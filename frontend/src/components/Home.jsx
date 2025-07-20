import { useState, useEffect, useRef } from "react";
import { fetchArticles, fetchMagazines } from "./api"; 
import axios from "axios";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const images = [
  { url: "slide1.png" },
  { url: "slide2.png" },
  { url: "manzil3.png" },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [articles, setArticles] = useState([]);
  const articlesRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [, setCurrentPage] = useState(0);

  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedPublishedDate, setSelectedPublishedDate] = useState('');

  const flipBookRef = useRef();
  const flipSound = useRef(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchArticles();
      setArticles(data);
    };
    loadArticles();
  }, []);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (articlesRef.current) {
        articlesRef.current.scrollTop += 1;
        if (
          articlesRef.current.scrollTop >=
          articlesRef.current.scrollHeight - articlesRef.current.clientHeight
        ) {
          articlesRef.current.scrollTop = 0;
        }
      }
    }, 50);
    return () => clearInterval(scrollInterval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(`${process.env.VITE_API_URL}/api/categories`);
        setCategories(categoryRes.data.data);

        const magazineData = await fetchMagazines();
        magazineData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setMagazines(magazineData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
    
    flipSound.current = new Audio('/sound.mp3');
  }, []);

  const handlePdfSelect = (mag) => {
    setPdfUrl(mag.pdf);
    setSelectedTitle(mag.title);
    setSelectedCategoryName(mag.category);
    setSelectedPublishedDate(mag.publishedAt);
    setCurrentPage(0);
  };

  const closeViewer = () => {
    setPdfUrl(null);
    setCurrentPage(0);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const filteredMagazines = selectedCategory
    ? magazines.filter((mag) => mag.category === selectedCategory)
    : magazines;

  const renderPage = (pageNumber) => (
    <Page
      key={pageNumber}
      pageNumber={pageNumber}
      width={600}
      renderAnnotationLayer={false}
      renderTextLayer={false}
    />
  );

  const onFlip = (e) => {
    setCurrentPage(e.data);
    if (flipSound.current) {
      flipSound.current.currentTime = 0;
      flipSound.current.play();
    }
  };

  const goToPreviousPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const handleReadMore = (article) => {
    setSelectedTitle(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col p-8 space-y-8">
      <div className="flex flex-col w-full space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        {/* Webinar Section */}
        <div className="flex flex-col items-center w-full lg:w-1/4">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Upcoming Webinar</h2>
          <Events />
        </div>

        {/* Slider Section */}
        <section className="relative w-full lg:w-1/2 h-[400px] overflow-hidden rounded-md shadow-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div className="flex-shrink-0 w-full h-[400px]" key={index}>
                <img
                  src={image.url}
                  alt={`Slide ${index}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Articles Section */}
        <aside className="flex flex-col items-center w-full lg:w-1/4">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Top Articles</h2>
          <div
            className="w-full p-8 bg-white border border-gray-200 max-h-[400px] overflow-y-scroll scrollbar-hide"
            ref={articlesRef}
          >
            <ul className="space-y-2 text-left">
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <li
                    key={index}
                    className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                  >
                    {article.title}
                  </li>
                ))
              ) : (
                <li className="text-lg italic text-gray-500">No articles available</li>
              )}
            </ul>
          </div>
        </aside>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border rounded-md ${
            !selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.attributes.name)}
            className={`px-4 py-2 border rounded-md ${
              selectedCategory === category.attributes.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.attributes.name}
          </button>
        ))}
      </div>

      {/* Magazine Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMagazines.slice(0, 6).map((mag) => (
          <div
            key={mag.id}
            onClick={() => handlePdfSelect(mag)}
            className="block p-4 transition-transform transform bg-white border rounded-lg shadow-md cursor-pointer hover:scale-105"
          >
            <img
              src={`${process.env.VITE_MEDIA_URL}${mag.cover}`}
              alt={mag.title}
              className="object-cover w-full mb-4 rounded-md h-60"
            />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">{mag.title}</h3>
            {mag.publishedAt && (
              <p className="mb-1 text-sm text-gray-500">
                Published: {new Date(mag.publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Additional Articles Grid Section */}
      {articles.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 text-4xl font-bold text-left text-black-900">Our Latest Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {articles.slice(0, 8).map((article, index) => (
              <div
                key={index}
                className="overflow-hidden transition transform bg-white shadow-lg rounded-2xl hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={article.image || "https://via.placeholder.com/600x400"}
                  alt={article.title}
                  className="object-cover w-full h-48 rounded-t-2xl"
                />
                <div className="p-6">
                  <div className="flex justify-between mb-2 text-xs text-gray-400">
                    <span>{article.author || ""}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-left text-gray-900">{article.title}</h3>
                  <p className="mb-4 text-sm text-justify text-gray-700">{article.description}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleReadMore(article)}
                      className="px-5 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF FlipBook Modal */}
      {pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white p-8 rounded-xl max-w-[100%] max-h-[100%] overflow-auto">
            <button
              onClick={closeViewer}
              className="absolute text-2xl font-bold text-red-600 top-2 right-2 hover:text-red-700"
            >
              &times;
            </button>
            <div className="mb-1 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedTitle}</h2>
              <div className="mt-1 text-sm text-gray-500">
                {selectedCategoryName && <span>{selectedCategoryName}</span>}
                {selectedPublishedDate && (
                  <span> • {new Date(selectedPublishedDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <button
                onClick={goToPreviousPage}
                className="absolute left-0 z-10 p-2 text-3xl text-blue-600 transform -translate-y-1/2 top-1/2 hover:text-blue-800"
              >
                &#8592;
              </button>

              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {numPages && (
                  <HTMLFlipBook
                    ref={flipBookRef}
                    width={1400}
                    height={900}
                    showCover={true}
                    className="mx-auto shadow-xl"
                    mobileScrollSupport={true}
                    flipDirection="horizontal"
                    minWidth={900}
                    maxWidth={1600}
                    onFlip={onFlip}
                    style={{ padding: '0 10px' }}
                  >
                    {Array.from({ length: Math.ceil(numPages / 2) }, (_, i) => {
                      const leftPage = i * 2 + 1;
                      const rightPage = i * 2 + 2;
                      return (
                        <div key={i} className="p-4">
                          <div className="flex">
                            <div className="w-1/2">
                              {leftPage <= numPages && renderPage(leftPage)}
                            </div>
                            <div className="w-1/2">
                              {rightPage <= numPages && renderPage(rightPage)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </HTMLFlipBook>
                )}
              </Document>

              <button
                onClick={goToNextPage}
                className="absolute right-0 z-10 p-2 text-3xl text-blue-600 transform -translate-y-1/2 top-1/2 hover:text-blue-800"
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hide scrollbar style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const Events = () => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.VITE_API_URL}/api/events?populate=Image&sort=createdAt:desc&pagination[limit]=1`)
      .then((res) => {
        setEvent(res.data.data[0]);
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

  if (!event) {
    return <div>Loading...</div>;
  }

  const { attributes } = event;
  const { Title, Date: eventDate, Description, Link, Image } = attributes;
  const imageUrl = Image?.data?.attributes?.url;

  return (
    <div className="w-full max-w-xs flip-card">
      <div className="flip-card-inner">
        {/* Front */}
        <div className="overflow-hidden bg-white shadow-lg flip-card-front rounded-xl">
          {imageUrl && (
            <img
              src={`${process.env.VITE_MEDIA_URL}${imageUrl}`}
              alt={Title}
              className="object-cover w-full h-48"
            />
          )}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{Title || "Untitled Event"}</h2>
          </div>
        </div>

        {/* Back */}
        <div className="p-4 overflow-hidden bg-white shadow-lg flip-card-back rounded-xl">
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
            <p className="text-sm italic text-gray-500">No link available</p>
          )}
        </div>
      </div>

      {/* Flip Card CSS */}
      <style>{`
        .flip-card {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 380px;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Home;
