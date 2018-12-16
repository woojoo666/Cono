from pymongo import MongoClient
from collections import OrderedDict
import sys
import schema

client = MongoClient() 
db = client.testX

db.cono_tag_entity_testdb.drop()

db.create_collection("cono_tag_entity_testdb")  # Force create!

query = [('collMod', 'cono_tag_entity_testdb'),
        ('validator', schema.tag_entity_validator),
        ('validationLevel', 'moderate')]
query = OrderedDict(query)
db.command(query)


# Test that random junk can't be inserted into db.
try:
    db.cono_tag_entity.insert({"x":1})
    assert(False == True)
except:
    assert(True == True)


# Test valid tag entity pair
try:
    okdoc = {"tag" : "TaylorSwift", "entity" : {"url" : "taylorswift/red.com"}}
    print(okdoc['tag'])
    db.cono_tag_entity.insert(okdoc)
    assert(True == True)
except:
    print(("exc:", sys.exc_info()))
    assert(True == False)