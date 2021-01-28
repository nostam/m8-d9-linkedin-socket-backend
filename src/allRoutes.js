const router = require("express").Router();
const PostsRouter = require("./services/posts");
const experiencesRoute = require("./services/experiences");
const profilesRoute = require("./services/profiles");
const commentsRoute = require("./services/comments");


router.use("/profiles", profilesRoute);
router.use("/posts", PostsRouter);
router.use("/experiences", experiencesRoute);
router.use("/comments", commentsRoute);



module.exports = router;
