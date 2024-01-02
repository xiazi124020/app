from .dal_sqlstr import *
from .pool import DBPool
import asyncpg
from utils import check_page_num
from datetime import date, datetime
import json
import re

class TDept:
    table_name = "t_dept"
    col_names = ('id', 'name', 'location', 'is_deleted',
    'create_by', 'update_by', 'create_time', 'update_time')

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
        return dict(row)

    @classmethod
    async def insert(cls, data):
        sq = SqlBuilder()
        id = -1
        col_names = list(cls.col_names)
        col_names.remove("id")
        col_names.remove("create_time")
        col_names.remove("update_time")
        data['is_deleted'] = False
        data['create_by'] = 'admin'
        data['update_by'] = 'admin'
        try:
            async with DBPool.acquire() as db:
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
        data['update_by'] = 'admin'
        data['update_time'] = datetime.now()
        sq.build_update(cls.table_name, col_names, data,
                        True, ["id"], {"id": id})
        try:
            async with DBPool.acquire() as db:
                await sq.execute(db)
        except Exception as e:
            print(e)
            return None
        return id

    @classmethod
    async def check_name(cls, data):
        check_name_sql = f"""
            select count(*) from t_dept where name = $1 and location = $2
        """
        try:
            async with DBPool.acquire() as db:
                count = await db.fetchval(check_name_sql, data['name'], data['location'])
        except Exception as e:
            print(e)
            return None
        if count > 0:
            return -9
        return count

    @classmethod
    async def check_name1(cls, id, data):
        check_name_sql = f"""
            select count(*) from t_dept where name = $1 and location = $2 and id <> $3
        """
        try:
            async with DBPool.acquire() as db:
                count = await db.fetchval(check_name_sql, data['name'], data['location'], data['id'])
        except Exception as e:
            print(e)
            return None
        if count > 0:
            return -9
        return count

    @classmethod
    async def delete(cls, data):
        ids = data.get("ids", [])

        if not ids:
            return None

        placeholders = ', '.join(f'${i}' for i in range(1, len(ids) + 1))

        delete_sql = f"""
            UPDATE t_dept SET is_deleted = true WHERE id in ({placeholders})
        """
        try:
            async with DBPool.acquire() as db:
                await db.execute(delete_sql,  *ids)
        except Exception as e:
            print(e)
            return None
        return 0

    @classmethod
    async def get_all_depts(cls, name, location, page_num, page_size):

        sql_count = f"""
            SELECT count(*)
            FROM t_dept a 
            WHERE a.is_deleted = false 
        """
        sqlstr = f"""
            SELECT a.id,a.name,a.location 
            FROM t_dept a
            WHERE a.is_deleted = false 
        """
        sql_cond = ""
        params = []
        i = 1
        if name is not None and name != '':
            sql_cond += f" AND a.name like ${i} "
            params.append('%' + name  + '%')
            i = i + 1

        if location is not None:
            sql_cond += f" AND a.location = ${i} " 
            params.append(location)
            i = i + 1

        if sql_cond != '':
            sql_count += sql_cond
            sqlstr += sql_cond

        # fetch count
        try:
            async with DBPool.acquire() as db:
                count = await db.fetchval(sql_count, *params)
        except Exception as e:
            print(e)
            return None, None, None

        # fetch records
        sqlstr += f" order by a.update_time desc LIMIT ${i} OFFSET ${i+1} "       
        page_num = check_page_num(page_num, count, page_size)
        params.append(page_size)
        params.append(page_num * page_size)
        rows = []
        try:
            async with DBPool.acquire() as db:
                rows = await db.fetch(sqlstr, *params)
        except Exception as e:
            print(e)
            return None, None, None
        return rows, page_num, count