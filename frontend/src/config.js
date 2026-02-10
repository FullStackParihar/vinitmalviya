// const API_BASE_URL = import.meta.env.PROD 
//   ? 'https://vinitmalviya.onrender.com' 
//   : 'http://localhost:8000';

const API_BASE_URL = 'https://vinitmalviya.onrender.com';
export default API_BASE_URL;

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};
