export const uploadToCloudinary = async (file, type = "image") => {
  if (!file) return null;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "news_upload"); // replace
  data.append("cloud_name", "dnnx2sedu"); // your cloud name

  const endpoint =
    type === "video"
      ? "https://api.cloudinary.com/v1_1/dnnx2sedu/video/upload"
      : "https://api.cloudinary.com/v1_1/dnnx2sedu/image/upload";

  const res = await fetch(endpoint, { method: "POST", body: data });
  return res.json(); // contains secure_url
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  return fileName.split('.')[0];
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId, type = "image") => {
  if (!publicId) return null;
  
  try {
    // For unsigned uploads, we can't delete directly via API
    // This function is kept for reference but won't work with unsigned presets
    console.warn("Cannot delete from Cloudinary with unsigned upload preset");
    return { result: "error", message: "Deletion not supported with unsigned uploads" };
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

// Update/Replace image with new one (simplified for unsigned uploads)
export const updateImage = async (newFile, oldImageUrl, type = "image") => {
  if (!newFile) return null;
  
  // Note: With unsigned uploads, we can't delete the old image
  // We just upload the new one and let the application handle the URL update
  console.log("Uploading new file (old file will remain in Cloudinary)");
  
  // Upload new image
  return await uploadToCloudinary(newFile, type);
};
