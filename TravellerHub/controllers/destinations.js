const Destination = require("../Models/destination");
const {cloudinary} = require("../cloudinary");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken: mapBoxToken});


module.exports.index=async (req, res) => {
    const destinations = await Destination.find({});
    res.render("index", { destinations });
}
module.exports.renderNewForm= (req, res) => {
    res.render("new");
}
module.exports.submitNewDestination=async (req, res, next) => {
    // if (!req.body,name) throw new expressError("name not filled", 500);
   const geoData=await geocoder.forwardGeocode({
       query:req.body.location,
       limit:1
   }).send()
   
   
    const newDestination = new Destination(req.body);
    newDestination.geometry=geoData.body.features[0].geometry;
    newDestination.images=req.files.map(f=>({url:f.path,fileName:f.filename}));
    newDestination.author=req.user._id;
    await newDestination.save();
    // console.log(newdestination);
    req.flash("success","Successfully created a new destination!!!!");
    res.redirect(`/Destinations/${newDestination.id}`)
}
module.exports.showDestination=async (req, res) => {
    const { id } = req.params;
    const destination = await Destination.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }

}).populate("author");

    if(!destination){
        req.flash("error","Destination not found");
        return res.redirect(`/Destinations`);
    }
    res.render("show", { destination });
}
module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    if(!destination){
        req.flash("error","Destination not found");
        return res.redirect(`/Destinations`);
    }
  
    res.render("edit", { destination });
}
module.exports.submitEditDestination=async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    
    const destination = await Destination.findByIdAndUpdate(id, req.body);
    const imgs=req.files.map(f=>({url:f.path,fileName:f.filename}));
    destination.images.push(...imgs);
    await destination.save();
    if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
    }
    await destination.updateOne({$pull:{images:{fileName:{$in:req.body.deleteImages}}}});
    
    }
    req.flash("success","Updated a destination!!!");
    res.redirect(`/Destinations/${destination.id}`);
}
module.exports.deleteDestination=async (req, res) => {
    const { id } = req.params;
    const destination=await Destination.findByIdAndDelete(id);
   
    req.flash("success","Deleted a Destination!!!")
    res.redirect("/Destinations");
}