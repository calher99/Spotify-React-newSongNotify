const HttpError = require("../models/http-error");
const Playlist = require("../models/playlist");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaylistsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let playlists;

  try {
    playlists = await Playlist.find({ user: userId });
  } catch (error) {
    return next(
      new HttpError(
        "Error while retrieving the playlists, try again please",
        500
      )
    );
  }
  if (!playlists) {
    new HttpError("Could not find a playlist for the provided id", 404);
  } else {
    //Getters : true so we get rid of an underscore in the id
    res.json({
      playlists: playlists.map((playlist) =>
        playlist.toObject({ getters: true })
      ),
    });
  }
};

const add = async (req, res, next) => {
  const createdPlaylist = new Playlist({
    spotifyId: req.body.id,
    name: req.body.name,
    image: req.body.image,
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

  res
    .status(201)
    .json({ playlist: createdPlaylist.toObject({ getters: true }) });
};

const update = async (req, res, next) => {
  // req.params.playlistId,
  // req.body.songs,
  // req.usedData.userId,

  let updatedPlaylist;
  try {
    updatedPlaylist = await Playlist.findById(req.params.playlistId);
  } catch (error) {
    return next(
      new HttpError("Error while retrieving a playlist, try again please", 500)
    );
  }
  //We dont want to let another verified user to modify a playlist that is not his
  //Autentication
  if (updatedPlaylist.user.toString() !== req.usedData.userId) {
    return next(
      new HttpError("You are not allowed to edit this playlist", 500)
    );
  }

  //Create new song array
  updatedPlaylist.songs = updatedPlaylist.songs.concat(req.body);

  try {
    await updatedPlaylist.save();
  } catch (error) {
    return next(
      new HttpError(
        "Error while saving updated playlist, try again please",
        500
      )
    );
  }

  res
    .status(201)
    .json({ playlist: updatedPlaylist.toObject({ getters: true }) });
};

const deletePlaylistById = async (req, res, next) => {
  const playlistId = req.params.playlistId;

  let playlist;
  try {
    //populate makes us to get the information of the user also
    playlist = await Playlist.findById(playlistId).populate("user", "playlists");
  } catch (error) {
    new HttpError("Something went wrong,try again please", 500);
  }
  if (!playlist) {
    new HttpError(
      "Could not retrive the playlist to be removerd, try again please",
      500
    );
  }
  //We have the id of user because of populate
  if(playlist.user.id !== req.usedData.userId){
    return next(
      new HttpError("You are not allowed to delete this place"),
      401
    );
  }
  
  try {
    //For ChatGPT: We need to delete the playlist and also delete it from the user playlists
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Playlist.deleteOne({ _id: playlist._id }, { session: sess });
    await User.updateOne(
      { _id: playlist.user },
      { $pull: { playlists: playlist._id } },
      { session: sess, new: true }
    );
    
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Error while deleting the playlist try again please", 500)
    );
  }

  
  res.status(200); //Convention is 201 when you submit something correctly
  res.json({ message: "Deleted playlist" });
};


exports.deletePlaylistById = deletePlaylistById;
exports.add = add;
exports.getPlaylistsByUserId = getPlaylistsByUserId;
exports.update = update;
