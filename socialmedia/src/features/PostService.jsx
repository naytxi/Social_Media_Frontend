import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/posts";

const getToken = () => localStorage.getItem("token");

export const fetchAllPosts = async () => {
  const res = await axios.get(API_URL, { headers: { "Content-Type": "application/json" } });
  return res.data.posts;
};

export const fetchMyPosts = async () => {
  const res = await axios.get(`${API_URL}/mine`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data.posts;
};

export const likePost = async (postId) => {
  const res = await axios.post(`${API_URL}/${postId}/like`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data.post;
};

export const unlikePost = async (postId) => {
  const res = await axios.post(`${API_URL}/${postId}/unlike`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data.post;
};

export const createPost = async ({ title, content, image }) => {
  const res = await axios.post(
    API_URL,
    { title, content, image },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );

  return res.data.post;
};

export const fetchUserPosts = async (userId) => {
  const t = getToken();
  const url =
    userId === "me"
      ? `${API_URL}/mine`
      : `${import.meta.env.VITE_API_URL}/users/${userId}/posts`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${t}` },
  });

  return res.data.posts;
};
