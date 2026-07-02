import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/axios";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const loadPost = () => {
    setLoading(true);
    api
      .get(`/posts/${slug}`)
      .then(({ data }) => {
        setPost(data.post);
        setLikeCount(data.post.likes.length);
        setLiked(user ? data.post.likes.includes(user.id) : false);
      })
      .catch(() => setError("This post could not be found."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) return navigate("/login", { state: { from: `/post/${slug}` } });
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login", { state: { from: `/post/${slug}` } });
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comments`, { text: commentText });
      setPost((p) => ({ ...p, comments: data.comments }));
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-2xl mb-2">{error || "Post not found"}</p>
        <Link to="/" className="text-moss hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const isOwner = user && (user.id === post.author._id || user.role === "admin");

  return (
    <article className="max-w-prose mx-auto px-5 sm:px-8 py-12">
      <div className="byline mb-4">
        {post.author?.name} · {format(new Date(post.createdAt), "MMMM d, yyyy")} · {post.readTime} min read
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-6">{post.title}</h1>

      {isOwner && (
        <div className="flex gap-3 mb-6">
          <Link to={`/edit/${post.slug}`} className="btn-secondary text-sm py-2">
            Edit post
          </Link>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger text-sm py-2">
            Delete post
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mb-6 border border-rust/30 bg-rust/5 rounded-sm p-4">
          <p className="text-sm text-ink mb-3">Delete this post permanently? This can't be undone.</p>
          <div className="flex gap-2">
            <button onClick={handleDelete} className="btn-danger text-sm py-1.5">
              Yes, delete it
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-sm py-1.5">
              Cancel
            </button>
          </div>
        </div>
      )}

      {post.coverImage?.url && (
        <img src={post.coverImage.url} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-sm mb-8" />
      )}

      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-ink/10">
          {post.tags.map((tag) => (
            <span key={tag} className="font-mono text-[11px] uppercase tracking-wide text-clay border border-clay/40 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Like */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-ink/10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
            liked ? "border-rust text-rust bg-rust/5" : "border-ink/20 text-ink/60 hover:border-rust hover:text-rust"
          }`}
        >
          <span>{liked ? "♥" : "♡"}</span>
          <span className="font-mono text-sm">{likeCount}</span>
        </button>
      </div>

      {/* Comments */}
      <section className="mt-10 pt-8 border-t border-ink/10">
        <h2 className="font-display text-xl font-semibold mb-5">
          Comments <span className="text-ink/40">({post.comments?.length || 0})</span>
        </h2>

        <form onSubmit={handleComment} className="mb-8 flex flex-col gap-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={user ? "Share your thoughts…" : "Sign in to leave a comment"}
            disabled={!user}
            rows={3}
            className="input-field resize-none"
          />
          <button type="submit" disabled={submittingComment || !user} className="btn-secondary self-start disabled:opacity-50">
            {submittingComment ? "Posting…" : "Post comment"}
          </button>
        </form>

        <div className="space-y-5">
          {post.comments?.length === 0 && <p className="text-ink/50 text-sm">Be the first to comment.</p>}
          {[...(post.comments || [])].reverse().map((c) => (
            <div key={c._id} className="border-b border-ink/10 pb-4">
              <div className="byline mb-1">
                {c.name} · {format(new Date(c.createdAt), "MMM d, yyyy")}
              </div>
              <p className="text-ink/85 text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default PostDetail;
