import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getOrgPatient,
  updatePatientDetails,
  patientDischarge,
  getAllBedAssign,
  getAllBed,
  getAllPatient,
} from "../../slices/thunk";
import { FaPlus, FaPlusSquare, FaSearch,  } from "react-icons/fa";
import dischargeIcon from '../../assets/images/admit2.png';
import { GoPersonAdd }from "react-icons/go";
import { Pagination } from "react-bootstrap";
import 
{
  Table,Modal,ModalFooter, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardFooter, Badge, ModalBody, ModalHeader
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import "./patient.css";
// import PatientCreation from "./";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { baseURL, successCode } from "../../configuration/url";
import patientImage from './../../assets/images/patientImage.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBed, faDoorOpen, faPencil } from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";
import axios from 'axios';
import * as Constants from "../Constants/Constant";
import { HttpLogin } from "../../utils/Http";
import { toast } from "react-toastify";
import PatientCreation from "../Patient/patientCreation";
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
  beaconDevice: string;
  gender: string;
  country: string;

}
interface DropdownItem {
  id: string;
  value: string;
  type: string;
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
const Patient: React.FC = () => {
  const [modal,setModal]=useState(false);
  const toggle=()=>{
    setModal(!modal);
  }
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const [search,setSearch]=useState("");
  const dispatch = useDispatch<any>();
  let [genderDropDown, setGenderDropDown] = useState(new Array<any>());
  const [selectPatientId, setSelectPatientId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const { allPatientData, loading } = useSelector((state: any) => state.Patient);
  const { organization } = useSelector((state: any) => state.Login);
  const [bedAssignDialog, setBedAssignDialog] = useState(false);
  let [bedSelected, setBedSelected] = useState<string | null>(null);
  const [bedClick, setBedClick] = useState(false)
  const [patientAndBedAssign, setPatientAndBedAssign] = useState<any[]>([]);
  const { patientData } = useSelector((state: any) => state.Patient);
  const navigate = useNavigate();
  const [bedId, setBedId] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  let [cityDropDown, setCityDropDown] = useState(new Array<any>());
  let [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    ssn: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    mrNumber: "",
    email: "",
    beaconDevice: "",
    gender: "",
    country: "",
  });

  useEffect(() => {
    getOrgPatient(dispatch, organization);
  }, [dispatch, organization]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [filteredRecords,setFilteredRecords]=useState<any[]>([]);
  const currentallPatientData =filteredRecords.slice(indexOfFirstItem,indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const renderPageNumbers = () => {
    const totalPages = Math.ceil(allPatientData?.length / itemsPerPage);

    const pageNumbersToShow = Math.min(5, totalPages);

    let startPage: number;
    let endPage: number;

    if (totalPages <= pageNumbersToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middlePage = Math.ceil(pageNumbersToShow / 2);

      if (currentPage <= middlePage) {
        startPage = 1;
        endPage = pageNumbersToShow;
      } else if (currentPage + middlePage >= totalPages) {
        startPage = totalPages - pageNumbersToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - middlePage + 1;
        endPage = currentPage + middlePage - 1;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
      <Pagination.Item
        key={startPage + index}
        active={startPage + index === currentPage}
        onClick={() => paginate(startPage + index)}
      >
        {startPage + index}
      </Pagination.Item>
    ));
  };
useEffect(()=>{
  setCurrentPage(1);
},[allPatientData]);

const fetchPatientsandBedAssign = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/Q15Bed/getByOrg/${organization}`
    );

    if (response.data.data && Array.isArray(response.data.data)) {
      // console.log(JSON.stringify());
      setPatientAndBedAssign(response.data.data);
      // setPatientAndBedAssign(response.data.data.sort((a:any, b:any) => (parseInt(a.roomNo) > parseInt(b.roomNo)) ? 1 : -1));
    } else {
      console.error("Invalid data format for patients:", response.data);
    }
  } catch (error) {
    console.log(error);
  }
};
let [newAssignedBy, setAssignedBy] = useState<string | null>(null);

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

}, []);

useEffect(() => {
  const filteredallPatientData = allPatientData?.filter((patient: any) => {
    const basicDetails = patient.basicDetails[0];
    if (!basicDetails) return false;

    const name = basicDetails.name[0];
    if (!name) return false;

    const given = name.given;
    const birthDate = basicDetails.birthDate;
    const ssn = basicDetails.ssn;
    const beaconDevice = patient.beaconDevice;
    const email = patient.email;

    return (
      (given && given.toLowerCase().includes(search?.toLowerCase())) ||
      (birthDate && birthDate.toString().toLowerCase().includes(search?.toLowerCase())) ||
      (ssn && ssn.toString().toLowerCase().includes(search?.toLowerCase())) ||
      (beaconDevice && beaconDevice.toLowerCase().includes(search?.toLowerCase())) ||
      (email && email.toLowerCase().includes(search?.toLowerCase()))
    );
  });

  setFilteredRecords(filteredallPatientData);
}, [search, allPatientData]);
  
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };
  const handlePostalCodeChange = async (e: any) => {
    formData.postalCode = e.target.value;
    // console.log(JSON.stringify(e.target.value.length));
    if (e.target.value.length === 5) {
        try {
            const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?codes=${e.target.value}&country=US&${Constants.apiKey}`);
            formData.state = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].state : "";
            formData.country = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].country_code : "";
            formData.city = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].city : "";
            setCityDropDown(response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]].map((k: any) => k.city_en) : [])


        } catch (error) {
            console.error('Error fetching city:', error);
        }
    }else{
      formData.state = "";
      formData.country = "";
      formData.city = "";
    }
    setFormData({ ...formData });
};

const handleAddress = (e:any) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleinputchange = (event: any) => {
  if (event.target.id === 'firstName') {
    formData.firstName = event.target.value;
  } else if (event.target.id === 'middleName') {
    formData.middleName = event.target.value;
  } else if (event.target.id === 'lastName') {
    formData.lastName = event.target.value;
  } else if (event.target.id === 'mrNumber') {
    formData.mrNumber = event.target.value;
  } else if (event.target.id === 'ssn') {
    formData.ssn = event.target.value;
  } else if (event.target.id === 'email') {
    formData.email = event.target.value;
  } else if (event.target.id === 'addressLine1') {
    formData.addressLine1 = event.target.value;
  } else if (event.target.id === 'AddressLine2') {
    formData.addressLine2 = event.target.value;
  } else if (event.target.id === 'city') {
    formData.city = event.target.value;
  } else if (event.target.id === 'state') {
    formData.state = event.target.value;
  } else if (event.target.id === 'country') {
    formData.country = event.target.value;
  }
  setFormData({...formData});
}
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    
    country: false,
    state: false,
  });
  const [selectedValues, setSelectedValues] = useState<any>({
    
    country: [],
    state: [],
  });
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${baseURL}/dropdowns/get-all`);
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === 'MHC - 0200') {
          setDropdownData(data.data);
          // console.log('Fetched data:', data.data);
        } else {
          console.error('Error fetching dropdown data:', data.message.description);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);
  
  const handleBedClick = (selectedBed: any) => {
    setBedSelected(selectedBed.roomNo + "-" + selectedBed.bedNo);
    const bedAssignId = selectedBed.id || " ";
    setBedId(bedAssignId);
    // setBedAssignDialog(false);
    setBedClick(!bedClick)
  };

  const handleDioCancel = () => {
    setBedAssignDialog(false);
    setBedClick(false);
  }

  const handleSave = async() => {
    try {
      const requestBody = {
        bedId: bedId,
        pid: selectPatientId,
        assignedBy: newAssignedBy,
        admitDate: new Date().toISOString().slice(0, 10).replace(/-/g, "")
      };
      const response = await axios.post(
        `${baseURL}/Q15Bed/assign`,
        requestBody
      );
      // console.log("API bedassign Response:", response.data);
      if (
        response.data.message &&
        response.data.message.code === successCode
      ) {
        getOrgPatient(dispatch, organization);
        getAllPatient(dispatch,organization);
        toast.success(response.data.message.description)
        setBedAssignDialog(false)
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("API Request Error:", error);
    }
  }
  const handleSaveChanges = () => {
    // console.log("Form Data:", formData);
    if (!selectPatientId) {
      console.error("Selected Patient ID is not found");
      return;
    }else if (formData.postalCode.length > 0 && formData.city === "" && formData.state === "") {
      formData.city = "";
      formData.state = "";
      formData.country = "";
      alert("Please Enter Valid Zip Code");
      return;
    }
    const updatedPatientFields = {
      id: selectPatientId,
      basicDetails: [
        {
          name: [
            {
              use: formData.middleName,
              given: formData.firstName,
              family: formData.lastName,
            },
          ],
          ssn: formData.ssn,
          mrNumber: formData.mrNumber,
          gender: formData.gender,
          birthDate: formData.birthDate,
        },
      ],
      email: formData.email,
      organization,
      contact: [
        {
          address: [
            {
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
            },
          ],
        },
      ],
      beaconDevice: formData.beaconDevice,
    };
    // console.log("Before Update:", allPatientData);
    dispatch(
      updatePatientDetails(
        selectPatientId,
        updatedPatientFields,
        //setEditModal,
        organization
      )
    );

    // console.log("After Update:", updatedPatientFields);
    setEditModal(false);
  };

  useEffect(() => {
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

  const handleClick = (selectedPatient: any) => {
    // console.log("Clicked patient Details:", selectedPatient);

    if (selectedPatient) {
      const patientId = selectedPatient.id || "";
      setSelectPatientId(patientId);
      // console.log("Patiend ID:", patientId);
      const basicDetails = selectedPatient.basicDetails[0];
      const address = selectedPatient.contact[0]?.address[0];

      setFormData({
        firstName: basicDetails.name[0]?.given || "",
        middleName: basicDetails.name[0]?.use || "",
        lastName: basicDetails.name[0]?.family || "",
        birthDate: basicDetails.birthDate || "",
        ssn: basicDetails.ssn || "",
        addressLine1: address?.addressLine1 || "",
        addressLine2: address?.addressLine2 || "",
        city: address?.city || "",
        state: address?.state || "",
        postalCode: address?.postalCode || "",
        mrNumber: basicDetails.mrNumber || "",
        email: selectedPatient.email || "",
        beaconDevice: selectedPatient.beaconDevice || "",
        gender: basicDetails.gender || "",
        country: address?.country || "",
      });

      setEditModal(true);
    } else {
      console.error("Invalid patient data:", selectedPatient);
    }
  };
  
  return (
    <div className="container m5 p3" style={{ width: '90%' }}>
      <div className="row" style={{ position: "relative" }}>
            <div className="col-md-8 d-flex align-items-center">
          </div>
          <div className="col-md-4 d-flex justify-content-end align-items-center gap-2 mb-2">
                  {/* <p onClick={toggle} style={{cursor:'pointer'}} className="mb-0">Create</p> */}
                  <div className="mx-0 search-container d-flex align-items-center">
              <input
                type="text"
                placeholder="Search..."
                className="search form-control"
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
            <FaPlusSquare
                data-bs-target="#exampleModal"
                style={{ cursor: "pointer", fontSize: '30px', color:'#1F489F' }}
                // onClick={() => navigate("/patient-register")}
                onClick={toggle}
              />
        </div>
    
      <table className="table table-bordered" style={{fontSize: '13px'}}>
        <thead style={{ backgroundColor: "#F8FAFB" }}>
          <tr>
          <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>S.No</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Patient Name</th>
            {/* <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Patient ID</th> */}
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>SSN</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Beacon Device</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Room No - Bed No</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentallPatientData
            .map((patient: any, index: number) => (
              <tr key={index}>
                <td className="text-center">{ indexOfFirstItem+index + 1}</td>
                <td
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleClick(patient)
                }
                  className="text"
                >
                  {patient.basicDetails[0].name[0].given}{" "}
                  {patient.basicDetails[0].name[0].family}
                </td>
                <td className="text-center">{patient.basicDetails[0].ssn}</td>
                <td className="text-center">{patient.beaconDevice}</td>
                <td className="text-center">{patient.assignedBed}</td>
                <td className="text-center d-flex justify-content-around align-items-center">
                <Tooltip title="Edit" arrow>
                  <FontAwesomeIcon
                      icon={faPencil}
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleClick(patient)
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Admit " arrow>
                    <img
                      src={dischargeIcon}
                      alt="Discharge Icon"
                      className="text-danger"
                      style={{ cursor: "pointer",width:'18px',height:'20px' }}
                      onClick={() => { 
                        setBedAssignDialog(true); 
                        setSelectPatientId(patient.id); 
                      }}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    {currentallPatientData.length === 0 &&(
  <div className="no-records row ">
    <div className="col-md-9 text-center">
      <p>No Records Found</p>
    </div>
    <div className="col-md-3">
      <Button label="Register New Patient" style={{backgroundColor: '#0f3995',fontSize:'14px',fontWeight:'bold'}} onClick={toggle}></Button>
    </div>
  </div>
)}
<PatientCreation modal={modal} toggle={toggle}/>
    <div className="pagination-container" >
  <div className="d-flex justify-content-center">
    <Pagination>
      <Pagination.Prev
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {renderPageNumbers()}
      <Pagination.Next
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === Math.ceil(allPatientData?.length / itemsPerPage)}
      />
    </Pagination>
  </div>
</div>
    <Modal
        isOpen={editModal}
        toggle={() => setEditModal(false)}
        centered
        size="lg"
        ><div className="d-flex align-items-center justify-content-center vh-90">
      <div className="row">
      <div className="container col-md-12">
      {/* <div className="d-flex justify-content-center align-items-center">
                <h3 className="mt-1">Patient Detail</h3>
              </div>
              <hr></hr> */}
              <ModalHeader toggle={() => setEditModal(false)}>Patient Detail</ModalHeader>
              <ModalBody style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <div className="row w-100 ">
              <div className="col-md-4 mb-2">
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="col-md-4 mb-2">
                <TextField
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  placeholder="Enter Middle Name"
                  value={formData.middleName}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="col-md-4 mb-2">
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter LastName"
                  value={formData.lastName}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
            </div>
            <div className="row w-100">
            <div className="col-md-4 mt-3">
                <Autocomplete
                            id="natureOfReaction"
                            options={genderDropDown}
                            value={formData.gender}
                            getOptionLabel={(option) => option}
                            onChange={(e, v) => { formData.gender = v; setFormData({ ...formData }); }}
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
              <div className="col-md-4 mb-2">
                <TextField
                  id="birthDate"
                  name="birthDate"
                  label="Date Of Birth"
                  placeholder="Enter DateOfBirth"
                  value={formData.birthDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="col-md-4 mb-2">
                <TextField
                  id="mrNumber"
                  name="mrNumber"
                  label="MrNumber"
                  placeholder="Enter Phone Number"
                  value={formData.mrNumber}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            </div>
            <div className="row w-100">
            <div className="col-md-6 mb-2">
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            <div className="col-md-6 mb-2">
                <TextField
                  id="ssn"
                  name="ssn"
                  label="SSN"
                  placeholder="Enter SSN"
                  value={formData.ssn}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            </div>
          
            <div className="row w-100">
            <div className="col-md-4 mb-2">
                <TextField
                  id="addressLine1"
                  name="addressLine1"
                  label="AddressLine1"
                  placeholder="Enter Address"
                  value={formData.addressLine1}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            <div className="col-md-4 mb-2">
            <TextField
                    id="addressLine2"
                    name="addressLine2"
                    label="AddressLine2"
                    placeholder="Enter Address"
                    value={formData.addressLine2}
                    onChange={handleAddress}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
            </div>
          
            <div className="col-md-4 mt-3">
            <TextField
                    id="zipcode"
                    label="Zip/Postal Code"
                    variant="outlined"
                    fullWidth
                    value={formData.postalCode}
                    onChange={handlePostalCodeChange}
                  />
            </div>
            </div>
            <div className="row w-100">
            <div className="col-md-4">
                <TextField
                  id="country"
                  name="country"
                  label="Country"
                  placeholder="Enter Country"
                  value={formData.country}
                  onChange={handleinputchange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            <div className="col-md-4 mt-3">
                {/* <TextField
                  id="state"
                  name="state"
                  label="State"
                  placeholder="Enter State"
                  value={formData.state}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                /> */}
                {/* {renderDropdown('state')} */}
                <TextField
                    id="state"
                    label="State"
                    variant="outlined"
                    fullWidth
                    value={formData.state}
                    onChange={handleinputchange}
                  />   
            </div>
            <div className="col-md-4 mt-3">
            {cityDropDown !== null && cityDropDown.length === 1 ?
                 <TextField
                 id="city"
                 label="City"
                 variant="outlined"
                 fullWidth
                 value={formData.city}
                 onChange={handleinputchange}
               /> :
                  <Autocomplete
                            id="city"
                            options={cityDropDown}
                            value={formData.city}
                            getOptionLabel={(option) => option}
                            onChange={(e, v) => { formData.city = v; setFormData({ ...formData }); }}
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
            </div>
            </ModalBody>
      </div>
    </div>
  </div>
  {/* <ModalFooter>
  <Button onClick={()=>setEditModal(false)} className="btn-danger">Cancel</Button>
  <Button onClick={handleSaveChanges} className="btn-info">Save Changes</Button>
 </ModalFooter> */}
  <ModalFooter className="">
                <div className="d-flex gap-3 justify-content-center">
                <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7',fontSize:'12px', fontWeight:'bold'}} onClick={()=>setEditModal(false)}></Button>
                <Button label="Save Changes" style={{ backgroundColor: '#0f3995',fontSize:'12px',fontWeight:'bold'}} onClick={handleSaveChanges}></Button>
            </div>
          </ModalFooter>
</Modal>
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
                              onClick={() => handleBedClick(bedassign)}
                              style={{ cursor: "pointer", padding: '0.6rem',backgroundColor: (bedId === bedassign.id && bedClick) ? 'grey' : '', }}
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
                            </CardFooter>
                          </Card>
                        </div>
                      </Col>
                      </>
                  ))
                ) : (
                  <p>No bed assignments available.</p>
                )}
              </Row></div>
          </DialogContent>
        </DialogContentText>
        <div className="d-flex gap-3 mb-3 justify-content-center">
                <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7',fontSize:'12px', fontWeight:'bold'}}
                onClick={handleDioCancel}></Button>
                <Button label="Save Changes" style={{ backgroundColor: '#0f3995',fontSize:'12px',fontWeight:'bold'}} onClick={handleSave}></Button>
            </div>
      </Dialog>

      </div>
  );
};

export default Patient;