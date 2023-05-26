const HttpError = require("../models/http-error");
const Playlist = require("../models/playlist");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaylistsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let playlists;

  try {
    playlists = await Playlist.find({user: userId});
  } catch (error) {
    return next(
      new HttpError("Error while retrieving the playlists, try again please", 500)
    );
  }
  if (!playlists) {
    new HttpError("Could not find a playlist for the provided id", 404)
  } else {
 
    //Getters : true so we get rid of an underscore in the id
    res.json({ playlists: playlists.map(playlist => playlist.toObject({getters: true})) });
  }
}

const add = async (req, res, next) => {
  
  
  const createdPlaylist = new Playlist({
    spotifyId: req.body.id,
    name:req.body.name,
    image:req.body.image, 
    songs: req.body.songs,
    user: req.usedData.userId,
  });
  let user;
  try {
    user = await User.findById(req.usedData.userId);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Error while creating a new Place, try again please", 500)
    );
  }
  if (!user) {
    return next(
      new HttpError("Could not find the user for the provided id", 404)
    );
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlaylist.save({ session: sess }); // save playlist
    user.playlists.push(createdPlaylist); // add playlist to user's playlists
    await user.save({ session: sess }); // save user
    await sess.commitTransaction(); // commit transaction
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Creating playlist failed, please try again.", 500)
    );
  }

  res.status(201).json({ playlist: createdPlaylist.toObject({ getters: true }) });

};

exports.add = add;
exports.getPlaylistsByUserId = getPlaylistsByUserId