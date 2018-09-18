const {describe, it, before, after} = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const expect = chai.expect

const data = require('./fixture')
const {app, server} = require('../index')
const {create, close} = require('../storage')

before(() => {
  return create(data)
})

after(async () => {
  await server.close()
  await close()
})

describe('api test', () => {
  it('get data', () => {
    return chai.request(app)
      .post('/')
      .send({
        start: '2018-09-18',
        end: '2018-09-21',
        step: 60 * 24
      })
      .then(res => {

        console.log(res.body)

        expect(res).to.have.status(200)
        expect(res.body).to.be.a('object')
        expect(res.body.t0).to.be.equal("2018-09-18")
        expect(res.body.t1).to.be.equal("2018-09-21")

        expect(res.body.data).to.be.an('array').that.is.not.empty

        const { data } = res.body

        expect(data[0]['200']).to.be.equal(1)
        expect(data[1]['500']).to.be.equal(1)
        expect(data[1]['OK']).to.be.equal(1)

      })
  })
})