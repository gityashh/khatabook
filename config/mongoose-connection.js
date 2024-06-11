const mongoose = require('mongoose')
const dbgr = require('debug')('development:')

mongoose
       .connect('mongodb://127.0.0.1:27017/khatabookn18')
       .then(function () {
        dbgr('connected to mongo')
       })
       .catch(function (err) {
        dbgr(err)
       })

let db = mongoose.connection;

module.exports = db;

