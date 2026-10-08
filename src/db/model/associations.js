import { userModel } from "./user.model.js";
import { Post } from "./post.model.js";
import { Comment } from "./comment.model.js";

Post.belongsTo(userModel, {
  foreignKey: "userId",
  as: "user",
});

Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
});



Comment.belongsTo(userModel, {
  foreignKey: "userId",
  as: "user",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",
});