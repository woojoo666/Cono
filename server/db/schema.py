#  $jsonSchema expression type is prefered.  New since v3.6 (2017):
# TODO(vishvanand): Replace entity object with list of entities.
tag_entity_validator = {"$jsonSchema":
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
                  },
                  "tag_count" : {
                    "bsonType" : "int",
                    "minimum" : 1,
                    "description" : "Number of distinct users that have tagged this entity with same tag."
                  }
                }
            }
         }
  }
}

user_tag_url_validator = {"$jsonSchema":
  {
         "bsonType": "object",
         "required": ["username", "tag", "url"],
         "properties": {
            "username": {
               "bsonType": "string",
               "description": "Authenticated user on the server."
            },
            "tag": {
               "bsonType": "string",
               "description": "Canonical key tag across the internet."
            },
            "url" : {
              "bsonType" : "string",
              "description" : "Url representing this entity."
            }
         }
  }
}
