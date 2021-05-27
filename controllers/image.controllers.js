const cloudinary = require('cloudinary').v2;

const uploadImage = async (req, res) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(req.body.image, {
      public_id: `keke_cook-${Date.now()}`,
      folder:'keke-cook',
      resource_type: 'image',
    });
    res.json({
      public_id: uploadResult.public_id,
      imageURL: uploadResult.secure_url,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteImage = (req, res) => {
  const image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) return res.json({ success: false, error });
    res.json(result);
  });
};

module.exports = {
  uploadImage,
  deleteImage,
};
