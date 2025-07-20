import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fetchMagazines } from './api';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const Current = () => {
  const [categories, setCategories] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [, setCurrentPage] = useState(0);

  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedPublishedDate, setSelectedPublishedDate] = useState('');
  const [userBookmarks, setUserBookmarks] = useState([]);

  const flipBookRef = useRef();
  const flipSound = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(`${process.env.VITE_API_URL}/api/categories`);
        setCategories(categoryRes.data.data);

        const magazineData = await fetchMagazines();
        magazineData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setMagazines(magazineData);

        if (user && token) {
          const bookmarkRes = await axios.get(
            `${process.env.VITE_API_URL}/api/bookmarks?populate=magazine&filters[user][id][$eq]=${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const bookmarkedIds = bookmarkRes.data.data.map((b) => b.attributes.magazine.data.id);
          setUserBookmarks(bookmarkedIds);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
    flipSound.current = new Audio('/sound.mp3');
  }, [user, token]);

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

  const toggleBookmark = async (magId) => {
    if (!user || !token) return alert("Please log in to bookmark.");

    try {
      if (userBookmarks.includes(magId)) {
        const res = await axios.get(
          `${process.env.VITE_API_URL}/api/bookmarks?filters[user][id][$eq]=${user.id}&filters[magazine][id][$eq]=${magId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const bookmarkId = res.data.data[0]?.id;
        if (bookmarkId) {
          await axios.delete(`${process.env.VITE_API_URL}/api/bookmarks/${bookmarkId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserBookmarks(userBookmarks.filter((id) => id !== magId));
        }
      } else {
        // Add bookmark
        await axios.post(
          `${process.env.VITE_API_URL}/api/bookmarks`,
          {
            data: {
              user: user.id,
              magazine: magId,
            },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserBookmarks([...userBookmarks, magId]);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  if (loading) return <div className="py-20 text-lg font-semibold text-center">Loading...</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border rounded-md ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.attributes.name)}
            className={`px-4 py-2 border rounded-md ${selectedCategory === category.attributes.name ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {category.attributes.name}
          </button>
        ))}
      </div>

      {/* Magazine Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMagazines.map((mag) => (
          <div
            key={mag.id}
            className="relative block p-4 transition-transform transform bg-white border rounded-lg shadow-md cursor-pointer hover:scale-105"
          >
            <img
              src={mag.cover}
              alt={mag.title}
              onClick={() => handlePdfSelect(mag)}
              className="object-cover w-full mb-4 rounded-md h-60"
            />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">{mag.title}</h3>
            {mag.publishedAt && (
              <p className="mb-1 text-sm text-gray-500">
                Published: {new Date(mag.publishedAt).toLocaleDateString()}
              </p>
            )}
            {user && (
              <button
                onClick={() => toggleBookmark(mag.id)}
                className="absolute text-xl text-blue-500 top-4 right-4 hover:text-blue-700"
              >
                {userBookmarks.includes(mag.id) ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* PDF FlipBook Modal */}
      {pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white p-2 rounded-xl max-w-[100%] max-h-[95%] overflow-auto">
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
    </div>
  );
};

export default Current;
