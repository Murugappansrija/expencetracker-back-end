const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');

const {readdirSync} = require('fs')
const cookiParser = require("cookie-parser");
const router = require('./routes/transaction');


const app = express()
require('dotenv').config()


const PORT = process.env.PORT

//middlewars

app.use(express.json())
app.use(cors())
app.use(cookiParser());
app.use(router)

//routes

readdirSync('./routes').map((route) => app.use('/api/v1',require('./routes/' + route)))

const server =()=>{
    db()
   app.listen(PORT,()=>{
        console.log('listening to port:',PORT)
   })
}


server()