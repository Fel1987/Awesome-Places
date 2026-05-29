const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dzjlhczw0/image/upload/w_100/v1780089045/campgound-images/et6nkjk3uqvwhbt1zqn7.jpg\\\

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = new Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  images: [ImageSchema],

  description: {
    type: String,
  },
  location: {
    type: String,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

campgroundSchema.post("findOneAndDelete", async function (document) {
  if (document) {
    await Review.deleteMany({
      _id: { $in: document.reviews },
    });
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
