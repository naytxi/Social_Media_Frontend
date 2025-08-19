import React, { useState } from "react";
import "./EditPostModal.scss";

const EditPostModal = ({ post, onClose, onSave }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
      });
      if (!res.ok) throw new Error("Error al actualizar el zumbido");
      const data = await res.json();
      onSave(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="edit-post-modal">
      <div className="edit-post-modal__content">
        <h2>Editar Zumbido</h2>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        <div className="edit-post-modal__actions">
          <button  className="cancel" onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
