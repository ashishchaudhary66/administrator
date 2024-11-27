const jwt=require("jsonwebtoken")
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try{
        //extract JWT token
        //PENDING : other ways to fetch token
        // 1) req.body.token  2) req.cookies.token

        console.log("body :",req.body.token);
        console.log("cookies :",req.cookies.token);
        // console.log("Header : ",req.header("Authorization").replace("Bearer ",""));

        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(404).json({
                success:false,
                message:"Token Missing"
            })
        }

        //verify the token
        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload)

            req.user=payload;

        }catch(error){
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            })
        }
        next();

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:`Internal server error : ${error}`
        })
    }
}
