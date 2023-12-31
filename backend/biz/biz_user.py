from dal import TUser

async def get(id):
    user = await TUser.get(id)
    return user

async def get_all(name, email, sex, page_num, page_size):
    user, page_num, count = await TUser.get_all(name, email, sex, page_num, page_size)

    if user is not None:
        data = [dict(ret) for ret in user]
        
    return data, page_num, count

async def update(id, data):
    if id == 'null':
        count = await TUser.check_name(data)
        if count == -9:
            return count
        ret = await TUser.insert(data)
    else:
        count = await TUser.check_name1(id, data)
        if count == -9:
            return count
        ret = await TUser.update(id, data)
    return ret

async def delete(id):
    ret = await TUser.delete(id)
    return ret
