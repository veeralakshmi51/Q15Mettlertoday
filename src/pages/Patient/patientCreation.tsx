import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import TextField from '@mui/material/TextField';
import {
  Autocomplete,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Constants from "../Constants/Constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, successCode } from '../../configuration/url';
import { FaQrcode } from 'react-icons/fa';
import Scan from '../beaconDevices/Scan';
import { DatePicker } from '@mui/x-date-pickers';
import { formatDateToYYYYMMDD, formatSSN } from '../../helpers/common';
import { DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  CardFooter,
  CardHeader,
  Badge,
  Input,
  Table
} from "reactstrap";
import { getAllPatient, getOrgPatient } from '../../slices/thunk';
import roomImage from './../../assets/images/roomImage.svg';
import bedImage from './../../assets/images/bedImage.jpg';
import patientImage from './../../assets/images/patientImage.png'
import {
  getAllBedAssign
} from "../../slices/bedAssign/thunk";
import { getAllBed } from "../../slices/patientAssign/thunk";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faBed, faDoorOpen, faPencil } from '@fortawesome/free-solid-svg-icons';
import { AssignmentInd, Bed, BedOutlined, BedRounded, BedSharp } from '@mui/icons-material';
import { Button } from 'primereact/button';
import { HttpLogin } from '../../utils/Http';
import { BrowserMultiFormatReader } from '@zxing/library';
import { ModalTitle } from 'react-bootstrap';

interface DropdownItem {
  id: string;
  value: string;
  type: string;
}

interface BedFormData {
  id: string;
  bedId: string;
  pid: string;
  orgId: string;
}

interface Dropdown {
  id: string;
  dropdown: string;
  list: DropdownItem[];
}

interface DropdownResponse {
  message: {
    code: string;
    description: string;
  };
  data: Dropdown[];
}

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  mrNumber: string;
  email: string;
  deviceId: string;
}
interface PatientCreationFormProps {
  modal: boolean;
  toggle: () => void;
}
const PatientCreation: React.FC<PatientCreationFormProps> = ({ modal, toggle }) => {
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  let [genderDropDown, setGenderDropDown] = useState(new Array<any>());
  let [stateDropDown, setStateDropDown] = useState(new Array<any>());
  let [countryDropDown, setCountryDropDown] = useState(new Array<any>());
  let [cityDropDown, setCityDropDown] = useState(new Array<any>());
  const { organization } = useSelector((state: any) => state.Login);
  const [bedAssignDialog, setBedAssignDialog] = useState(false);
  const [patientAndBedAssign, setPatientAndBedAssign] = useState<any[]>([]);
  const { patientData, loading } = useSelector((state: any) => state.Patient);
  const dispatch = useDispatch<any>()
  const navigate = useNavigate();
  const [bedId, setBedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [options , setOptions] = useState<any>([]);
  const [deviceIds, setDeviceIds] = useState<string[]>([]);
  const videoRef = useRef(null);
    const codeReader = new BrowserMultiFormatReader();
    const [scanning, setScanning] = useState(false);
  useEffect(() => {
    // Extract deviceIds from selectedDevices and store them in a single array
    const extractedDeviceIds = selectedDevices.map((device:any) => device.deviceId);
    setDeviceIds(extractedDeviceIds);
  }, [selectedDevices]);
  
  let [newAssignedBy, setAssignedBy] = useState<string | null>(null);
  const { bedAssignData = [] } = useSelector(
    (state: any) => state.BedAssign
  );
  let [bedSelected, setBedSelected] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<any>({
    gender: [],
    Country: [],
    state: []
  });
  useEffect(() => {
    if (scanning) {
        startScanning();
    } else {
        codeReader.reset();
    }

    return () => {
        codeReader.reset();
    };
}, [scanning]);

const startScanning = async () => {
  try {
      setScanning(true);
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0].deviceId;
      const constraints = {
          video: { deviceId: selectedDeviceId },
      };
      codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result: any, err: any) => {
              if (result) {
                  const result1 = result.getText();
                  const resultId = result1.match(/.{2}/g).join(':');
                  // Find the option corresponding to the scanned device ID
                  const scannedOption = options.find((option:any) => option.deviceId === resultId);
                  if (scannedOption) {
                    // If selectedOption is not an array, convert it to an array
                    if (!Array.isArray(scannedOption)) {
                        setSelectedOption([...selectedOption ,scannedOption]);
                    }
                    // Add the new resultId to the selectedOption array
                    // setSelectedOption([...selectedOption, resultId]);
                    console.log("resilzzz",resultId,selectedOption)
                    handleClose1();
                      const modal = document.getElementById("exampleModal");
                      if (modal) {
                          modal.classList.add("show");
                          modal.style.display = "block";
                      }
                  } else {
                      console.error("Scanned device ID not found in the options.");
                  }
              }
              if (err && err.name === "NotFoundError") {
                  console.error("No QR code found in the video feed.");
              }
              if (err) {
                  console.error("Error during scanning:", err);
              }
          },
      );
  } catch (error) {
      console.error("Error starting the scanner:", error);
  }
};

  const [show, setShow] = useState(false);

  const handleClose1 = () => { 
    setShow(false)
    setScanning(false)
    codeReader.reset()
  };


const closeModalAndRec = () => {
  setShow(false)
  setScanning(false)
  codeReader.reset()
}

  const handleQrClick = ()=> {
    if(options.length < 1)  return;
    setShow(true);
    setScanning(!scanning);
    // console.log("show modal",!show)
}
  const initFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    ssn: '',
    gender: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country:'',
    mrNumber: '',
    email: '',
    deviceId: ''
  }

  let [formValues, setFormValues] = useState(initFormData);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleCancel = () => {
    setFormValues(initFormData);
    setSelectedOption([])
    setSelectedDevices([])
    toggle();
  }


  const fetchPatientsandBedAssign = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/Q15Bed/getByOrg/${organization}`
      );

      if (response.data.data && Array.isArray(response.data.data)) {
        setPatientAndBedAssign(response.data.data);
        } else {
        console.error("Invalid data format for patients:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPatientName = (patientId: string) => {
    // console.log("patientData:", patientData);

    const selectedPatient = patientData.find((patient: any) => patient.id === patientId);

    // console.log("selectedPatient:", selectedPatient);

    if (selectedPatient) {
      if (selectedPatient.name && selectedPatient.name.length > 0) {
        const { family, given } = selectedPatient.name[0];
        const fullName = `${given} ${family}`;

        // console.log("patientName:", fullName);
        return fullName;
      } else if (selectedPatient.basicDetails && selectedPatient.basicDetails.length > 0) {
        const { family, given } = selectedPatient.basicDetails[0].name[0];
        const fullName = `${given} ${family}`;
        // console.log("patientName (using basicDetails):", fullName);
        return fullName;
      }
    }
    console.warn(`Patient data issue for ID: ${patientId}`, selectedPatient);
    return "Unknown";
  };

  useEffect(() => {
    getAllBedAssign(dispatch, organization);
    getAllBed(dispatch, organization);
  }, [dispatch, organization]);

  useEffect(() => {
    fetchPatientsandBedAssign();
    setAssignedBy(window.localStorage.getItem("LoginData"));
    const fetchDropdownData = () => { 
        HttpLogin.axios().get(`/api/dropdowns/get-all`)
        .then((response) => {
            if (response.data.data !== null && response.data.data !== 'MHC - 0200') {     
              let newGenderDropDown: [] | any ;                  
              newGenderDropDown = response.data.data !== null && response.data.data.length > 0 && response.data.data.filter((k:any) => k.dropdown === "gender").map((i:any) => { return i.list })         
          setGenderDropDown(newGenderDropDown !== null && newGenderDropDown !== undefined ? newGenderDropDown[0].map((k:any) => { return k.value }):[]);
            }

        })   
      }      
    fetchDropdownData();
  }, []);

  const handleSaveClick = async () => {
    if (!formValues.email) {
      toast.error("Please Enter Email Address")
      return;
    }  if (formValues.postalCode.length > 0 && formValues.city === "" && formValues.state === "") {
      formValues.city = "";
      formValues.state = "";
      formValues.country = "";
      toast.error("Please Enter Valid Zip Code");
      return;
    } else if (!emailRegex.test(formValues.email)) {
      toast.error("Invalid Email Address")
      return;
    }
    // console.log("Organization:", organization);
    const zipcode = {
      Postalcode: "",
      country: "",
      city: "",
      state: ""
    }
    const requestBody = {
      id: "",
      active: "",
      resource: [
        {
          fullUrl: "",
          resourceType: ""
        }
      ],
      basicDetails: [
        {
          coding: [
            {
              system: "",
              code: "",
              display: ""
            }
          ],
          name: [
            {
              use: formValues.middleName,
              given: formValues.firstName,
              family: formValues.lastName,
            }
          ],
          gender: formValues.gender || '',
          birthDate: formValues.birthDate,
          mrNumber: formValues.mrNumber,
          ssn: formValues.ssn,
          profile: "",
          licenseId: "",
          confirmEmail: "",
          get_birthDate: [
            {
              extension: [
                {
                  url: ""
                }
              ]
            }
          ],
          maritalStatus: "",
          sexualOrientation: ""
        }
      ],
      email: formValues.email,
      organization,
      deviceId1:deviceIds,
      contact: [
        {
          address: [
            {
              addressLine1: formValues.addressLine1,
              addressLine2: formValues.addressLine2,
              city: formValues.city,
              state: formValues.state || '',
              postalCode: formValues.postalCode,
              country: formValues.country || ''
            }
          ],
          motherName: "",
          firstName: "",
          lastName: "",
          homePhone: "",
          workPhone: "",
          mobilePhone: "",
          contactEmail: "",
          trustedEmail: "",
          emergency: [
            {
              relationShip: "",
              emergencyContact: "",
              emergencyPhone: ""
            }
          ],
          additionalAddress: [
            {
              addressUse: "",
              addressType: "",
              startDate: "",
              endDate: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              district: "",
              state: "",
              postalCodeNumber: "",
              Country: ""
            }
          ]
        }
      ],
      userType: "",
      employer: [
        {
          occupation: "",
          city: "",
          state: "",
          postalCode: "",
          Country: "",
          unassignedUSA: "",
          industry: "",
          addressLine1: "",
          addressLine2: ""
        }
      ],
      guardian: [
        {
          name: "",
          relationship: "",
          gender: "",
          address: [
            {
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              postalCode: "",
              Country: ""
            }
          ],
          workPhone: "",
          email: ""
        }
      ],
      misc: [
        {
          dateDeceased: "",
          reason: ""
        }
      ],
      stats: [
        {
          languageDeclined: true,
          ethnicityDeclined: true,
          raceDeclined: true,
          language: "",
          ethnicity: "",
          race: "",
          familySize: 0,
          financialReviewDate: "",
          monthlyIncome: "",
          homeless: "",
          interpreter: "",
          migrant: "",
          referralSource: "",
          religion: "",
          vfc: ""
        }
      ],
      insurance: [
        {
          primary: [
            {
              planName: "",
              subscriber: "",
              effectivedate: "",
              relationship: "",
              policyNumber: "",
              birthDate: "",
              groupNumber: "",
              ss: "",
              subscriberEmployee: "",
              subscriberPhone: "",
              city: "",
              state: "",
              Country: "",
              zipCode: "",
              gender: "",
              subscriberAddress: [
                {
                  addressLine1: "",
                  addressLine2: "",
                  city: "",
                  state: "",
                  Country: "",
                  zipCode: ""
                }
              ],
              co_pay: "",
              acceptAssignment: "",
              title: "",
              seaddress: ""
            }
          ],
          secondary: [
            {
              insuranceDetails: {
                planName: "",
                subscriber: "",
                effectivedate: "",
                relationship: "",
                policyNumber: "",
                birthDate: "",
                groupNumber: "",
                ss: "",
                subscriberEmployee: "",
                subscriberPhone: "",
                city: "",
                state: "",
                Country: "",
                zipCode: "",
                gender: "",
                subscriberAddress: [
                  {
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    Country: "",
                    zipCode: ""
                  }
                ],
                co_pay: "",
                acceptAssignment: "",
                title: "",
                seaddress: ""
              }
            }
          ]
        }
      ],
      familyHealth: [
        {
          id: "",
          name: "",
          deceadsed: "",
          diabetes: "",
          disease: "",
          stroke: "",
          mentalIllness: "",
          cancer: "",
          unknown: "",
          other: ""
        }
      ],
      socialHistory: [
        {
          smoker: "",
          smokePerDay: 0,
          everSmoked: "",
          smokeYears: 0,
          quitYear: 0,
          quitIntrest: "",
          drinkAlcohal: "",
          recreationalDrugs: "",
          pastAlcohal: "",
          tabaccoUse: "",
          usingTime: 0,
          partner: "",
          sexInfection: "",
          caffine: "",
          migrantOrSeasonal: "",
          usePerDay: 0,
          occupation: "",
          maritalStatus: "",
          child: "",
          noOfChild: 0,
          childAge: [
            ""
          ],
          sexActive: ""
        }
      ],
      primaryCarePhysician: [
        {
          id: "",
          primaryCarePhysician: "",
          phoneNo: "",
          medicalClinicName: "",
          fax: "",
          clinicAddress: "",
          notifyprimaryCarePhysician: true,
          patientSignature: "",
          psDateTime: "",
          guardianSignature: "",
          gsDateTime: "",
          releaseOfInformation: "",
          informationDateTime: "",
          faxed: ""
        }
      ],
      deviceId: formValues.deviceId,
      devices: [
        {
          id: "",
          deviceId: "",
          companyName: "",
          brandName: "",
          gmdnPTName: "",
          snomedCTName: "",
          dateTime: "",
          batch: "",
          serialNumber: "",
          identificationCode: true,
          mriSaftyStatus: "",
          containsNRL: true,
          status: ""
        }
      ],
      password: "",
      username: ""

    };
    

    try {
      const response = await axios.post(`${baseURL}/patient/register`, requestBody);
      // console.log('API response:', response.data);
      // console.log('Request : ', requestBody)
      if (response.data.message && response.data.message.code === 'MHC - 0200') {
        const requestBody = {
          bedId: bedId,
          pid: response.data.data.id,
          assignedBy: newAssignedBy,
          admitDate: new Date().toISOString().slice(0, 10).replace(/-/g, "")
        };

        handleCancel()

        // console.log("Request Payload:", JSON.stringify(requestBody));

        try {
          const response = await axios.post(
            `${baseURL}/Q15Bed/assign`,
            requestBody
          );

          // console.log("API bedassign Response:", response.data);

          if (
            response.data.message &&
            response.data.message.code === successCode
          ) {
            getAllBedAssign(dispatch, organization);
            getAllBed(dispatch, organization)
            getAllPatient(dispatch, organization);
            getOrgPatient(dispatch,organization)
            toast.success(response.data.message.description)
            toggle()
          } else {
            console.error("Error:", response.data.message);
            // alert(`Error: ${response.data.message.description}`);
          }
        } catch (error) {
          console.error("API Request Error:", error);
          // alert("An error occurred. Please check console for details.");
        } finally {
        }
      } else {
        toast.error(`Error: ${response.data.message.description}`);
      }
    } catch (error) {
      // console.log('Request : ', requestBody)
      console.error('Error:', error);
      
      // console.log(requestBody)
    }
  };

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    gender: false,
    Country: false,
  });

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, dropdownName: string) => {
    setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value as string[] });
    setOpenState({ ...openState, [dropdownName]: false });
  };
  const selectedPatientId = patientData?.id;

  const handleClick = (selectedBed: any) => {
    setBedSelected(selectedBed.roomNo + "-" + selectedBed.bedNo);
    const bedAssignId = selectedBed.id || " ";
    setBedId(bedAssignId);
    setBedAssignDialog(false);
  };
  const [formValuesf, setFormValuesf] = useState({ city: '', state: '', postalCode: '', country: '' });

  const fetchCity = async (postalCode: any) => {

  };

  const handlePostalCodeChange = async (e: any) => {
    formValues.postalCode = e.target.value;
    // console.log(JSON.stringify(e.target.value.length));
    if (e.target.value.length === 5) {
      try {
        const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?codes=${e.target.value}&country=US&${Constants.apiKey}`);       
        formValues.state = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].state:"";       
        formValues.country = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].country_code:"";  
        formValues.city = response.data.query.codes !== null && response.data.query.codes !== undefined  ? response.data.results[response.data.query.codes[0]][0].city:"";            
        setCityDropDown(response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]].map((k:any) => k.city_en):[])
      
      } catch (error) {
        console.error('Error fetching city:', error);
      }
    } else{
      formValues.state = "";
      formValues.country = "";
      formValues.city = "";
    }  
    setFormValues({ ...formValues});
  };
  
  const handleinputchange = (event: any) => {
    if (event.target.id === 'firstname') {
      formValues.firstName = event.target.value;
    } else if (event.target.id === 'middlename') {
      formValues.middleName = event.target.value;
    } else if (event.target.id === 'lastname') {
      formValues.lastName = event.target.value;
    } else if (event.target.id === 'MrNumber') {
      formValues.mrNumber = event.target.value;
    } else if (event.target.id === 'ssn') {
      formValues.ssn = event.target.value;
    } else if (event.target.id === 'email') {
      formValues.email = event.target.value;
    } else if (event.target.id === 'addressline1') {
      formValues.addressLine1 = event.target.value;
    } else if (event.target.id === 'addressline2') {
      formValues.addressLine2 = event.target.value;
    } else if (event.target.id === 'city') {
      formValues.city = event.target.value;
    } else if (event.target.id === 'state') {
      formValues.state = event.target.value;
    } else if (event.target.id === 'country') {
      formValues.country = event.target.value;
    }
    setFormValues({...formValues});
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOptionChange = (event:any) => {
    setSelectedOption(event.target.value);
  };

  const handleAddDevices = () => {
    setSelectedDevices(selectedOption);
    setOpen(false);
  };

  const handleRemoveDevice = (deviceId:any) => {
    setSelectedDevices(selectedDevices.filter((device:any) => device.deviceId !== deviceId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/sensor/getAllByorgId/${organization}`);
        setOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} centered size='lg'>
        <div className="d-flex align-items-center justify-content-center vh-90">
          <div className='row'>
            <div className='container col-md-12'>

              {/* <div className="d-flex justify-content-center align-items-center">
                <h3 className="mt-1">Patient Register</h3>
              </div> */}
              <ModalHeader toggle={toggle}>
                  Patient Register
                </ModalHeader>
              <ModalBody style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <div className="row w-100 " style={{ marginTop: '10px' }}>
                <div className='col-md-4 mb-2'>
                  <TextField id="firstname" label="First Name" variant="outlined" fullWidth value={formValues.firstName} onChange={handleinputchange} />
                </div>
                <div className='col-md-4 mb-2'>
                  <TextField id="middlename" label="Middle Name" variant="outlined" fullWidth value={formValues.middleName} onChange={handleinputchange} />
                </div>
                <div className='col-md-4 mb-2'>
                  <TextField id="lastname" label="Last Name" variant="outlined" fullWidth value={formValues.lastName} onChange={handleinputchange} />
                </div>
              </div>

              <div className="row w-100">
                <div className='col-md-4 mb-2'>
                <Autocomplete
                            id="natureOfReaction"
                            options={genderDropDown}
                            value={formValues.gender}
                            getOptionLabel={(option) => option}
                            onChange={(e, v) => { formValues.gender = v; setFormValues({ ...formValues }); }}
                            sx={{ width: "100%" }}
                            size="medium"
                            renderInput={params =>
                                <TextField
                                    name="natureOfReaction"
                                    {...params}
                                    variant="outlined"
                                    label="Gender"
                                    placeholder="Nature of Reaction"
                                    margin="none"
                                    size="medium"
                                    fullWidth
                                />
                            }
                        />
                </div>
                <div className='col-md-4 mb-2' >
                  {/* <TextField id="outlined-basic-2" label="Date of Birth" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, birthDate: e.target.value })} /> */}
                  <DatePicker
                    label={'Date Of Birth'}
                    format='DD-MM-YYYY'
                    onChange={(date: any) => {
                      // console.log(formatDateToYYYYMMDD(date))
                      setFormValues({ ...formValues, birthDate: formatDateToYYYYMMDD(date) })
                    }}
                  />
                </div>
                <div className='col-md-4 mb-2'>
                  <TextField id="MrNumber" label="MrNumber" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, mrNumber: e.target.value })} />
                </div>
              </div>
              <div className='row w-100'>
                <div className='col-md-6 mb-2'>
                  <TextField id="ssn" label="SSN" variant="outlined" value={formatSSN(formValues.ssn)} fullWidth onChange={(e) => setFormValues({ ...formValues, ssn: e.target.value })} />
                </div>
                <div className='col-md-6 mb-2'>
                  <TextField id="email" label="Email" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
                </div>
              </div>

              <div className="row w-100 ">

                <div className='col-md-6 mb-2'>
                  <TextField id="addressline1" label="Address Line 1" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, addressLine1: e.target.value })} />
                </div>
                <div className='col-md-6 mb-2'>
                  <TextField id="addressline2" label="Address Line 2" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, addressLine2: e.target.value })} />
                </div>
              </div>

              <div className="row w-100 ">
                <div className='col-md-4 mb-2'>
                  <TextField
                    id="zipcode"
                    label="Zip/Postal Code"
                    variant="outlined"
                    fullWidth
                    value={formValues.postalCode}
                    onChange={handlePostalCodeChange}
                  />

                </div>
                <div className='col-md-4 mb-2'>

                {cityDropDown !== null && cityDropDown.length === 1 ?
                  <TextField
                  id="city"
                  label="City"
                  variant="outlined"
                  fullWidth
                  value={formValues.city}
                  onChange={handleinputchange}
                /> :
                  <Autocomplete
                            id="city"
                            options={cityDropDown}
                            value={formValues.city}
                            getOptionLabel={(option) => option}
                            onChange={(e, v) => { formValues.city = v; setFormValues({ ...formValues }); }}
                            sx={{ width: "100%" }}
                            size="medium"
                            renderInput={params =>
                                <TextField
                                    name=""
                                    {...params}
                                    variant="outlined"
                                    label="City"
                                    placeholder=""
                                    margin="none"
                                    size="medium"
                                    fullWidth
                                />
                            }
                        />}
                </div>
                <div className='col-md-4 mb-2'>
                <TextField
                    id="state"
                    label="State"
                    variant="outlined"
                    fullWidth
                    value={formValues.state}
                    onChange={handleinputchange}
                  />                  
                </div>
                
              </div>

              <div className="row w-100 ">
                <div className='col-md-6 mb-2'>
                <TextField
                    id="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={formValues.country}
                    onChange={handleinputchange}
                  />    
                </div>
                <div className="col-md-6 mb-2" style={{ textAlign: 'end' }}>
                  <TextField
                    label="Room-Bed"
                    type="text"
                    placeholder=''
                    margin="none"
                    fullWidth
                    value={bedSelected ? bedSelected : ""}
                    disabled={true}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => { setBedAssignDialog(true) }} edge="end">
                          <Bed />
                        </IconButton>
                      )
                    }}
                  />
                </div>
              </div>
              <div className="row w-100 ">
                <div className='col-md-6 mb-2' style={{ position: 'relative' }}>
                {/* <table className="table table-bordered my-1" style={{ fontSize: '13px' }}>
        <thead style={{ backgroundColor: "#F8FAFB" }}>
          <tr>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Device ID</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Device Type</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedDevices.map((device:any) => (
            <tr key={device.id}>
              <td className="text-center">{device.deviceId}</td>
              <td className="text-center">{device.deviceType}</td>
              <td className="text-center d-flex justify-content-around align-items-center">
                <Tooltip title="Remove" arrow>
                  <FontAwesomeIcon icon={faBan} className="text-danger" style={{ cursor: "pointer" }} onClick={() => handleRemoveDevice(device.deviceId)} />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
          <Select
  multiple
  value={selectedOption}
  onChange={handleOptionChange}
  fullWidth
  style={{ minWidth: '300px', minHeight: '50px' }}
  IconComponent={() => (
    <FaQrcode
      className="position-absolute bottom-0 m-3" onClick={handleQrClick}
      role='button'
      style={{ fontSize: '1.2rem', color: '#000', right: '0', cursor: 'pointer' }}
    />
  )}
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: '300px', // Maximum height for the dropdown menu
      },
    },
  }}
>
  {options.map((option: any) => (
    <MenuItem key={option.id} value={option}>
      {option.deviceId}
    </MenuItem>
  ))}
</Select>


</ListItem>
          </List>
                </div>
              </div>
              </ModalBody>
            </div>
            <ModalFooter className="">
                <div className="d-flex gap-3 justify-content-center">
                  <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7', fontSize: '12px', fontWeight: 'bold' }} onClick={handleCancel}></Button>
                  <Button label="Save Changes" style={{ backgroundColor: '#0f3995', fontSize: '12px', fontWeight: 'bold' }} onClick={handleSaveClick}></Button>
                </div>
              </ModalFooter>

              <ToastContainer />
          </div>
        </div>
      </Modal >
      <Dialog maxWidth={'xl'} PaperProps={{ sx: { width: '90%', maxWidth: '90%', position: 'absolute', height: '95vh', top: '1px'} }}
        open={bedAssignDialog}
        onClose={() => setBedAssignDialog(false)}
      >
        <DialogTitle>All Beds</DialogTitle>
        <DialogContentText >
          <DialogContent style={{ padding: '20px', background: '#F8FAFB' }}>
            <div>
              <Row style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-evenly' }}>
                {Array.isArray(patientAndBedAssign) && patientAndBedAssign.length > 0 ? (
                  patientAndBedAssign.map((bedassign: any, index: number) => (
                    bedassign.pid !== null ? <>
                      <Col key={bedassign.id} style={{ flex: 0, padding: 0 }}>
                        <div className="bed-assignment-box">
                          <Card
                            className="mb-3"
                            color="danger"
                            outline
                            style={{
                              width: "92px",
                              height: "70px",
                              margin: "5px",
                              justifyContent: "flex-start",
                            }}
                          >
                            <CardBody
                              key={index}
                              className="d-flex gap-1"
                              style={{ cursor: 'pointer', padding: '0.6rem' }}
                            >
                              <CardTitle tag="h6">
                                <FontAwesomeIcon icon={faDoorOpen} style={{ width: '15px', height: '20px' }} />
                                <span style={{ marginLeft: '3px', fontSize: '12px', fontWeight: 'bold' }}>{bedassign.roomNo}</span>
                                {/* <img src={roomImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.roomNo}</span> */}
                              </CardTitle>
                              <CardSubtitle tag="h6" className="mb-2 text-muted">
                                <FontAwesomeIcon icon={faBed} style={{ width: '12px', height: '20px' }} />
                                <span style={{ marginLeft: '3px', fontSize: '12px', fontWeight: 'bold' }}>{bedassign.bedNo}</span>
                                {/* <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.bedNo}</span> */}
                              </CardSubtitle>
                            </CardBody>
                            <CardFooter style={{ padding: '0.2rem', position: 'relative', display: 'flex', top: '-13px', height: '25px', fontSize: '10px', fontWeight: 'bold', lineHeight: 'normal' }}>
                              <img src={patientImage} style={{ width: '20px', height: '20px' }}></img><span style={{ paddingLeft: '5px' }}>{getPatientName(bedassign.pid)}</span>
                            </CardFooter>
                          </Card>
                        </div>
                      </Col>
                    </> : <>
                      <Col key={index} style={{ flex: 0, padding: 0 }}>
                        <div className="bed-assignment-box">
                          <Card
                            className="mb-3"
                            color="primary"
                            outline
                            style={{
                              width: "92px",
                              height: "70px",
                              margin: "5px",
                              justifyContent: "flex-start",
                            }}
                          >
                            <CardBody
                              key={index}
                              className="d-flex gap-1"
                              onClick={() => handleClick(bedassign)}
                              style={{ cursor: "pointer", padding: '0.6rem' }}
                            >
                              <CardTitle tag="h6">
                                <FontAwesomeIcon icon={faDoorOpen} style={{ width: '15px', height: '20px' }} />
                                <span style={{ marginLeft: '3px', fontSize: '12px', fontWeight: 'bold' }}>{bedassign.roomNo}</span>
                                {/* <img src={roomImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.roomNo}</span> */}
                              </CardTitle>
                              <CardSubtitle tag="h6" className="mb-2 text-muted">
                                <FontAwesomeIcon icon={faBed} style={{ width: '12px', height: '20px' }} />
                                <span style={{ marginLeft: '3px', fontSize: '12px', fontWeight: 'bold' }}>{bedassign.bedNo}</span>
                                {/* <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.bedNo}</span> */}
                              </CardSubtitle>
                            </CardBody>

                            <CardFooter style={{ padding: '0.6rem', position: 'relative', top: '-13px', height: '25px', paddingTop: '5px', paddingLeft: '13px' }}>
                              <Badge
                                style={{ fontSize: '10px' }}
                                color={bedassign.pid ? "danger" : "success"}
                                tag="h4"
                              >
                                {bedassign.pid ? "Not Available" : "Available"}
                              </Badge>
                              {/* <FontAwesomeIcon
                          icon={faTrash}
                          className="text-danger outline"
                          onClick={() => handleDelete(bedassign.id)}
                          style={{ cursor: "pointer", marginLeft: "20%" }}
                        /> */}
                            </CardFooter>
                          </Card>
                        </div>
                      </Col></>
                  ))
                ) : (
                  <p>No bed assignments available.</p>
                )}
              </Row></div>
          </DialogContent>
        </DialogContentText>
      </Dialog>
      <Modal isOpen={show} toggle={handleClose1}>
                <ModalHeader toggle={handleClose1}>Scanning</ModalHeader>
                <ModalBody>
                    <video ref={videoRef} style={{ display: scanning ? "block" : "none", width: '100%', height: '400px' }} />
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="secondary" onClick={handleClose1}>Close</Button>
                    <Button color="primary" onClick={closeModalAndRec}>
                        {scanning ? "Stop Scanning" : "Start Scanning"}
                    </Button> */}
                    <div className="d-flex gap-3 justify-content-center">
                  <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7', fontSize: '12px', fontWeight: 'bold' }} onClick={handleClose1}></Button>
                  <Button label={scanning ? "Stop Scanning" : "Start Scanning"} style={{ backgroundColor: '#0f3995', fontSize: '12px', fontWeight: 'bold' }} onClick={closeModalAndRec}></Button>
                </div>
                </ModalFooter>
            </Modal>
    </>
  );
};

export default PatientCreation;