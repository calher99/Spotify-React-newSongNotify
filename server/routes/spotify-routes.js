const express = require("express");
const router = express.Router();

const spotifyControllers = require("../controllers/spotify-controller");



router.post("/login" , spotifyControllers.logIn)

router.post("/refresh" , spotifyControllers.refresh)



module.exports = router;