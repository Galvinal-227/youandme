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
    searchNews(searchQuery);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading news</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={refreshNews}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">News Feed</h1>
          <p className="mt-2 text-gray-600">Stay updated with the latest news</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Sources</option>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
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
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title || 'No title'}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
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
                    className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No news articles found.</p>
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
    </div>
  );
};

export default News;
