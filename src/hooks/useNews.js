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
      const response = await getTopHeadlines({
        category: category !== 'general' ? category : undefined,
        ...params
      });
      
      if (response.status === 'ok') {
        setArticles(response.articles || []);
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Search news
  const searchNewsArticles = useCallback(async (query) => {
    if (!query.trim()) {
      fetchHeadlines();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchNews(query);
      if (response.status === 'ok') {
        setArticles(response.articles || []);
      } else {
        setError('Failed to search news');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
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
  }, []);

  // Change source
  const changeSource = useCallback((sourceId) => {
    setSelectedSource(sourceId);
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
