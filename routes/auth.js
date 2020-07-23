const express = require("express");
const router = express.Router();
const { userSignupValidator } = require("../validator/index");

const {
  signup,
  signin,
  signout,
} = require("../controllers/auth");

router.post("/signin", signin);
router.post("/signup", userSignupValidator, signup);
router.get("/signout", signout);

module.exports = router;
