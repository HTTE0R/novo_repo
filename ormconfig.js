module.exports = [
  {
    "name": "default",
    "type": "sqlite",
    "database": "./src/database/database.sqlite",
    "migrations":["./src/database/migrations/**.ts"],
    "entities":["./src/models/**.ts"],
    "logging":false,
    "cli":{
        "migrationsDir":"./src/database/migrations"
    }
  }
]
