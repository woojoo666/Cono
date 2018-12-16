#  $jsonSchema expression type is prefered.  New since v3.6 (2017):
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
                  }
                }
            }
         }
  }
}