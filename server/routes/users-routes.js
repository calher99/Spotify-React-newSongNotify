const express = require("express");
const router = express.Router();

const usersControllers = require("../controllers/users-controller");

router.get("/" , usersControllers.getUsers)

router.post("/signup" , usersControllers.signUp)

router.post("/signin" , usersControllers.logIn)


module.exports = router;