import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/axios";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadPosts = () => {
    setLoading(true);
    api
      .get("/posts/mine/all")
      .then(({ data }) => setPosts(data.posts))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    await api.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <div className="byline mb-3">Your desk</div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-3xl font-semibold">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <Link to="/create" className="btn-primary text-sm">
          Write a post
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-ink/20 rounded-sm">
          <p className="font-display text-xl mb-2">You haven't published anything yet.</p>
          <p className="text-ink/60 mb-5">Your drafts and posts will show up here.</p>
          <Link to="/create" className="btn-primary">
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-ink/10">
          {posts.map((post) => (
            <div key={post._id} className="py-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="byline mb-1.5">
                  {post.status === "draft" ? (
                    <span className="text-clay">Draft</span>
                  ) : (
                    <span className="text-moss">Published</span>
                  )}
                  {" · "}
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                  {" · "}
                  {post.likes.length} likes · {post.comments.length} comments
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {post.status === "published" ? (
                    <Link to={`/post/${post.slug}`} className="hover:text-moss transition-colors">
                      {post.title}
                    </Link>
                  ) : (
                    post.title
                  )}
                </h3>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/edit/${post.slug}`} className="btn-secondary text-sm py-1.5">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  disabled={deletingId === post._id}
                  className="btn-danger text-sm py-1.5"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
