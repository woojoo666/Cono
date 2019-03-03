from pymongo import MongoClient
from collections import OrderedDict
import sys
import schema


# Setup real db.
# This will fail if the db already exists.
client = MongoClient() 
db = client.prod

# WARNING: ONLY RUN THE FOLLOWING COMMAND IF YOU WANT TO NUKE THE DB.
db.cono_tag_entity_db.drop()
db.cono_user_tag_url_db.drop()

db.create_collection("cono_tag_entity_db")

query = [('collMod', 'cono_tag_entity_db'),
        ('validator', schema.tag_entity_validator),
        ('validationLevel', 'moderate')]
query = OrderedDict(query)
db.command(query)

db.create_collection("cono_user_tag_url_db")

query = [('collMod', 'cono_user_tag_url_db'),
        ('validator', schema.user_tag_url_validator),
        ('validationLevel', 'moderate')]
query = OrderedDict(query)
db.command(query)
