from typing import Union, Tuple, List

# pure sql helper
class SqlHelper:
    # concat col names, and add prefix and alias, return sql column string and results col names(list)
    @staticmethod
    def concat_colnames(col_names, prefix:Union[str, None]=None, aliass:Union[dict, None]=None)->Tuple[str, List[list]]:
        if aliass is not None:
            col_names_fetch = [f'{aliass[col]}' if col in aliass else col for col in col_names]
            if prefix is not None:
                col_names = [f'{prefix}.{col} AS {aliass[col]}' if col in aliass else f'{prefix}.{col}' for col in col_names]
            else:
                col_names = [f'{prefix}.{col}' for col in col_names]
        else:
            col_names_fetch = list(col_names)
            if prefix is not None:
                col_names = [f'{prefix}.{col}' for col in col_names]
        cols_str = ','.join([f'{col}' for col in col_names])
        return cols_str, col_names_fetch


# Sql构造器
# 暂时支持简单sql
class SqlBuilder:
    def __init__(self):
        self._sqlstr = ""
        self._params = []

    def __str__(self):
        return f'{self._sqlstr} {self._params}'

    @property
    def sqlstr(self):
        return self._sqlstr
    
    @property
    def params(self):
        return self._params
    
    async def execute(self, db):
        return await db.execute(self._sqlstr, *self._params)

    async def fetch(self, db):
        return await db.fetch(self._sqlstr, *self._params)

    async def fetchrow(self, db):
        return await db.fetchrow(self._sqlstr, *self._params)

    async def fetchval(self, db):
        return await db.fetchval(self._sqlstr, *self._params)
        
    def append_sql(self, sql):
        self._sqlstr += sql
    
    def append_andcond(self, cond, value, opr="="):
        self._sqlstr += f' AND {cond} {opr} ${len(self._params)+1}'
        self._params.append(value)

    def append_is_deleted(self, is_deleted):
        self.append_andcond('is_deleted', is_deleted)
     
    # 构造插入语句 insert into table (col1,col2,col3) values ($1,$2,$3) returning id
    def build_insert(self, table_name, colnames, datas, returing_col=None):
        self._sqlstr = f'INSERT INTO {table_name} ('
        # col1,col2,col3
        txt_col = ','.join(colnames)
        self._sqlstr += txt_col
        # $1,$2,$3
        txt_value = ','.join([f'${i+1}' for i in range(len(colnames))])
        self._sqlstr += f') VALUES ({txt_value})'
        if returing_col:
            self._sqlstr += f' RETURNING {returing_col}'
        self._params = [datas[k] if k in datas else None for k in colnames]

    # 构造查询语句 select * from table where col1=$1 and col2=$2
    # orders is a list, like ['col1', 'col2 desc']
    def build_select(self, table_name, colnames, with_where = None, cond_colnames = None, cond_datas = None, cond_op='AND', orders=None, limit=None, offset=None):
        self._sqlstr = f'SELECT '
        # col1,col2,col3
        txt_col = ','.join(colnames)
        self._sqlstr = self._sqlstr + txt_col + f' FROM {table_name}'
        if with_where:
            # where col3=$3 and col4=$4
            cond_op = ' AND ' if cond_op == 'AND' else ' OR '
            txt_col = cond_op.join([f'{cond_colnames[i]}=${i+1}' for i in range(len(cond_colnames))])
            self._sqlstr += f' WHERE {txt_col}'
            self._params += [cond_datas[k] if k in cond_datas else None for k in cond_colnames]
        if orders is not None:
            order_clause = ','.join(orders)
            self._sqlstr += f' ORDER BY {order_clause}'
        if limit is not None:
            self._sqlstr += f' LIMIT {limit}'
        if offset is not None:
            self._sqlstr += f' OFFSET {offset}'

    # 构造更新语句 update table set col1=$1,col2=$2 where col3=$3 and col4=$4
    def build_update(self, table_name, colnames, datas, with_where, cond_colnames, cond_datas, cond_op='AND'):
        self._sqlstr = f'UPDATE {table_name} SET '
        # col1=$1,col2=$2,col3=$3
        txt_col = ','.join([f'{colnames[i]}=${i+1}' for i in range(len(colnames))])
        self._sqlstr += txt_col
        self._params = [datas[k] if k in datas else None for k in colnames]
        if with_where:
            # where col4=$4 and col5=$5 
            cond_op = ' AND ' if cond_op == 'AND' else ' OR '
            txt_col = cond_op.join([f'{cond_colnames[i]}=${i+len(colnames)+1}' for i in range(len(cond_colnames))])
            self._sqlstr += f' WHERE {txt_col}'
            self._params += [cond_datas[k] if k in cond_datas else None for k in cond_colnames]

    # 构造删除语句 delete from table where col1=$1 and col2=$2
    def build_delete(self, table_name, with_where, cond_colnames, cond_datas, cond_op='AND'):
        self._sqlstr = f'DELETE FROM {table_name}'
        if with_where:
            # where col1=$1 and col2=$2
            cond_op = ' AND ' if cond_op == 'AND' else ' OR '
            txt_col = cond_op.join([f'{cond_colnames[i]}=${i+1}' for i in range(len(cond_colnames))])
            self._sqlstr += f' WHERE {txt_col}'
            self._params = [cond_datas[k] if k in cond_datas else None for k in cond_colnames]
        
