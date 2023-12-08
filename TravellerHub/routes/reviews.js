
const express = require("express");
const Destination = require("../Models/destination");
const router=express.Router({mergeParams:true});
const Review= require("../Models/reviews");
const expressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");
const {reviewSchema}= require("../schema.js")
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviews=require("../controllers/reviews");

router.post("/",isLoggedIn,validateReview,catchAsync(reviews.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));
module.exports=router;