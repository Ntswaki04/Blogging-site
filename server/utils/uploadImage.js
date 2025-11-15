const cloudinary = require('../config/cloudinary');

const uploadImage = async (file) => {
    try {
        console.log('📸 Starting image upload...');

        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
                folder: 'dev-blog',
                resource_type: 'image'
            }
        );

        console.log('Cloudinary upload successful:', result.secure_url);

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Image upload failed:', error);
        
        if (error.message.includes('Invalid Signature')) {
            throw new Error('Cloudinary configuration error. Check your API credentials in .env file');
        }
        
        throw new Error('Image upload failed: ' + error.message);
    }
};

module.exports = uploadImage;