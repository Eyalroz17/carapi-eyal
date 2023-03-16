const express = require("express");
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"Welcome to the Car dealership , to learn more checkout the api decumantation"});
})

module.exports = router;