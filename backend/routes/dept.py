# minor_apply
from fastapi import APIRouter, Body, Request, Query
from biz import biz_dept
from typing import Union

router = APIRouter()

# 部門登録
@router.post("")
async def user_insert(data: dict = Body(...)):
    print("--------------------部門登録開始--------------------")
    print(data)
    ret = await biz_dept.insert(data)
    if ret >= 0:
        json_result = {
            "status_code": 200,
            "data": ret,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": ret, "error": 'create error'}

# 部門一覧検索
@router.get("/all")
async def get_all_depts(
    name: Union[str, None] = None,
    location: Union[int, None] = None,
    page_num: int = Query(0, ge=0),
    page_size: int = Query(10, ge=1, le=100),
    data_count: int = Query(0),
):
    data, page_num, count = await biz_dept.get_all_depts(name, location, page_num, page_size)
    if data is not None:
        json_result = {
            "status_code": 200,
            "data": data,
            "page_info": {"page_num": page_num, "page_size": page_size, "count": count},
            "error": '',
        }
        return json_result
    return {"status": 500, "data": {}, "error": 'select error'}

# 部門検索
@router.get("/{id}")
async def user_get(id: int):
    print("--------------------部門検索開始--------------------")
    row = await biz_dept.get(id)
    if row is not None:
        json_result = {
            "status_code": 200,
            "data": row,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": None, "error": 'get error'}

# 部門更新
@router.put("/{id}")
async def user_put(id: int, data: dict = Body(...)):
    print("--------------------部門更新開始--------------------")
    ret = await biz_dept.update(id, data)
    if ret >= 0:
        json_result = {
            "status_code": 200,
            "data": ret,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": ret, "error": 'update error'}

# 部門削除
@router.delete("")
async def user_delete(data: dict = Body(...)):
    print("--------------------部門削除開始--------------------")
    ret = await biz_dept.delete(data)
    if ret == 0:
        json_result = {
            "status_code": 200,
            "data": ret,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": ret, "error": 'delete error'}
