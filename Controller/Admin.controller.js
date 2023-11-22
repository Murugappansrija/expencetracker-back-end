const adminRouter = require("express").Router();
const adminModel = require("../Model/Admin.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

//To Signup Admin
adminRouter.post("/signup", async function (req, res, next) {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password === "") {
    return res.status(422).json({
      message: "Invalid Inputs",
    });
  }
  let existingAdmin;
  try {
    existingAdmin = await adminModel.findOne({ email });
  } catch (error) {
    console.log(error);
  }
  if (existingAdmin) {
    return res.status(400).json({
      message: "Admin already exist",
    });
  }

  let admin;
  const hashedPassword = bcrypt.hashSync(password);
  try {
    admin = new adminModel({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (error) {
    console.log(error);
  }

  if (!admin) {
    return res.status(500).json({
      message: "Unable to store admin",
    });
  }
  return res.status(200).json({
    message: "Account Created",
    data: admin,
  });
});

//To Login Admin
adminRouter.post("/login", async function (req, res, next) {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password === "") {
    return res.status(422).json({
      message: "Invalid Inputs",
    });
  }

  let existingAdmin;
  try {
    existingAdmin = await adminModel.findOne({ email });
  } catch (error) {
    console.log(error);
  }
  if (!existingAdmin) {
    return res.status(400).json({
      message: "Admin not found",
    });
  }
  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );
  if(!isPasswordCorrect){
    return res.status(400).json({
        message:"Incorrect Password",
    })
}

const token = jwt.sign({id: existingAdmin._id},process.env.SECRETE_KEY,{
    expiresIn:"7d"
})

   return res.status(200).json({
    message:"Admin login Successfull",
    token,
    id:existingAdmin._id,
   })
});

//To view all Admin
adminRouter.get("/all",async function(req,res){
  let admins;
  try {
    admins = await adminModel.find();
  } catch (error) {
    console.log(error);
  }
  if(!admins){return res.status(500).json({message:"Internal server error"})}
  return res.status(200).json({
    data: admins,
  })
})

module.exports = adminRouter;