const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  lastName: {type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  playlists: [{type: mongoose.Types.ObjectId, ref: 'Playlist'}]
});

userSchema.plugin(uniqueValidator)
//uniqueValidator bc email will be unique
//It makes the queries to run faster

module.exports = mongoose.model("User", userSchema);
