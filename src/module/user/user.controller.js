import { Router } from "express";
import * as us from "./user.service.js";

export const userRouter = Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    await us.CreateUser(req.body);

    return res.status(201).json({
      message: "User added successfully.",
    });
  } catch (err) {
    next(err);
  }
});


userRouter.put("/:id", async (req, res, next) => {
  try {
    await us.CreateOrUpdateUser(req.params.id, req.body);

    return res.status(200).json({
      message: "User created or updated successfully",
    });
  } catch (err) {
    next(err);
  }
});



userRouter.get("/by-email", async (req, res, next) => {
  try {
    const user = await us.FindUserByEmail(req.query.email);

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
});



userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await us.FindUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});