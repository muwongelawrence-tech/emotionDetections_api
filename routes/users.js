require("dotenv").config();
const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();


// Getting some user information while excluding the password...
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered ..");

  user = new User(_.pick(req.body, ["name" ,"email", "password"]));

  // Encrypt the password sent by the user...
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  //Save user to the Database..
  await user.save();
  //Get users token...
  const token = user.generateAuthToken();

  //Send back the response to the client..
  res.status(200).send("user Registered successfully...");
});

module.exports = router;
