const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); // require listing from modules

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({}); // delete the already present data
    initData.data = initData.data.map((obj) => ({...obj,owner: "694a454cfacfc0e94ab75160"}));
    await Listing.insertMany(initData.data);
    console.log("data is initializes");
}

initDB();