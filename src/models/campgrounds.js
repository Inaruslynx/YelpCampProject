const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const CloudinarySchema = new Schema({
  url: String,
  filename: String,
});

CloudinarySchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const GeometrySchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  _id: false,
  autoindex: false,
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  geometry: GeometrySchema,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  image: {
    id: String,
    width: Number,
    height: Number,
    urls: {
      raw: String,
      full: String,
      regular: String,
      small: String,
      thumb: String,
    },
  },
  cloudinary: [CloudinarySchema],
}, opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a>`;
})

// Deletes reviews associated with campground when campground deleted
CampgroundSchema.post("findOneAndRemove", async (camp) => {
  if (camp.reviews.length) {
    const result = await Review.deleteMany({ _id: { $in: camp.reviews } });
    // console.log(`Deleted ${result.deletedCount} reviews`);
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
