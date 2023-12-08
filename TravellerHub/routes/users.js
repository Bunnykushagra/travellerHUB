const express=require('express');
const router =express.Router();
const catchAsync = require("../utils/catchAsync");
const User=require("../Models/user");
const Passport=require("passport");
const users=require("../controllers/users");

router.route("/register")
       .get(users.renderRegister)
       .post(catchAsync(users.registerUser))

router.route("/login")       
      .get(users.renderLogIn)
      .post(Passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),users.logIn);
      
router.get("/logout",users.logOut);
module.exports=router;