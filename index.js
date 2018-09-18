const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const Promise = require('bluebird')
const Moment = require('moment')

const {extendMoment} = require('moment-range')
const moment = extendMoment(Moment);

const storage = require('./storage')

const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

require('dotenv').config()

if (!process.env.API_PORT) {
  throw new Error('ENV variable API_PORT not set')
}

app.route('/').post(async (req, res) => {

  let {start, end, step} = req.body

  if (!start || !moment(start).isValid()) {
    return res.status(400).json({
      error: 'invalid start date'
    })
  }

  if (!end || !moment(end).isValid()) {
    return res.status(400).json({
      error: 'invalid end date'
    })
  }

  if (!step || Number.isNaN(Number(step))) {
    return res.status(400).json({
      error: 'invalid step'
    })
  }

  const range = moment.range(
    moment.utc(start),
    moment.utc(end)
  )

  const ranges = Array.from(range.by('minute', {
    step
  }));

  const splittedRanges = []

  // split range to chunks
  // for ex:
  // 1 -> 2, 2 -> 3, 3 -> 4

  for (let i = 0; i < ranges.length; i++) {
    if (ranges[i + 1]) {
      splittedRanges.push([ranges[i], ranges[i + 1]])
    }
  }

  if (splittedRanges.length) {

    const promises = []

    splittedRanges.forEach(i => {

      promises.push(
        storage.aggregate(
          // Pipeline
          [
            // Stage 1
            {
              $match: {
                ct: {
                  $gte: i[0].toDate(),
                  $lt: i[1].toDate()
                }
              }
            },

            // Stage 2
            {
              $group: {
                _id: {
                  "tgs": "$tgs",
                  "uid": "$uid"
                },
                number: {$sum: 1}
              }
            },

            // Stage 3
            {
              $group: {
                _id: "$_id.tgs",
                count: {$sum: 1}
              }
            },

          ]
          // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/
        ).then(async data => {
          if (data.length) {
            const result = {}

            await Promise.each(data, i => {
              result[i._id] = i.count
            })

            return result
          }
        })
      )

    })

    const result = await Promise.all(promises)
    return res.json({
      t0: start,
      t1: end,
      data: result
    })
  }

  return res.json([])
})

const server = app.listen(process.env.API_PORT, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  storage.connect()
    .then(() => {
      console.log(`API is now running on port ${process.env.API_PORT}`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
})

process
  .on('unhandledRejection', (err, p) => {
    console.error(err, p)
  })
  .on('uncaughtException', err => {
    console.error(err)
    process.exit(1)
  })

module.exports = {
  app,
  server
}
