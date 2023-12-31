import asyncpg

class DBPool:
    _pool = None

    @classmethod
    async def create(cls, host, port, user, password, database):
        cls._pool = await asyncpg.create_pool(host=host, port=port, user=user, password=password, database=database)

    @classmethod
    async def close(cls):
        if cls._pool is not None:
            await cls._pool.close()    

    @classmethod
    def acquire(cls):
        return cls._pool.acquire()
