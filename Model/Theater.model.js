const mongoose = require('mongoose')

const theaterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    seats:{
       type:Number,
       required:true,
    },
    address:{
        type:String,
        required:true,
    },
    bookings:[{type:mongoose.Types.ObjectId, ref:"Booking"}],
    shows:{
        type:Array,
        required:true,
    }
    
})

module.exports = mongoose.model("Theaters",theaterSchema);