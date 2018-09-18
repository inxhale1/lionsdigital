const moment = require('moment')

// - _id : ObjectId (msg_id json field)
// - ct : timestamp, время создания записи
// - ts : timestamp, время последнего изменения
// - src : модуль-инициатор ["masssend", "portal", ...]
// - 'user_id`: идентификатор пользователя коллекции users
// - uid : id пользователя телеграма (int)
// - gid : идентификатор группы (номер рассылки)
// - tgs : статус ["OK", "200", "400", "404", "500", ...]

const data = [
  {
    ct: new Date('2018-09-18T12:00:00.000Z'),
    ts: new Date('2018-09-18T12:00:00.000Z'),
    src: "masssend",
    user_id: 1,
    uid: 1115,
    gid: 99,
    tgs: "200"
  },
  {
    ct: new Date('2018-09-19T15:00:00.000Z'),
    ts: new Date('2018-09-19T15:00:00.000Z'),
    src: "masssend",
    user_id: 1,
    uid: 1103,
    gid: 99,
    tgs: "OK"
  },
  {
    ct: new Date('2018-09-19T16:00:00.000Z'),
    ts: new Date('2018-09-19T16:00:00.000Z'),
    src: "portal",
    user_id: 1,
    uid: 1103,
    gid: 99,
    tgs: "500"
  },
  {
    ct: new Date('2018-09-21T12:00:00.000Z'),
    ts: new Date('2018-09-21T12:00:00.000Z'),
    src: "portal",
    user_id: 1,
    uid: 1115,
    gid: 99,
    tgs: "400"
  }
]

module.exports = data