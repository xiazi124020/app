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
    col_names = ('id', 'dept_id', 'emp_id', 'name', 'name_kana', 'sex', 'birthday', 'position', 'emp_div', 'phone', 'email', 'zip_code', 'address', 'password', 'is_admin', 'status', 'is_deleted',
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
        return dict(row)

    @classmethod
    async def insert(cls, data):
        sq = SqlBuilder()
        id = -1
        col_names = list(cls.col_names)
        col_names.remove("id")
        col_names.remove("create_time")
        col_names.remove("update_time")
        data['birthday'] = datetime.strptime(data['birthday'], '%Y-%m-%d')
        data['is_deleted'] = False
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
        col_names.remove("emp_id")
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
            select count(*) from t_user where ( name = $1 or email = $2 ) and id <> $3
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
    async def delete(cls, data):
        ids = data.get("ids", [])

        if not ids:
            return None

        placeholders = ', '.join(f'${i}' for i in range(1, len(ids) + 1))

        delete_sql = f"""
            UPDATE t_user SET is_deleted = true WHERE id in ({placeholders})
        """
        try:
            async with DBPool.acquire() as db:
                await db.execute(delete_sql,  *ids)
        except Exception as e:
            print(e)
            return None
        return 0

    @classmethod
    async def get_all_users(cls, name, sex, dept_id, status, page_num, page_size):

        sql_count = f"""
            SELECT count(*)
            FROM t_user a left join t_dept b on a.dept_id = b.id and b.is_deleted = false
            WHERE a.is_deleted = false 
        """
        sqlstr = f"""
            SELECT a.id,a.emp_id,a.name,a.name_kana,a.sex,a.email,a.phone,b.name dept_name,a.status 
            FROM t_user a left join t_dept b on a.dept_id = b.id and b.is_deleted = false
            WHERE a.is_deleted = false 
        """
        sql_cond = ""
        params = []
        i = 1
        if name is not None and name != '':
            sql_cond += f" AND (a.name like ${i} or a.name_kana like ${i+1}) "
            params.append('%' + name  + '%')
            params.append('%' + name  + '%')
            i = i + 2

        if sex is not None:
            sql_cond += f" AND a.sex = ${i} " 
            params.append(sex)
            i = i + 1

        if dept_id is not None:
            sql_cond += f" AND a.dept_id = ${i} " 
            params.append(dept_id)
            i = i + 1

        if status is not None:
            sql_cond += f" AND a.status = ${i} " 
            params.append(status)
            i = i + 1

        if sql_cond != '':
            sql_count += sql_cond
            sqlstr += sql_cond

        print(sql_count)
        print(sqlstr)
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