import axios from 'axios';
import { endLoading, saveLoginData, saveOrganization, saveUserData, saveUserDetails, saveUserType, startLoading } from './reducer'
import { toast } from 'react-toastify';
import { baseURL, successCode } from '../../configuration/url'

export const handleLogin = async (dispatch: any, body: any, navigate: (p: string) => void) => {
    dispatch(startLoading())
    try {
        const response = await axios.post(`${baseURL}/user/signin`,body);
        console.log("Login response:", response);
        if (response.data.message.code === successCode) {
            const { jwt, session, userType, organization, userDetail } = response.data.data;
            const userEmail = userDetail ? userDetail.email : null;
            const username = session.username;
            localStorage.setItem('userDetailEmail', userEmail);
            localStorage.setItem('userDetailUsername', username);
            dispatch(saveLoginData(jwt.jwtToken));
            dispatch(saveUserDetails(username));
            dispatch(saveUserData(response.data.data))
            dispatch(saveUserType(userType[0]));
            dispatch(saveOrganization(organization));
            toast.success(response.data.message.description);
            if (userType[0] === "Super Admin") {
                navigate('/secret-key');
            } else {
                if (userDetail && userDetail.name && userDetail.name.length > 0) {
                    const given = userDetail.name[0].given;
                    const family = userDetail.name[0].family;
                    localStorage.setItem('given', given);
                    localStorage.setItem('family', family);
                }
                navigate('/secret-key');
            }
        } else {
            toast.error(response.data.message.description);
            dispatch(endLoading());
        }
        
        
    } catch (error) {
        // toast.error("Error during login:");
        dispatch(endLoading())
    }
};

export const handleLogout = async(body: any, navigate: (p: string) => void) => {
    
    try {
        const response = await axios.post(`${baseURL}/user/signout`,body);
        console.log("Logout :" , response);

        if(response.data.message.code === successCode) {
            localStorage.clear()
            navigate('/login')
        }else {
            // alert("Login failed: " + response.data.message.description);
            localStorage.clear()
            navigate('/login')
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}