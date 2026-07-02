import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import PostForm from "../components/PostForm";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${slug}`)
      .then(({ data }) => {
        if (data.post.author._id !== user?.id && user?.role !== "admin") {
          setNotAllowed(true);
        } else {
          setPost(data.post);
        }
      })
      .catch(() => setNotAllowed(true))
      .finally(() => setLoading(false));
  }, [slug, user]);

  const handleUpdate = async (payload) => {
    const { data } = await api.put(`/posts/${post._id}`, payload);
    navigate(`/post/${data.post.slug}`);
  };

  if (loading) return <Loader />;

  if (notAllowed) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-2xl mb-2">You can't edit this post.</p>
        <p className="text-ink/60">It either doesn't exist or belongs to someone else.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <div className="byline mb-3">Editing</div>
      <h1 className="font-display text-3xl font-semibold mb-8">{post.title}</h1>
      <PostForm initialValues={post} onSubmit={handleUpdate} submitLabel="Save changes" />
    </div>
  );
};

export default EditPost;
