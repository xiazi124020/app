from dal import TUser

async def get(id):
    user = await TUser.get(id)
    return user

async def get_all(name, email, sex, page_num, page_size):
    user, page_num, count = await TUser.get_all(name, email, sex, page_num, page_size)

    if user is not None:
        data = [dict(ret) for ret in user]
        
    return data, page_num, count

async def insert(data):
    count = await TUser.check_name(data)
    print("----------2-----------")
    print(count)
    if count == -9:
        return count
    ret = await TUser.insert(data)
    return ret

async def update(id, data):
    count = await TUser.check_name1(id, data)
    if count == -9:
        return count
    ret = await TUser.update(id, data)
    return ret

async def delete(id):
    ret = await TUser.delete(id)
    return ret

async def get_all_users(name, sex, dept_id, status, page_num, page_size):
    user, page_num, count = await TUser.get_all_users(name, sex, dept_id, status, page_num, page_size)

    if user is not None:
        data = [dict(ret) for ret in user]
        
    return data, page_num, count
