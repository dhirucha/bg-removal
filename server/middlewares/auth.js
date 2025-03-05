import jwt from 'jsonwebtoken'

//Middleware function to decode jwt tokens to get clerkid
const authUser = async (req, res) =>{
    try {

        const {token} = req.headers

        if (!token){
            return res.json({success:false, message: 'Not authorized login again'})
        }

        const token_decode = jwt.decode(token)
        req.body.clerkId = token_decode.clerkId 
        next()
        
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

export default authUser