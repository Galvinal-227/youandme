// src/hooks/useNews.js
import { useState, useEffect, useCallback } from 'react';
import { getTopHeadlines, searchNews, getSources } from '../services/newsService';

export const useNews = (initialCategory = 'general') => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');

  // Fetch top headlines
  const fetchHeadlines = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const requestParams = {
        ...params
      };
      
      // Only add category if not 'general'
      if (category && category !== 'general') {
        requestParams.category = category;
      }
      
      console.log('Fetching headlines with params:', requestParams);
      const response = await getTopHeadlines(requestParams);
      
      if (response.status === 'ok') {
        setArticles(response.articles || []);
        if (response.articles?.length === 0) {
          setError('No articles found for this category');
        }
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(err.message || 'An error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Search news
  const searchNewsArticles = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      fetchHeadlines();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchNews(query);
      if (response.status === 'ok') {
        setArticles(response.articles || []);
        if (response.articles?.length === 0) {
          setError('No articles found for your search');
        }
      } else {
        setError('Failed to search news');
      }
    } catch (err) {
      console.error('Search error details:', err);
      setError(err.message || 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  }, [fetchHeadlines]);

  // Fetch sources
  const fetchSources = useCallback(async () => {
    try {
      const response = await getSources();
      if (response.status === 'ok') {
        setSources(response.sources || []);
      }
    } catch (err) {
      console.error('Error fetching sources:', err);
    }
  }, []);

  // Change category
  const changeCategory = useCallback((newCategory) => {
    setCategory(newCategory);
    setSelectedSource('');
    setError(null);
  }, []);

  // Change source
  const changeSource = useCallback((sourceId) => {
    setSelectedSource(sourceId);
    setError(null);
    if (sourceId) {
      fetchHeadlines({ sources: sourceId });
    } else {
      fetchHeadlines();
    }
  }, [fetchHeadlines]);

  // Initial fetch
  useEffect(() => {
    fetchHeadlines();
    fetchSources();
  }, [fetchHeadlines, fetchSources]);

  // Refetch when category changes
  useEffect(() => {
    if (!selectedSource) {
      fetchHeadlines();
    }
  }, [category, fetchHeadlines, selectedSource]);

  return {
    articles,
    loading,
    error,
    category,
    sources,
    selectedSource,
    setCategory: changeCategory,
    setSelectedSource: changeSource,
    searchNews: searchNewsArticles,
    refreshNews: fetchHeadlines
  };
};

export default useNews;
