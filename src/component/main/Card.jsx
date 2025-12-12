import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { db } from "../../utils/firebase";
import logo from "../../assets/textlogo.svg"
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import "../style/Card.css";

export default function Card() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch news using TanStack Query
    const { data: news = [], isLoading, error, refetch } = useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            console.log('Starting fetch...');

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
            return newsData;
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Filter news based on search query
    const filteredNews = news.filter(article =>
        searchQuery === '' ||
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleBack() {
        navigate('/');
    }

    function handleRefresh() {
        refetch();
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

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

    return (
        <div className="news-container">
            <div className="news-header">
                <button onClick={handleBack} className="back-button">
                    ← Back to Home
                </button>
                {/* <img src={logo} alt="" className="textlogo" /> */}
                {/* NEW WRAPPER HERE */}
                <div className="header-right">
                    <input
                        type="search"
                        placeholder="Search news..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    <button onClick={handleRefresh} className="refresh-button" disabled={isLoading}>
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {isLoading && news.length === 0 && (
                <div className="news-loading">
                    <div className="loading-spinner">Loading news...</div>
                </div>
            )}

            {error && (
                <div className="news-error">
                    <p>Error: {error.message}</p>
                    <button onClick={refetch} className="retry-button">Try Again</button>
                </div>
            )}

            {!isLoading && !error && news.length === 0 && (
                <div className="news-empty">
                    <p>No user-created news articles available.</p>
                    <p>Create some news to see them here!</p>
                </div>
            )}

            <div className="news-grid">
                {filteredNews.map((article, index) => (
                    <div key={article.id || index} className={`news-card ${article.source?.id === 'user-news' ? 'user-news-card' : ''}`}>
                        {/* Display Image */}
                        {(article?.urlToImage || article?.image) && ( // Added article.image as a fallback for Firebase data structure
                            <div className="news-media">
                                <img
                                    src={article.urlToImage || article.image} // Use urlToImage or image
                                    alt={article.title || "News Image"}
                                    className="news-image"
                                    onError={(e) => {
                                        e.target.onerror = null;         // prevent infinite loop
                                        e.target.src = "/fallback-image.jpg"; // show fallback instead of hiding
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
                            <span className="news-date">
                                {formatDate(article.publishedAt?.toDate())}
                            </span>
                            <h3 className="news-headline">{article.title}</h3>
                            <Link to={`/read/${article.id}`} className="read-more-link">Read More →</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}