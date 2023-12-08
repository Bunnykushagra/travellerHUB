if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
}

// console.log(process.env.CLOUDINARY_KEY);

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const destination = require("./Models/destination");
const Review= require("./Models/reviews");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const catchAsync = require("./utils/catchAsync");
const joi = require("joi");
const ImageExtension = require('joi-image-extension')
const {serverSchema,reviewSchema}= require("./schema.js");
const destinations=require("./routes/destinations");
const reviews=require("./routes/reviews");
const users=require("./routes/users");
const session= require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./Models/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const {MongoStore} = require("connect-mongo");
const MongoDBStore = require('connect-mongo')(session); 
//used for storing session data in mongo not in default memory



const dbUrl=process.env.DB_URL ||"mongodb://localhost:27017/destinationsHub";
mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,

        useUnifiedTopology: true,
       
    }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const secret=process.env.SECRET || "key";
const store=new MongoDBStore({
    url:dbUrl,
    secret,
    touchAfter:24*60*60
});
store.on("error",function(e){
    console.log("Session store error", e);
})

const sessionConfig={
    store,
    name:"session",
    secret,

    resave:false,
    saveUninitialized:true,
    cookie:{
       
        maxAge:24*7*60*60,
        httpOnly:true,
        // secure:true
    }
}


app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&display=swap",

    
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = ["https://fonts.gstatic.com",];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dnqidqwvx/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(mongoSanitize());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    // console.log(req.query)
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})




app.use("/",users);
app.use("/destinations",destinations);
app.use("/destinations/:id/reviews",reviews);
app.get("/",(req,res)=>{
    res.render("home");
})

app.all("*", (req, res, next) => {
    next(new expressError("Page not found", 404));
})
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Something wrong";
    res.status(status).render("error", { err });

})
const port=process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`listening on Port ${port}`);
})