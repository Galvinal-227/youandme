import NewsAPI from 'newsapi';

const API_KEY = '74947dbb774b4c44a9a4d2e4f1e6379b';
const newsapi = new NewsAPI(API_KEY);

// Get top headlines
export const getTopHeadlines = async (params = {}) => {
  try {
    const defaultParams = {
      country: 'us',
      category: 'business',
      language: 'en',
      pageSize: 20,
      ...params
    };
    
    const response = await newsapi.v2.topHeadlines(defaultParams);
    return response;
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};

// Search news
export const searchNews = async (query, params = {}) => {
  try {
    const defaultParams = {
      q: query,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 20,
      ...params
    };
    
    const response = await newsapi.v2.everything(defaultParams);
    return response;
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
    
    const response = await newsapi.v2.sources(defaultParams);
    return response;
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
