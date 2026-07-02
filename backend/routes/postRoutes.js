import express from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  toggleLike,
  addComment,
  uploadImage,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/mine/all", protect, getMyPosts);
router.get("/:slug", getPostBySlug);

router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

router.put("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);

router.post("/upload-image", protect, upload.single("image"), uploadImage);

export default router;
