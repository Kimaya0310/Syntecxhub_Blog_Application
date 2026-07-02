import mongoose from "mongoose";
import slugify from "slugify";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      maxlength: 220,
    },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    readTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

postSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now()
      .toString()
      .slice(-6)}`;
  }
  if (this.content) {
    const plainText = this.content.replace(/<[^>]+>/g, "");
    if (!this.excerpt) {
      this.excerpt = plainText.slice(0, 200);
    }
    const words = plainText.trim().split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

postSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.model("Post", postSchema);
