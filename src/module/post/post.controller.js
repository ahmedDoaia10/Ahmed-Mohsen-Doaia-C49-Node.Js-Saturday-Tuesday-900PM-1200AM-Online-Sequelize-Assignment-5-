import { Router } from "express";
import * as ps from "./post.service.js";

export const postRouter = Router();

postRouter.post("/", async (req, res, next) => {
  try {
    await ps.CreatePost(req.body);

    return res.status(201).json({
      message: "Post created successfully.",
    });
  } catch (err) {
    next(err);
  }
});



postRouter.delete("/:postId", async (req, res, next) => {
  try {
    await ps.DeletePost(req.params.postId, req.body?.userId);

    return res.status(200).json({
      message: "Post deleted.",
    });
  } catch (err) {
    next(err);
  }
});



postRouter.get("/details", async (req, res, next) => {
  try {
    const posts = await ps.GetPostsDetails();

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});



postRouter.get("/comment-count", async (req, res, next) => {
  try {
    const posts = await ps.GetPostsCommentCount();

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});