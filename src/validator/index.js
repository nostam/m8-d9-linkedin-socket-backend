const { body } = require("express-validator");

const validatePost = [
  body("text", "share something with us! :)").isString(),
  body("username", "Invalid username").isAlphanumeric(),
];

module.exports = { validatePost, validateExperience, validateProfile };
