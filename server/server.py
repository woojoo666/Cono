from flask import (
    Flask,
    request,
)
from flask_pymongo import PyMongo
import json

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/test"
mongo = PyMongo(app)

@app.route("/")
def base():

    ret = {}
    ret["tag"] = "Taylor Swift"
    ret["entitites"] = [
            "https://www.taylorswift.com",
            "https://www.youtube.com/taylorswift",
            "https://www.instagram.com/taylorswift/?hl=en",
            ]
    return json.dumps(ret)

@app.route("/read")
def read():
    tag = request.args.get("tag")
    ret = {}

    if tag is None:
        ret["error_msg"] = "No tag passed"
        return json.dumps(ret)

    entities = []
    documents = mongo.db.maxdb.find({"tag": "Taylor Swift"})

    print(documents)
    for document in documents:
        entities.append(document["entity"])
    print(entities)
    ret = {}
    ret["tag"] = tag
    ret["entitites"] = entities
    return json.dumps(ret)

@app.route("/write")
def write():
    ret = {}
    tag = request.args.get("tag")
    entity = request.args.get("entity")

    print(tag,entity)

    if tag is None or entity is None:
        ret["error_msg"] =  "Both tag and entity must be passed"
        return json.dumps(ret)

    try:
        mongo.db.maxdb.insert_one({"tag": tag, "entity": entity})
    except Exception as e:
        ret["exception_message"] = str(e)
        ret["result"] = "Fail"

    ret["result"] = "Success"
    return json.dumps(ret)
