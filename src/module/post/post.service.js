import { ValidationError, ForeignKeyConstraintError, fn, col } from "sequelize";
import { Post } from "../../db/model/post.model.js";
import { userModel } from "../../db/model/user.model.js";
import { Comment } from "../../db/model/comment.model.js";

export const CreatePost = async (data) => {
  const { title, content, userId } = data;
  const authorId = Number(userId);

  if (!Number.isSafeInteger(authorId) || authorId <= 0) {
    throw new Error("Invalid user ID.", { cause: 400 });
  }

  const user = await userModel.findByPk(authorId);

  if (!user) {
    throw new Error("User not found.", { cause: 404 });
  }

  const post = new Post({ title, content, userId: authorId });

  try {
    await post.save();
    return post;
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof ForeignKeyConstraintError
    ) {
      err.cause = 400;
    }

    throw err;
  }
};



export const DeletePost = async (postId, userId) => {
  const id = Number(postId);
  const requesterId = Number(userId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid post ID.", { cause: 400 });
  }

  if (!Number.isSafeInteger(requesterId) || requesterId <= 0) {
    throw new Error("Invalid user ID.", { cause: 400 });
  }

  const post = await Post.findByPk(id);

  if (!post) {
    throw new Error("Post not found.", { cause: 404 });
  }

  if (post.userId !== requesterId) {
    throw new Error("You are not authorized to delete this post.", {
      cause: 403,
    });
  }

  await post.destroy();
};



export const GetPostsDetails = async () => {
  return Post.findAll({
    attributes: ["id", "title"],
    include: [
      {
        model: userModel,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "content"],
        required: false,
      },
    ],
    order: [["id", "ASC"]],
  });
};



export const GetPostsCommentCount = async () => {
  const posts = await Post.findAll({
    attributes: [
      "id",
      "title",
      [fn("COUNT", col("comments.id")), "commentCount"],
    ],
    include: [
      {
        model: Comment,
        as: "comments",
        attributes: [],
        required: false,
      },
    ],
    group: ["post.id", "post.title"],
    order: [["id", "ASC"]],
    raw: true,
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    commentCount: Number(post.commentCount),
  }));
};