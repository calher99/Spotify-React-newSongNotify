const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  spotifyId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  songs: [{ type: String }],
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
},{
  timestamps: true
});

module.exports = mongoose.model("Playlist", playlistSchema);
