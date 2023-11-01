const userdb = require("../models/userSchema");


exports.addUser = async(req,res)=>{
        const { fname, email, password, cpassword } = req.body;
        console.log(req.body)
    
        if (!fname || !email || !password || !cpassword) {
            res.status(422).json({ error: "fill all the details" })
        }
    
        try {
    
            const preuser = await userdb.findOne({ email: email });
    
            if (preuser) {
                res.status(422).json({ error: "This Email is Already Exist" })
            } else if (password !== cpassword) {
                res.status(422).json({ error: "Password and Confirm Password Not Match" })
            } else {
                const finalUser = new userdb({
                    fname, email, password, cpassword
                });
    
                // here password hasing
    
                const storeData = await finalUser.save();
    
                // console.log(storeData);
                res.status(201).json({ status: 201, storeData })
            }
    
        } catch (error) {
            res.status(422).json(error);
            console.log("catch block error");
        }
    
    }

    exports.userLogIn = async (req, res) => {
        console.log(req.body);
    
        const { email, password } = req.body;
    
        if (!email || !password) {
            res.status(422).json({ error: "fill all the details" })
        }
    
        try {
           const userValid = await userdb.findOne({email:email});
    
            if(userValid){
    
                const isMatch = await bcrypt.compare(password,userValid.password);
    
                if(!isMatch){
                    res.status(422).json({ error: "invalid details"})
                }else{
    
                    // token generate
                    const token = await userValid.generateAuthtoken();
    
                    // cookiegenerate
                    res.cookie("usercookie",token,{
                        expires:new Date(Date.now()+9000000),
                        httpOnly:true
                    });
    
                    const result = {
                        userValid,
                        token
                    }
                    res.status(201).json({status:201,result})
                }
            }else{
                res.status(401).json({status:401,message:"invalid details"});
            }
    
        } catch (error) {
            res.status(401).json({status:401,error});
            console.log("catch block");
        }
    }