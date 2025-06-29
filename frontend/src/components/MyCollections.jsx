import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyCollections = () => {
  const [bookmarkedMagazines, setBookmarkedMagazines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    fetchBookmarkedMagazines(userData);
  }, [navigate]);

  const fetchBookmarkedMagazines = async (userData) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_STRAPI_URL}/api/bookmarks?filters[users_permissions_user][id][$eq]=${userData.id}&populate=magazine.cover`,
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      const text = await res.text();
      if (text.includes("<!doctype html>")) {
        console.error("Received HTML response. It might be an error page or redirect.");
        return;
      }

      const data = JSON.parse(text);
      const magazines = data.data.map((entry) => {
        const mag = entry.attributes.magazine.data;
        return {
          id: mag.id,
          title: mag.attributes.title,
          cover: mag.attributes.cover?.url?.startsWith("http")
            ? mag.attributes.cover.url
            : `${import.meta.env.VITE_STRAPI_URL}${mag.attributes.cover.url}`,
        };
      });

      setBookmarkedMagazines(magazines);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-center text-blue-700">My Collections</h1>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading your collections...</p>
      ) : bookmarkedMagazines.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {bookmarkedMagazines.map((mag) => (
            <div
              key={mag.id}
              className="overflow-hidden transition border shadow-xl cursor-pointer rounded-2xl hover:shadow-2xl"
              onClick={() => navigate(`/magazine/${mag.id}`)}
            >
              <div className="flex items-center justify-center w-full h-[320px] overflow-hidden">
                <img
                  src={mag.cover}
                  alt={mag.title}
                  className="w-[280px] h-[350px] object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white">
                <h2 className="text-lg font-semibold text-gray-800">{mag.title}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No bookmarked magazines yet.</p>
      )}
    </div>
  );
};

export default MyCollections;
