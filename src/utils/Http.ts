import axios, { AxiosInstance } from "axios";
let API_URL = "";
const iPAddress = "https://www.vitalszoom.com/";
const fileUploadURL = "https://accessgudid.nlm.nih.gov/";
const ImplantIP = "http://47.32.254.89:5000/";
if (process.env.REACT_APP_API_URL) {
  
  API_URL = process.env.REACT_APP_API_URL;
}

 
export class HttpLogin {
  public static axios(): AxiosInstance {
    return axios.create({
    baseURL: iPAddress+'/loginapi/'
    });
  }
}

export class HttpMettlerHealth {
  public static axios(): AxiosInstance {
    return axios.create({
    baseURL: iPAddress+"/fileUploadApi/"
    });
  }
}

export class HttpImplantDevice {
  public static axios(): AxiosInstance {
    return axios.create({
    baseURL: newImplantIp
    });
  }
}

export const apiURL = iPAddress+'/api2/api/';
export const caseURL = iPAddress+'/api3/';
export const caseInitiationURL = iPAddress+'/api4/';
export const caseUploadURL = iPAddress+'/api7/';
export const downloadURL = iPAddress+'/api2/visacare/';
export const formTypeURL = iPAddress+'/api8/';
export const newImplantIp = ImplantIP+'/api/v2/devices/'
