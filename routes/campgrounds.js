var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware/");

//INDEX --- Campgrounds page
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE -- create new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
                    id: req.user._id,
                    username: req.user.username
                 };
    var newCampground = {name: name, image: image, description: desc, author: author}
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else{
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });


});

//NEW --- form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW --- form to show information about camp
router.get("/:id", function(req, res){
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
             //render show template with that campground
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT --- form to edit camp
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE --- take edits and redirect to show page 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id + "/edit");
        } else {
            req.flash("success", "Campground Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE --- remove campground from the database
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds/" + req.params.id);
        }else {
            req.flash("success", "Campground Removed!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;