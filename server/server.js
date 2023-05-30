const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const usersRoutes = require("./routes/users-routes");
const spotifyRoutes = require("./routes/spotify-routes");
const playlistsRoutes = require("./routes/playlists-routes");
const HttpError = require("./models/http-error");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", usersRoutes);

app.use("/api/spotify", spotifyRoutes);

app.use("/api/playlists", playlistsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  next(error);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(4080);
    console.log("Succesfully connected");
  })
  .catch((error) => {
    console.log(error);
  });