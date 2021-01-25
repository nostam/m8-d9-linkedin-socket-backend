const router = require("express").Router();
const PostsRouter = require("./posts");

router.use("/posts", PostsRouter);

module.exports = router;
