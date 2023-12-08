
const express = require("express");

const router=express.Router();
const destination = require("../Models/destination");
const expressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");
const {serverSchema}= require("../schema.js")
const {isLoggedIn,validateDestination,isAuthor}=require("../middleware.js");
const destinations=require("../controllers/destinations");

const {storage}=require("../cloudinary");
const multer  = require('multer')
const upload = multer({ storage })


router.route("/")
    .get(catchAsync(destinations.index))
    .post(isLoggedIn,upload.array("image"),validateDestination,catchAsync(destinations.submitNewDestination));
   

router.get("/new",isLoggedIn,destinations.renderNewForm);

router.route("/:id")
      .get(catchAsync(destinations.showDestination))
      .put(isLoggedIn,isAuthor,upload.array("image"),validateDestination, catchAsync(destinations.submitEditDestination))
      .delete(isLoggedIn,isAuthor, catchAsync(destinations.deleteDestination))

router.get("/:id/edit", isLoggedIn,isAuthor,catchAsync(destinations.renderEditForm));

module.exports=router;