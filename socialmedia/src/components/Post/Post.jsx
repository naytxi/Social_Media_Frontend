import React, { useState } from "react";
import "./Post.scss";
import { useSelector, useDispatch } from "react-redux";
import { addPost as addPostAction } from "../../features/PostSlice";
import * as postService from "../../features/PostService";

const Post = ({ onClose }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !content) {
      setError("El título y contenido son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Debes iniciar sesión");

      const newPost = await postService.createPost({ title, content, image }, token);

      dispatch(addPostAction(newPost));

      onClose();
    } catch (err) {
      setError(err.message || "Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-modal">
      <div className="post-modal__content">
        <h2>Crear un nuevo Zumbido</h2>
        {error && <p className="post-modal__error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="URL de imagen (opcional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Publicando..." : "Publicar"}
          </button>
           <button className="post-modal__close" onClick={onClose}>
          &times;
        </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
