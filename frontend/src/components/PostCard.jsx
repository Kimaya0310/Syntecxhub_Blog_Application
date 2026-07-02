import { Link } from "react-router-dom";
import { format } from "date-fns";

const PostCard = ({ post }) => {
  return (
    <article className="group flex flex-col">
      <Link to={`/post/${post.slug}`} className="block overflow-hidden rounded-sm bg-sage/30 aspect-[16/10] mb-4">
        {post.coverImage?.url ? (
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-3xl text-ink/20">
            {post.title.charAt(0)}
          </div>
        )}
      </Link>

      <div className="byline mb-2">
        {post.author?.name || "Unknown"} · {format(new Date(post.createdAt), "MMM d, yyyy")} · {post.readTime} min read
      </div>

      <h3 className="font-display text-xl font-semibold leading-snug mb-2">
        <Link to={`/post/${post.slug}`} className="hover:text-moss transition-colors">
          {post.title}
        </Link>
      </h3>

      <p className="text-ink/65 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="font-mono text-[10px] uppercase tracking-wide text-clay border border-clay/40 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostCard;
