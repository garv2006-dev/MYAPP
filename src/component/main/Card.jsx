import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { db } from "../../utils/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import "../style/Card.css";

export default function Card() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNews();
    }, [user]);

    const fetchNews = async () => {
        try {
            setLoading(true);
            
            console.log('Starting fetch...');

            // Fetch all news from Firestore (remove user filter for testing)
            const newsQuery = query(
                collection(db, 'news'),
                orderBy('publishedAt', 'desc')
            );
            
            console.log('Query created');
            
            const querySnapshot = await getDocs(newsQuery);
            console.log('Documents fetched:', querySnapshot.docs.length);
            
            const newsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('News data:', newsData);
            
            setNews(newsData);
            setError(null);
        } catch (err) {
            console.error('Fetch error details:', err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    function handleBack() {
        navigate('/');
    }

    function handleRefresh() {
        fetchNews();
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div className="news-container">
            <div className="news-header">
                <button onClick={handleBack} className="back-button">
                    ← Back to Home
                </button>
                <h1 className="news-title">Latest News</h1>
                <div className="header-buttons">
                    <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {loading && news.length === 0 && (
                <div className="news-loading">
                    <div className="loading-spinner">Loading news...</div>
                </div>
            )}

            {error && (
                <div className="news-error">
                    <p>{error}</p>
                    <button onClick={fetchNews} className="retry-button">Try Again</button>
                </div>
            )}

            {!loading && !error && news.length === 0 && (
                <div className="news-empty">
                    <p>No user-created news articles available.</p>
                    <p>Create some news to see them here!</p>
                </div>
            )}

            <div className="news-grid">
                {news.map((article, index) => (
                    <div key={article.id || index} className={`news-card ${article.source.id === 'user-news' ? 'user-news-card' : ''}`}>
                        {/* Display Image */}
                        {article.urlToImage && (
                            <div className="news-media">
                                <img 
                                    src={article.urlToImage} 
                                    alt={article.title}
                                    className="news-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
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
                                <span className="source-name">{article.source.name}</span>
                                <span className="news-date">{formatDate(article.publishedAt)}</span>
                            </div>
                            <h3 className="news-headline">{article.title}</h3>
                            <p className="news-description">{article.description}</p>
                            {article.author && (
                                <p className="news-author">By {article.author}</p>
                            )}
                            {article.url && article.url !== '#' && (
                                <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="read-more-link"
                                >
                                    Read More →
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}