import mongoose from "mongoose";

const postCommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityPost",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostComment",
    default: null,
  },
  level: {
    type: Number,
    default: 1,
    max: 3,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postCommentSchema.index({ postId: 1, createdAt: -1 });
postCommentSchema.index({ parentId: 1 });

export default mongoose.model("PostComment", postCommentSchema);
