require("dotenv").config();
const HttpError = require("../models/http-error");

const SpotifyWebApi = require("spotify-web-api-node");

const logIn = async (req, res, next) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID_SPOTIFY,
    clientSecret: process.env.CLIENT_SECRET_SPOTIFY,
    redirectUri: process.env.REDIRECT_URI_SPOTIFY,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.status(201);
      res.json({
        spotiAccessToken: data.body.access_token,
        spotiRefreshToken: data.body.refresh_token,
        spotiExpiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.log(error);
      return next(new HttpError("Error retrieving the token", 400));
    });
};

const refresh = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID_SPOTIFY,
    clientSecret: process.env.CLIENT_SECRET_SPOTIFY,
    redirectUri: process.env.REDIRECT_URI_SPOTIFY,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.status(201);
      res.json({
        spotiAccessToken: data.body.access_token,
        spotiExpiresIn: data.body.expires_In,
      });
    })
    .catch((err) => {
      console.log(err);
      return next(new HttpError("Error refreshing the token", 500));
    });
};

exports.refresh = refresh;
exports.logIn = logIn;

