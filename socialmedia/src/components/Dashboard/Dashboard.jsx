import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import EditPostModal from "../Edit/EditPostModal";
import DeletePostModal from "../Delete/DeletePostModal";
import Comments from "../Comments/Comments";
import Post from "../Post/Post";
import beeIcon from "../../assets/logo2.png";
import {
  loadAllPosts,
  loadMyPosts,
  toggleLike,
  addPost,
  updatePost,
  deletePost,
} from "../../features/PostSlice";
import axios from "axios";
import "./Dashboard.scss";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: posts, loading, error, showMyPosts } = useSelector(
    (state) => state.posts
  );

  const [users, setUsers] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [showPostModal, setShowPostModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };
  const userId = getUserId();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    dispatch(loadAllPosts());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/users/search?name=`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const handleToggleLike = (postId, alreadyLiked) => {
    dispatch(toggleLike({ postId, alreadyLiked }));
  };

  const handleAddPost = (post) => {
    dispatch(addPost(post));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Header addPostToDashboard={() => setShowPostModal(true)} onSearch={handleSearch} />

      <nav className="dashboard__nav">
        <button
          className="dashboard__nav-link"
          onClick={() => dispatch(loadMyPosts())}
        >
          Tus Zumbidos
        </button>
        <button
          className="dashboard__nav-link"
          onClick={() => dispatch(loadAllPosts())}
        >
          Seguidos
        </button>
      </nav>

      <div className="dashboard__layout">
        <aside className="dashboard__sidebar dashboard__sidebar--users">
          <h3>Usuarios registrados</h3>
          <div className="dashboard__users-container">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div key={u._id || u.id} className="dashboard__user-link">
                  {u.name}
                </div>
              ))
            ) : (
              <p>No hay usuarios que coincidan 🐝</p>
            )}
          </div>
        </aside>

        <main className="dashboard__posts">
          {loading && <p>Cargando posts...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && filteredPosts.length === 0 && (
            <p>
              {showMyPosts
                ? "No tienes zumbidos todavía 🐝"
                : "No hay posts que coincidan con la búsqueda 🐝"}
            </p>
          )}

          {!loading &&
            !error &&
            filteredPosts.map((post) => {
              const alreadyLiked = post.likes?.includes(userId);

              return (
                <div className="dashboard__post" key={post._id}>
                  <div className="dashboard__post-left">
                    {post.author?.name || "@Anónimo"}
                    {post.author?._id === userId && (
                      <div className="dashboard__post-actions">
                        <span
                          className="dashboard__icon edit"
                          onClick={() => setEditingPost(post)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </span>

                        <span
                          className="dashboard__icon delete"
                          onClick={() => setDeletingPost(post)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="dashboard__post-center">
                    <div className="dashboard__post-title">{post.title}</div>
                    <div className="dashboard__post-content">{post.content}</div>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Imagen del post"
                        className="dashboard__post-image"
                      />
                    )}

                    <button
                      className="dashboard__comment-btn"
                      onClick={() =>
                        setOpenComments((prev) => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }))
                      }
                    >
                      {openComments[post._id]
                        ? "Ocultar comentarios"
                        : " Ver Comentarios"}
                    </button>

                    {openComments[post._id] && <Comments postId={post._id} />}
                  </div>

                  <div className="dashboard__post-right">
                    <img
                      src={beeIcon}
                      alt="Like"
                      className={`dashboard__post-follow ${
                        alreadyLiked ? "liked" : ""
                      }`}
                      onClick={() => handleToggleLike(post._id, alreadyLiked)}
                    />
                    <div className="dashboard__post-likes">
                      {post.likes?.length || 0}
                    </div>
                  </div>
                </div>
              );
            })}
        </main>

        <aside className="dashboard__sidebar dashboard__sidebar--ads">
          <h3>Publicidad</h3>
          <div className="dashboard__ads-container">
            <div>🔥 Compra miel 100% natural al mejor precio</div>
            <div>🐝 Únete a nuestra colmena premium</div>
            <div>🍯 Recetas con miel que te sorprenderán</div>
          </div>
        </aside>
      </div>

      {showPostModal && (
        <Post
          onClose={() => setShowPostModal(false)}
          addPostToDashboard={handleAddPost}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={(updatedPost) => {
            dispatch(updatePost(updatedPost));
            setEditingPost(null);
          }}
        />
      )}

      {deletingPost && (
        <DeletePostModal
          post={deletingPost}
          onClose={() => setDeletingPost(null)}
          onDelete={() => {
            dispatch(deletePost(deletingPost._id));
            setDeletingPost(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
