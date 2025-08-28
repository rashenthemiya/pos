const mode = import.meta.env.MODE;  // "development" or "production"

export const API_URL = 
  mode === "development" 
    ? import.meta.env.VITE_DEV_API_URL 
    : import.meta.env.VITE_PROD_API_URL;
