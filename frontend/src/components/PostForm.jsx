import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios";

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const PostForm = ({ initialValues, onSubmit, submitLabel }) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [tags, setTags] = useState(initialValues?.tags?.join(", ") || "");
  const [status, setStatus] = useState(initialValues?.status || "published");
  const [coverImage, setCoverImage] = useState({
    url: initialValues?.coverImage?.url || "",
    publicId: initialValues?.coverImage?.publicId || "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/posts/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCoverImage({ url: data.url, publicId: data.publicId });
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim() || content === "<p><br></p>") {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title,
        content,
        tags,
        status: publishStatus || status,
        coverImageUrl: coverImage.url,
        coverImagePublicId: coverImage.publicId,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      {error && (
        <div className="border border-rust/30 bg-rust/5 text-rust text-sm px-4 py-3 rounded-sm">{error}</div>
      )}

      {/* Cover image */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-ink/60 mb-1.5">Cover image</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border border-dashed border-ink/25 rounded-sm aspect-[21/9] flex items-center justify-center bg-white/40 hover:border-moss transition-colors overflow-hidden"
        >
          {uploading ? (
            <span className="font-mono text-xs uppercase tracking-wide text-ink/50">Uploading…</span>
          ) : coverImage.url ? (
            <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-xs uppercase tracking-wide text-ink/40">Click to upload a cover image</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-ink/60 mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field font-display text-xl"
          placeholder="Give your post a title"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-ink/60 mb-1.5">Content</label>
        <div className="quill-editorial">
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-ink/60 mb-1.5">
          Tags <span className="normal-case text-ink/40">(comma separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input-field"
          placeholder="writing, technology, life"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || uploading}
          onClick={(e) => handleSubmit(e, "published")}
          className="btn-primary disabled:opacity-60"
        >
          {submitting ? "Publishing…" : submitLabel || "Publish post"}
        </button>
        <button
          type="button"
          disabled={submitting || uploading}
          onClick={(e) => handleSubmit(e, "draft")}
          className="btn-secondary disabled:opacity-60"
        >
          Save as draft
        </button>
      </div>
    </form>
  );
};

export default PostForm;
