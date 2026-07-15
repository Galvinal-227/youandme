// src/components/News.jsx
import React, { useState } from 'react';
import useNews from '../hooks/useNews';

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    articles,
    loading,
    error,
    category,
    sources,
    selectedSource,
    setCategory,
    setSelectedSource,
    searchNews,
    refreshNews
  } = useNews();

  const categories = [
    'general', 'business', 'entertainment', 'health', 
    'science', 'sports', 'technology'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchNews(searchQuery);
    }
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSearchQuery('');
  };

  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-white mb-2">Error loading news</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => refreshNews()}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                refreshNews();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat && !selectedSource
                ? 'bg-pink-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Sources Dropdown */}
      {sources.length > 0 && (
        <div className="max-w-xs mx-auto mb-6">
          <select
            value={selectedSource}
            onChange={handleSourceChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
          >
            <option value="" className="text-black">All Sources</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id} className="text-black">
                {source.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-all hover:transform hover:scale-[1.02] border border-white/10"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title || 'News image'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect width="400" height="200" fill="%23333"/%3E%3Ctext x="200" y="100" text-anchor="middle" fill="%23666" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {article.title || 'No title'}
                </h2>
                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                  {article.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.source?.name || 'Unknown source'}</span>
                  <span>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : 'Unknown date'}
                  </span>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-pink-400 hover:text-pink-300 text-sm font-medium"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No news articles found.</p>
            <button 
              onClick={() => refreshNews()}
              className="mt-4 text-pink-400 hover:text-pink-300"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      {articles.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {articles.length} articles
        </div>
      )}
    </div>
  );
};

export default News;
