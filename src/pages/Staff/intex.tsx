import React, { useEffect, useState } from "react";
import { FaPlusSquare, FaSearch, FaUserPlus } from "react-icons/fa";
import { Pagination } from "react-bootstrap";
import "./staff.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaff, deleteStaffDetails, updateStaffDetails } from "../../slices/thunk";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ModalBody, ModalHeader, Table } from "reactstrap";
import Loader from "../../components/loader/Loader";
import { GoPersonAdd } from "react-icons/go";
import StaffCreationForm from "./staffCreation";
import { Modal, ModalFooter } from "reactstrap";
import { baseURL } from "../../configuration/url";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from 'axios';
import * as Constants from "../Constants/Constant";
import { Button } from "primereact/button";
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
interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateofBirth: string;
  ssn: string;
  npi: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  mobilePhone: string;
  email: string;
  gender: string;
  country: string;
  roles: string;
  speciality: string;
  startDate: string;
  active: string;
  userType: string;
}
const Staff: React.FC = () => {
  const [selectStaffId, setSelectStaffId] = useState<string | null>(null);
  let [cityDropDown, setCityDropDown] = useState(new Array<any>());
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<any>();
  const { staffData, loading } = useSelector((state: any) => state.Staff);
  const { organization } = useSelector((state: any) => state.Login);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(staffData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const currentStaffData = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);

  useEffect(() => {
    getAllStaff(dispatch, organization);
  }, [dispatch, organization]);

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const editToggle = () => {
    setModal(!modal);
  };
  const [editModal, setEditModal] = useState(false);
  let [formData, setFormData] = useState({
    firstName: "",
    middleName: " ",
    lastName: " ",
    dateofBirth: " ",
    ssn: " ",
    npi: " ",
    addressLine1: " ",
    addressLine2: " ",
    city: " ",
    state: " ",
    zip: " ",
    mobilePhone: " ",
    email: " ",
    gender: " ",
    country: " ",
    roles: " ",
    speciality: " ",
    startDate: " ",
    active: " ",
    userType: "",
  });
  useEffect(() => {
    setCurrentPage(1)
  }, [staffData]);

  useEffect(() => {
    const filteredStaffData = staffData.filter(
      (staff: any) =>
        (staff.name?.[0]?.given?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (staff.name?.[0]?.family?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (staff.dateofBirth?.toString()?.includes(search.toLowerCase()) || '') ||
        (staff.ssn?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
        (staff.email?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
        (staff.role?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
        (staff.userType?.toLowerCase()?.includes(search.toLowerCase()) || '')
    );
    setFilteredRecords(filteredStaffData);
  }, [search, staffData]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const renderPageNumbers = () => {

    // Define the number of page numbers to show
    const pageNumbersToShow = Math.min(5, totalPages);

    let startPage: any;
    let endPage: any;

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
  const handleSelectChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };
  const handlePostalCodeChange = async (e: any) => {
    formData.zip = e.target.value;
    console.log(JSON.stringify(e.target.value.length));
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
    } else{
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
    if (event.target.id === 'firstname') {
      formData.firstName = event.target.value;
    } else if (event.target.id === 'middlename') {
      formData.middleName = event.target.value;
    } else if (event.target.id === 'lastname') {
      formData.lastName = event.target.value;
    } else if (event.target.id === 'dateofBirth') {
      formData.dateofBirth = event.target.value;
    } else if (event.target.id === 'email') {
      formData.email = event.target.value;
    } else if (event.target.id === 'ssn') {
      formData.ssn = event.target.value;
    } else if (event.target.id === 'addressLine1') {
      formData.addressLine1 = event.target.value;
    } else if (event.target.id === 'addressline2') {
      formData.addressLine2 = event.target.value;
    } else if (event.target.id === 'city') {
      formData.city = event.target.value;
    } else if (event.target.id === 'state') {
      formData.state = event.target.value;
    } else if (event.target.id === 'mobilePhone') {
      formData.mobilePhone = event.target.value;
    } else if (event.target.id === 'npi') {
      formData.npi = event.target.value;
    }else if (event.target.id === 'userType') {
      formData.userType = event.target.value;
    }else if (event.target.id === 'speciality') {
      formData.speciality = event.target.value;
    }else if (event.target.id === 'roles') {
      formData.roles = event.target.value;
    }
    setFormData({ ...formData });
  }
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    city: false,
    country: false,
    state: false,
    roles:false
  });
  const [selectedValues, setSelectedValues] = useState<any>({
    city: [],
    country: [],
    state: [],
    roles:[],
  });
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${baseURL}/dropdowns/get-all`);
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === 'MHC - 0200') {
          setDropdownData(data.data);
          console.log('Fetched data:', data.data);
        } else {
          console.error('Error fetching dropdown data:', data.message.description);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);
  const renderDropdown = (dropdownName: string) => {
    const dropdown = dropdownData.find((item) => item.dropdown === dropdownName);

    if (!dropdown) {
      return null;
    }

    const menuStyle = {
      maxHeight: "250px",
    };

    return (
      // <FormControl
      //   sx={{ marginLeft: "3px", width: "100%" }}
      //   key={dropdownName}
      // >
      //   <InputLabel id={`demo-simple-name-label-${dropdownName}`}>
      //     {dropdownName}
      //   </InputLabel>
      //   <Select
      //     labelId={`demo-simple-name-label-${dropdownName}`}
      //     id={`demo-simple-name-${dropdownName}`}
      //     value={formData[dropdownName as keyof FormData]}
      //     onChange={(e: any) => handleSelectChange(dropdownName, e.target.value)}
      //     onClose={() =>
      //       setOpenState({ ...openState, [dropdownName]: false })
      //     }
      //     onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
      //     open={openState[dropdownName]}
      //     input={<OutlinedInput label={dropdownName} />}
      //     MenuProps={{
      //       PaperProps: {
      //         style: menuStyle,
      //       },
      //     }}
      //   >
      //     {dropdown.list.map((item: any) => (
      //       <MenuItem key={item.id} value={item.value}>
      //         {item.value}
      //       </MenuItem>
      //     ))}
      //   </Select>
      // </FormControl>
      <Autocomplete
      id={dropdownName}
      options={dropdown.list.map(item => item.value)}
      value={formData[dropdownName as keyof FormData]}
      onChange={(e, v) => handleSelectChange(dropdownName, v)}
      renderInput={(params) => (
        <TextField {...params} label={dropdownName} variant="outlined" />
      )}
    />
    );
  };
  const handleDelete = async (username: string) => {
    const confirmDelete = window.confirm("Are You Sure Do You Want To Delete?");
    if (confirmDelete) {
      try {
        await dispatch(deleteStaffDetails(username, organization));
        // toast.success("Staff Details deleted successfully");
      } catch (error) {
        console.log("Failed to delete organization");
      }
    }
  };

  const handleSaveChanges = () => {
    console.log("Form Data:", formData);
    if (!selectStaffId) {
      console.log("Selected staff ID is not found");
      return;
    }else if (formData.zip.length > 0 && formData.city === "" && formData.state === "") {
      formData.city = "";
      formData.state = "";
      formData.country = "";
      toast.error("Please Enter Valid Zip Code");
      return;
    }

    const updatedStaffFields = {
      id: selectStaffId,
      name: [
        {
          use: formData.middleName,
          given: formData.firstName,
          family: formData.lastName,
        },
      ],
      gender: formData.gender,
      email: formData.email,
      role: formData.roles,
      organization,
      startDate: formData.startDate,
      speciality: [formData.speciality],
      dateofBirth: formData.dateofBirth,
      ssn: formData.ssn,
      npi: formData.npi,
      userType: formData.userType,
      contact: [
        {
          address: [
            {
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              country: formData.country,
              zip: formData.zip,
            },
          ],
          mobilePhone: formData.mobilePhone,
        },
      ],
      active: formData.active,
    };
    console.log("Before Update:", staffData);
    dispatch(
      updateStaffDetails(
        selectStaffId,
        updatedStaffFields,
        organization,
        setEditModal,
      )
    );
    console.log("After Update:", updatedStaffFields);
    setEditModal(false);
  };
  
  const handleClick = (selectStaff: any) => {
    console.log("Clicked Staff Details:", selectStaff);
    if (selectStaff) {
      const staffId = selectStaff.id || "";
      setSelectStaffId(staffId);
      console.log("Staff ID:", staffId);
  
      const name = selectStaff.name?.[0] || {};
      const contact = selectStaff.contact?.[0]?.address?.[0] || {};
  
      setFormData({
        firstName: name.given || "",
        middleName: name.use || "",
        lastName: name.family || "",
        dateofBirth: selectStaff.dateofBirth || "",
        ssn: selectStaff.ssn || "",
        npi: selectStaff.npi || "",
        addressLine1: contact.addressLine1 || "",
        addressLine2: contact.addressLine2 || "",
        city: contact.city || "",
        state: contact.state || "",
        zip: contact.zip || "",
        mobilePhone: selectStaff.contact?.[0]?.mobilePhone || "",
        email: selectStaff.email || "",
        gender: selectStaff.gender || "",
        country: contact.country || "",
        roles: selectStaff.role || "",
        speciality: selectStaff.speciality?.[0] || "",
        startDate: selectStaff.startDate || "",
        active: selectStaff.active || " ",
        userType: selectStaff.userType || " ",
      });
  
      setEditModal(true);
    } else {
      console.error("Invalid staff data:", selectStaff);
    }
  };

  // const handleClick = (selectStaff: any) => {
  //   console.log("Clicked Staff Details:", selectStaff);
  //   if (selectStaff) {
  //     const staffId = selectStaff?.id || "";
  //     setSelectStaffId(staffId);
  //     console.log("Staff ID:", staffId);
  //     setFormData({
  //       firstName: selectStaff.name[0]?.given || "",
  //       middleName: selectStaff.name[0]?.use || "",
  //       lastName: selectStaff.name[0]?.family || "",
  //       dateofBirth: selectStaff.dateofBirth || "",
  //       ssn: selectStaff.ssn || "",
  //       npi: selectStaff.npi || "",
  //       addressLine1: selectStaff.contact[0]?.address[0]?.addressLine1 || "",
  //       addressLine2: selectStaff.contact[0]?.address[0]?.addressLine2 || "",
  //       city: selectStaff.contact[0]?.address[0]?.city || "",
  //       state: selectStaff.contact[0]?.address[0]?.state || "",
  //       zip: selectStaff.contact[0]?.address[0]?.zip || "",
  //       mobilePhone: selectStaff.contact[0]?.mobilePhone || "",
  //       email: selectStaff.email || "",
  //       gender: selectStaff.gender || "",
  //       country: selectStaff.contact[0]?.address[0]?.country || "",
  //       roles: selectStaff.role || "",
  //       speciality: selectStaff.speciality[0] || "",
  //       startDate: selectStaff.startDate || "",
  //       active: selectStaff.active || " ",
  //       userType: selectStaff.userType || " ",
  //     });
  //     setEditModal(true);
  //   } else {
  //     console.error("Invalid staff data:", selectStaff);
  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Using functional form of setFormData to access previous state
    setFormData((prevData) => {
      console.log('Previous formData:', prevData);
      return {
        ...prevData,
        [name]: value,
      };
    });
  };


  return (
    <div className="container m5 p3" style={{ width: '90%' }}>
      {loading && <Loader />}
      <div className="row">
        <div className="col-md-8 d-flex align-items-center">
        </div>
        <div className="col-md-4 d-flex justify-content-end align-items-center mb-1 gap-2">
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
            style={{ cursor: "pointer", fontSize: '30px', color: '#1F489F' }}
            // onClick={() => navigate("/staff-register")}
            onClick={toggle}
          />
        </div>
        <Table className="table table-bordered" style={{ fontSize: '13px' }}>
          <thead style={{ backgroundColor: "#F8FAFB" }}>
            <tr>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>S.No</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Staff Name</th>
              {/* <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}></th> */}
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Role</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Job Title</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStaffData

              .map((staff: any, index: number) => (
                <tr key={index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    // onClick={() => navigate(`/staff-update/${staff.id}`, { state: staff })}
                    onClick={() => handleClick(staff)}
                  >
                    {staff.name[0].given} {staff.name[0].family}
                  </td>
                  {/* <td>{staff.id}</td> */}
                  <td>{staff.userType}</td>
                  <td>{staff.role}</td>
                  {/* <td>{staff.email}</td> */}
                  <td className="text-center d-flex justify-content-around align-items-center">
                    <Tooltip title="Edit" arrow>
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick(staff)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-danger"
                        onClick={() => handleDelete(staff.username)}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>

                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <StaffCreationForm modal={modal} toggle={toggle} />
      <div className="row">
        <div className="col-md-3">

        </div>
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {renderPageNumbers()}

            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(staffData.length / itemsPerPage)}
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
                <h3 className="mt-1">Staff Details</h3>
              </div>
              <hr></hr> */}
              <ModalHeader toggle={() => setEditModal(false)}>
                  Staff Details
                </ModalHeader>
              <ModalBody style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <div className="row w-100 ">
                <div className="col-md-4">
                  <TextField
                    id="firstname"
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
                <div className="col-md-4">
                  <TextField
                    id="middlename"
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
                <div className="col-md-4">
                  <TextField
                    id="lastname"
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
                  {/* <TextField
                  id="gender"
                  name="gender"
                  label="Gender"
                  placeholder="Enter Gender"
                  value={formData.gender}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                /> */}
                  {renderDropdown('gender')}
                </div>
                <div className="col-md-4">
                  <TextField
                    id="dateofBirth"
                    name="dateofBirth"
                    label="Date Of Birth"
                    placeholder="Enter DateOfBirth"
                    value={formData.dateofBirth}
                    onChange={handleinputchange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    id="mobilePhone"
                    name="mobilePhone"
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    value={formData.mobilePhone}
                    onChange={handleinputchange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                </div>
              </div>
              <div className="row w-100">
                <div className="col-md-6">
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
                <div className="col-md-6">
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
                    inputProps={{
                      maxLength: 9,
                      pattern: '[0-9]*',
                      inputMode: 'numeric'
                    }}
                  />
                </div>
              </div>
              <div className="row w-100">
                <div className="col-md-6">
                  <TextField
                    id="npi"
                    name="npi"
                    label="NPI#"
                    placeholder="Enter NPI"
                    value={formData.npi}
                    onChange={handleinputchange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    id="userType"
                    name="userType"
                    label="User Type"
                    placeholder="Enter UserType"
                    value={formData.userType}
                    onChange={handleinputchange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                </div>
              </div>
              <div className="row w-100">
                <div className="col-md-6">
                  {/* <TextField
                    id="speciality"
                    name="speciality"
                    label="Speciality"
                    placeholder="Enter Speciality"
                    value={formData.speciality}
                    onChange={handleinputchange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  /> */}
                  {renderDropdown('speciality')}
                </div>
                <div className="col-md-6">
                  {/* <TextField
                    id="roles"
                    name="roles"
                    label="Roles"
                    placeholder="Enter Roles"
                    value={formData.roles}
                    onChange={handleinputchange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  /> */}
                  {renderDropdown('roles')}
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
                <div className="col-md-4 mt-3 mb-2">
                <TextField
                    id="zipcode"
                    label="Zip/Postal Code"
                    variant="outlined"
                    fullWidth
                    value={formData.zip}
                    onChange={handlePostalCodeChange}
                  />
                
                </div>
              </div>
              <div className="row w-100">
                
                <div className="col-md-4">
                  <TextField
                    id="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={formData.country}
                    onChange={handleinputchange}
                  />
                </div>
                <div className="col-md-4 dropup">
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
                <div className="col-md-4">
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
        <ModalFooter className="">
          <div className="d-flex gap-3 justify-content-center">
            <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7', fontSize: '12px', fontWeight: 'bold' }} onClick={() => setEditModal(false)}></Button>
            <Button label="Save Changes" style={{ backgroundColor: '#0f3995', fontSize: '12px', fontWeight: 'bold' }} onClick={handleSaveChanges}></Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Staff;