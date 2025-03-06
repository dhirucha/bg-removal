import express from 'express'
import {removeBgImge} from '../controllers/ImageController.js'
import upload from '../middlewares/multer.js'
import authUser from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/remove-bg',upload.single('image'),authUser,removeBgImge)


export default imageRouter