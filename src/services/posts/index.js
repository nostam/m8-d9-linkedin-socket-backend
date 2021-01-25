const express = require("express");
const PostsRouter = express.Router();
const { validatePost } = require("../../validator");

const PostsModel = require("../../model/posts");
const { APIError } = require("../../utils");

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
      if (!errors.isEmpty()) throw APIError(errors.array(), 404);
      const newPost = await PostsModel(req.body);
      const { _id } = await newPost.save();
      res.status(201).send(_id);
    } catch (error) {
      next(error);
    }
  });

PostsRouter.route("/:postId")
  .get(async (req, res, next) => {
    try {
      const payload = await PostsModel.getPostById(req.params.psotId);
      res.send(payload);
    } catch (error) {
      next(error);
    }
  })
  .put(validatePost, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw APIError(errors.array(), 404);
      const _id = await PostsModel.updatePostByPostId(req.params.postId);
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
  .post();

module.exports = PostsRouter;
