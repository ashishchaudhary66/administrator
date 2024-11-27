const bcrypt=require("bcrypt")
const User= require("../models/User")
const jwt=require("jsonwebtoken")
require("dotenv").config();

//signup route handler
exports.signup = async(req,res) =>{
    try{
        //get data
        const {name,email,password,dob,role}=req.body;
        //check if user already exist
        const existingEmail= await User.findOne({email});

        if(existingEmail){
            return res.status(400).json({
                success:false,
                message:"User already Exists",
            })
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:'Error in hashing password',
            })
        }

        //create entry for User
        const user = await User.create({
            name,email,password:hashedPassword,dob,role
        })

        const payload={
            name:user.name,
            email:user.email,
            dob:user.dob,
            id:user._id,
            role:user.role,
        }
        let token=jwt.sign(payload,
            process.env.JWT_SECRET,
            {
                expiresIn:"2h",
            })
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user:{
                name,
                email,
                dob,
                role,
                id:user._id
            },
            message:"User Logged in successfully"
        })
    }   
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:`User cannot be registered, Please try again later: ${error}`
        })
    }
}

//login
exports.login=async(req,res)=>{
    try{
        //data fetch
        const {email,password}=req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the datails carefully..."
            })
        }
        //check for registered user
        let user= await User.findOne({email});
        //if not a registered user
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User is not registered"
            })
        }

        const payload={
            email:user.email,
            id:user._id,
            role:user.role,
        }
        //verify password
        if(await bcrypt.compare(password,user.password)){
            //password matched
            let token=jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                })

            user=user.toObject();
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged in successfully"
            })
        }
        else{
            //password do not match
            return res.status(401).json({
                success:false,
                message:"Password do not match"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.users=async(req,res)=>{
    try {
        const users = await User.find({},{ password:0, __v:0 });
        return res.status(200).json({
            success:true,
            message: "Users fetched Successfully",
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:`Internal Server Error, ${error}`
        })
    }
}

exports.logout=async(req,res)=>{
    try {
        return res.cookie("token",{mazAge:0}).status(200).json({
            success:true,
            message: "User logged out Successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:`Internal Server Error, ${error}`
        })
    }
}