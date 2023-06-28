require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const { Item , validateItem } = require("../models/item");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

// configuration for the new aws package @aws-sdk/client-s3
const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRETACCESS_KEY,
  },
});

// uploading images to the aws bucket -- faster process highly recommended.
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "radiographyvideoupload",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `emotion_detection_images/${shortId.generate()}-${file.originalname}`);
      },
    }),
  });


router.get("/", async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

// Getting  an item  with a specific id....
router.get("/:id", validateObjectId, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item)
    return res
      .status(404)
      .send("The item with this id doesnot exist in the database.");

  res.send(item);
});


// Adding new items to the rentals collection....
// uploading images for multiple fields...
router.post("/", upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'imageUrl', maxCount: 1 }
]), async (req, res) => {
  //input validation using joi............
  const { error } = validateItem(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const avatar = req.files['avatar'][0].location;

  const imageUrl = req.files['imageUrl'][0].location;

  if (!avatar && !imageUrl) {
    res.send("No file is  picked...");
  } else {

    let item = new Item({
      title: req.body.title,
      ownerName: req.body.ownerName,
      price: req.body.price,
      contact : req.body.contact,
      description: req.body.description,
      avatar : avatar,
      imageUrl : imageUrl
    });

    // Save item to the Database...
    item = await item.save();
    res.send("Successfully added this item to the database.");
  }
});


module.exports = router;
