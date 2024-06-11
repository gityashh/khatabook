const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index-routes')
const db = require('./config/mongoose-connection')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.set('view engine','ejs')

app.use('/',indexRouter)

app.listen(process.env.PORT || 3000)