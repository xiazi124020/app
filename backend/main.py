# main.py
from fastapi import Body, FastAPI, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
import tracemalloc
from fastapi import Request
from dal import DBPool
import uvicorn
from routes import api_router

tracemalloc.start()

app = FastAPI()

app.include_router(router=api_router)


def read_config():
    with open("config.json", "r") as config_file:
        config = json.load(config_file)
    return config

async def init_db_pool():
    print("--------------------start db connect pool-------------------------")
    config = read_config()
    await DBPool.create(config["db_host"], config["db_port"], config["db_user"], config["db_password"], config["db_name"])

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