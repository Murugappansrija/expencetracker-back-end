const movieRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const movieModel = require("../Model/Movies.model");
const { default: mongoose } = require("mongoose");
const AdminModel = require("../Model/Admin.model");

//Add Movie
movieRouter.post("/add", async function (req, res, next) {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({
      message: "Token not found",
    });
  }
  let adminId;

  //verify token
  jwt.verify(extractedToken, process.env.SECRETE_KEY, (err, decrypted) => {
    if (err) {
      return res.status(404).json({
        message: `${err.message}`,
      });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  //Create new movie
  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() === "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new movieModel({
      title,
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl
    });

    
   const session = await mongoose.startSession();
   const adminUser = await AdminModel.findById(adminId);
   session.startTransaction();
   await movie.save({session});
   adminUser.addedMovies.push(movie);
   await adminUser.save({session});
   await session.commitTransaction();



    
  } catch (error) {
    console.log(error);
  }

  if(!movie){
    return res.status(500).json({
        message:"Resquest failed",
    })
  }
  return res.status(200).json({
    message:"Movie Added",
    data: movie,
  })
});

//To view all movies
movieRouter.get("/all", async function(req,res){
    let movie;
    try {
        movie = await movieModel.find()
    } catch (error) {
        console.log(error)
    }
    if(!movie){return res.status(500).json({message:"Request failed"})}

    return res.status(200).json({
        movie
    })

})

//To get movie by Id
movieRouter.get("/:id",async function(req,res){
    const id =req.params.id;
    let movie;
    try {
        movie = await movieModel.findById(id);
    } catch (error) {
        console.log(error);
    }
    if(!movie){return res.status(404).json({message:"Invalid movie id"})}
     return res.status(200).json({
        data:movie,
     })
     
})

module.exports = movieRouter;