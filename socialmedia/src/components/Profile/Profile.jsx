import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useParams } from "react-router-dom";
import "./Profile.scss";

const Profile = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [groupedPosts, setGroupedPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMonth, setOpenMonth] = useState(null);

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };
  
  const userId = getUserId();
  const isOwnProfile = !id || id === userId; 

  useEffect(() => {
    loadProfile();
  }, [id]); 

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró token en localStorage");

      const endpointUser = id
        ? `http://localhost:5000/api/users/${id}`
        : `http://localhost:5000/api/users/me`;

      const resUser = await fetch(endpointUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resUser.ok) throw new Error("Error al obtener el perfil");

      const dataUser = await resUser.json();
      setUser(dataUser.user);

      // 2️⃣ Cargar posts del usuario
      let posts = [];
      if (isOwnProfile) {
        posts = dataUser.user?.posts || [];
      } else {
        
     const resPosts = await fetch(
         `http://localhost:5000/api/users/${id}/posts`,
             { headers: { Authorization: `Bearer ${token}` } }
              );

        if (!resPosts.ok) throw new Error("Error al cargar los zumbidos del usuario");

        const dataPosts = await resPosts.json();
        posts = dataPosts.posts || [];
      }

      const grouped = posts.reduce((acc, post) => {
        const date = new Date(post.createdAt);
        const key = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(post);
        return acc;
      }, {});

      setGroupedPosts(grouped);

    } catch (err) {
      setError(err.message);
      setGroupedPosts({});
    } finally {
      setLoading(false);
    }
  };

  const toggleMonth = (month) => {
    setOpenMonth(openMonth === month ? null : month);
  };

  return (
    <div className="profile">
      <Header />

      <div className="profile__content">
        {loading && <p>Cargando perfil...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && user && (
          <>
            <div className="profile__info">
              <h2>{user.name}</h2>
              {isOwnProfile && <p>Email: {user.email}</p>}
              <p>Seguidores: {user.followersCount}</p>
              {user.followerNames?.length > 0 && (
                <p>
                  <strong>🐝</strong> {user.followerNames.join(", ")}
                </p>
              )}
            </div>

            <div className="profile__posts">
              {Object.keys(groupedPosts).length === 0 && (
                <p>
                  {isOwnProfile
                    ? "No tienes zumbidos todavía 🐝"
                    : "Esta abejita no tiene zumbidos todavía 🐝"}
                </p>
              )}

              {Object.entries(groupedPosts).map(([month, posts]) => (
                <div key={month} className="profile__month">
                  <button
                    className="profile__month-toggle"
                    onClick={() => toggleMonth(month)}
                  >
                    {month} {openMonth === month ? "▲" : "▼"}
                  </button>

                  {openMonth === month && (
                    <div className="profile__posts-list">
                      {posts.map((post) => (
                        <div className="profile__post" key={post._id}>
                          <div className="profile__post-title">{post.title}</div>
                          <div className="profile__post-content">{post.content}</div>
                          {post.image && (
                            <img
                              src={post.image}
                              alt="Imagen del post"
                              className="profile__post-image"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
