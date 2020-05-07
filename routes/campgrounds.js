var express = require("express");
var  router = express.Router();  
var Campground = require("../models/campground");
var middleware = require("../middleware");
//===============================
//CAMPGROUND ROUTES
//===============================

router.get("/" , function(req , res){
  Campground.find({}, function(err , allcampgrounds){
    if(err){
      console.log(err);
    } else{
      res.render("campground/index" , {campg: allcampgrounds });
    }
  });
   //res.render("campgrounds" , {campg: campgrounds});
});


router.post("/" ,middleware.isloggedin , function(req , res){
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newcampg = {name: name ,price:price, image: image ,description:desc , author:author }
  //campgrounds.push(newcampg);
   Campground.create(newcampg , function(err , campgrounds){
    if(err){
      console.log(err);
    } else{
         res.redirect("/campgrounds");
    }
   });
  // res.redirect("/campgrounds");
});


router.get("/new" ,middleware.isloggedin , function(req , res){
   res.render("campground/new");
});


router.get("/:id" , function(req , res){
   Campground.findById(req.params.id).populate("comments").exec(function(err , foundcamp){
    if(err){
      console.log(err);
    } else{
      //console.log(foundcamp);
         res.render("campground/show" , {campground: foundcamp});
    }
   });
});

//EDIT CAMPGROUNDS
router.get("/:id/edit" ,middleware.checkcampgroundownership, function(req, res){
          Campground.findById(req.params.id, function(err , foundcampg){
               res.render("campground/edit" , {campground:foundcampg});     
     });
});

//UPDATE CAMPGROUNDS
router.put("/:id" ,middleware.checkcampgroundownership , function(req , res){
  Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err , updatecamp){
     if(err){
      res.redirect("/campgrounds");
     } else{
      res.redirect("/campgrounds/" + req.params.id);
     }
  });
});

//DESTROY CAMPGROUNDS
router.delete("/:id",middleware.checkcampgroundownership , function(req , res){
   //res.send("deleted");
  Campground.findByIdAndRemove(req.params.id , function(err){
    if(err){
      req.flash('error', err.message);
      res.redirect("/campgrounds");
    } else{
      req.flash('error', 'Campground deleted!');
      res.redirect("/campgrounds");
    }
  });
});

//MIDDLEWARE
// function checkcampgroundownership(req , res , next){
//      if(req.isAuthenticated()){
//           Campground.findById(req.params.id, function(err , foundcampg){
//           if(err){
//             res.redirect("back");
//           } else{
//              //if(foundcampg.author.id === req.user._id)
//              if(foundcampg.author.id.equals(req.user._id)){
//                next();
//              } else{
//                 res.redirect("back");
//              }    
//           }
//          }); 
//         } else{
//                  res.redirect("back");
//      }
// }


// function isloggedin(req , res , next){
//   if(req.isAuthenticated()){
//       return next();
//   }
//   res.redirect("/login");
// }


module.exports = router;