//import UserModel from "../Model/User.model";
const userRouter = require("express").Router();
const BookingModel = require("../Model/Booking.model");
const userModel = require("../Model/User.model");
const bcrypt = require("bcryptjs");

//To view all users
userRouter.get("/getAll", async function (req, res, next) {
  try {
    const response = await userModel.find();
    if (response) {
      res.status(200).json({
        message: "Fetched Data Successfully",
        data: response,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "No Records found",
        data: response,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error,
      success: false,
    });
  }
});

//To Create User
userRouter.post("/signup", async function (req, res, next) {
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password === ""
  ) {
    return res.status(422).json({
      message: "Invalid Inputs",
    });
  }
  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new userModel({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (error) {
    return next(error);
  }
  if (!user) {
    res.status(400).json({
      message: "Unexpexted Error",
    });
  }
  return res.status(200).json({
    message: "Data Added",
    data: user._id,
  });
});

//To update user
userRouter.put("/:id", async function (req, res, next) {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password === ""
  ) {
    return res.status(422).json({
      message: "Invalid Inputs",
    });
  }
  const hashedPassword = bcrypt.hashSync(password);

  let user;
  try {
    user = await userModel.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    console.log(error);
  }
  if(!user){
    res.status(400).json({
        message: "Something went wrong",
      });
  }
  return res.status(200).json({
    message:"Successfully Updated",
    data : user,
  })
});

//To Delete User
userRouter.delete("/:id",async function(req,res,next){
    const id = req.params.id
    let user;
    try {
        user = await userModel.findByIdAndRemove(id)
    } catch (error) {
        console.log(error);
    }
    if(!user){
        res.status(400).json({
            message: "Something went wrong",
          });
    }
    return res.status(200).json({
        message:"Record has been Deleted",
        success:true,
    })
})

//To Login user
userRouter.post('/login',async function(req,res,next){
    const{email,password} = req.body;
    if (
        !email &&
        email.trim() === "" &&
        !password &&
        password === ""
      ) {
        return res.status(422).json({
          message: "Invalid Inputs",
        });
      }
      let existingUser;
      try {
       existingUser = await userModel.findOne({email})
      } catch (error) {
        console.log(error)
      }

      if(!existingUser){
        return res.status(404).json({
            message:"User not found",
        })
      }

      const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password)
      if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Incorrect Password",
        })
      }
   
      return res.status(200).json({
        message:"login successfull",
        data: existingUser,
      })
})

//To get bookings of user
userRouter.get("/booking/:id",async function(req,res){
  const id = req.params.id;
  let booking;
  try {
    booking = await BookingModel.find({user:id});

  } catch (error) {
    console.log(error);
  }
  if(!booking){
    return res.status(500).json({
      message:"unable to get booking user",
    })
  }
  return res.status(200).json({
    data:booking,
  })
})

module.exports = userRouter;
