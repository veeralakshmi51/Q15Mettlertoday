import axios from 'axios'
import { isLoading, setErrorMessage, setIsLoadingFalse, getStaffSuccess, setSuccess } from "./reducer"
import { toast } from 'react-toastify';
import { baseURL, successCode } from '../../configuration/url'

export const getAllStaff = async (dispatch: any,organization:string) => {
    dispatch(isLoading());
    try {
      const response = await axios.get(`${baseURL}/staff/get/ActiveStaff/${organization}`);
      console.log('API response',response.data)
      if (response.data.message.code === successCode) {
        
        dispatch(getStaffSuccess(response.data.data));
        // toast.success(response.data.message.description)
      } else {
        dispatch(getStaffSuccess([]));
        // dispatch(setErrorMessage(response.data.message.description));
        // toast.error(response.data.message.description)
      dispatch(setIsLoadingFalse());
      }
    } catch (error) {
      dispatch(setIsLoadingFalse());
      // toast.error("Error: something went wrong.")
    }
  };

export const deleteStaffDetails=(username:string,organization:string)=>async(dispatch:any)=>{
  dispatch(isLoading());
 try{
  const response=await axios.delete(`${baseURL}/staff/delete/${username}`);
  console.log('Deleted Staff Details:',response.data)
  if(response.data.message.code===successCode){
    getAllStaff(dispatch,organization)
    toast.success(response.data.message.description)
  }else{
    // dispatch(setErrorMessage(response.data.message.description))
    toast.error(response.data.message.description)
  }
 }catch(error){
  dispatch(setIsLoadingFalse())
  toast.error("Error: something went wrong.")
}
}

export const createStaff = (requestBody: any, navigate: any,org:any) => async (dispatch: any) => {
  dispatch(isLoading())
  try {
    const response = await axios.post(baseURL + '/staff/register', requestBody)
    if (response.data.message.code === successCode) {
      toast.success(response.data.message.description)
      dispatch(setIsLoadingFalse())
      getAllStaff(dispatch,org)
      setTimeout(() => {
        navigate(-1)
        dispatch(setSuccess());
      }, 600)
    } else {
      dispatch(setIsLoadingFalse())
      toast.error(response.data.message.description)
    }
  } catch (error) {
    dispatch(setIsLoadingFalse())
    toast.error("Error: something went wrong.")
  }
}

export const updateStaffDetails = (id: any, data: any, organization:string, setEditModal: any) => async (
  dispatch: any
) => {
  dispatch(isLoading());

  try {
    const response = await axios.put(`${baseURL}/staff/update/${id}`, data);
    if (response.data.message.code === successCode) {
      dispatch(setIsLoadingFalse());
      toast.success(response.data.message.description)
      setEditModal(false)
      getAllStaff(dispatch,organization);
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      toast.error(response.data.message.description);
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    toast.error("Error: something went wrong.")
  }
};