const {MongoClient} = require('mongodb')

require('dotenv').config()

const COLLECTION_NAME = 'entries'

let db
let client

async function connect () {
  if (db) {
    return db
  } else {
    if (!process.env.MONGO_URI) {
      throw new Error('ENV variable MONGO_URI not set')
    }

    if (!process.env.MONGO_DB) {
      throw new Error('ENV variable MONGO_DB not set')
    }

    client = await MongoClient.connect(process.env.MONGO_URI, {
      promiseLibrary: Promise,
      useNewUrlParser: true
    })

    db = client.db(process.env.MONGO_DB)
    return db
  }
}

async function create (data) {
  const db = await connect()
  return db.collection(COLLECTION_NAME).insertMany(data)
}

async function aggregate (query = []) {
  const db = await connect()

  return db.collection(COLLECTION_NAME).aggregate(
    query
  ).toArray()

}

async function clear () {
  const db = await connect()
  return db.collection(COLLECTION_NAME).deleteMany({})
}

async function close () {
  if (client) {
    await client.close()
    db = false
    return
  }

  throw new Error('Storage not initialized')
}


module.exports = {
  connect,
  close,
  create,
  clear,
  aggregate
}