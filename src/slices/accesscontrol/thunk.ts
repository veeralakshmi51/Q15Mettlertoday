import axios from 'axios'
import { getAccessControlSuccess, getOrgSuccess, isLoading, setErrorMessage, setIsLoadingFalse } from "./reducer"
import { baseURL, successCode } from '../../configuration/url'

export const getAllAccess = async (dispatch: any) => {
    dispatch(isLoading())
    try{
        const response = await axios.get(`${baseURL}/access/getAll`)
        if(response.data.message.code === successCode) {
            dispatch(getAccessControlSuccess(response.data.data))
            // toast.success(response.data.message.description)
        } else {
            dispatch(setErrorMessage(response.data.message.description))
            // toast.error(response.data.message.description)
        }
    } catch (error) {
        dispatch(setIsLoadingFalse())
        // console.log(error)
        // toast.error("Error: something went wrong.")
    }
}

export const getOrganization = async (dispatch: any) => {
    dispatch(isLoading())
    try {
        const response = await axios.get(`${baseURL}/org/name`)
        if(response.data.message.code === successCode){
            dispatch(getOrgSuccess(response.data.data))
            // toast.success(response.data.message.description)
        } else {
            dispatch(setErrorMessage(response.data.message.descryption))
            // toast.error(response.data.message.description)
        }
    } catch (error) {
        dispatch(setIsLoadingFalse())
        // console.log(error)
        // toast.error("Error: something went wrong.")
    }
}