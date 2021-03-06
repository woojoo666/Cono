from pymongo import MongoClient
from collections import OrderedDict
import sys
import schema


# Setup test follection.
client = MongoClient() 
db = client.testX

db.cono_tag_entity_testdb.drop()

print("Create tag entity testdb.")
db.create_collection("cono_tag_entity_testdb")

query = [('collMod', 'cono_tag_entity_testdb'),
        ('validator', schema.tag_entity_validator),
        ('validationLevel', 'moderate')]
query = OrderedDict(query)
db.command(query)

print("Create user tag url testdb.")
db.create_collection("cono_user_tag_entity_testdb")

query = [('collMod', 'cono_user_tag_url_testdb'),
        ('validator', schema.user_tag_url_validator),
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
    okdoc = {"tag" : "TaylorSwift", "entity" : {"url" : "taylorswift/red.com", "upvote_count"}}
    print(okdoc['tag'])
    db.cono_tag_entity.insert(okdoc)

    assert(True == True)
except:
    print(("exc:", sys.exc_info()))
    assert(True == False)