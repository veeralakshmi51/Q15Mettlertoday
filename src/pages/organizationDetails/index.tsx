import { Link, useNavigate } from "react-router-dom";
import {
  getAllOrganizationDetails,
  updateOrganizationDetails,
  deleteOrganizationDetails,
} from "../../slices/organizationDetails/thunk";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPencil,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { FormGroup } from "reactstrap";
import "./form.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrganizationForm from "./Form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
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
import { baseURL, successCode } from "../../configuration/url";
import { formatPhoneNumber } from "../../helpers/common";
import { Button } from "primereact/button";
// import { Button } from 'primereact/button';
import * as Constants from "../Constants/Constant";
interface FormData {
  organizationName: string;
  email: string;
  mobileNumber: string;
  websiteUrl: string;
  OrganizationType: string;
  hippaPrivacyOfficerName: string;
  id: string;
  proximityVerification: string;
  geofencing: string;
  q15Access: string;
  starttime: string;
  duration: string;
  cPerson: string;
  cEmail: string;
  cPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zip: string;
  state: string;
  Country: string;
  npi: string;
  tin: string;
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

const Organization: React.FC = () => {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<any>();
  const { organizationDetails } = useSelector(
    (state: any) => state.Organization
  );
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);

  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(organizationDetails.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const records = filteredRecords.slice(firstIndex, lastIndex);
  const numbers = [
    ...Array(Math.ceil(filteredRecords.length / itemsPerPage)).keys(),
  ].map((num) => num + 1);
  const [editModal, setEditModal] = useState(false);
  const [cityDropDown, setCityDropDown] = useState(new Array<any>());
  let [formData, setFormData] = useState({
    id: "",
    organizationName: "",
    email: "",
    mobileNumber: "",
    websiteUrl: "",
    hippaPrivacyOfficerName: "",
    OrganizationType: "",
    proximityVerification: "",
    geofencing: "",
    q15Access: "",
    starttime: "",
    duration: "",
    cEmail: "",
    cPerson: "",
    cPhone: "",
    addressLine1: "",
    addressLine2: "",
    zip: "",
    city: "",
    state: "",
    Country: "",
    npi: "",
    tin: "",
  });
  useEffect(() => {
    dispatch(getAllOrganizationDetails());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [organizationDetails]);

  useEffect(() => {
    const filteredData = organizationDetails.filter(
      (organization: any) =>
        organization.organizationdetails?.[0]?.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        organization.organizationdetails?.[0]?.type
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        organization.hippaprivacyofficer[0]?.name
          .toLowerCase()
          .includes(search.toLowerCase())
    );
    setFilteredRecords(filteredData);
  }, [search, organizationDetails]);

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changecurrentpage(page: number) {
    setCurrentPage(page);
  }

  function nextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handleDelete = async (organizationId: string) => {
    const confirmDelete = window.confirm("Are You sure Do You want To Delete?");
    if (confirmDelete) {
      try {
        await dispatch(deleteOrganizationDetails(organizationId));
        console.log("Organization Details deleted successfully");
      } catch (error) {
        console.log("Failed to delete organization");
      }
    }
  };
  const columnStyle = {
    maxWidth: "150px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const handleSaveChanges = (e:any) => {
    e.preventDefault()
    if (!selectedOrganizationId) {
      console.error("Selected organization ID not found");
      return;
    } else if (
      formData.zip.length > 0 &&
      formData.city === "" &&
      formData.state === ""
    ) {
      formData.city = "";
      formData.state = "";
      formData.Country = "";
      alert("Please Enter Valid Zip Code");
      return;
    }

    const updatedFields = {
      id: "",
      organizationdetails: [
        {
          name: formData.organizationName,
          type: formData.OrganizationType,
          npi: formData.npi,
          tin: formData.tin,
        },
      ],
      contact: [
        {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.Country,
          zip: formData.zip,
        },
      ],
      email: formData.email,
      websiteUrl: formData.websiteUrl,
      shift: {
        duration: formData.duration,
        startTime: formData.starttime,
      },
      hippaprivacyofficer: [
        {
          name: formData.hippaPrivacyOfficerName,
        },
      ],
      mobileNumber: formData.mobileNumber,
      proximityVerification: formData.proximityVerification,
      geofencing: formData.geofencing,
      q15Access: formData.q15Access,
      pointofcontact: [
        {
          name: formData.cPerson,
          email: formData.cEmail,
          phoneNumber: formData.cPhone,
        },
      ],
    };
    console.log("BeforeUpdate:", organizationDetails);
    dispatch(updateOrganizationDetails(selectedOrganizationId, updatedFields));
    console.log("After Upadate", updatedFields);
    setEditModal(false);
    // dispatch(getAllOrganizationDetails());
  };
  const handleClick = (organization: any) => {
    console.log("Clicked Organization:", organization);
    const organizationDetails =
      organization.organizationdetails && organization.organizationdetails[0];
    console.log("Organization Details:", organizationDetails);

    if (organizationDetails) {
      const organizationId = organization.id || "";
      console.log("Organization ID from organizationDetails:", organizationId);
      setSelectedOrganizationId(organizationId);
      setFormData({
        id: organization.id || "",
        organizationName: organizationDetails.name || "",
        npi: organizationDetails?.npi || "",
        tin: organizationDetails?.tin || "",
        email: organization.email || "",
        mobileNumber: organization.mobileNumber || "",
        websiteUrl: organization.websiteUrl || "",
        OrganizationType: organizationDetails.type || "",
        hippaPrivacyOfficerName:
          organization.hippaprivacyofficer[0]?.name || "",
        proximityVerification: organization.proximityVerification || "",
        geofencing: organization.geofencing || "",
        q15Access: organization.q15Access || "",
        starttime: organization.shift.startTime || "",
        duration: organization.shift.duration || "",
        cEmail: organization.pointofcontact[0].email || "",
        cPerson: organization.pointofcontact[0].name || "",
        cPhone: organization.pointofcontact[0].phoneNumber || "",
        city: organization.contact[0].city || "",
        zip: organization.contact[0].zip || "",
        addressLine1: organization.contact[0].addressLine1 || "",
        addressLine2: organization.contact[0].addressLine2 || "",
        state: organization.contact[0].state || "",
        Country: organization.contact[0].country || "",
      });
      console.log("Selected Organization ID after setting:", organizationId);
      setEditModal(true);
    } else {
      console.error("Organization details or ID not found:", organization);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlePostalCodeChange = async (e: any) => {
    formData.zip = e.target.value;
    console.log(JSON.stringify(e.target.value.length));
    if (e.target.value.length === 5) {
      try {
        const response = await axios.get(
          `https://app.zipcodebase.com/api/v1/search?codes=${e.target.value}&country=US&${Constants.apiKey}`
        );
        formData.state =
          response.data.query.codes !== null &&
          response.data.query.codes !== undefined
            ? response.data.results[response.data.query.codes[0]][0].state
            : "";
        formData.Country =
          response.data.query.codes !== null &&
          response.data.query.codes !== undefined
            ? response.data.results[response.data.query.codes[0]][0]
                .country_code
            : "";
        formData.city =
          response.data.query.codes !== null &&
          response.data.query.codes !== undefined
            ? response.data.results[response.data.query.codes[0]][0].city
            : "";
        setCityDropDown(
          response.data.query.codes !== null &&
            response.data.query.codes !== undefined
            ? response.data.results[response.data.query.codes[0]].map(
                (k: any) => k.city_en
              )
            : []
        );
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    } else {
      formData.state = "";
      formData.Country = "";
      formData.city = "";
    }
    setFormData({ ...formData });
  };
  const handleAddress = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleinputchange = (event: any) => {
    if (event.target.id === "OrganizationName") {
      formData.organizationName = event.target.value;
    } else if (event.target.id === "email") {
      formData.email = event.target.value;
    } else if (event.target.id === "npi") {
      formData.npi = event.target.value;
    } else if (event.target.id === "tin") {
      formData.tin = event.target.value;
    } else if (event.target.id === "OrganizationType") {
      formData.OrganizationType = event.target.value;
    } else if (event.target.id === "AddressLine1") {
      formData.addressLine1 = event.target.value;
    } else if (event.target.id === "AddressLine2") {
      formData.addressLine2 = event.target.value;
    } else if (event.target.id === "city") {
      formData.city = event.target.value;
    } else if (event.target.id === "state") {
      formData.state = event.target.value;
    } else if (event.target.id === "country") {
      formData.Country = event.target.value;
    } else if (event.target.id === "mobileNumber") {
      formData.mobileNumber = event.target.value;
    } else if (event.target.id === "WebsiteURL") {
      formData.websiteUrl = event.target.value;
    } else if (event.target.id === "Contactperson") {
      formData.cPerson = event.target.value;
    } else if (event.target.id === "ContactMobile") {
      formData.cPhone = event.target.value;
    } else if (event.target.id === "cEmail") {
      formData.cEmail = event.target.value;
    }
    setFormData({ ...formData });
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

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    city: false,
    Country: false,
    state: false,
  });
  const [selectedValues, setSelectedValues] = useState<any>({
    city: [],
    Country: [],
    state: [],
  });
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${baseURL}/dropdowns/get-all`);
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === successCode) {
          setDropdownData(data.data);
          console.log("Fetched data:", data.data);
        } else {
          console.error(
            "Error fetching dropdown data:",
            data.message.description
          );
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const renderDropdown = (dropdownName: string) => {
    const dropdown = dropdownData.find(
      (item) => item.dropdown === dropdownName
    );

    if (!dropdown) {
      return null;
    }

    const menuStyle = {
      maxHeight: "250px",
    };

    // return (
    //   <FormControl sx={{ marginLeft: "3px", width: "100%" }} key={dropdownName}>
    //     <InputLabel id={`demo-simple-name-label-${dropdownName}`}>
    //       {dropdownName}
    //     </InputLabel>
    //     <Select
    //       labelId={`demo-simple-name-label-${dropdownName}`}
    //       id={`demo-simple-name-${dropdownName}`}
    //       value={formData[dropdownName as keyof FormData]}
    //       onChange={(e: any) =>
    //         handleSelectChange(dropdownName, e.target.value)
    //       }
    //       onClose={() => setOpenState({ ...openState, [dropdownName]: false })}
    //       onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
    //       open={openState[dropdownName]}
    //       input={<OutlinedInput label={dropdownName} />}
    //       MenuProps={{
    //         PaperProps: {
    //           style: menuStyle,
    //         },
    //       }}
    //     >
    //       {dropdown.list.map((item: any) => (
    //         <MenuItem key={item.id} value={item.value}>
    //           {item.value}
    //         </MenuItem>
    //       ))}
    //     </Select>
    //   </FormControl>
    // );

    return (
      <Autocomplete
      id={`autocomplete-${dropdownName}`}
      options={dropdown.list}
      getOptionLabel={(option)=>option.value}
      value={dropdown.list.find((option)=>option.value ===formData.OrganizationType)}
      onChange={(e,newvalue)=>handleSelectChange(dropdownName,newvalue?.value || '')}
      renderInput={(params)=><TextField {...params} label={dropdownName} variant="outlined"/>}
      />
    )
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row">
        <div className="col-md-12">
          <div className="row mb-2">
            <div className="col-md-5 d-flex align-items-center">
              {/* <h4>Organization List</h4> */}
            </div>
            <div className="col-md-3"></div>
            <div className="col-md-4 d-flex justify-content-end align-items-center gap-2">
              <div className="mx-0 search-container d-flex align-items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search form-control"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              {/* <p onClick={() => navigate("/organization-form")} style={{cursor:'pointer'}} className="mb-0">Create</p> */}
              <FaPlusSquare
                data-bs-target="#exampleModal"
                style={{
                  cursor: "pointer",
                  fontSize: "30px",
                  color: "#1F489F",
                }}
                onClick={toggle}
              />
            </div>
          </div>
          {/* <hr /> */}
          {/* <div className="row-md-3">
            <div className="mx-2 search-container d-flex justify-content-between align-items-center">
          
            </div>
          </div> */}
          {/* <br /> */}
          <table className="table table-bordered" style={{ fontSize: "13px" }}>
            <thead style={{ backgroundColor: "#F8FAFB" }}>
              <tr>
                <th
                  scope="col"
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                >
                  S.No{" "}
                </th>
                <th
                  scope="col"
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                >
                  Organization Name
                </th>
                <th
                  scope="col"
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                >
                  Organization Type
                </th>
                <th
                  scope="col"
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                >
                   Q15 Access
                </th>
                <th
                  scope="col"
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                >                 
                 Proximity
                </th>
                <th
                  scope="col"
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                >
                  GeoFencing
                </th>
                <th
                  scope="col"
                  className="text-center"
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((organization: any, index: number) => (
                <tr key={index}>
                  <td>{firstIndex + index + 1}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClick(organization)}
                  >
                    {organization.organizationdetails?.[0]?.name || ""}
                  </td>
                  <td>{organization.organizationdetails?.[0]?.type || ""}</td>
                  <td className="text-center">
                    {organization.q15Access  === "Yes" ? (
                      <FontAwesomeIcon icon={faCheck} color="green" />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} color="red" />
                    )}
                  </td>
                  <td className="text-center">
                    {organization.proximityVerification === "Yes" ? (
                      <FontAwesomeIcon icon={faCheck} color="green" />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} color="red" />
                    )}
                  </td>
                  <td className="text-center">
                    {organization.geofencing === "Yes" ? (
                      <FontAwesomeIcon icon={faCheck} color="green" />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} color="red" />
                    )}
                  </td>
                  <td className="text-center d-flex justify-content-around align-items-center">
                    <Tooltip title="Edit" arrow>
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick(organization)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-danger"
                        onClick={() => handleDelete(organization.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OrganizationForm modal={modal} toggle={toggle} />
      <div className="pagination-container">
        <nav className="d-flex">
          <ul className="pagination">
            <li className="page-item">
              <a href="#" className="page-link" onClick={prevPage}>
                Prev
              </a>
            </li>
            {numbers.map((num, index) => (
              <li key={index} className="page-item">
                <a
                  href="#"
                  className={`page-link ${currentPage === num ? "active" : ""}`}
                  onClick={() => changecurrentpage(num)}
                >
                  {num}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a href="#" className="page-link" onClick={nextPage}>
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <Modal
        isOpen={editModal}
        toggle={() => setEditModal(false)}
        centered
        size="lg"
      >
        <div className="d-flex align-items-center justify-content-center vh-90">
          <div className="row">
            <div className="container col-md-12">
              <div className="d-flex justify-content-center align-items-center">
                <h3>Organization Details</h3>
              </div>
              <FormGroup>
                <form onSubmit={handleSaveChanges}>
                  <div className="row w-100 ">
                    <div className="col-md-6">
                      <TextField
                        id="OrganizationName"
                        name="organizationName"
                        label="Organization Name"
                        placeholder="Enter Organization Name"
                        value={formData.organizationName}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                    <div className="col-md-6 ">
                      <TextField
                        id="email"
                        name="email"
                        label="Organization Email"
                        placeholder="Enter Organization Email"
                        value={formData.email}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                  </div>
                  <div className="row w-100 ">
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
                    <div className="col-md-6 ">
                      <TextField
                        id="tin"
                        name="tin"
                        label="TIN"
                        placeholder="Enter TIN"
                        value={formData.tin}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                  </div>
                  <div className="row w-100 ">
                    <div className="col-md-4 mt-3">
                      {/* <TextField id="OrganizationType"name="OrganizationType" label="Organization Type" placeholder="Enter Organization Type" value={formData.OrganizationType} onChange={handleChange} variant="outlined" fullWidth margin="normal"/> */}
                      {renderDropdown('OrganizationType')}
                    
                    </div>
                    <div className="col-md-4">
                      <TextField
                        id="mobileNumber"
                        name="mobileNumber"
                        label="Mobile Number"
                        placeholder="Enter Mobile Number"
                        value={formatPhoneNumber(formData.mobileNumber)}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        id="WebsiteURL"
                        name="websiteUrl"
                        label="WebsiteURL"
                        placeholder="Enter WebsiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                  </div>
                  <div className="row w-100 ">
                    <div className="col-md-4">
                      <TextField
                        id="hippaPrivacyOfficerName"
                        name="hippaPrivacyOfficerName"
                        label="HIPPA Privacy Officer Name"
                        placeholder="Enter HippaPrivacyOfficerName"
                        value={formData.hippaPrivacyOfficerName}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        id="duration"
                        name="duration"
                        label="Duration"
                        placeholder="Enter Duration Time"
                        value={formData.duration}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        id="starttime"
                        name="starttime"
                        label="Start Time"
                        placeholder="Enter Start Time"
                        value={formData.starttime}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="OrganizationType"
                      className="label d-flex justify-content-center align-items-center"
                    >
                      Contact Person
                    </label>
                  </div>
                  <div className="row w-100 ">
                    <div className="col-md-4">
                      <TextField
                        id="Contactperson"
                        name="cPerson"
                        label="Contact Person"
                        placeholder="Enter Contact Person Name"
                        value={formData.cPerson}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        id="cEmail"
                        name="cEmail"
                        label="Contact Email"
                        placeholder="Enter Contact Email"
                        value={formData.cEmail}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        id="ContactMobile"
                        name="cPhone"
                        label="Contact Phone"
                        placeholder="Enter Contact Phone"
                        value={formatPhoneNumber(formData.cPhone)}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="Address"
                      className="label d-flex justify-content-center align-items-center"
                    >
                      Address
                    </label>
                  </div>
                  <div className="row w-100 ">
                    <div className="col-md-4 ">
                      <TextField
                        id="addressLine1"
                        name="addressLine1"
                        label="AddressLine 1"
                        placeholder="Enter Address"
                        value={formData.addressLine1}
                        onChange={handleinputchange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </div>
                    <div className="col-md-4">
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
                      {/* <TextField id="city"name="city" label="City" placeholder="Enter City" value={formData.city} onChange={handleChange} variant="outlined" fullWidth margin="normal"

                      /> */}
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

                  <div className="row w-100 ">
                    <div className="col-md-4 mt-3">
                      {/* {renderDropdown("state")} */}
                      {/* <TextField id="state"name="state" label="State" placeholder="Enter State" value={formData.state} onChange={handleChange} variant="outlined" fullWidth margin="normal"/> */}
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
                      <TextField
                        id="country"
                        label="Country"
                        variant="outlined"
                        fullWidth
                        value={formData.Country}
                        onChange={handleinputchange}
                      />
                      {/* {renderDropdown("Country")} */}
                      {/* <TextField id="outlined-basic-1" label="Country" variant="outlined" fullWidth onChange={handleChange} value={formData.Country} margin="normal" placeholder="Enter Country" /> */}
                    </div>
                    <div className="col-md-4 mt-3">
                      {/* <TextField id="zip"name="zip" label="Zip/Postal Code" placeholder="Enter ZipCode" value={formData.zip} onChange={handleChange} variant="outlined" fullWidth margin="normal" */}

                      {cityDropDown !== null && cityDropDown.length === 1 ? (
                        <TextField
                          id="city"
                          label="City"
                          variant="outlined"
                          fullWidth
                          value={formData.city}
                          onChange={handleinputchange}
                        />
                      ) : (
                        <Autocomplete
                          id="city"
                          options={cityDropDown}
                          value={formData.city}
                          getOptionLabel={(option) => option}
                          onChange={(e, v) => {
                            formData.city = v;
                            setFormData({ ...formData });
                          }}
                          sx={{ width: "100%" }}
                          size="medium"
                          renderInput={(params) => (
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
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="mt-3">
                      <label
                        htmlFor="OrganizationType"
                        className="label d-flex justify-content-center align-items-center"
                      >
                        Access Control
                      </label>
                    </div>
                    <div className="col-md-4 mt-2">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="q15-access-label">Q15</InputLabel>
                        <Select
                          labelId="q15-access-label"
                          id="q15Access"
                          label="Q15"
                          value={formData.q15Access}
                          onChange={(e) =>
                            handleSelectChange("q15Access", e.target.value)
                          }
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-4 mt-2">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="proximity-label">Proximity</InputLabel>
                        <Select
                          labelId="proximity-label"
                          id="proximity"
                          label="Proximity"
                          value={formData.proximityVerification}
                          onChange={(e) =>
                            handleInputChange(
                              "proximityVerification",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    
                    <div className="col-md-4 mt-2">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="geofencing-label">
                          Geo Fencing
                        </InputLabel>
                        <Select
                          labelId="geofencing-label"
                          id="geofencing"
                          label="Geo Fencing"
                          value={formData.geofencing}
                          onChange={(e) =>
                            handleSelectChange("geofencing", e.target.value)
                          }
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  {/* <div className="d-flex gap-3 justify-content-end mt-4">
                    <Button
                      onClick={() => setEditModal(false)}
                      className="btn btn-danger"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      className="btn btn-info"
                    >
                      Save
                    </Button>
                  </div> */}
                  <ModalFooter className="">
                    <div className="d-flex gap-3 justify-content-center">
                      <Button
                        label="Cancel"
                        severity="secondary"
                        style={{
                          color: "#000",
                          backgroundColor: "#94a0b7",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                        onClick={() => setEditModal(false)}
                      ></Button>
                      <Button
                        label="Save Changes"
                        style={{
                          backgroundColor: "#0f3995",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                        onClick={handleSaveChanges}
                      ></Button>
                    </div>
                  </ModalFooter>
                  {/* <br></br> */}
                </form>
              </FormGroup>
              <ToastContainer />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Organization;
