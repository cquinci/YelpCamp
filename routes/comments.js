var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware/");

//NEW - new comment form
router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: foundCampground});
        }
    }); 
});

//CREATE - add comment to campground 
router.post("/", middleware.isLoggedIn, function(req,res){
    //look up campground by id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds")
        } else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.render("comments/new");
                } else {
                    //add user to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connection comment to campground
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+ foundCampground._id);
                }
            });
        }
    }); 
});

//EDIT - Edit comment of a campground
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE -- Modify comment in campground
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE/DESTROY -- remove comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, updatedComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment Removed!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;