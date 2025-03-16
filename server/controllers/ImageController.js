import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import userModel from "../models/userModel.js";

// Controller function to remove bg from image
const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.body;

        // Finding user from database
        const user = await userModel.findOne({ clerkId });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: 'No credit balance', creditBalance: user.creditBalance });
        }

        const imagePath = req.file?.path;

        if (!imagePath) {
            return res.json({ success: false, message: 'No image provided' });
        }

        // Reading file as Buffer instead of Stream ✅
        const imageBuffer = fs.readFileSync(imagePath);



        const formData = new FormData();
        formData.append('image_file', imageBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Sending request to Clipdrop API
        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        // Converting buffer to base64
        const base64Image = Buffer.from(data, 'binary').toString('base64');

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

        // Deducting 1 credit
        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

        // Deleting the uploaded file after processing
        fs.unlinkSync(imagePath);

        res.json({
            success: true,
            resultImage,
            creditBalance: user.creditBalance - 1,
            message: 'Background Removed Successfully'
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

};

export default removeBgImage;
