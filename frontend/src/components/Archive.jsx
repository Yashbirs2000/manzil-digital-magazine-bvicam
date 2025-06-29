import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fetchMagazines } from './api';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const Archive = () => {
  const [categories, setCategories] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [filteredMagazines, setFilteredMagazines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedPublishedDate, setSelectedPublishedDate] = useState('');
  const flipBookRef = useRef();
  const flipSound = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get('http://localhost:1337/api/categories');
        setCategories(categoryRes.data.data);

        const magData = await fetchMagazines();
        setMagazines(magData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching archive data:', err);
        setLoading(false);
      }
    };

    fetchData();
    flipSound.current = new Audio('/sound.mp3');
  }, []);

  useEffect(() => {
    let filtered = [...magazines];

    if (selectedCategory) {
      filtered = filtered.filter(mag => mag.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(mag =>
        mag.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Correctly filter by selected year
    if (selectedYear) {
      filtered = filtered.filter(mag => {
        const magazineYear = new Date(mag.publishedAt).getFullYear().toString();
        return magazineYear === selectedYear;
      });
    }

    setFilteredMagazines(filtered);
  }, [magazines, selectedCategory, searchTerm, selectedYear]);

  const handlePdfSelect = (mag) => {
    setPdfUrl(mag.pdf);
    setSelectedTitle(mag.title);
    setSelectedCategoryName(mag.category);
    setSelectedPublishedDate(mag.publishedAt);
  };

  const closeViewer = () => {
    setPdfUrl(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const renderPage = (pageNumber) => (
    <Page
      key={pageNumber}
      pageNumber={pageNumber}
      width={600}
      renderAnnotationLayer={false}
      renderTextLayer={false}
    />
  );

  const goToPreviousPage = () => {
    flipBookRef.current?.pageFlip().flipPrev();
    flipSound.current?.play();
  };

  const goToNextPage = () => {
    flipBookRef.current?.pageFlip().flipNext();
    flipSound.current?.play();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  if (loading) return <div className="text-center py-10 font-semibold">Loading...</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Controls - Adjusted for one line */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search magazine title..."
          className="border px-4 py-2 rounded-md w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded-md w-full sm:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.attributes.name}>
              {cat.attributes.name}
            </option>
          ))}
        </select>

        {/* Year dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-4 py-2 rounded-md w-full sm:w-1/3"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Issues */}
      {filteredMagazines.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMagazines.map((mag) => (
            <div
              key={mag.id}
              onClick={() => handlePdfSelect(mag)}
              className="p-4 bg-white rounded-lg border shadow hover:scale-105 transform transition cursor-pointer"
            >
              <img
                src={mag.cover}
                alt={mag.title}
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{mag.title}</h3>
              {/* Removed the publication date from the card */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-10 text-gray-500">No magazines found.</p>
      )}

      {/* PDF FlipBook Modal */}
      {pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative bg-white p-4 rounded-xl max-w-[100%] max-h-[95%] overflow-auto">
            <button
              onClick={closeViewer}
              className="absolute top-2 right-2 text-red-600 text-2xl font-bold hover:text-red-800"
            >
              &times;
            </button>

            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">{selectedTitle}</h2>
              <p className="text-sm text-gray-500">
                {selectedCategoryName} • {new Date(selectedPublishedDate).toLocaleDateString()}
              </p>
            </div>

            <div className="relative flex justify-center items-center">
              <button
                onClick={goToPreviousPage}
                className="absolute left-0 text-3xl text-blue-600 hover:text-blue-800"
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
                className="absolute right-0 text-3xl text-blue-600 hover:text-blue-800"
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

export default Archive;
