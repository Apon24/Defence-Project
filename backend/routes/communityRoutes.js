import express from "express";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
  getComments,
  addComment,
  likeComment,
  deleteComment,
} from "../controllers/communityController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/posts").get(getPosts).post(createPost);

router.route("/posts/:id").delete(deletePost);

router.put("/posts/:id/like", likePost);

router.route("/posts/:id/comments").get(getComments).post(addComment);

// Comment specific routes
router.put("/comments/:commentId/like", likeComment);
router.delete("/comments/:commentId", deleteComment);

export default router;
