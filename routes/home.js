const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
res.send('<h1> Hello welcome to Emotion detection  api build.. </h1>');
});

module.exports = router;

