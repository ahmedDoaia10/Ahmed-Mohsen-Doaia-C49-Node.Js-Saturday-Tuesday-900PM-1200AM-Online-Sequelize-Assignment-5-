import express from "express";
import { PORT } from "./config/config.service.js";
import { connect } from "./db/connection.js";
import "./db/model/user.model.js";
import "./db/model/post.model.js";
import "./db/model/comment.model.js";
import "./db/model/associations.js";
import { userRouter } from "./module/user/index.js";
import { postRouter } from "./module/post/index.js";
import { commentRouter } from "./module/comment/index.js";
import { globalErrorHandler } from "./common/index.js";

const app = express();


await connect();

app.use(express.json());

app.use(["/users", "/user"], userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
