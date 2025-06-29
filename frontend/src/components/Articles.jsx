import { useEffect, useState } from "react";

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [latestArticle, setLatestArticle] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/articles?populate=Image&sort=createdAt:desc");
        const data = await response.json();

        if (!data.data || data.data.length === 0) return;

        const formatted = data.data.map((article) => {
          const attr = article.attributes;
          const image = attr.Image?.data?.[0]?.attributes?.url
            ? `http://localhost:1337${attr.Image.data[0].attributes.url}`
            : "https://via.placeholder.com/600x400";

          return {
            id: article.id,
            title: attr.Title || "Untitled",
            description: attr.Description || "",
            content: attr.Content || [],
            createdAt: attr.createdAt,
            image,
          };
        });

        setLatestArticle(formatted[0]);
        setArticles(formatted.slice(1));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchArticles();
  }, []);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const renderContent = (content) =>
    content.map((p, idx) =>
      p.children?.map((child, i) => (
        <p
          key={`${idx}-${i}`}
          className="mb-4 text-lg leading-relaxed text-justify text-gray-700"
        >
          {child.text}
        </p>
      ))
    );

  if (selectedArticle) {
    return (
      <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-6 text-4xl font-bold text-gray-900">{selectedArticle.title}</h2>
          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="object-cover w-full mb-6 shadow-xl h-96 rounded-xl"
          />
          <div className="prose max-w-none">{renderContent(selectedArticle.content)}</div>
          <button
            onClick={handleBack}
            className="px-6 py-3 mt-10 font-semibold text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
          >
            ← Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Latest Article */}
        {latestArticle && (
          <div className="grid gap-8 mb-16 lg:grid-cols-2">
            <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
              <img
                src={latestArticle.image}
                alt={latestArticle.title}
                className="object-cover w-full h-64 rounded-t-2xl"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-gray-900">{latestArticle.title}</h1>
              <p className="text-base text-justify text-gray-700">{latestArticle.description}</p>
              <button
                onClick={() => handleReadMore(latestArticle)}
                className="inline-flex items-center px-5 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-full shadow hover:bg-blue-700"
              >
                Read More →
              </button>
            </div>
          </div>
        )}

        {/* Recent Articles */}
        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-gray-900">Our Recent Articles</h2>
          
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="overflow-hidden transition transform bg-white shadow-lg rounded-2xl hover:scale-105 hover:shadow-xl"
            >
              <img
                src={article.image}
                alt={article.title}
                className="object-cover w-full h-48 rounded-t-2xl"
              />
              <div className="p-6">
                <div className="flex justify-between mb-2 text-xs text-gray-400">
                  <span>{article.author || ""}</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{article.title}</h3>
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
    </div>
  );
};

export default Article;
