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
        const categoryRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
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
              src={`${import.meta.env.VITE_MEDIA_URL}${mag.cover}`}
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
              <article
                key={index}
                className="relative p-4 overflow-hidden transition duration-300 border rounded-md shadow-lg cursor-pointer group hover:scale-105"
                onClick={() => handleReadMore(article)}
              >
                <h3 className="text-xl font-semibold">{article.title}</h3>
                <p className="line-clamp-4">{article.body}</p>
                <button
                  className="absolute px-3 py-1 font-semibold text-white transition rounded bottom-3 right-3 bg-primary-900 hover:bg-primary-800"
                  onClick={() => handleReadMore(article)}
                >
                  Read more
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {pdfUrl && (
        <>
          <button
            onClick={closeViewer}
            className="fixed top-0 left-0 z-50 p-4 text-white bg-black bg-opacity-75"
          >
            Close
          </button>
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-90">
            <div className="relative w-full max-w-[900px] max-h-[600px]">
              <h2 className="mb-4 text-2xl font-bold text-white">{selectedTitle}</h2>
              <p className="mb-2 text-white">Category: {selectedCategoryName}</p>
              <p className="mb-4 text-white">Published: {new Date(selectedPublishedDate).toLocaleDateString()}</p>
              <HTMLFlipBook
                width={600}
                height={800}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1536}
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                onFlip={onFlip}
                ref={flipBookRef}
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <div key={index} className="h-full bg-white">
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={<div>Loading PDF...</div>}
                    >
                      {renderPage(index + 1)}
                    </Document>
                  </div>
                ))}
              </HTMLFlipBook>
              <div className="flex justify-center gap-8 mt-4">
                <button
                  onClick={goToPreviousPage}
                  className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Prev
                </button>
                <button
                  onClick={goToNextPage}
                  className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function Events() {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/events?populate=Image&sort=createdAt:desc&pagination[limit]=1`)
      .then((res) => {
        setEvent(res.data.data[0]);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
      });
  }, []);

  if (!event) return null;

  const { Title, Description, Date, Image } = event.attributes;
  const imageUrl = Image?.data?.attributes?.url || "";

  return (
    <div className="relative w-full max-w-sm p-4 bg-white border rounded-lg shadow-md">
      <div className="overflow-hidden rounded-md">
        <img
          src={`${import.meta.env.VITE_MEDIA_URL}${imageUrl}`}
          alt={Title}
          className="object-cover w-full h-48"
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold">{Title}</h3>
      <p className="mt-2 text-gray-600">{Description}</p>
      <p className="mt-2 font-semibold text-gray-800">Date: {new Date(Date).toLocaleDateString()}</p>
    </div>
  );
}

export default Home;
