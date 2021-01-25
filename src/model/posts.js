const { Schema, model } = require("mongoose");
const q2m = require("query-to-mongo");
const { APIError } = require("../utils");
const PostsSchema = new Schema(
  {
    text: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "profiles" },
    image: { type: String },
  },
  { timestamps: true }
);

PostsSchema.static("getAllPosts", async function (req) {
  try {
    const query = q2m(req.query);
    const total = await this.countDocuments(query.criteria);
    const articles = await this.find(
      query.criteria,
      { reviews: 0 },
      query.optionsfields
    )
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    const payload = {
      links: query.links(`/articles`, total),
      articles,
    };
    return payload;
  } catch (error) {
    throw new APIError(error);
  }
});

PostsSchema.static("updatePostByPostId", async function (postId, body) {
  try {
    const updatePost = await this.findByIdAndUpdate(
      postId,
      { $set: { text: body.text, image: body.image ? body.image : "" } },
      { runValidators: true, new: true }
    );
    const { _id } = await updatePost.save();
    return _id;
  } catch (error) {
    throw new APIError(error);
  }
});

const PostsModel = model("posts", PostsSchema);
module.exports = PostsModel;
