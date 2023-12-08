const User=require("../Models/user");

module.exports.renderRegister=(req,res)=>{
    res.render("register");
}
module.exports.registerUser=async(req,res,next)=>{
    try{ const {email,username,password}=req.body;
     const user=new User({email,username});
     const newUser=await User.register(user,password);
     req.login(newUser,(err)=>{
      if(err){return next(err);}
          req.flash("success","Welcome to TravelHub!!!");
          res.redirect("/Destinations"); }
     )
     }
     catch(e){
         req.flash("error",e.message);
         res.redirect("/register");
     }
  }
  module.exports.renderLogIn=(req,res)=>{
    res.render("login");
}
  module.exports.logIn=(req,res)=>{
    req.flash("success","Welcome Back!!!")
    const redirectUrl=req.session.returnTo || "/Destinations"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logOut=(req,res)=>{
    req.logout();
    req.flash("success","See u Again!!!")
    res.redirect("/Destinations");
}