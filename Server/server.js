const express = require('express')
const bodyParser = require('body-parser')
const dotEnv = require("dotenv")
dotEnv.config()
const port = process.env.port || 5000 ;
const Db = require('../DB/Db')
const userRoutes = require('../Routes/userRoutes')
 const createAdmin = require("../Scripts/admin")
const app = express()
const cors = require('cors')

app.use(bodyParser.json());
 

Db.ConnectToDB() 
app.use(cors())
app.use('/' , userRoutes) 
 
 
createAdmin()

app.listen(port , ()=> {

    console.log(`ServerConnected on ${port}`)
    
    })  