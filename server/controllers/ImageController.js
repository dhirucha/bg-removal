import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import userModel from "../models/userModel.js"

//controller function to remove bg from image
const removeBgImage = async (req,res) =>{
    try {

        const {clerkId} = req.body

        const user = await userModel.findOne({clerkId})

        if(!user){
            return res.json({ success:false, message: 'user not found'})
        }

        if(user.creditBalance === 0){
            return res.json({success:false, message: 'No credit Balance', creditBalance:user.creditBalance})
        }

        const imagePath = req.file.path

        //Reading image file
        const imageFile = fs.createReadStream(imagePath)

        const formadata = new FormData()
        formadata.append('image_file',imageFile)

        const {data} = await axios.post('https://clipdrop-api.co/remove-background/v1',formadata,{
            headers:{
            'x-api-key': process.env.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer'

        })

        const base64Image = Buffer.form(data,'binary').toString('base64')

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id,{creditBalance:user.creditBalance - 1})

        rea.json({success:true, rsultImage, creditBalance:user.creditBalance-1, message:'Background Removed'})

        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message})
    }
}

export default removeBgImage