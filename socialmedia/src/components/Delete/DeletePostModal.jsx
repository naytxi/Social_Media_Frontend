import React from "react";
import "./DeletePostModal.scss";

const DeletePostModal = ({ post, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Error al eliminar el zumbido");
      await res.json();
      onDelete();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="delete-post-modal">
      <div className="delete-post-modal__content">
        <h3>¿Seguro que quieres eliminar este zumbido?</h3>
        <div className="delete-post-modal__actions">
          <button className="cancel" onClick={onClose}>Cancelar</button>
          <button onClick={handleDelete}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
