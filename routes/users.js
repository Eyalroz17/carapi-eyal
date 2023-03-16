const express = require("express");
const bcrypt = require("bcrypt");
const { auth } = require("../middlewares/auth");
const { validateJoi, UserModel, validateLogin, createToken } = require("../models/userModel");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users Endpoint." });
})



router.get("/userInfo", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    res.json(user)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


router.post("/", async (req, res) => {
  let validBody = validateJoi(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "******"
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "Email already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "Email not found" });
    }
    let passwordValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ err: "Password worng" });
    }
    let token = createToken(user._id, user.role)
    return res.json({ token })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;