import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../style/Card.css";

export default function Read() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) {
                setError("No article ID provided");
                setLoading(false);
                return;
            }

            try {
                const articleDoc = doc(db, 'news', id);
                const articleSnapshot = await getDoc(articleDoc);

                if (articleSnapshot.exists()) {
                    setArticle({
                        id: articleSnapshot.id,
                        ...articleSnapshot.data()
                    });
                } else {
                    setError("Article not found");
                }
            } catch (err) {
                console.error("Error fetching article:", err);
                setError("Failed to load article");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "No Date";

        const date =
            dateString instanceof Date
                ? dateString
                : new Date(dateString);

        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleBack = () => {
        navigate('/card');
    };

    if (loading) {
        return (
            <div className="news-container">
                <div className="news-loading">
                    <div className="loading-spinner">Loading article...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="news-container">
                <div className="news-error">
                    <p>{error}</p>
                    <button onClick={handleBack} className="retry-button">Back to Articles</button>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="news-container">
                <div className="news-empty">
                    <p>Article not found</p>
                    <button onClick={handleBack} className="retry-button">Back to Articles</button>
                </div>
            </div>
        );
    }

    return (
        <div className="news-container">
            {/* <div className="news-header">
                <button onClick={handleBack} className="back-button">
                    ← Back to Articles
                </button>
                <h1 className="news-title">Article Details</h1>
            </div> */}

            <div className="news-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Display Image */}
                {article?.urlToImage && (
                    <div className="news-media">
                        <img
                            src={article.urlToImage}
                            alt={article.title || "Article Image"}
                            className="news-image"
                            style={{ height: '400px' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/fallback-image.jpg";
                            }}
                        />
                    </div>
                )}

                {/* Display Video */}
                {article.videoUrl && (
                    <div className="news-media">
                        <video
                            src={article.videoUrl}
                            controls
                            className="news-video"
                            style={{ height: '400px' }}
                            onError={(e) => {
                                console.error('Video error:', e);
                            }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                <div className="news-content">
                    <div className="news-source">
                        {/* <span className="source-name">{article.source?.name || 'Unknown Source'}</span> */}
                        <span className="news-date">
                            {formatDate(article.publishedAt?.toDate())}
                        </span>
                    </div>  

                    <h1 className="news-headline" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        {article.title}
                    </h1>

                    <div className="news-description" style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        marginBottom: '1.5rem',
                        display: 'block',
                        WebkitLineClamp: 'unset'
                    }}>
                        {article.description}
                    </div>

                    {article.author && (
                        <p className="news-author" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                            By {article.author}
                        </p>
                    )}

                    {article.content && (
                        <div className="article-content" style={{
                            fontSize: '1rem',
                            lineHeight: '1.8',
                            color: '#374151',
                            marginBottom: '1.5rem'
                        }}>
                            {article.content}
                        </div>
                    )}

                    {article.url && article.url !== '#' && (
                        <div style={{ marginTop: '2rem' }}>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="read-more-link"
                                style={{ fontSize: '1rem' }}
                            >
                                Read Original Article →
                            </a>
                        </div>
                    )}

                    <button onClick={handleBack} className="back-button">
                        ← Back to Articles
                    </button>
                </div>
            </div>
        </div>
    );
}