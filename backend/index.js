const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const cookieParser=require("cookie-parser")
app.use(cookieParser());
app.use(express.json());
require("./config/database").dbConnect();

const user=require("./routes/user")
app.use("/api/v1",user);

app.get('/', (req, res) => {
    res.send("GET Request Called")
})
app.listen(PORT, () => {
  console.log("App is running at PORT : ", PORT);
});
