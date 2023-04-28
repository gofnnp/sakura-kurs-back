const express = require('express')
const app = express()
const port = process.env.PORT || 3500
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const morgan = require('morgan')

app.use(cors({
    origin: '*'
}))
app.use(morgan("tiny"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(passport.initialize())
require('./middleware/passport')(passport)

const routes = require('./settings/routes')
routes(app)

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})