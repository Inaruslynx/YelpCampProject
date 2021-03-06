// Used to seed initial fake data into mongoDB

// const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");
const Cities = require("./cities");
const { descriptors, places } = require("./helper");
const { getCampPhoto } = require("../utils/unsplash");

// Don't change below (required by unsplash)
const maxResults = 30;

// This can be changed for how many entries are desired
let numberOfCamps = 50;

// Uses unsplash to add photos and make up data for mongoDB and submits
function mySave(photo) {
  const random1000 = Math.floor(Math.random() * 1000);
  const price = Math.floor(Math.random() * 20 + 10);
  const camp = new Campground({
    title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${
      places[Math.floor(Math.random() * places.length)]
    }`,
    location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
    image: {
      id: photo.id,
      width: photo.width,
      height: photo.height,
      urls: {
        raw: photo.urls.raw,
        full: photo.urls.full,
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
      },
    },
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi eius suscipit sit ipsa corporis, recusandae error. Obcaecati id quae magni facere animi, necessitatibus debitis! Quidem dolor quibusdam ex inventore ad?",
    price,
    author: "616d5ebbafac7e1e52d1aa70"
  });
  camp.save();
}

// Executes save
exports.seed = async () => {
  await Campground.deleteMany({});
  do {
    const results = await getCampPhoto(numberOfCamps);
    if (results.type === "success") {
      if (numberOfCamps === 1) {
        const photo = results.response;
        mySave(photo);
      } else if (numberOfCamps > 1) {
        const photos = results.response;
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          mySave(photo);
        }
      }
    }
    numberOfCamps -= maxResults;
  } while (numberOfCamps > 0);
};
