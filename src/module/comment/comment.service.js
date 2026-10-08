import { Op, AggregateError, ForeignKeyConstraintError } from "sequelize";

import { Comment } from "../../db/model/comment.model.js";
import { Post } from "../../db/model/post.model.js";
import { userModel } from "../../db/model/user.model.js";

export const CreateComments = async (data) => {
  if (!Array.isArray(data?.comments) || data.comments.length === 0) {
    throw new Error("Comments must be a non-empty array.", {
      cause: 400,
    });
  }

  const comments = data.comments.map((comment) => {
    const postId = Number(comment?.postId);
    const userId = Number(comment?.userId);

    if (
      !Number.isSafeInteger(postId) ||
      postId <= 0 ||
      !Number.isSafeInteger(userId) ||
      userId <= 0
    ) {
      throw new Error("Invalid post or user ID.", { cause: 400 });
    }

    if (typeof comment?.content !== "string" || comment.content.trim() === "") {
      throw new Error("Comment content is required.", { cause: 400 });
    }

    return {
      content: comment.content,
      postId,
      userId,
    };
  });

  const postIds = [...new Set(comments.map((comment) => comment.postId))];
  const userIds = [...new Set(comments.map((comment) => comment.userId))];

  const posts = await Post.findAll({
    where: { id: { [Op.in]: postIds } },
    attributes: ["id"],
  });

  if (posts.length !== postIds.length) {
    throw new Error("One or more posts were not found.", { cause: 404 });
  }

  const users = await userModel.findAll({
    where: { id: { [Op.in]: userIds } },
    attributes: ["id"],
  });

  if (users.length !== userIds.length) {
    throw new Error("One or more users were not found.", { cause: 404 });
  }

  try {
    return await Comment.bulkCreate(comments, {
      validate: true,
    });
  } catch (err) {
    if (
      err instanceof AggregateError ||
      err instanceof ForeignKeyConstraintError
    ) {
      err.cause = 400;
    }

    throw err;
  }
};



export const UpdateComment = async (commentId, data) => {
  const id = Number(commentId);
  const userId = Number(data?.userId);

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !Number.isSafeInteger(userId) ||
    userId <= 0
  ) {
    throw new Error("Invalid comment or user ID.", { cause: 400 });
  }

  const comment = await Comment.findByPk(id);

  if (!comment) {
    throw new Error("comment not found.", { cause: 404 });
  }

  if (comment.userId !== userId) {
    throw new Error(
      "You are not authorized to update this comment.",
      { cause: 403 }
    );
  }

  if (
    typeof data?.content !== "string" ||
    data.content.trim() === ""
  ) {
    throw new Error("Comment content is required.", { cause: 400 });
  }

  await comment.update({
    content: data.content,
  });
};



export const FindOrCreateComment = async (data) => {
  const postId = Number(data?.postId);
  const userId = Number(data?.userId);
  const content = data?.content;

  if (
    !Number.isSafeInteger(postId) ||
    postId <= 0 ||
    !Number.isSafeInteger(userId) ||
    userId <= 0
  ) {
    throw new Error("Invalid post or user ID.", { cause: 400 });
  }

  if (typeof content !== "string" || content.trim() === "") {
    throw new Error("Comment content is required.", { cause: 400 });
  }

  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found.", { cause: 404 });
  }

  const user = await userModel.findByPk(userId);

  if (!user) {
    throw new Error("User not found.", { cause: 404 });
  }

  const [comment, created] = await Comment.findOrCreate({
    where: {
      postId,
      userId,
      content,
    },
  });

  return { comment, created };
};



export const SearchComments = async (word) => {
  if (typeof word !== "string" || word.trim() === "") {
    throw new Error("Search word is required.", { cause: 400 });
  }

  const { count, rows } = await Comment.findAndCountAll({
    where: {
      content: {
        [Op.like]: `%${word.trim()}%`,
      },
    },
    order: [["id", "ASC"]],
  });

  return {
    count,
    comments: rows,
  };
};



export const GetNewestComments = async (postId) => {
  const id = Number(postId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid post ID.", { cause: 400 });
  }

  const post = await Post.findByPk(id);

  if (!post) {
    throw new Error("Post not found.", { cause: 404 });
  }

  return Comment.findAll({
    where: {
      postId: id,
    },
    attributes: ["id", "content", "createdAt"],
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    limit: 3,
  });
};



export const GetCommentDetails = async (commentId) => {
  const id = Number(commentId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid comment ID.", { cause: 400 });
  }

  return Comment.findByPk(id, {
    attributes: ["id", "content"],
    include: [
      {
        model: userModel,
        as: "user",
        attributes: ["id", "name", "email"],
      },
      {
        model: Post,
        as: "post",
        attributes: ["id", "title", "content"],
      },
    ],
  });
};
