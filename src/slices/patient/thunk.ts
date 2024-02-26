import axios from 'axios';
import { isLoading, setErrorMessage, setIsLoadingFalse, getPatientSuccess, getPatientgetOrgSuccess } from './reducer';
import { toast } from 'react-toastify';
import { baseURL, successCode } from '../../configuration/url'

export const getAllPatient = async (dispatch: any,org: string) => {
  dispatch(isLoading());
  try {
    const response = await axios.get(`${baseURL}/patient/get/activePatient/${org}`);

    if (response.data.message.code === successCode) {
      dispatch(getPatientSuccess(response.data.data));
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      dispatch(getPatientSuccess([]));
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    console.error(error);
  }
};

export const getOrgPatient = async (dispatch: any,org: string) => {
  dispatch(isLoading());
  try {
    const response = await axios.get(`${baseURL}/patient/getPatient/org/${org}`);

    if (response.data.message.code === successCode) {
      dispatch(getPatientgetOrgSuccess(response.data.data));
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      dispatch(getPatientgetOrgSuccess([]));
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    console.error(error);
  }
};

export const updatePatientDetails = (id: string, data: any, org: string) => async (
  dispatch: any
) => {
  dispatch(isLoading());
  console.log('Updating Patient with ID:', id);
  console.log('Data to be sent:', data);

  try {
    const response = await axios.put(`${baseURL}/patient/update/${id}`, data);

    console.log('Update API Response:', response.data);

    if (response.data.message.code === successCode) {
      dispatch(setIsLoadingFalse());
      toast.success(response.data.message.description)
      getOrgPatient(dispatch,org)
      getAllPatient(dispatch, org);
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      toast.error(response.data.message.description)
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    toast.error("Error: something went wrong.")
  }
};

export const patientDischarge = async (dispatch: any,id:string,org:string) => {
  dispatch(isLoading());
  try {
    const response = await axios.post(`${baseURL}/Q15Bed/dischargePatient/${id}/${org}`);

    if (response.data.message.code === successCode) {
      toast.success(response.data.message.description)
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      dispatch(getPatientSuccess([]));
      toast.error(response.data.message.description)
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    toast.error("Error: something went wrong.")
  }
};