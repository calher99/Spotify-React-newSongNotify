const express = require("express");
const router = express.Router();

const playlistsControllers = require("../controllers/playlists-controller");
const checkAuth = require("../middleware/check-auth");

router.get("/:userId", playlistsControllers.getPlaylistsByUserId);

//Any route below this will need a token
router.use(checkAuth);


router.post("/add" , playlistsControllers.add)




module.exports = router;