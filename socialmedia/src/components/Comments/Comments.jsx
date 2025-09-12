import React, { useState, useEffect } from "react";
import axios from "axios";
import "./comments.scss";

const Comments = ({ postId, token: tokenProp }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL + "/posts";

  const getToken = () => tokenProp || localStorage.getItem("token");

  const fetchComments = async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);

    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axios.get(`${API_URL}/${postId}/comments`, {
        headers,
      });

      const data = res.data?.comments ?? res.data;
      const sortedComments = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComments(sortedComments);
    } catch (err) {
      console.error("Error al obtener comentarios", err);
      setError(
        err.response?.data?.message ||
          "No se pudieron cargar los comentarios"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 10000);
    return () => clearInterval(interval);
  }, [postId, tokenProp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const token = getToken();
    if (!token) {
      setError("Debes iniciar sesión para comentar");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = res.data?.comment ?? res.data;
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setError(null);
    } catch (err) {
      console.error("Error al crear comentario", err);
      if (err.response?.status === 401) {
        setError("No autorizado. Inicia sesión de nuevo.");
      } else {
        setError("No se pudo enviar el comentario");
      }
    }
  };

  return (
    <div className="comments-wrapper">
      <div className="comments">
        <h4 className="comments__title">Comentarios</h4>

        <form className="comments__form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="comments__input"
          />
          <button type="submit" className="comments__button">
            Enviar
          </button>
        </form>

        {loading && <p>Cargando comentarios...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="comments__list">
          {comments.length === 0 && !loading ? (
            <p className="comments__empty">Sé el primero en comentar</p>
          ) : (
            comments.map((c) => (
              <div key={c._id || c.id} className="comments__item">
                <span className="comments__author">
                  {c.author?.name || c.author?.username || "Usuario"}
                </span>
                <p className="comments__content">{c.content}</p>
                <span className="comments__date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
