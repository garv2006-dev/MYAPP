import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import { db } from "../../utils/firebase";
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
import "../style/createnews.css";

// ⬇️ Cloudinary Upload Helper
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

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

    // Fetch logged-in user profile
    const fetchUserProfile = async () => {
        try {
            const docRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(docRef);

            if (userDoc.exists()) {
                const u = userDoc.data();
                setFormData((prev) => ({
                    ...prev,
                    author:
                        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
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
            setFormData((prev) => ({
                ...prev,
                author: user.displayName || user.email
            }));
        }
    };

    // Fetch all user news
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
            setError(error.message);
        } finally {
            setFetchLoading(false);
        }
    };

    // Input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Image validation
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setError(null);
        } else {
            setError("Please upload a valid image.");
        }
    };

    // Video validation
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

    // ⬇️ Replace Firebase upload with Cloudinary upload
    const uploadFile = async (file, type) => {
        const uploaded = await uploadToCloudinary(file, type);
        return uploaded.secure_url; // Cloudinary returns URL
    };

    // Create News Submit Handler
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

    // Edit News
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
        // Reset file inputs when editing
        setImageFile(null);
        setVideoFile(null);
        setUploadProgress(0);
    };

    // Update News
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            return setError("Title and description are required.");
        }

        try {
            setLoading(true);
            setUploadProgress(0);

            let imageUrl = editingNews.urlToImage;
            let videoUrl = editingNews.videoUrl;

            // Handle image upload if new image is selected
            if (imageFile) {
                const imageResult = await uploadToCloudinary(imageFile, "image");
                imageUrl = imageResult.secure_url;
                setUploadProgress(50);
            }

            // Handle video upload if new video is selected
            if (videoFile) {
                const videoResult = await uploadToCloudinary(videoFile, "video");
                videoUrl = videoResult.secure_url;
                setUploadProgress(100);
            }

            const refDoc = doc(db, "news", editingNews.id);

            await updateDoc(refDoc, {
                ...formData,
                urlToImage: imageUrl,
                videoUrl: videoUrl,
                updatedAt: serverTimestamp()
            });

            setIsEditing(false);
            setEditingNews(null);
            setImageFile(null);
            setVideoFile(null);
            setFormData({
                title: "",
                description: "",
                content: "",
                author: "",
                urlToImage: "",
                url: ""
            });
            fetchExistingNews();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete News
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this article?")) return;

        try {
            await deleteDoc(doc(db, "news", id));
            fetchExistingNews();
        } catch (err) {
            setError(err.message);
        }
    };

    // UI
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
                <form
                    onSubmit={isEditing ? handleUpdate : handleSubmit}
                    className="create-news-form"
                >
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows="6"
                        />
                    </div>

                    <div className="form-group">
                        <label>Author</label>
                        <input
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                        />
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
                            <div
                                style={{ width: `${uploadProgress}%` }}
                                className="progress-fill"
                            ></div>
                        </div>
                    )}

                    <button className="submit-button" disabled={loading}>
                        {loading
                            ? "Please wait..."
                            : isEditing
                            ? "Update Article"
                            : "Create Article"}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="cancel-btn"
                        >
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
                                    {article.urlToImage && (
                                        <img
                                            src={article.urlToImage}
                                            alt=""
                                            className="news-image"
                                        />
                                    )}

                                    {article.videoUrl && (
                                        <video
                                            className="news-video"
                                            src={article.videoUrl}
                                            controls
                                        ></video>
                                    )}
                                                
                                    <h3>{article.title}</h3>
                                    <p>{article.description}</p>

                                    <div className="news-actions">
                                        <button onClick={() => handleEdit(article)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDelete(article.id)} className="delete-btn">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
