from .dal_sqlstr import *
from .pool import DBPool
from .constants import PREFIX
import asyncpg
from utils import check_page_num
from datetime import date, datetime
import json
import re


class TUser:
    table_name = "t_user"
    col_names = ('id', 'dept_id', 'emp_id', 'name', 'name_kana', 'sex', 'phone', 'email', 'zip_code', 'address', 'password', 'is_admin', 'status', 'is_deleted',
    'create_by', 'update_by', 'pwd_reset_time', 'create_time', 'update_time')

    @classmethod
    async def get(cls, id):
        sq = SqlBuilder()
        sq.build_select(cls.table_name, cls.col_names,
                        True, ["id"], {"id": id})
        try:
            async with DBPool.acquire() as db:
                row = await db.fetchrow(sq.sqlstr, id)
        except Exception as e:
            print(e)
            return None
        print(row)
        return row

    @classmethod
    async def insert(cls, data):
        sq = SqlBuilder()
        id = -1
        col_names = list(cls.col_names)
        col_names.remove("id")
        col_names.remove("create_time")
        col_names.remove("update_time")
        data['create_by'] = 'admin'
        data['update_by'] = 'admin'
        try:
            async with DBPool.acquire() as db:
                sequence_sql = "select nextval('seq_emp')"
                result = await db.fetchval(sequence_sql)
                data['emp_id'] = PREFIX + str(result).zfill(7)
                sq.build_insert(cls.table_name, col_names, data, "id")
                result = await sq.fetchval(db)
        except Exception as e:
            print(e)
            return None
        return result

    @classmethod
    async def update(cls, id, data):
        sq = SqlBuilder()
        col_names = list(cls.col_names)
        col_names.remove("id")
        col_names.remove("create_time")
        col_names.remove("create_by")

        sq.build_update(cls.table_name, col_names, data,
                        True, ["id"], {"id": id})
        try:
            async with DBPool.acquire() as db:
                await sq.execute(db)
        except Exception as e:
            print(e)
            return None
        return cs_id

    @classmethod
    async def check_name(cls, data):
        check_name_sql = f"""
            select count(*) from t_user where name = $1 or email = $2
        """
        try:
            async with DBPool.acquire() as db:
                count = await db.fetchval(check_name_sql, data['name'], data['email'])
        except Exception as e:
            print(e)
            return None
        if count > 0:
            return -9
        return count

    @classmethod
    async def check_name1(cls, id, data):
        check_name_sql = f"""
            select count(*) from t_user where ( name = $1 or email = $2 ) and id = $3
        """
        try:
            async with DBPool.acquire() as db:
                count = await db.fetchval(check_name_sql, data['name'], data['email'], data['id'])
        except Exception as e:
            print(e)
            return None
        if count > 0:
            return -9
        return count

    @classmethod
    async def delete(cls, id):
        delete_sql = f"""
            update t_user set is_deleted = true where id = $1
        """
        try:
            async with DBPool.acquire() as db:
                await db.execute(delete_sql, id)
        except Exception as e:
            print(e)
            return None
        return id
