
const cloudinary = require("../config/cloudinary");



// Function to delete old image from Cloudinary
const deleteOldImage = async (oldImageUrl) => {

  console.log('delete before try');
  
  try {
    console.log("delete old");
    if (!oldImageUrl) return null;
    const parts = oldImageUrl.split("/");
    const publicId = parts[parts.length - 1].split(".")[0];
    
    if (!publicId) return;
    
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted old image: ${publicId}`);
  } catch (error) {
    console.error("Error deleting old Cloudinary image:", error.message);
  }
  
};

module.exports = deleteOldImage;