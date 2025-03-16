import { createContext, useState } from "react";
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [credit, setCredit] = useState(false);
    const [image, setImage] = useState(null); // Fixed: Initially set to null, not false
    const [resultImg, setResultImg] = useState(null); // Fixed: Initially set to null

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    const { getToken } = useAuth();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();

    const loadCreditsData = async () => {
        try {
            const token = await getToken();



            const { data } = await axios.get(`${backendUrl}/api/user/credits`, { 
                headers: { Authorization: `Bearer ${token}` } // Fixed: Sending token in Authorization header
                
            });

            if (data.success) {
                setCredit(data.credits);
                console.log(data.credits);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const removeBg = async (image) => {
        try {
            if (!isSignedIn) {
                return openSignIn();
            }

            setImage(image);
            setResultImg(null); // Fixed: Set to null instead of false

            navigate('/result');

            const token = await getToken();

            const formData = new FormData();
            image && formData.append('image', image);

            const { data } = await axios.post(`${backendUrl}/api/image/remove-bg`, formData, { 
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setResultImg(data.resultImg);
                data.creditBalance && setCredit(data.creditBalance);
            } else {
                toast.error(data.message);
                data.creditBalance && setCredit(data.creditBalance);
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const value = {
        credit, setCredit,
        loadCreditsData,
        backendUrl,
        image, setImage,
        removeBg,
        resultImg, setResultImg
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};


export default AppContextProvider;
