var mangoose = require("mongoose");
var Campground = require("./models/campground");
var comment = require("./models/comment");
var data =[
        {
        	name: "Cloud's Rest",
        	image: "https://blog.theclymb.com/wp-content/uploads/2017/02/iStock-487756252.jpg",
        	description: "Poor network!"
        },
        {
        	name: "Rusty Dusty",
        	image: "https://www.clevelandclinicabudhabi.ae/PublishingImages/health-byte/ccad-img-blog-desert-safety-HL.jpg",
        	description: "Poor network!"
        },
        {
        	name: "Spotlight",
        	image: "https://www.roomsoom.com/blog/wp-content/uploads/2018/12/Camping-Sites-Near-Delhi-NCR.jpg",
        	description: "Poor network!"
        }
]


function seedDB(){
	Campground.remove({} , function(err , removed){
	    if(err){
	    	console.log(err);
	    } else{ //add  few campgrounds	
		    	data.forEach(function(seed){
			    Campground.create(seed , function(err , /*data*/campground){
			 	if(err){
			 		console.log(err);
			 	} else{
			 		console.log("campgrounds Added!!!");
                    comment.create(
                    {
                    	text: "This place is great, but I wish there would be a good network",
                    	author: "Homer"
                    }, function(err , comment){
                          if(err){
                          	console.log(err);
                          } else{
                          	campground.comments.push(comment);
                          	campground.save();
                          	console.log("created new comment");
                          }
                    });
			 	}
			  }); 
	        });
	    }
	});
}

module.exports = seedDB;
