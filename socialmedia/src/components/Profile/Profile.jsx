import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useParams } from "react-router-dom";
import { fetchUserPosts } from "../../features/PostSlice"; 
import { getFullImageUrl } from "../../features/getFullImageUrl";
import "./Profile.scss";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list: posts, loading, error } = useSelector((state) => state.posts);

  const [user, setUser] = useState(null);
  const [groupedPosts, setGroupedPosts] = useState({});
  const [openMonth, setOpenMonth] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    if (posts.length > 0) {
      const grouped = posts.reduce((acc, post) => {
        const date = new Date(post.createdAt);
        const key = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(post);
        return acc;
      }, {});
      setGroupedPosts(grouped);
    } else {
      setGroupedPosts({});
    }
  }, [posts]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró token en localStorage");

      const endpointUser = id ? `${API_URL}/users/${id}` : `${API_URL}/users/me`;
      const resUser = await fetch(endpointUser, { headers: { Authorization: `Bearer ${token}` } });
      if (!resUser.ok) throw new Error("Error al obtener el perfil");
      const dataUser = await resUser.json();
      setUser(dataUser.user);

      dispatch(fetchUserPosts(id || "me"));
    } catch (err) {
      console.error(err);
      setUser(null);
      setGroupedPosts({});
    }
  };

  const toggleMonth = (month) => {
    setOpenMonth(openMonth === month ? null : month);
  };

  const profileUrl = getFullImageUrl(user?.profilePic);

  return (
    <div className="profile">
      <Header />

      <div className="profile__content">
        {loading && <p>Cargando perfil...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && user && (
          <>
            <div className="profile__info">
              {profileUrl && (
                <img
                  src={profileUrl}
                  alt="Foto de perfil"
                  className="profile__profile-pic"
                />
              )}
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
                      {posts.map((post) => {
                        const postImageUrl = getFullImageUrl(post.image);
                        return (
                          <div className="profile__post" key={post._id}>
                            <div className="profile__post-title">{post.title}</div>
                            <div className="profile__post-content">{post.content}</div>
                            {postImageUrl && (
                              <img
                                src={postImageUrl}
                                alt="Imagen del post"
                                className="profile__post-image"
                              />
                            )}
                          </div>
                        );
                      })}
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
