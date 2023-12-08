const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review= require("./reviews");
const imageSchema=new schema({
    url:String,
    fileName:String
});
imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200")
});
//mongoose doesnot include virtuals to result object so for that:-
const opts={toJSON:{virtuals:true}};

const destinationSchema=new schema(
    {
        name:String,
        
        budget:Number,
        location:String,
        description:String,
       geometry:{
            type:{
                type:String,
                enum:["Point"],
                required:true
            },
            coordinates:{
                type:[Number],
                required:true
            }
       },
        images:[imageSchema],
        reviews:[
            {type:schema.Types.ObjectId,
            ref:"Review"
            }
        ],
        author:{type:schema.Types.ObjectId,
            ref:"User"
            }
        
    },opts
)
destinationSchema.virtual("properties.popupText").get(function(){
    return `<a href="/Destinations/${this._id}">${this.name}</a>`
});
destinationSchema.post("findOneAndDelete",async function(doc){
    if(doc){
        await Review.deleteMany({
            id:{$in:
                doc.reviews
            }
        })
      
    }
});
module.exports=mongoose.model("Destination",destinationSchema);
