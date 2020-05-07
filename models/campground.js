var mongoose   = require("mongoose");

var campgroundschema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description:{
    type: String,
    default:
      "Just pretend you are a whisper floating across a mountain. This painting comes right out of your heart. You don't want to kill all your dark areas they are very important. Look around, look at what we have. Beauty is everywhere, you only have to look to see it. We need dark in order to show light."
  },
  author: {
  	id:  {
  		type: mongoose.Schema.Types.ObjectId,
  		ref: "user"
  	} ,
  	username: String
  },
  comments: [
  {
       type: mongoose.Schema.Types.ObjectId,
       ref: "comment" 
   }
   ]
});

module.exports = mongoose.model("Campground" ,campgroundschema);  //COMPILING SCHEMA INTO MODEL
