// src/services/newsService.js
const API_KEY = '74947dbb774b4c44a9a4d2e4f1e6379b';
const BASE_URL = 'https://newsapi.org/v2';

// Helper function untuk handle response
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'API returned an error');
  }
  return data;
};

// Get top headlines
export const getTopHeadlines = async (params = {}) => {
  try {
    const defaultParams = {
      country: 'us',
      category: 'general',
      language: 'en',
      pageSize: 20,
      ...params
    };
    
    // Remove undefined values
    Object.keys(defaultParams).forEach(key => {
      if (defaultParams[key] === undefined || defaultParams[key] === null) {
        delete defaultParams[key];
      }
    });
    
    const queryParams = new URLSearchParams({
      apiKey: API_KEY,
      ...defaultParams
    });
    
    const url = `${BASE_URL}/top-headlines?${queryParams}`;
    console.log('Fetching URL:', url); // Untuk debugging
    
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};

// Search news
export const searchNews = async (query, params = {}) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }
    
    const defaultParams = {
      q: query,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 20,
      ...params
    };
    
    // Remove undefined values
    Object.keys(defaultParams).forEach(key => {
      if (defaultParams[key] === undefined || defaultParams[key] === null) {
        delete defaultParams[key];
      }
    });
    
    const queryParams = new URLSearchParams({
      apiKey: API_KEY,
      ...defaultParams
    });
    
    const url = `${BASE_URL}/everything?${queryParams}`;
    console.log('Searching URL:', url); // Untuk debugging
    
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

// Get news sources
export const getSources = async (params = {}) => {
  try {
    const defaultParams = {
      language: 'en',
      country: 'us',
      ...params
    };
    
    // Remove undefined values
    Object.keys(defaultParams).forEach(key => {
      if (defaultParams[key] === undefined || defaultParams[key] === null) {
        delete defaultParams[key];
      }
    });
    
    const queryParams = new URLSearchParams({
      apiKey: API_KEY,
      ...defaultParams
    });
    
    const url = `${BASE_URL}/sources?${queryParams}`;
    console.log('Fetching sources URL:', url); // Untuk debugging
    
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
};

// Get news by category
export const getNewsByCategory = async (category) => {
  return getTopHeadlines({ category });
};

// Get news by source
export const getNewsBySource = async (sourceId) => {
  return getTopHeadlines({ sources: sourceId });
};

export default {
  getTopHeadlines,
  searchNews,
  getSources,
  getNewsByCategory,
  getNewsBySource
};
