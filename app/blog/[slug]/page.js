'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Image } from '@heroui/react';

const BlogPostPage = ({ post }) => {
  const contentRef = useRef(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample post data - in a real app this would come from props or API
  const fullPost = {
    ...post,
    content: [
      {
        type: 'paragraph',
        text: 'Airport parking can be one of the most stressful parts of travel, especially during peak seasons when lots fill up quickly and prices skyrocket. But with the right strategies, you can navigate this challenge like a pro.'
      },
      {
        type: 'heading',
        text: '1. Book Early, Save More'
      },
      {
        type: 'paragraph',
        text: 'The golden rule of airport parking is simple: the earlier you book, the more you save. Most airport parking providers offer significant discounts for advanced bookings—sometimes up to 60% off drive-up rates.'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=2574&auto=format&fit=crop',
        caption: 'Early booking discounts can save you significant money'
      },
      {
        type: 'heading',
        text: '2. Consider Off-Site Lots'
      },
      {
        type: 'paragraph',
        text: 'While official airport parking is convenient, off-site lots often provide better rates and comparable security. Many off-site operators offer free shuttle services that run 24/7, with travel times under 10 minutes to terminals.'
      },
      {
        type: 'paragraph',
        text: 'Look for lots with:'
      },
      {
        type: 'list',
        items: [
          'Covered parking options',
          '24/7 security surveillance',
          'Frequent shuttle service',
          'Online reviews with 4+ stars'
        ]
      },
      {
        type: 'heading',
        text: '3. Leverage Loyalty Programs'
      },
      {
        type: 'paragraph',
        text: 'Many parking providers have loyalty programs that offer points for every booking. These points can be redeemed for free parking days or upgrades. Some credit cards also offer airport parking discounts as part of their travel benefits.'
      },
      {
        type: 'quote',
        text: 'By joining just two loyalty programs, I saved over $200 on airport parking last year alone.',
        author: 'Sarah K., frequent traveler'
      },
      {
        type: 'heading',
        text: '4. The Midweek Advantage'
      },
      {
        type: 'paragraph',
        text: 'If your travel dates are flexible, consider flying midweek. Parking demand (and prices) are typically lower Tuesday through Thursday. Some lots offer special midweek discounts that aren\'t available on weekends.'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=2670&auto=format&fit=crop',
        caption: 'Midweek travel often means lower parking rates'
      },
      {
        type: 'heading',
        text: '5. Package Deals'
      },
      {
        type: 'paragraph',
        text: 'Some travel sites offer flight + parking bundles that can save you 15-30% compared to booking separately. Always check these options before finalizing your travel plans.'
      },
      {
        type: 'paragraph',
        text: 'Remember that the cheapest option isn\'t always the best value. Factor in shuttle frequency, security, and distance from the airport when making your decision.'
      }
    ],
    author: {
      name: 'John Parker',
      title: 'Travel Expert',
      bio: 'With over 10 years of experience in the travel industry, John has helped thousands of travelers optimize their journeys. He specializes in airport logistics and cost-saving strategies.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    readTime: '8 min read',
    shares: 142,
    comments: 28
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <motion.p 
            key={index}
            className="text-gray-300 mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {block.text}
          </motion.p>
        );
      case 'heading':
        return (
          <motion.h3 
            key={index}
            className="text-2xl font-bold text-white mt-12 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {block.text}
          </motion.h3>
        );
      case 'image':
        return (
          <motion.figure 
            key={index}
            className="my-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <div className="relative rounded-xl overflow-hidden border border-gray-800">
              <Image
                src={block.url}
                alt={block.caption}
                className="w-full h-auto"
                radius="none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />
            </div>
            {block.caption && (
              <figcaption className="text-sm text-gray-500 mt-2 text-center">
                {block.caption}
              </figcaption>
            )}
          </motion.figure>
        );
      case 'list':
        return (
          <motion.ul 
            key={index}
            className="list-disc pl-6 text-gray-300 mb-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </motion.ul>
        );
      case 'quote':
        return (
          <motion.blockquote 
            key={index}
            className="border-l-4 border-indigo-500 pl-6 my-8 italic text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <p className="text-xl mb-2">"{block.text}"</p>
            {block.author && <footer className="text-indigo-400">— {block.author}</footer>}
          </motion.blockquote>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: backgroundOpacity }}
        >
          <Image
            src={fullPost.imageUrl}
            alt={fullPost.title}
            className="w-full h-full object-cover"
            radius="none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/30 to-gray-900/90" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 px-6 pb-16 max-w-7xl mx-auto"
          style={{ y: contentY }}
        >
          <div className="flex justify-between items-start">
            <div>
              <motion.span 
                className="inline-block px-3 py-1 bg-indigo-600/90 text-white text-sm font-semibold rounded-full mb-4 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {fullPost.category}
              </motion.span>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {fullPost.title}
              </motion.h1>
              <motion.div 
                className="flex items-center text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span>{fullPost.date}</span>
                <span className="mx-2">•</span>
                <span>{fullPost.readTime}</span>
              </motion.div>
            </div>
            
            <motion.button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-3 rounded-full bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={isBookmarked ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`w-6 h-6 ${isBookmarked ? 'text-indigo-500' : 'text-gray-400'}`}
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </motion.button>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="animate-bounce flex flex-col items-center">
                <span className="text-sm text-gray-400 mb-1">Scroll</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-6 h-6 text-gray-400"
                >
                  <polyline points="7 13 12 18 17 13"></polyline>
                  <polyline points="7 6 12 11 17 6"></polyline>
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Content Section */}
      <div ref={contentRef} className="relative z-10">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Article Content */}
          <article className="prose prose-invert max-w-none">
            {fullPost.content.map((block, index) => renderContentBlock(block, index))}
          </article>
          
          {/* Tags */}
          <motion.div 
            className="flex flex-wrap gap-3 mt-16 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">#airport</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">#parking</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">#travelhacks</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">#savemoney</span>
          </motion.div>
          
          {/* Social Sharing */}
          <motion.div 
            className="flex items-center justify-between border-t border-b border-gray-800 py-6 my-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 mr-3 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
              <span className="text-gray-400 text-sm">{fullPost.comments} comments</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400 hover:text-indigo-500">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400 hover:text-blue-500">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400 hover:text-blue-400">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </button>
              <span className="text-gray-400 text-sm">{fullPost.shares} shares</span>
            </div>
          </motion.div>
          
          {/* Author Bio */}
          <motion.div 
            className="bg-gray-800/50 rounded-2xl p-8 my-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-6">
                <Image
                  src={fullPost.author.avatar}
                  alt={fullPost.author.name}
                  className="w-full h-full object-cover"
                  radius="none"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">{fullPost.author.name}</h4>
                <p className="text-indigo-400 text-sm mb-3">{fullPost.author.title}</p>
                <p className="text-gray-400">{fullPost.author.bio}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Related Articles */}
          <motion.div 
            className="my-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <motion.div 
                  key={item}
                  className="group relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2670&auto=format&fit=crop"
                      alt="Related post"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      radius="none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-xs text-gray-400 mb-2">
                      <span>May 12, 2023</span>
                      <span className="mx-2">•</span>
                      <span>5 min read</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Off-Site vs On-Site Airport Parking: Pros and Cons</h4>
                    <p className="text-gray-400 text-sm mb-4">A detailed comparison to help you decide which parking option suits your needs best.</p>
                    <button className="text-indigo-500 text-sm font-medium hover:text-indigo-400 transition-colors">
                      Read Article →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Comments Section */}
          <motion.div 
            className="my-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Comments ({fullPost.comments})</h3>
            
            <div className="space-y-6">
              {[1, 2].map((comment) => (
                <motion.div 
                  key={comment}
                  className="bg-gray-800/50 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: comment * 0.1 }}
                >
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
                      <span className="text-white font-bold">U</span>
                    </div>
                    <div>
                      <h5 className="text-white font-medium">User{comment}</h5>
                      <p className="text-gray-500 text-xs">2 days ago</p>
                    </div>
                  </div>
                  <p className="text-gray-300 pl-14">
                    This is a sample comment about how helpful this article was. The tips about midweek parking were especially useful for my upcoming trip!
                  </p>
                </motion.div>
              ))}
            </div>
            
            <motion.form 
              className="mt-8 bg-gray-800/50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-white font-medium mb-4">Leave a comment</h4>
              <textarea 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                rows="4"
                placeholder="Share your thoughts..."
              ></textarea>
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Post Comment
                </button>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </div>
      
      {/* Newsletter CTA */}
      <motion.section 
        className="py-16 px-6 bg-gradient-to-br from-gray-900 to-gray-800"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get More Travel Insights</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive the latest airport parking deals, travel hacks, and destination guides directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
            />
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default BlogPostPage;