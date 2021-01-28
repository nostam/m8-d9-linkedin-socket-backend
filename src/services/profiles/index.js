const express = require("express");
const app = express.Router();
const { uploadCloudinary } = require("../../utils/cloudinary");
const PDFDocument = require("pdfkit");
const requestIp = require("request-ip");
const { validateProfile } = require("../../validator");
const jwt = require("express-jwt");
const auth = require("../middleware/auth")
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MG_DOMAIN;
const mg = mailgun({
  apiKey: process.env.MG_APIKEY,
  domain: process.env.MG_DOMAIN,
});
const senderEmail = "Mailgun Sandbox" + process.env.MG_EMAIL;

const ProfileSchema = require("../../model/profiles");




app.get("/me", auth.checkToken, (req, res) => {
  res.send(req.user)
});

app.post("/", async (req, res, next) => {
  try {
    const profile = await new ProfileSchema(req.body).save();
    req.user = profile;
    next()
  } catch (err) {
    console.log(err);
    next(err);
  }
}, auth.generateToken);

app.post("/login", auth.login, auth.generateToken);

app.get("/", async (req, res, next) => {
  try {
    const regex = new RegExp(req.query.name, "ig");
    const profiles = await ProfileSchema.find({
      $or: [{ name: regex }, { surname: regex }],
    });
    const clientIp = requestIp.getClientIp(req);

    if (profiles.length > 0) {
      res.status(200).send(profiles);
      console.log("\x1b[32m", clientIp + " did GET/profiles");
    } else {
      res
        .status(404)
        .send(
          "404, not found. Could it be that there aren't any profiles in the databse?"
        );
      console.log(
        "\x1b[33m%s\x1b[0m",
        clientIp + " did GET/profiles but encountered 404"
      );
    }
  } catch (err) {
    console.log("\x1b[31m", err);
    next(err);
  }
});

app.get("/:id", async (req, res, next) => {
  try {
    const clientIp = requestIp.getClientIp(req);
    const profile = await ProfileSchema.findById(req.params.id);
    if (profile) {
      res.status(200).send(profile);
      console.log("\x1b[32m", clientIp + " did GET/profiles/" + req.params.id);
    } else {
      res
        .status(404)
        .send("404, not found. Wrong id or the elemnt doesn't exist?");
      console.log(
        "\x1b[33m%s\x1b[0m",
        clientIp + " did GET/profiles/" + req.params.id + " but encountered 404"
      );
    }
  } catch (err) {
    console.log("\x1b[31m", err);
    next(err);
  }
});

app.get("/:id/cv", async (req, res, next) => {
  try {
    const profile = await ProfileSchema.findById(req.params.id);
    const doc = new PDFDocument();

    doc.fontSize(25).text(profile.username);
    doc.text(profile.name);
    doc.text(profile.surname);
    doc.text(profile.title);
    doc.text(profile.area);
    doc.text(profile.email);
    doc.text(profile.bio);
    doc.text(profile.image);

    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.log("\x1b[31m", err);
    next(err);
  }
});

app.post(
  "/:id/img_upld",
  uploadCloudinary.single("image"),
  async (req, res, next) => {
    try {
      const addPicture = await ProfileSchema.findByIdAndUpdate(req.params.id, {
        $set: {
          image: req.file.path,
        },
      });
      res.status(200).send(addPicture);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

app.put("/:id", validateProfile, async (req, res, next) => {
  try {
    const clientIp = requestIp.getClientIp(req);
    const modifiedProfile = await ProfileSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    console.log();
    if (modifiedProfile) {
      res.status(200).send("profile changed, new id:" + modifiedProfile._id);
      console.log(
        "\x1b[32m",
        clientIp + " modified a profile, id: " + req.params.id
      );
    } else {
      res.send("Unknown error, maybe you mistaken the id?");
      console.log(
        "\x1b[33m%s\x1b[0m",
        clientIp +
        " tried to modify a profile but encountered an error, id: " +
        req.params.id
      );
      next();
    }
  } catch (err) {
    console.log("\x1b[31m", err);
    next(err);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    const clientIp = requestIp.getClientIp(req);
    const DeletedProfile = await ProfileSchema.findByIdAndDelete(req.params.id);
    if (DeletedProfile) {
      res.status(200).send("profile deleted!");
      console.log(
        "\x1b[32m",
        clientIp + " deleted a profile, id: " + req.params.id
      );
    } else {
      res.send("Unknown error, maybe you mistaken the id?");
      console.log(
        "\x1b[33m%s\x1b[0m",
        clientIp +
        " tried to delete a profile but encountered an error, id: " +
        req.params.id
      );
      next();
    }
  } catch (err) {
    console.log("\x1b[31m", err);
    next(err);
  }
});

module.exports = app;
