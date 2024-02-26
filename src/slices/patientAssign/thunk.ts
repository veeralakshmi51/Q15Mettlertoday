import axios from 'axios'
import { isLoading, setErrorMessage, setIsLoadingFalse, getBedAssignSuccess } from "./reducer"
import { toast } from 'react-toastify';
import { baseURL, successCode } from '../../configuration/url'

export const getAllBed = async (dispatch: any, orgId: string) => {
    dispatch(isLoading());
    try {
      const response = await axios.get(`${baseURL}/Q15Bed/getByOccupied/${orgId}`);
      console.log('API assign response', response.data)
      if (response.data.message.code === successCode) {
        dispatch(getBedAssignSuccess(response.data.data));
        // toast.success(response.data.message.description)
      } else {
        dispatch(setErrorMessage(response.data.message.description));
        // toast.error(response.data.message.description)
      }
    } catch (error) {
      dispatch(setIsLoadingFalse());
      console.error('API error:', error);
      // toast.error("Error: something went wrong.")
    }
  };

  export const deletePatientAssignDetails = (id:string,org: string) => async (dispatch: any) => {
    dispatch(isLoading());
    try {
      const response = await axios.post(`${baseURL}/Q15Bed/dischargePatient/${id}`);
      console.log('Deleted Details:', response.data);
      if (response.data.message.code === successCode) {
          getAllBed(dispatch,org)
          toast.success(response.data.message.description)
          } else {
        // dispatch(setErrorMessage(response.data.message.description));
        toast.error(response.data.message.description)
      }
    } catch (error) {
      dispatch(setIsLoadingFalse());
      toast.error("Error: something went wrong.")
      console.log('API Error:', error);
    }
  };