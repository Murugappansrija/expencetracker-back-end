const mongoose = require('mongoose');

mongoose.connect(process.env.DB).then((res)=>{
    if(res) console.log("Database Connected");
}).catch((e)=> console.log(e));