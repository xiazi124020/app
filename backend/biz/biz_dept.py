from dal import TDept

async def get(id):
    dept = await TDept.get(id)
    
    return dept

async def insert(data):
    count = await TDept.check_name(data)
    if count == -9:
        return count
    ret = await TDept.insert(data)
    return ret

async def update(id, data):
    count = await TDept.check_name1(id, data)
    if count == -9:
        return count
    ret = await TDept.update(id, data)
    return ret

async def delete(data):
    ret = await TDept.delete(data)
    return ret

async def get_all_depts(name, location, page_num, page_size):
    dept, page_num, count = await TDept.get_all_depts(name, location, page_num, page_size)

    if dept is not None:
        data = [dict(ret) for ret in dept]
        return data, page_num, count
    return None, page_num, count
