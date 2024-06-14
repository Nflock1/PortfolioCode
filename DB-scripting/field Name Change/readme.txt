fieldChange.json is used as follows:

- updates and query array can be any length

QUERY RULES:
- The query holds key value pairs used to find a subset of DB objects that the updates will be applied to (Id's work well here for specific objects)
- falsey query key values cause the query object to be ignored.

UPDATE RULES:
- falsy oldName values will cause the array object at the current index to be skipped????
- falsy oldValue entries will result in updates occuring regardless of the field's value
- falsy newName values will cause the name of a field to remain the same
- falsy newValue values will cause the field's value to remain the same 


Prescribed use Cases:

1. delete an old field from objects
  "query" : [ 
    {
    "key": "id",
    "value": "1234"
    }
  ],
  "updates": [
    {
      "oldName":"foo",
      "oldValue":"",
      "newName":"",
      "newValue":""
    }
  ]

2. copy value from old field into a new field that will be created
  "query" : [ 
    {
    "key": "id",
    "value": "1234"
    }
  ],
  "updates": [
    {
      "oldName":"foo",
      "oldValue":"",
      "newName":"foo2",
      "newValue":""
    }
  ]

3. delete fields with a specific name (foo) and associated value (bar)
  "query" : [ 
    {
    "key": "id",
    "value": "1234"
    }
  ],
  "updates": [
    {
      "oldName":"foo",
      "oldValue":"bar",
      "newName":"",
      "newValue":""
    }
  ]

4. find objects with a specific field name (foo) and a specific value (bar). Then create a new field (foo2) and copy the value (bar) into it.

TODO: should this delete the old entry or leave it for sake of backwards compatibility
  "query" : [ 
    {
    "key": "id",
    "value": "1234"
    }
  ],
  "updates": [
    {
      "oldName":"foo",
      "oldValue":"bar",
      "newName":"foo2",
      "newValue":""
    }
  ]

5. change a value from old (bar) to new (bar2).
  "query" : [ 
    {
    "key": "id",
    "value": "1234"
    }
  ],
  "updates": [
    {
      "oldName":"foo",
      "oldValue":"bar",
      "newName":"",
      "newValue":"bar2"
    }
  ]

6. delete an old field (foo) and replace it with a new field (foo2) that holds a new value (bar2)
  "query" : [ 
    {
    "key": "id",
    "value": "1234"
    }
  ],
  "updates": [
    {
      "oldName":"foo",
      "oldValue":"",
      "newName":"foo2",
      "newValue":"bar2"
    }
  ]

7. replace an field's (foo) old value with a new value (bar2) but only for fields with a specific value (bar).
  "query" : [ 
    {
    "key": "id",
    "value": "1234"
    }
  ],
  "updates": [
    {
      "oldName":"foo",
      "oldValue":"bar",
      "newName":"",
      "newValue":"bar2"
    }
  ]

8. delete all fields with a specific name (foo) and a specific value (bar) and replace them with a new field (foo2) and new value (bar2)

