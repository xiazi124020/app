# minor_apply
from fastapi import APIRouter, Body
from fastapi import Request
from biz import biz_user
from typing import Union

router = APIRouter()

# 社員登録
@router.post("")
async def user_insert(data: dict = Body(...)):
    print("--------------------社員登録開始--------------------")
    ret = await biz_user.insert(data)
    if ret >= 0:
        json_result = {
            "status_code": 200,
            "data": ret,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": ret, "error": 'create error'}

# 社員検索
@router.get("/{id}")
async def user_get(id: int):
    print("--------------------社員検索開始--------------------")
    row = await biz_user.get(id)
    if row is not None:
        json_result = {
            "status_code": 200,
            "data": row,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": None, "error": 'get error'}


# 社員更新
@router.put("/{id}")
async def user_put(id: int, data: dict = Body(...)):
    print("--------------------社員更新開始--------------------")
    ret = await biz_user.update(id, data)
    if ret >= 0:
        json_result = {
            "status_code": 200,
            "data": ret,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": ret, "error": 'update error'}

# 社員削除
@router.delete("/{id}")
async def user_delete(id: int):
    print("--------------------社員開始--------------------")
    ret = await biz_user.delete(id)
    if ret >= 0:
        json_result = {
            "status_code": 200,
            "data": ret,
            "error": '',
        }
        return json_result          
    return {"status": 500, "data": ret, "error": 'delete error'}
