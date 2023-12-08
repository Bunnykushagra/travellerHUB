const expressError = require("./utils/expressError");
const Destination = require("./Models/destination");
const Review=require("./Models/reviews");
const {serverSchema,reviewSchema}= require("./schema.js")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash("error","Sign in first!!!")
        res.redirect("/login");
    }next();
}

//req.user store info about user loggedin


module.exports.validateDestination = (req, res,next) => {
    
    const {error}=serverSchema.validate(req.body);
    console.log(error);
    if(error){
    const msg=error.details.map(el=>el.message).join(', ');
    throw new expressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
    const { id } = req.params;
    const destination=await Destination.findById(id);
    if(!destination.author.equals(req.user._id)){
        req.flash("error","You do not have permissions.");
        return res.redirect(`/destinations/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res,next) => {
    
    const {error}=reviewSchema.validate(req.body);
    if(error){
    const msg=error.details.map(el=>el.message).join(', ');
    throw new expressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const { id,reviewId } = req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You do not have permissions.");
        return res.redirect(`/destinations/${id}`);
    }
    next();
}