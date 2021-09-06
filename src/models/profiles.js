//const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ProfileSchema = new Schema(
  {
    name: String,
    surname: String,
    email: { type: String, unique: true },
    bio: String,
    title: { type: String, default: "New User" },
    area: String,
    image: { type: String, default: "https://picsum.photos/100" },
    username: { type: String, unique: true },
    password: String,
    refreshToken: [{ token: String }],
  },
  {
    timestamps: true,
  }
);

//ProfileSchema.plugin(passportLocalMongoose)

ProfileSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      return user;
    } else return null;
  } else {
    return null;
  }
};

ProfileSchema.pre("save", async function (next) {
  const user = this;
  const plainPW = user.password;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

Profile_Schema = mongoose.model("profiles", ProfileSchema);

module.exports = Profile_Schema;
