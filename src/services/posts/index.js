const express = require("express");
const PostsRouter = express.Router();
const { validatePost } = require("../../validator");
const { validationResult } = require("express-validator");
const PostsModel = require("../../models/posts");
const ProfilesModel = require("../../models/profiles");
const { APIError } = require("../../utils");
const {
  uploadCloudinary,
  uploadCloudinaryWithLimit,
} = require("../../utils/cloudinary");

PostsRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const payload = await PostsModel.getAllPosts(req);
      res.send(payload);
    } catch (error) {
      next(error);
    }
  })
  .post(validatePost, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new APIError(400, errors.array());
      const user = await ProfilesModel.find({ username: req.body.username });
      if (user.length !== 1) throw new APIError(404, "User not found");
      const payload = {
        ...req.body,
        user: user[0],
      };
      const newPost = await PostsModel(payload);
      const { _id } = await newPost.save();
      res.status(201).send(_id);
    } catch (error) {
      next(error);
    }
  });

PostsRouter.route("/:postId")
  .get(async (req, res, next) => {
    try {
      const payload = await PostsModel.findById(req.params.postId).populate([
        "comments",
        "user",
      ]);
      res.send(payload);
    } catch (error) {
      next(error);
    }
  })
  .put(validatePost, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new APIError(404, errors.array());
      const _id = await PostsModel.updatePostByPostId(
        req.params.postId,
        req.body
      );
      res.status(201).send(_id);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const payload = await PostsModel.findByIdAndDelete(req.params.postId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
  .post(uploadCloudinary.single("post"), async (req, res, next) => {
    let imageUrl;
    if (req.file && req.file.path) imageUrl = req.file.path;
    try {
      console.log(req.body, req.file);
      const { _doc } = await PostsModel.findById(req.params.postId);
      const payload = { ..._doc, image: imageUrl };
      const _id = await PostsModel.updatePostByPostId(
        req.params.postId,
        payload
      );
      res.status(201).send(_id);
    } catch (error) {
      next(error);
    }
  });

PostsRouter.post("/:postId/:userId/like", async (req, res, next) => {
  try {
    const modifiedPost = await PostsModel.findByIdAndUpdate(
      req.params.postId,
      {
        $push: {
          likes: [
            {
              _id: req.params.userId,
              name: req.body.name,
              surname: req.body.surname,
            },
          ],
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.send(modifiedPost);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
PostsRouter.delete("/:postId/:likeId", async (req, res, next) => {
  try {
    const posts = await PostsModel.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          likes: {
            _id: req.params.likeId,
          },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.send(posts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = PostsRouter;
