from pymongo import MongoClient
from collections import OrderedDict
import sys

client = MongoClient() 
db = client.testX

db.myColl.drop()
db.cono.drop()
db.cono_tag_entity.drop()

db.create_collection("cono_tag_entity")  # Force create!

#  $jsonSchema expression type is prefered.  New since v3.6 (2017):
vexpr = {"$jsonSchema":
  {
         "bsonType": "object",
         "required": ["tag", "entity"],
         "properties": {
            "tag": {
               "bsonType": "string",
               "description": "Canonical key tag across the internet."
            },
            "entity" : {
                "bsonType" : "object",
                "required" : ["url"],
                "description" : "Entity associated with given tag.",
                "properties" : {
                  "url" : {
                    "bsonType" : "string",
                    "description" : "Url representing this entity."
                  }
                }
            }
         }
  }
}

query = [('collMod', 'cono_tag_entity'),
        ('validator', vexpr),
        ('validationLevel', 'moderate')]
query = OrderedDict(query)
db.command(query)

try:
    db.cono_tag_entity.insert({"x":1})
    print("NOT good; the insert above should have failed.")
except:
    print(("OK. Expected exception:", sys.exc_info()))

try:
    okdoc = {"tag" : "TaylorSwift", "entity" : {"url" : "taylorswift/red.com"}}
    print(okdoc['tag'])
    db.cono_tag_entity.insert(okdoc)
    print("All good.")
except:
    print(("exc:", sys.exc_info()))