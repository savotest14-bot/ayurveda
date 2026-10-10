export const getImageUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  const path = url.startsWith('/') ? url : `/${url}`;
  
  // If it's an uploaded file, resolve with backend base URL if running on a different port
  if (path.startsWith('/uploads')) {
    const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const backendOrigin = apiBase.replace(/\/api\/?$/, '');
    return `${backendOrigin}${path}`;
  }
  
  return path;
};
