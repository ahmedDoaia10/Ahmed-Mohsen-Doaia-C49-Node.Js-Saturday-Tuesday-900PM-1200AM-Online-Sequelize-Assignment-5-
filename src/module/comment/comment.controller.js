import { Router } from "express";
import * as cs from "./comment.service.js";

export const commentRouter = Router();

commentRouter.post("/", async (req, res, next) => {
  try {
    await cs.CreateComments(req.body);

    return res.status(201).json({
      message: "Comments created.",
    });
  } catch (err) {
    next(err);
  }
});




commentRouter.patch("/:commentId", async (req, res, next) => {
  try {
    await cs.UpdateComment(req.params.commentId, req.body);

    return res.status(200).json({
      message: "Comment updated.",
    });
  } catch (err) {
    next(err);
  }
});



commentRouter.post("/find-or-create", async (req, res, next) => {
  try {
    const result = await cs.FindOrCreateComment(req.body);

    return res.status(result.created ? 201 : 200).json(result);
  } catch (err) {
    next(err);
  }
});




commentRouter.get("/search", async (req, res, next) => {
  try {
    const result = await cs.SearchComments(req.query.word);

    if (result.count === 0) {
      return res.status(404).json({
        message: "no comments found.",
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});




commentRouter.get("/newest/:postId", async (req, res, next) => {
  try {
    const comments = await cs.GetNewestComments(req.params.postId);

    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
});




commentRouter.get("/details/:id", async (req, res, next) => {
  try {
    const comment = await cs.GetCommentDetails(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "no comment found",
      });
    }

    return res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
});