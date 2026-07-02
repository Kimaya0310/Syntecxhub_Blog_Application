import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const fetchPosts = useCallback(async (pageNum, searchTerm) => {
    setLoading(true);
    try {
      const { data } = await api.get("/posts", {
        params: { page: pageNum, limit: 9, search: searchTerm || undefined },
      });
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page, search);
  }, [page, fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(search ? { search } : {});
    fetchPosts(1, search);
  };

  const [featured, ...rest] = posts;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      {/* Hero */}
      <section className="mb-14">
        <div className="byline mb-4">Issue No. {new Date().getFullYear()} · Est. Today</div>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] max-w-3xl mb-6">
          Long-form thinking, published for anyone paying attention.
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts, topics, tags…"
            className="input-field"
          />
          <button type="submit" className="btn-secondary shrink-0">
            Search
          </button>
        </form>
      </section>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl mb-2">Nothing here yet.</p>
          <p className="text-ink/60">Try a different search, or be the first to publish.</p>
        </div>
      ) : (
        <>
          {/* Featured post masthead-style */}
          {page === 1 && featured && (
            <Link to={`/post/${featured.slug}`} className="group grid md:grid-cols-2 gap-8 items-center mb-16 pb-16 border-b border-ink/10">
              <div className="overflow-hidden rounded-sm bg-sage/30 aspect-[4/3]">
                {featured.coverImage?.url ? (
                  <img
                    src={featured.coverImage.url}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-5xl text-ink/20">
                    {featured.title.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="byline mb-3">Featured · {featured.author?.name}</div>
                <h2 className="font-display text-3xl font-semibold leading-tight mb-4 group-hover:text-moss transition-colors">
                  {featured.title}
                </h2>
                <p className="text-ink/65 leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="font-mono text-xs uppercase tracking-wide text-ink/50">
                  {format(new Date(featured.createdAt), "MMMM d, yyyy")} · {featured.readTime} min read
                </span>
              </div>
            </Link>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {(page === 1 ? rest : posts).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-16 font-mono text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="flex items-center px-2 text-ink/50">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
