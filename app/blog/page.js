'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Image } from '@heroui/react';
import { useRouter } from 'next/navigation';


const MagneticButton = ({ children, onClick = () => {} }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const handleMouseMove = (e) => {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    };
    
    const handleMouseEnter = () => setHovering(true);
    const handleMouseLeave = () => {
      setHovering(false);
      setPosition({ x: 0, y: 0 });
    };
    
    ref.current.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseenter', handleMouseEnter);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseenter', handleMouseEnter);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(); // This is now safe because we provided a default function
  };

  return (
    <motion.button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="relative overflow-hidden bg-indigo-600 text-white px-6 py-3 rounded-full font-medium"
      whileTap={{ scale: 0.95 }}
    >
      <motion.span 
        className="relative z-10"
        animate={{
          x: position.x * 0.2,
          y: position.y * 0.2
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {children}
      </motion.span>
      <motion.div 
        className="absolute inset-0 bg-indigo-700 rounded-full"
        initial={{ scale: 0 }}
        animate={{ 
          scale: hovering ? 1 : 0,
          x: position.x * 0.4,
          y: position.y * 0.4
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      />
    </motion.button>
  );
};

const BlogCard = ({ title, excerpt, date, category, imageUrl, index, onReadMore }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onReadMore();
  };

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500 transition-all"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          radius="none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-indigo-600/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>5 min read</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-4">{excerpt}</p>
        <button 
          onClick={handleClick}
          className="relative overflow-hidden bg-indigo-600 text-white px-6 py-3 rounded-full font-medium"
        >
          Read More
        </button>
      </div>
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
      </div>
    </motion.article>
  );
};

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = ['All', 'Travel Tips', 'Airport Guides', 'Parking Hacks', 'Company News'];
  
  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

const BlogHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div ref={ref} className="relative h-[80vh] overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{ y: yBg }}
      >
        <Image
          src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=2670&auto=format&fit=crop"
          alt="Blog hero"
          className="w-full h-full object-cover"
          radius="none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-gray-900/90" />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-center px-6"
        style={{ y: yText }}
      >
        <div className="max-w-4xl">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Simpleparking Blog
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover expert travel tips, airport guides, and parking hacks to make your journeys smoother
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <MagneticButton>Explore Articles</MagneticButton>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
};

const FeaturedPost = ({ featuredPost, onReadMore }) => {
  const [hovered, setHovered] = useState(false);

  if (!featuredPost) return null;
  
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-white mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Article
        </motion.h2>
        
        <motion.div 
          className="relative rounded-3xl overflow-hidden border border-gray-800"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <Image
                src={featuredPost.post_img || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2670&auto=format&fit=crop"}
                alt={featuredPost.Blog_title}
                className="w-full h-full object-cover"
                radius="none"
              />
              <AnimatePresence>
                {hovered && (
                  <motion.div 
                    className="absolute inset-0 bg-indigo-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="p-8 lg:p-12 bg-gray-900">
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <span>{featuredPost.Date}</span>
                <span className="mx-2">•</span>
                <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full">
                  {featuredPost.category}
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {featuredPost.Blog_title}
              </h3>
              <p className="text-gray-400 mb-6">
                {featuredPost.title_desc}
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">
                    {featuredPost.post_by?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {featuredPost.post_by || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {featuredPost.category || "Author"}
                  </p>
                </div>
              </div>
              <motion.div
                className="absolute bottom-8 right-8"
                whileHover={{ scale: 1.1 }}
              >
                <MagneticButton onClick={onReadMore}>
                  Read Full Article
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog_post');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  const handleReadMore = (postId) => {
    router.push(`/blog/${postId}`);
  };

  // Get the first post as featured or a specific featured post
  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;
  
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white">
      <BlogHero />
      
      {featuredPost && (
        <FeaturedPost 
          featuredPost={featuredPost} 
          onReadMore={() => handleReadMore(featuredPost.id)} 
        />
      )}
      
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard 
                key={post.id} 
                index={index} 
                title={post.Blog_title}
                excerpt={post.title_desc}
                date={post.Date}
                category={post.category}
                imageUrl={post.post_img || "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=2670&auto=format&fit=crop"}
                onReadMore={() => handleReadMore(post.id)}
              />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-xl font-medium text-gray-400">No articles found in this category</h3>
            </motion.div>
          )}
          
          <motion.div 
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <MagneticButton>Load More Articles</MagneticButton>
          </motion.div>
        </div>
      </section>
      <section className="py-16 px-6 bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Stay Updated with Travel Tips
          </motion.h2>
          <motion.p 
            className="text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Subscribe to our newsletter and receive the latest parking deals and travel guides directly to your inbox
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
            />
            <MagneticButton>Subscribe</MagneticButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;