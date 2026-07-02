import Post from "../models/Post.js";
import { cloudinary } from "../config/cloudinary.js";

// @route GET /api/posts
// Supports ?page=&limit=&search=&tag=&author=
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = { status: "published" };
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    if (req.query.tag) {
      filter.tags = req.query.tag.toLowerCase();
    }
    if (req.query.author) {
      filter.author = req.query.author;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// @route GET /api/posts/:slug
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("author", "name avatar bio")
      .populate("comments.user", "name avatar");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error: error.message });
  }
};

// @route POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { title, content, tags, status, coverImageUrl, coverImagePublicId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",").map((t) => t.trim()) : [],
      status: status || "published",
      author: req.user._id,
      coverImage: {
        url: coverImageUrl || "",
        publicId: coverImagePublicId || "",
      },
    });

    const populated = await post.populate("author", "name avatar");
    res.status(201).json({ post: populated });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

// @route PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    const { title, content, tags, status, coverImageUrl, coverImagePublicId } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    }
    if (status) post.status = status;
    if (coverImageUrl !== undefined) {
      // remove old cloudinary image if replaced
      if (post.coverImage?.publicId && post.coverImage.publicId !== coverImagePublicId) {
        await cloudinary.uploader.destroy(post.coverImage.publicId).catch(() => {});
      }
      post.coverImage = { url: coverImageUrl, publicId: coverImagePublicId || "" };
    }

    await post.save();
    const populated = await post.populate("author", "name avatar");
    res.json({ post: populated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

// @route DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    if (post.coverImage?.publicId) {
      await cloudinary.uploader.destroy(post.coverImage.publicId).catch(() => {});
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// @route GET /api/posts/mine/all - current user's posts (drafts included)
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your posts", error: error.message });
  }
};

// @route PUT /api/posts/:id/like
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: "Failed to update like", error: error.message });
  }
};

// @route POST /api/posts/:id/comments
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: req.user._id, name: req.user.name, text });
    await post.save();

    res.status(201).json({ comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

// @route POST /api/posts/upload-image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};
