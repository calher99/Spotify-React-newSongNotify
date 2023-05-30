const express = require("express");
const router = express.Router();

const spotifyControllers = require("../controllers/spotify-controller");



router.post("/login" , spotifyControllers.logIn)

router.post("/refresh" , spotifyControllers.refresh)

router.post("/get-playlists" , spotifyControllers.userPlaylists)


module.exports = router;