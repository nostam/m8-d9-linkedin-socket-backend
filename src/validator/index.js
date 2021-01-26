const { body } = require("express-validator");

const validateExperience = [
  body("role","tell your role").isString(),
  body("company","tell your role").isString(),
  body("description","tell your role").isString(),


];
const validateProfile = [];

const validatePost = [
  body("text", "share something with us!").isString(),
  body("username", "Invalid username").isAlphanumeric(),
  body("user.id").isAlphanumeric(),
];


module.exports = { validatePost, validateExperience, validateProfile };
