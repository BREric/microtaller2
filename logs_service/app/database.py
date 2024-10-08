from pymongo import MongoClient

def init_db():
    client = MongoClient("mongodb://mongodb:27017") 
    db = client['logs_service']
    return db

db = init_db()
