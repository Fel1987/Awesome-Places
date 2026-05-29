const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);

  if (req.files.length > 5) {
    req.flash("error", "You can upload a maximum of 5 images");
    return res.redirect("/campgrounds/new");
  }

  campground.images = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampgorund = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const newImages = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  if (campground.images.length >= 5) {
    req.flash("error", "Cannot upload anymore images");
    return res.redirect(`/campgrounds/${campground._id}`);
  }

  campground.images.push(...newImages);
  await campground.save();

  if (req.body.deleteImages) {
    for (const filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }

    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Campground succesfully updated");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campgorund deleted");
  res.redirect("/campgrounds");
};
