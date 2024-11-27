const express=require("express")
const router=express.Router();
const {login,signup, users, logout} = require('../controller/Auth')
const {auth} = require("../middleware/auth");
router.post("/login",login);
router.post("/signup",signup);
router.get("/users",auth,users);
router.get("/logout",auth,logout);
module.exports = router;