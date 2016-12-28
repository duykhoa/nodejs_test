#!/bin/bash
mongoimport --host localhost --port 3001 --jsonArray --db meteor  --collection  users --file db/users.json
mongoimport --host localhost --port 3001 --jsonArray --db meteor  --collection  userAvailabilities --file db/user_availabilities.json
