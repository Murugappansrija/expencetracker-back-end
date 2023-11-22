require('dotenv').config()
const express = require('express');
const nodeServer = express();
const app = require('./App');
const cors = require("cors")

// CONFIGURING CORS
nodeServer.use(cors())

//Inject app_server
nodeServer.use('/',app)


//Start the Port
const port=  process.env.PORT || 4001;
const host = process.env.HOST;

nodeServer.listen(port,()=>{
    console.log("Node_Server Started on",port);
    require("./DbConfig");
})