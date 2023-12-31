const { User } = require("../models/user");
 const _ = require("lodash");
 const bcrypt = require("bcrypt");
 const Joi = require("joi");
const express = require('express');
const router = express.Router();

router.post('/',async (req,res) => {
  
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email : req.body.email });
    if(!user) return res.status(400).send("user not Registered..");

    const validPassword = await bcrypt.compare(req.body.password , user.password);

    if(!validPassword) return res.status(400).send("Invalid password");

    //Get  the json web token generated.....
   const token = user.generateAuthToken();

   res.send(user);

});


  function validate(req){
    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required(),
     };
 
     return result = Joi.validate(req, schema);
}



module.exports = router;