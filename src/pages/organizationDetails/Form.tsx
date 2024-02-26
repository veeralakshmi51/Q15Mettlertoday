import React, { useEffect, useState } from "react";
import { FormGroup, Modal,ModalFooter } from "reactstrap";
import "./form.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { baseURL, successCode } from "../../configuration/url";
import { formatPhoneNumber } from "../../helpers/common";
import { getAllOrganizationDetails } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import { Button } from "primereact/button";
import * as Constants from "../Constants/Constant";
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
  organizationName: string;
  OrganizationType: string;
  organizationId: string;
  duration: string,
  startTime: string,
  mobileNumber: string;
  email: string;
  websiteUrl: string;
  hippaPrivacyOfficerName: string;
  proximityVerification: string;
  geofencing: string;
  q15Access: string;
  addressLine1: string; 
  addressLine2: string;
  city: string;
  state: string;
  Country: string;
  zip: string;
  cPerson: string;
  cEmail: string;
  cPhone: string;
  npi:string;
  tin:string;
}
interface OrganizationType {
  id: string;
  value: string;
  type: string;
}
interface OrganizationFormProps {
  modal: boolean;
  toggle: () => void;
}
const OrganizationForm: React.FC<OrganizationFormProps> = ({modal,toggle}) => {
  const dispatch = useDispatch<any>()
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const [cityDropDown, setCityDropDown] = useState(new Array<any>());
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const initselect = {
    // city: [],
    Country: [],
    state: [],
    OrganizationType:null,
  }
  const [selectedValues, setSelectedValues] = useState<any>(initselect);
  const initFormData = {
    organizationName: "",
    OrganizationType: "",
    organizationId: '',
    duration: "",
    startTime: "",
    mobileNumber: "",
    email: "",
    websiteUrl: "",
    hippaPrivacyOfficerName: "",
    proximityVerification: "",
    geofencing: "",
    q15Access: "",
    addressLine1: "", 
    addressLine2: "",
    city: "",
    state: "",
    Country: "",
    zip: "",
    cPerson:"",
    cEmail:"",
    cPhone:"",
    npi:"",
    tin:"",
  }
  const [formData, setFormData] = useState<FormData>(initFormData);

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handlePostalCodeChange = async (e: any) => {
    formData.zip = e.target.value;
    console.log(JSON.stringify(e.target.value.length));
    if (e.target.value.length === 5) {
        try {
            const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?codes=${e.target.value}&country=US&${Constants.apiKey}`);
            formData.state = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].state : "";
            formData.Country = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].country_code : "";
            formData.city = response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]][0].city : "";
            setCityDropDown(response.data.query.codes !== null && response.data.query.codes !== undefined ? response.data.results[response.data.query.codes[0]].map((k: any) => k.city_en) : [])


        } catch (error) {
            console.error('Error fetching city:', error);
        }
    }  else{
      formData.state = "";
      formData.Country = "";
      formData.city = "";
    } 
    setFormData({ ...formData });
};

const handleinputchange = (event: any) => {
    if (event.target.id === 'OrganizationName') {
        formData.organizationName = event.target.value;
    } else if (event.target.id === 'OrganizationEmail') {
        formData.email = event.target.value;
    } else if (event.target.id === 'npi') {
        formData.npi = event.target.value;
    } else if (event.target.id === 'tin') {
        formData.tin = event.target.value;
    } else if (event.target.id === 'OrganizationType') {
        formData.OrganizationType = event.target.value;
    } else if (event.target.id === 'AddressLine1') {
        formData.addressLine1 = event.target.value;
    } else if (event.target.id === 'AddressLine2') {
        formData.addressLine2 = event.target.value;
    } else if (event.target.id === 'city') {
        formData.city = event.target.value;
    } else if (event.target.id === 'state') {
        formData.state = event.target.value;
    }else if (event.target.id === 'country') {
        formData.Country = event.target.value;
    }else if (event.target.id === 'MobileNumber') {
        formData.mobileNumber = event.target.value;
    }else if (event.target.id === 'WebsiteURL') {
        formData.websiteUrl = event.target.value;
    }else if (event.target.id === 'ContactPerson') {
        formData.cPerson = event.target.value;
    }else if (event.target.id === 'ContactMobile') {
        formData.cPhone = event.target.value;
    }else if (event.target.id === 'ContactEmail') {
        formData.cEmail = event.target.value;
    }else if (event.target.id === 'HIPPAOfficerName') {
      formData.hippaPrivacyOfficerName = event.target.value;
  }
    setFormData({ ...formData });
}
  const handleSelectChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleCancel = () => {
    setFormData(initFormData);
    setSelectedValues(initselect)
    toggle();
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {

      if (!formData.organizationName  || !formData.duration || !formData.startTime || 
        !formData.email ||
        !formData.mobileNumber) {
        toast.error('Please fill the required fields');
        return;
    }
    else if(!emailRegex.test(formData.email)){
      toast.error("Invalid Email Address");
      return;
    } else if (formData.zip.length > 0 && formData.city === "" && formData.state === "") {
      formData.city = "";
      formData.state = "";
      formData.Country = "";
      toast.error("Please Enter Valid Zip Code");
      return;
    }

      const response = await axios.post(
        `${baseURL}/org/register`,
        {
          organizationdetails: [
            {
              id: formData.organizationId,
              name: formData.organizationName,
              type: selectedValues.OrganizationType.value,
              tin:formData.tin,
              npi:formData.npi,
            },
          ],
          shift: {
            duration: formData.duration,
            startTime: formData.startTime

          },
          contact:[
            {
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state || '',
              country: formData.Country || '',
              zip: formData.zip
            }
          ],
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          websiteUrl: formData.websiteUrl,
          proximityVerification: formData.proximityVerification,
          geofencing: formData.geofencing,
          q15Access: formData.q15Access,
          pointofcontact:[
            {
              name: formData.cPerson,
              email: formData.cEmail,
              phoneNumber: formData.cPhone,
            }
          ],
          hippaprivacyofficer: [
            {
              name: formData.hippaPrivacyOfficerName,
            },
          ],
        }
      );

      if (response.data.message.code === successCode) {
        console.log("Registration Data", response.data);
        toast.success(response.data.message.description);
        handleCancel()
        dispatch(getAllOrganizationDetails());
        // toggle()
      } else {
        console.error("Error registering:", response.data.message);
        toast.warning(`Error: ${response.data.message.description}`);
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.warning("An error occurred during registration.");
    }
  };
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    city: false,
    Country: false,
    state: false,
    type:false
  });

  const handleSelectChange1 = (e: React.ChangeEvent<{ value: unknown }>, dropdownName: string) => {
    setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value });
    setOpenState({ ...openState, [dropdownName]: false });
  };

  const renderDropdown = (dropdownName: string) => {
    const dropdown = dropdownData.find((item) => item.dropdown === dropdownName);

    if (!dropdown) {
      return null;
    }
    const menuStyle = {
      maxHeight: "250px",
      maxWidth:'250px'
    };
    return (
      <FormControl sx={{ marginLeft: '3px', width: '100%' }} key={dropdownName}>
        <InputLabel id={`demo-simple-name-label-${dropdownName}`}>{dropdownName}</InputLabel>
        <Select
          labelId={`demo-simple-name-label-${dropdownName}`}
          id={`demo-simple-name-${dropdownName}`}
          value={selectedValues[dropdownName]}
          onChange={(e: any) => handleSelectChange1(e, dropdownName)}
          onClose={() => setOpenState({ ...openState, [dropdownName]: false })}
          onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
          open={openState[dropdownName]}
          input={<OutlinedInput label={dropdownName} />}
          MenuProps={{
            PaperProps:{
              style:menuStyle,
            }
          }}
        >
          {dropdown.list.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Modal isOpen={modal} toggle={toggle} style={{overflowY:'auto'}} centered size="lg">
    <div className="d-flex align-items-center justify-content-center vh-90">
      <div className="row">
        <div className="container col-md-12">
          <div style={{height:'50px'}} className="d-flex justify-content-center align-items-center">
            <h3 style={{marginTop:'1.25rem'}}>Create An Organization</h3>
            </div>
          <hr></hr>
          <FormGroup>
            <form onSubmit={handleSubmit}>
              <div className="row w-100 ">
                <div className='col-md-6 mb-2'>
                  <TextField id="OrganizationName" label="OrganizationName" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} required/>
                </div>
                <div className='col-md-6 mb-2'>
                  <TextField id="OrganizationEmail" label="Organization Email" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, email: e.target.value })} required/>
                </div>
              </div>
              <div className="row w-100 ">
                <div className='col-md-6 mb-2'>
                  <TextField id="npi" label="NPI#" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, npi: e.target.value })} required/>
                </div>
                <div className='col-md-6 mb-2'>
                  <TextField id="tin" label="TIN" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, tin: e.target.value })} required/>
                </div>
              </div>
              <div className="row w-100  mb-1">
                <div className="col-md-4">
                <Autocomplete id="OrganizationType"
                  options={(dropdownData.find((dropdown)=>dropdown.dropdown === "OrganizationType")?.list || []).filter((item:DropdownItem)=>
                  item.value.toLocaleLowerCase().includes(search.toLocaleLowerCase()))}
                  getOptionLabel={(option:any)=>option.value}
                  value={selectedValues.OrganizationType}
                  onChange={(event:any,value:any)=>{
                    setSelectedValues({...selectedValues,OrganizationType:value});
                  }}
                  renderInput={(params:any)=>(
                    <TextField {...params}
                    variant="outlined"
                    label="Organization Type"
                    placeholder="Enter Organization Type"
                    margin="none"
                    fullWidth
                    />
                  )}
                  />
                  {/* {renderDropdown('OrganizationType')} */}
                </div>

                <div className='col-md-4'>
                  <TextField id="MobileNumber" label="Mobile Number" value={formatPhoneNumber(formData.mobileNumber)} variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} required />
                </div>
                <div className='col-md-4'>
                  <TextField id="WebsiteURL" label="Website URL" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })} />
                </div>
              </div>

              <div className="row w-100 ">
                <div className='col-md-4'>
                  <TextField id="HIPPAOfficerName" label="HIPPA Officer Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, hippaPrivacyOfficerName: e.target.value })} />
                </div>
                <div className='col-md-4'>
                  <TextField id="outlined-basic-1" label="Duration" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required/>
                </div>
                <div className='col-md-4'>
                  <TextField id="outlined-basic-2" label="Start Time" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required/>
                </div>
              </div>
              <div className="mt-3">
                  <label htmlFor="OrganizationType" className="label d-flex justify-content-center align-items-center">
                    Contact Person
                  </label>
                  </div>
              <div className="row w-100 ">
                <div className='col-md-4'>
                  <TextField id="ContactPerson" label="Contact Person" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, cPerson: e.target.value })} />
                </div>
                <div className='col-md-4'>
                  <TextField id="ContactEmail" label="Contact Email" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, cEmail: e.target.value })} />
                </div>
                <div className='col-md-4'>
                  <TextField id="ContactMobile" label="Contact Mobile" value={formatPhoneNumber(formData.cPhone)} variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, cPhone: e.target.value })} />
                </div>
              </div>
              <div className="mt-3">
                  <label htmlFor="Address" className="label d-flex justify-content-center align-items-center">
                    Address
                  </label>
                  </div>
              <div className="row w-100 ">
                <div className='col-md-4 mb-2'>
                  <TextField id="addessLine1" label="addessLine 1" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
                </div>
                <div className='col-md-4'>
                  <TextField id="addressLine2" label="addressLine 2" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                </div>
                <div className='col-md-4'>
                <TextField
                            id="zipcode"
                            label="Zip/Postal Code"
                            variant="outlined"
                            fullWidth
                            value={formData.zip}
                            onChange={handlePostalCodeChange}
                        />
                  {/* <TextField id="city" label="city" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, city: e.target.value })} /> */}
                </div>
              </div>

              <div className="row w-100 ">
                
                <div className='col-md-4'>
                <TextField
                            id="state"
                            label="State"
                            variant="outlined"
                            fullWidth
                            value={formData.state}
                            onChange={handleinputchange}
                        />
                {/* {renderDropdown('state')} */}
                </div>
                <div className='col-md-4'>
                {/* {renderDropdown('Country')} */}
                <TextField
                            id="country"
                            label="Country"
                            variant="outlined"
                            fullWidth
                            value={formData.Country}
                            onChange={handleinputchange}
                        />
                  {/* <TextField id="outlined-basic-1" label="Country" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, Country: e.target.value })} /> */}
                </div>
                <div className='col-md-4'>
                  {/* <TextField id="outlined-basic-2" label="zip" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, zip: e.target.value })} /> */}
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

              <div className="row w-100">
                <div className="mt-3">
                  <label htmlFor="OrganizationType" className="label d-flex justify-content-center align-items-center">
                    Access Control
                  </label>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="proximity-label">Proximity</InputLabel>
                    <Select
                      labelId="proximity-label"
                      id="proximity"
                      label="Proximity"
                      value={formData.proximityVerification}
                      onChange={(e) => handleInputChange('proximityVerification', e.target.value)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="q15-access-label">Q15</InputLabel>
                    <Select
                      labelId="q15-access-label"
                      id="q15Access"
                      label="Q15"
                      value={formData.q15Access}
                      onChange={(e) => handleSelectChange('q15Access', e.target.value)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="geofencing-label">Geo Fencing</InputLabel>
                    <Select
                      labelId="geofencing-label"
                      id="geofencing"
                      label="Geo Fencing"
                      value={formData.geofencing}
                      onChange={(e) => handleSelectChange('geofencing', e.target.value)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* <div className="d-flex gap-3 justify-content-end mt-4"> */}
                {/* <ModalFooter>
                  <Button onClick={handleCancel} className="btn-danger">Cancel</Button>
                  <Button onClick={handleSubmit} className="btn-info">Save</Button>
                </ModalFooter> */}
                <ModalFooter className="">
                <div className="d-flex gap-3 justify-content-center">
                <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7',fontSize:'12px', fontWeight:'bold'}} onClick={handleCancel}></Button>
                <Button label="Save Changes" style={{ backgroundColor: '#0f3995',fontSize:'12px',fontWeight:'bold'}} onClick={handleSubmit}></Button>
            </div>
          </ModalFooter>
              {/* </div> */}
              <br></br>

              {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
            </form>
          </FormGroup>
          <ToastContainer />
        </div>
      </div>
    </div>
    </Modal>
  );
};

export default OrganizationForm;