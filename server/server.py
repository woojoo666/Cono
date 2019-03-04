import sys

sys.path.insert(0, 'db/')

from flask import (
    Flask,
    request,
)
from flask_pymongo import PyMongo
from pymongo import MongoClient
import schema
import json
import schema

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/test"
client = MongoClient() 
db = client.prod

@app.route("/")
def base():
    return "Welcome to Cono."

@app.route("/read-tag-counts", methods=['GET'])
def read_username():
    username = request.args.get("username")
    url = request.args.get("url")
    ret = {}

    print("username", username, "url", url)

    try:
        username_tags = db.cono_user_tag_url_db.find({"url" : url})
    except Exception as e:
        ret["exception_message"] = str(e)
        ret["result"] = "Fail"
        return json.dumps(ret)
    for entry in username_tags:
        print(entry)

        first = 0
        second = False
        if entry['tag'] in ret:
            first = ret[entry['tag']]['count']
            second = ret[entry['tag']]['user_tagged']

        if entry['username'] == username:
            second = True

        first += 1
        ret[entry['tag']] = {'count' : first, 'user_tagged' : second}
    return json.dumps(ret)

@app.route("/read-tags", methods=['GET'])
def read_tags():
    url = request.args.get("url")
    ret = {'tags':[]}

    documents = db.cono_tag_entity_db.find({"entity" : {"url":url}})

    print (documents.count())
    for document in documents:
        print(document['tag'])
        ret['tags'].append(document['tag'])
    return json.dumps(ret)

@app.route("/read", methods=['GET'])
def read():
    tag = request.args.get("tag")
    ret = {}

    documents = db.cono_tag_entity_db.find({"tag":tag})

    print (documents.count())
    for document in documents:
        print(document['entity'])
        ret[document['entity']['url']] = document['entity']
    return json.dumps(ret)

@app.route("/write", methods=['POST'])
def write():
    ret = {}

    tag = request.form["tag"]
    url = request.form["url"]
    username = request.form["username"]

    print(tag, url, username)

    if tag is None or url is None or username is None:
        ret["error_msg"] =  "Tag, entity and Username must be passed"
        return json.dumps(ret)


    try:
        documents = db.cono_tag_entity_db.find({"tag":tag})
    except Exception as e:
        ret["exception_message"] = str(e)
        ret["result"] = "Fail"
        return json.dumps(ret)
    try:
        username_tags = db.cono_user_tag_url_db.find({"username" : username, "tag" : tag, "url" : url})
    except Exception as e:
        ret["exception_message"] = str(e)
        ret["result"] = "Fail"
        return json.dumps(ret)

    if username_tags.count() != 0:
        print("User has already tagged this url.")
        ret["result"] = "Fail"
        return json.dumps(ret)

    if documents.count() == 0:
        try:
            entity = {"url" : url, "tag_count" : 1}
            tag_entity_pair = {"tag" : tag}
            db.cono_tag_entity_db.insert_one({"tag": tag, "entity": entity})
            print("Created new tag, entity.")
        except Exception as e:
            ret["exception_message"] = str(e)
            ret["result"] = "Fail"
            return json.dumps(ret)
        db.cono_user_tag_url_db.insert_one({"username" : username, "tag" : tag, "url" : url})
        
        ret["result"] = "Success"
        return json.dumps(ret)
    else:
        for document in documents:
            entity = document['entity']
            if entity['url'] == url:
                entity['tag_count'] += 1
                print("Incremented tag count to", entity['tag_count'])
                db.cono_tag_entity_db.replace_one({"tag" : tag}, {"tag": tag, "entity": entity}, True)
                db.cono_user_tag_url_db.insert_one({"username" : username, "tag" : tag, "url" : url})
                print("Added to existing entity.")
                ret["result"] = "Success"
                return json.dumps(ret)

        entity = {"url" : url, "tag_count" : 1}
        tag_entity_pair = {"tag" : tag}
        db.cono_tag_entity_db.insert_one({"tag": tag, "entity": entity})
        db.cono_user_tag_url_db.insert_one({"username" : username, "tag" : tag, "url" : url})
        print("Added entity to existing tag.")
        ret["result"] = "Success"
        return json.dumps(ret)