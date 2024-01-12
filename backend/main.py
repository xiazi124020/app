# main.py
from fastapi import Body, FastAPI, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
import tracemalloc
from dal import DBPool
from routes import api_router
import os

tracemalloc.start()

app = FastAPI()

app.include_router(router=api_router)

async def init_db_pool():
    print("--------------------start db connect pool-------------------------")
    await DBPool.create(os.environ.get("db_host"), os.environ.get("db_port"), os.environ.get("db_user"), os.environ.get("db_password"), os.environ.get("db_name"))

async def shutdown_db_pool():
    print("--------------------end read_template-------------------------")
    await DBPool.close()

@app.on_event("startup")
async def startup_event():
    await init_db_pool()

@app.on_event("shutdown")
async def shutdown_event():
    await shutdown_db_pool()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.DEBUG) 