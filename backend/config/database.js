const mongoose=require("mongoose");
require("dotenv").config();

exports.dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("DB Connected Successfully!")
    })
    .catch((error)=>{
        console.log("Db connection failed : ");
        console.error(error);
        process.exit(1);
    })
}