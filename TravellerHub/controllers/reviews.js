const Destination = require("../Models/destination");
const Review= require("../Models/reviews");
module.exports.createReview=async (req, res,next) => {
    const destination=await Destination.findById(req.params.id);
    const newReview=new Review(req.body);
    newReview.author=req.user._id;
    destination.reviews.push(newReview);
    await newReview.save();
    await destination.save();
    req.flash("success","Successfully posted a review!!!")
    res.redirect(`/Destinations/${destination._id}`);
}
module.exports.deleteReview=async (req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Destination.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Successfully deleled a review!!!")
    res.redirect(`/Destinations/${id}`);
   
    

}