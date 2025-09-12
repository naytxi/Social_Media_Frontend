export const getFullImageUrl = (path) => {
  if (!path) return null; 
  if (path.startsWith("http") || path.startsWith("https")) return path; 
  return `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}${path}`; 
};
