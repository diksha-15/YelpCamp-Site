var express = require("express");
var  router = express.Router({mergeParams: true});  
var Campground = require("../models/campground");
var  Comment   = require("../models/comment");
var middleware = require("../middleware");

//===============================
//COMMENT ROUTES
//===============================

//NEW COMMENTS
router.get("/new", middleware.isloggedin , function(req, res){
  //res.send("This will be the comment form");
   Campground.findById(req.params.id, function(err , campg){
    if(err){
      console.log(err);
    } else{

        res.render("comments/new" ,{campground: campg});
    }
   });

});

// CREATE COMMENTS 
router.post("/" , middleware.isloggedin , function(req , res){
  Campground.findById(req.params.id, function(err , campg){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else{
      Comment.create(req.body.comment , function(err , comment){
        if(err){
          req.flash("error" , "Something went wrong");
          console.log(err);
        } else{
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campg.comments.push(comment);
          campg.save();
          req.flash('success', 'Created a comment!');
          res.redirect('/campgrounds/' + campg._id);
        }
      });
    }
   });
});


router.get("/:comment_id/edit",middleware.checkcommentownership, function(req , res){
  Comment.findById(req.params.comment_id , function(err , foundcomment){
    if(err){
      res.redirect("back");
    } else{
      res.render("comments/edit" , {campground_id: req.params.id , comment: foundcomment});
   }
 });
});


router.put("/:comment_id" ,middleware.checkcommentownership, function(req , res){
 Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment, function(err , updatedcomment){
    if(err){
      res.redirect("back");
     } else{
      res.redirect("/campgrounds/" + req.params.id);
     } 
    });
});

router.delete("/:comment_id" ,middleware.checkcommentownership, function(req , res){
 Comment.findByIdAndRemove(req.params.comment_id , function(err){
  if(err){
      req.flash('error', err.message);
     res.redirect("back");
  } else{
    req.flash("success" , "Comment deleted");
    res.redirect("/campgrounds/" + req.params.id);
  }
 });
});
//    Campground.findByIdAndUpdate(req.params.id, {
//     $pull: {
//       comments: req.comment.id
//     }
//   }, function(err) {
//     if(err){ 
//         console.log(err)
//         req.flash('error', err.message);
//         res.redirect('/');
//     } else {
//         req.comment.remove(function(err) {
//           if(err) {
//             req.flash('error', err.message);
//             return res.redirect('/');
//           }
//           req.flash('error', 'Comment deleted!');
//           res.redirect("/campgrounds/" + req.params.id);
//         });
//     }
//   });
// });


//MIDDLEWARE
// function isloggedin(req , res , next){
//   if(req.isAuthenticated()){
//       return next();
//   }
//   res.redirect("/login");
// }

// function checkcommentownership(req , res , next){
//   if(req.isAuthenticated()){
//      Comment.findById(req.params.comment_id , function(err , foundcomment){
//       if(err){
//         res.redirect("back");
//       } else{
//         if(foundcomment.author.id.equals(req.user._id)){
//           next();
//         } else{
//           res.redirect("back");
//         }
//       }
//      });
//   } else{
//      res.redirect("back"); 
//   }
// }

module.exports = router;

