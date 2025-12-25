import { useState, useEffect } from 'react';
import { blogApi } from '../lib/api';
import { BookOpen, Calendar, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  publishedAt: string;
  sourceUrl?: string;
  sourceName?: string;
  isExternal?: boolean;
  excerpt?: string;
}

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await blogApi.getAll();
      console.log('Blog API response:', response); // Debug log
      
      // Handle different response formats
      const postsData = response.data || response || [];
      setPosts(postsData);
    } catch (error: any) {
      console.error('Error loading blog posts:', error);
      // Show user-friendly error message
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        console.log('User may need to log in to view blog posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading blog posts...</div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 px-4 py-2 text-green-600 hover:text-green-700 font-semibold"
          >
            ← Back to Blog
          </button>

          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-96 object-cover"
              />
            )}

            <div className="p-8 md:p-12">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {selectedPost.title}
              </h1>

              <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(selectedPost.publishedAt)}</span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <div 
                  className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: '1.8',
                    fontSize: '1.125rem'
                  }}
                >
                  {selectedPost.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() ? (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ) : null
                  ))}
                </div>
                
                {selectedPost.isExternal && selectedPost.sourceUrl && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={selectedPost.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      <span>Read full article on {selectedPost.sourceName || 'source'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Environmental Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stories, insights, and updates about Bangladesh's environment
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-300">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150)}
                    {!post.excerpt && post.content.length > 150 && '...'}
                  </p>
                  
                  {post.isExternal && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        External Source
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>

                  <button className="mt-4 text-green-600 hover:text-green-700 font-semibold">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
