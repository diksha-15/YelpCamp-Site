// ALL MIDDLEWARES GOES HERE
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareobj = {};

middlewareobj.checkcampgroundownership = function(req , res , next){
     if(req.isAuthenticated()){
          Campground.findById(req.params.id, function(err , foundcampg){
          if(err || !foundcampg){
          	req.flash("error" , "Campground not found");
            res.redirect("back");
          } else{
             //if(foundcampg.author.id === req.user._id)
             if(foundcampg.author.id.equals(req.user._id || req.user.isAdmin)){
               req.campground = foundcampg; next();
             } else{
             	req.flash("error" , "You dont have permission to do that!!!");
                res.redirect("back");
             }    
          }
         }); 
        } else{
        	    req.flash("error" , "You need to be logged in to do that");
                res.redirect("back");
     }
}

middlewareobj.checkcommentownership = function(req , res , next){
  if(req.isAuthenticated()){
     Comment.findById(req.params.comment_id , function(err , foundcomment){
      if(err || !foundcomment){
        req.flash("error" , "Comment not found");
        res.redirect("back");
      } else{
        if(foundcomment.author.id.equals(req.user._id || req.user.isAdmin)){
          req.comment=foundcomment; next();
        } else{
        	req.flash("error" , "You dont have permission to do that!!!");
          res.redirect("back");
        }
      }
     });
  } else{
  	req.flash("error" , "You need to be logged in to do that");
     res.redirect("back"); 
  }
}

middlewareobj.isloggedin = function(req , res , next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error", "Please login first!");
  res.redirect("/login");
}
middlewareobj.isAdmin = function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash("error", "This site is now read only thanks to spam and trolls.");
      res.redirect("back");
    }
  }

module.exports = middlewareobj