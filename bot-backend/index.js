
//Loads .env file contents into process.env by default
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./DB/connection')

//Creates an express application
const botServer = express()

//use cors in express server
botServer.use(cors())
botServer.use(express.json())
botServer.use(router)
botServer.use('/uploads',express.static('./uploads'))

const PORT = 3000 || process.env.PORT

botServer.listen(PORT,()=>{
    console.log(`Bot Server Started at PORT:${PORT}`);
})

//http://localhost:3000/
botServer.get("/",(req,res)=>{
    res.status(200).send(`<h1 style="color:red">Bot Server Started and Waiting for client request!!!</h1>`)
})
