import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PostForm from "../components/PostForm";

const CreatePost = () => {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const { data } = await api.post("/posts", payload);
    navigate(`/post/${data.post.slug}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <div className="byline mb-3">New entry</div>
      <h1 className="font-display text-3xl font-semibold mb-8">Write a new post</h1>
      <PostForm onSubmit={handleCreate} submitLabel="Publish post" />
    </div>
  );
};

export default CreatePost;
