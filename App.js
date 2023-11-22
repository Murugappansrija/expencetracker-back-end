const express = require('express');
const app= express();
const bodyparser = require('body-parser');
const userController = require('./Controller/User.controller');
const adminController = require('./Controller/Admin.controller')
const movieController = require("./Controller/Movie.controller")
const bookingController = require("./Controller/Booking.controller");
const theaterRouter = require('./Controller/Theater.controller');


//Inject middleware
app.use(bodyparser.json())


//Inject User controller
app.use("/user",userController)
//Inject Admin controller
app.use("/admin",adminController)
//Inject Movie controller
app.use("/movie",movieController)
//Inject Booking Controller
app.use("/booking",bookingController)
//Inject Theater Controller
app.use("/theater",theaterRouter)


module.exports = app;