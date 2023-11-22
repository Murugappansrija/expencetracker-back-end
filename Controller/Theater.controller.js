const theaterRouter = require("express").Router();
const theaterModel = require("../Model/Theater.model");

//To create a Theater
theaterRouter.post("/create",async function(req,res){
    const {name,seats,address,shows} = req.body;
    if(!name && name.trim()==="" && !address && address.trim()===""){
        return res.status(422).json({
            message: "Invalid Inputs",
          });
    }
    let theater;
    try {
        theater = new theaterModel({name,seats,address,shows});
        theater = await theater.save();
    } catch (error) {
        console.log(error);
    }
    if (!theater) {
        res.status(400).json({
          message: "Unexpexted Error",
        });
      }
      return res.status(200).json({
        message: "Data Added",
        data: theater,
      });
})

//To view all theater
theaterRouter.get("/all", async function(req,res){
    let theater;
    try {
        theater = await theaterModel.find()
    } catch (error) {
        console.log(error)
    }
    if(!theater){return res.status(500).json({message:"Request failed"})}

    return res.status(200).json({
        data:theater
    })
})

module.exports=theaterRouter;