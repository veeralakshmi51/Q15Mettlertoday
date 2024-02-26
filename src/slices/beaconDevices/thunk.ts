import axios from 'axios'
import { isLoading, setErrorMessage, setIsLoadingFalse, getBeaconSuccess } from "./reducer"
import { toast } from 'react-toastify';
import { baseURL, successCode } from '../../configuration/url'

export const getAllBeacon = async (dispatch: any, organization: string) => {
  try {
    const res = await axios.get(
      `${baseURL}/sensor/getAllByorgId/${organization}`
    );
    if(res.data.message.code === successCode){
      dispatch(getBeaconSuccess(res.data.data))
    }
  } catch (error) {
    console.log(error);
  }
};

  export const updatedSensorDetails = async (dispatch: any, id: string, data: any,org:string) => {
    dispatch(isLoading());
    // console.log('Updating sensor with deviceName:',id);
    // console.log('Data to be sent:', data);
  
    try {
      const response = await axios.put(`${baseURL}/sensor/updateSensorTableByDeviceName/${id}`, data);
  
      // console.log('Update API Response:', response.data);
  
      if (response.data.message.code === successCode) {
        dispatch(setIsLoadingFalse());
        // console.log('Sensor details updated successfully!');
        // alert(response.data.message.description);
        toast.success(response.data.message.description)
        // window.location.reload();
        getAllBeacon(dispatch,org);
      } else {
        dispatch(setErrorMessage(response.data.message.description));
        // console.error('Update failed:', response.data.message.description);
        // alert(response.data.message.description);
        toast.error(response.data.message.description)
      }
    } catch (error) {
      dispatch(setIsLoadingFalse());
      // console.log('API error:', error);
      // dispatch(setErrorMessage('Error updating sensor details.'));
      toast.error("Error: something went wrong.")
    }
  };
  