import { useEffect, useState } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/events?populate=Image")
      .then((res) => {
        setEvents(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
      });
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <h1 className="mb-10 text-3xl font-bold text-center text-gray-800">Our Webinars</h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const { id, attributes } = event;
          const { Title, Date: eventDate, Description, Link, Image } = attributes;
          const imageUrl = Image?.data?.attributes?.url;

          return (
            <div key={id} className="flip-card">
              <div className="flip-card-inner">
                {/* Front */}
                <div className="flip-card-front">
                  {imageUrl && (
                    <img
                      src={`http://localhost:1337${imageUrl}`}
                      alt={Title}
                      className="object-cover w-full h-100 rounded-t-2xl"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">{Title || "Untitled Event"}</h2>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back">
                  <div className="p-4">
                    <h2 className="mb-2 text-xl font-bold text-black">{Title}</h2>
                    <div className="mb-2 text-sm text-black">
                      {Array.isArray(Description) && Description.length > 0 ? (
                        Description.map((block, index) => (
                          <p key={index} className="mb-1">
                            {block.children?.map((child, idx) => (
                              <span key={idx}>{child.text}</span>
                            ))}
                          </p>
                        ))
                      ) : (
                        <p className="italic">No description provided.</p>
                      )}
                    </div>
                    <p className="mb-2 text-sm text-black">
                      {eventDate
                        ? new Date(eventDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date not available"}
                    </p>
                    {Link && isValidUrl(Link) ? (
                      <a
                        href={Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Join Event
                      </a>
                    ) : (
                      <p className="text-sm italic text-white">No link available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flip card styles */}
      <style>{`
        .flip-card {
          background: transparent;
          width: 100%;
          height: 380px;
          perspective: 1000px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 110%;
          backface-visibility: hidden;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .flip-card-front {
          background: white;
        }

        .flip-card-back {
          background: white; 
          color: white;
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Events;
