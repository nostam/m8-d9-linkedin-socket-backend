const passport = require("passport");
const Profile = require("./models/profiles");
const express = require("express");
const cors = require("cors");
// const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const http = require("http");

const app = express();
const createSocketServer = require("./socket");
const httpServer = http.createServer(app);
createSocketServer(httpServer);

const servicesRoutes = require("./allRoutes");
const { httpErrorHandler } = require("./utils/index");

const port = process.env.PORT || 3001;
const whiteList =
  process.env.NODE_ENV === "production"
    ? [process.env.FE_URL_PROD]
    : [process.env.FE_URL_DEV];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("NOT ALLOWED - CORS ISSUES"));
    }
  },
};

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url} ${new Date()}`);
  next();
};

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Endpoints

app.use("/", servicesRoutes);

app.use(httpErrorHandler);

mongoose
  .connect(process.env.MONGO_CONNECTION + "/linkedin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    httpServer.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
