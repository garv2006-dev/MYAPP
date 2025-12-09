import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import { db, storage } from "../../utils/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    deleteDoc,
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../style/createnews.css";

export default function CreateNews() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [newsList, setNewsList] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNews, setEditingNews] = useState(null);

    const [uploadProgress, setUploadProgress] = useState(0);

    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        author: "",
        urlToImage: "",
        url: ""
    });

    useEffect(() => {
        if (user) fetchUserProfile();
        fetchExistingNews();
    }, [user]);

    // ------------------------------------------------------
    // Fetch logged-in user profile
    // ------------------------------------------------------
    const fetchUserProfile = async () => {
        try {
            const docRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(docRef);

            if (userDoc.exists()) {
                const u = userDoc.data();
                setFormData((prev) => ({
                    ...prev,
                    author: `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                        user.displayName ||
                        user.email
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    author: user.displayName || user.email
                }));
            }
        } catch (error) {
            console.error(error);
            setFormData((prev) => ({
                ...prev,
                author: user.displayName || user.email
            }));
        }
    };

    // ------------------------------------------------------
    // Fetch news created by all users (you filter later)
    // ------------------------------------------------------
    const fetchExistingNews = async () => {
        try {
            setFetchLoading(true);

            const newsQuery = query(
                collection(db, "news"),
                orderBy("publishedAt", "desc")
            );

            const snap = await getDocs(newsQuery);

            setNewsList(
                snap.docs.map((d) => ({
                    id: d.id,
                    ...d.data()
                }))
            );
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
        } finally {
            setFetchLoading(false);
        }
    };

    // ------------------------------------------------------
    // Handle form input
    // ------------------------------------------------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ------------------------------------------------------
    // Image & video validation
    // ------------------------------------------------------
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setError(null);
        } else {
            setError("Please upload a valid image.");
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("video/")) {
            setError("Invalid video file!");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setError("Video must be under 50MB.");
            return;
        }

        setVideoFile(file);
        setError("");
    };

    // ------------------------------------------------------
    // Upload to Firebase Storage
    // ------------------------------------------------------
    const uploadFile = async (file, fileType) => {
        if (!file) return null;

        const fileRef = ref(storage, `news/${user.uid}/${Date.now()}_${file.name}`);

        const snap = await uploadBytes(fileRef, file);
        return await getDownloadURL(snap.ref);
    };

    // ------------------------------------------------------
    // Create a news article
    // ------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return setError("Login required.");

        if (!formData.title.trim() || !formData.description.trim()) {
            return setError("Title and description are required.");
        }

        try {
            setLoading(true);
            setUploadProgress(0);

            let imageUrl = null;
            let videoUrl = null;

            if (imageFile) {
                imageUrl = await uploadFile(imageFile, "image");
                setUploadProgress(50);
            }

            if (videoFile) {
                videoUrl = await uploadFile(videoFile, "video");
                setUploadProgress(100);
            }

            const docData = {
                ...formData,
                urlToImage: imageUrl || formData.urlToImage,
                videoUrl: videoUrl || null,
                author: formData.author || user.displayName || user.email,
                url: formData.url || "#",
                publishedAt: serverTimestamp(),
                userId: user.uid,
                userEmail: user.email,
                source: { id: "user-news", name: "User Created" }
            };

            await addDoc(collection(db, "news"), docData);

            setSuccess(true);
            setFormData({
                title: "",
                description: "",
                content: "",
                author: "",
                urlToImage: "",
                url: ""
            });
            setImageFile(null);
            setVideoFile(null);
            fetchExistingNews();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------
    // Edit News
    // ------------------------------------------------------
    const handleEdit = (article) => {
        setIsEditing(true);
        setEditingNews(article);
        setFormData({
            title: article.title,
            description: article.description,
            content: article.content,
            author: article.author,
            urlToImage: article.urlToImage,
            url: article.url
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const refDoc = doc(db, "news", editingNews.id);

            await updateDoc(refDoc, {
                ...formData,
                updatedAt: serverTimestamp()
            });

            setIsEditing(false);
            setEditingNews(null);
            fetchExistingNews();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------
    // Delete News
    // ------------------------------------------------------
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this article?")) return;

        try {
            await deleteDoc(doc(db, "news", id));
            fetchExistingNews();
        } catch (err) {
            setError(err.message);
        }
    };

    // ------------------------------------------------------
    // UI Starts Here
    // ------------------------------------------------------
    return (
        <div className="create-news-container">
            <div className="create-news-header">
                <button onClick={() => navigate("/card")} className="back-button">
                    ← Back
                </button>
                <h1>{isEditing ? "Edit News" : "Create News"}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">News created!</div>}

            <div className="create-news-form-container">
                <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="create-news-form">
                    <div className="form-group">
                        <label>Title *</label>
                        <input name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <textarea name="content" value={formData.content} onChange={handleInputChange} rows="6" />
                    </div>

                    <div className="form-group">
                        <label>Author</label>
                        <input name="author" value={formData.author} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {imageFile && <p>Selected: {imageFile.name}</p>}
                    </div>

                    <div className="form-group">
                        <label>Upload Video</label>
                        <input type="file" accept="video/*" onChange={handleVideoChange} />
                        {videoFile && <p>Selected: {videoFile.name}</p>}
                    </div>

                    {uploadProgress > 0 && (
                        <div className="progress-bar">
                            <div style={{ width: `${uploadProgress}%` }} className="progress-fill"></div>
                        </div>
                    )}

                    <button className="submit-button" disabled={loading}>
                        {loading ? "Please wait..." : isEditing ? "Update Article" : "Create Article"}
                    </button>

                    {isEditing && (
                        <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="existing-news-section">
                <h2>Your Articles</h2>

                {fetchLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="news-grid">
                        {newsList
                            .filter((n) => n.userId === user?.uid)
                            .map((article) => (
                                <div className="news-card" key={article.id}>
                                    {article.urlToImage && <img src={article.urlToImage} alt="" className="news-image" />}
                                    <h3>{article.title}</h3>
                                    <p>{article.description}</p>

                                    <div className="news-actions">
                                        <button onClick={() => handleEdit(article)}>Edit</button>
                                        <button onClick={() => handleDelete(article.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
