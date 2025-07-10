'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const BlogPostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  const id = params.slug;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog_post');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const post = posts.length > 0 ? posts.find(p => p.id === id) : null;

  if (loading) return <LoadingSpinner />;
  if (error || !post) return <ErrorPage router={router} />;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <PostHeader post={post} />
      <PostContent post={post} />
    </div>
  );
};

// Sub-components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ErrorPage = ({ router }) => (
  <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
    <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
    <p className="text-gray-400 mb-6 max-w-md">
      We couldn't find the blog post you're looking for.
    </p>
    <button
      onClick={() => router.push('/blog')}
      className="px-6 py-3 bg-indigo-600 rounded-full font-medium hover:bg-indigo-700 transition-colors"
    >
      Browse All Articles
    </button>
  </div>
);

const PostHeader = ({ post }) => (
  <div className="relative h-[70vh] overflow-hidden">
    {post.post_img && (
      <div className="absolute inset-0">
        <img
          src={post.post_img}
          alt={post.Blog_title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/30 to-gray-900/90" />
      </div>
    )}
    <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          {post.category && (
            <span className="inline-block px-3 py-1 bg-indigo-600/90 text-white text-sm font-semibold rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl">
            {post.Blog_title}
          </h1>
          <div className="flex items-center text-gray-300">
            {post.Date && <span>{post.Date}</span>}
            <span className="mx-2">•</span>
            <span>5 min read</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PostContent = ({ post }) => {
  const formatContent = (content) => {
    if (!content) return '';
    
    // First handle {{ }} blocks with indentation
    let formatted = content.replace(/\{\{(.*?)\}\}/gs, (match, group) => {
      // Split the group by // and add indentation to each line
      const indentedLines = group.split('//')
        .filter(line => line.trim()) // Remove empty lines
        .map(line => `    ${line.trim()}`)
        .join('\n');
      return `\n${indentedLines}\n`; // Add extra newlines around the block
    });
    
    // Then handle remaining // as line breaks with spacing
    formatted = formatted.replace(/\/\//g);
    
    return formatted;
  };

  // Structure the content parts in order
  const contentParts = [
    { type: 'text', content: post.post_content_part_1 },
    { type: 'image', content: post.post_img_1 },
    { type: 'text', content: post.post_content_part_2 },
    { type: 'image', content: post.post_img_2 },
    { type: 'text', content: post.post_content_part_3 }
  ].filter(part => part.content); // Only include parts that have content

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <article className="prose prose-invert max-w-none">
        {contentParts.length > 0 ? (
          contentParts.map((part, index) => {
            if (part.type === 'image') {
              return (
                <div key={index} className="my-12 rounded-xl overflow-hidden">
                  <img 
                    src={part.content} 
                    alt={`Blog image ${index + 1}`} 
                    className="w-full h-auto"
                  />
                </div>
              );
            } else {
              const formattedText = formatContent(part.content);
              return (
                <div key={index} className="mb-8 whitespace-pre-wrap">
                  {formattedText}
                </div>
              );
            }
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 italic">Content not available</p>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPostPage;