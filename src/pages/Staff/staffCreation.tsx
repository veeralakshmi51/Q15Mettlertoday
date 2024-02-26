import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './staff.css'
import { DatePicker } from '@mui/x-date-pickers';
import { formatDateToYYYYMMDD, formatPhoneNumber, formatSSN } from '../../helpers/common';
import { toast } from 'react-toastify';
import { createStaff } from '../../slices/thunk';
import Loader from '../../components/loader/Loader';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button } from 'primereact/button';
import * as Constants from "../Constants/Constant";
import { baseURL, successCode } from '../../configuration/url';
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
interface StaffCreationFormProps {
  modal: boolean;
  toggle: () => void;
}
const StaffCreationForm: React.FC<StaffCreationFormProps> = ({ modal, toggle }) => {
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  let [cityDropDown, setCityDropDown] = useState(new Array<any>());
  const [userType, setUserType] = React.useState('');
  const { organization } = useSelector(
    (state: any) => state.Login
  );
  const [search, setSearch] = useState<string>('');
  const { loading } = useSelector(
    (state: any) => state.Staff
  );
  const navigate = useNavigate()
  const dispatch = useDispatch<any>()
  const initdrop = {
    gender: null,
    Country: '',
    roles: null,
    state: '',
    speciality: null,
  }
  const [selectedValues, setSelectedValues] = useState<any>(initdrop);
  const handleChange = (event: SelectChangeEvent) => {
    setUserType(event.target.value as string);
  };

  const initFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateofBirth: '',
    ssn: '',
    npi: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    startDate: '',
    userType: '',
    country: ''
  }
  const [formData, setFormData] = useState(initFormData);

  const [disabled, setDisabled] = useState<boolean>(false);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisabled(e.target.checked);
  };
  const handlePostalCodeChange = async (e: any) => {
    formData.postalCode = e.target.value;
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
    }else{
      formData.state = "";
      formData.country = "";
      formData.city = "";
    } 
    setFormData({ ...formData });
  };

  const handleinputchange = (event: any) => {
    if (event.target.id === 'firstname') {
      formData.firstName = event.target.value;
    } else if (event.target.id === 'middlename') {
      formData.middleName = event.target.value;
    } else if (event.target.id === 'lastname') {
      formData.lastName = event.target.value;
    } else if (event.target.id === 'email') {
      formData.email = event.target.value;
    } else if (event.target.id === 'SSN') {
      formData.ssn = event.target.value;
    } else if (event.target.id === 'addressline1') {
      formData.addressLine1 = event.target.value;
    } else if (event.target.id === 'addressline2') {
      formData.addressLine2 = event.target.value;
    } else if (event.target.id === 'city') {
      formData.city = event.target.value;
    } else if (event.target.id === 'state') {
      formData.state = event.target.value;
    }
    setFormData({ ...formData });
  }
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${baseURL}/dropdowns/get-all`);
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === successCode) {
          setDropdownData(data.data);
        } else {
          console.error('Error fetching dropdown data:', data.message.description);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSaveClick = async () => {
    if (!formData.email) {
      toast.error('Please Enter Email Address')
      return;
    }
    else if (!emailRegex.test(formData.email)) {
      toast.error("Invalid Email Address");
      return
    }else if (formData.postalCode.length > 0 && formData.city === "" && formData.state === "") {
      formData.city = "";
      formData.state = "";
      formData.country = "";
      toast.error("Please Enter Valid Zip Code");
      return;
    }
    const requestBody = {
      id: '',
      name: [
        {
          use: formData.middleName,
          given: formData.firstName,
          family: formData.lastName,
        },
      ],
      gender: selectedValues.gender.value || '',
      email: formData.email,
      role: selectedValues.roles.value || '',
      organization,
      userType: userType,
      startDate: formData.startDate,
      speciality: [
        selectedValues.speciality.value || ''
      ],
      dateofBirth: formData.dateofBirth,
      ssn: formData.ssn,
      npi: formData.npi,
      contact: [
        {
          address: [{
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            Country: formData.country || '',
            state: formData.state || '',
            zip: formData.postalCode
          }],
          mobilePhone: formData.phoneNumber
        }
      ]
    };

    dispatch(createStaff(requestBody, handleCancel,organization))

  };

  const handleCancel = () => {
    setFormData(initFormData);
    setSelectedValues(initdrop);
    toggle();
  }

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    gender: false,
    Country: false,
    roles: false,
    state: false,
    speciality: false,
  });

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, dropdownName: string) => {
    setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value as string[] });
    setOpenState({ ...openState, [dropdownName]: false }); // Close the dropdown after selecting
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered size='lg'>
      <div className="d-flex align-items-center justify-content-center">
        {loading && <Loader />}
        <div className="row">
          <div className="container col-md-12">
            {/* <div className="d-flex justify-content-center align-items-center">
              <h3 >Staff Register</h3>
              <hr />
            </div> */}
            <ModalHeader toggle={toggle}>
                  Staff Register
                </ModalHeader>
              <ModalBody style={{ maxHeight: '65vh', overflowY: 'auto' }}>

            <div className="row w-100 " style={{ marginTop: '10px' }}>
              <div className='col-md-4 mb-2'>
                <TextField id="firstname" label="First Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className='col-md-4 mb-2'>
                <TextField id="middlename" label="Middle Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
              </div>
              <div className='col-md-4 mb-2'>
                <TextField id="lastname" label="Last Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
            </div>
            <div className="row w-100">
              <div className='col-md-4 mb-2'>
                <Autocomplete
                  id="gender"
                  options={(dropdownData.find((dropdown) => dropdown.dropdown === "gender")?.list || []).filter((item: DropdownItem) =>
                  item.value.toLowerCase().includes(search.toLowerCase())
                )}
                  getOptionLabel={(option: any) => option.value}
                  value={selectedValues.gender}
                  onChange={(event: any, value: any) => {
                    setSelectedValues({ ...selectedValues, gender: value });
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="gender"
                      placeholder="Select gender"
                      margin="none"
                      fullWidth
                      disabled={disabled && 'gender'}
                    />
                  )}
                />
                  <FormControlLabel
                    control={<Checkbox checked={disabled} onChange={handleCheckboxChange} />}
                    label="Declined to specify"
                  />
              </div>
              <div className='col-md-4 mb-2'>
                <DatePicker
                  label={'Date Of Birth'}
                  format='DD-MM-YYYY'
                  onChange={(date: any) => {
                    console.log(formatDateToYYYYMMDD(date))
                    setFormData({ ...formData, dateofBirth: formatDateToYYYYMMDD(date) })
                  }}
                />
              </div>
              <div className='col-md-4 mb-2'>
                <TextField id="PhoneNumber" label="Phone Number" value={formatPhoneNumber(formData.phoneNumber)} variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
              </div>
            </div>
            <div className="row w-100 ">
              <div className='col-md-6 mb-2'>
                <TextField id="Email" label="Email" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className='col-md-6 mb-2'>
                <TextField id="SSN" label="SSN" variant="outlined" value={formatSSN(formData.ssn)} fullWidth onChange={(e) => setFormData({ ...formData, ssn: e.target.value })} />
              </div>
            </div>
            <div className="row w-100 ">
              <div className='col-md-6 mb-2'>
                {/* <TextField id="outlined-basic-2" label="User Type" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, userType: e.target.value })}/> */}

                <FormControl fullWidth>
                  <InputLabel >UserType</InputLabel>
                  <Select
                    value={userType}
                    label="User Type"
                    onChange={handleChange}
                  >
                    <MenuItem value={'Admin'}>Admin</MenuItem>
                    <MenuItem value={'SystemAdmin'}>System Admin</MenuItem>
                    <MenuItem value={'Staff'}>Staff</MenuItem>
                  </Select>
                </FormControl>

              </div>
              <div className='col-md-6 mb-2'>
                <TextField id="outlined-basic-2" label="NPI#" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, npi: e.target.value })} />
              </div>

            </div>
            <div className='row w-100'>
              <div className='col-md-6 mb-2'>
                {/* {renderDropdown('speciality')} */}
                <Autocomplete
                  id="speciality"
                  options={(dropdownData.find((dropdown) => dropdown.dropdown === "speciality")?.list || []).filter((item: DropdownItem) =>
                  item.value.toLowerCase().includes(search.toLowerCase())
                )}
                  getOptionLabel={(option: any) => option.value}
                  value={selectedValues.speciality}
                  onChange={(event: any, value: any) => {
                    setSelectedValues({ ...selectedValues, speciality: value });
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Speciality"
                      placeholder="Select Speciality"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className='col-md-6 mb-2'>
              <Autocomplete
                  id="roles"
                  options={(dropdownData.find((dropdown) => dropdown.dropdown === "roles")?.list || []).filter((item: DropdownItem) =>
                  item.value.toLowerCase().includes(search.toLowerCase())
                )}
                  getOptionLabel={(option: any) => option.value}
                  value={selectedValues.roles}
                  onChange={(event: any, value: any) => {
                    setSelectedValues({ ...selectedValues, roles: value });
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Role"
                      placeholder="Select Role"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>
            <div className="row w-100 ">
              <div className='col-md-4 mb-2'>
                <TextField id="addressline1" label="Address Line 1" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
              </div>
              <div className='col-md-4 mb-2'>
                <TextField id="addressline2" label="Address Line 2" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
              </div>
              <div className='col-md-4 mb-2'>
              <TextField
                  id="zipcode"
                  label="Zip/Postal Code"
                  variant="outlined"
                  fullWidth
                  value={formData.postalCode}
                  onChange={handlePostalCodeChange}
                />
              
                {/* <TextField id="outlined-basic-1" label="City" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, city: e.target.value })} /> */}
              </div>
            </div>
            <div className="row w-100 ">
              
              <div className='col-md-4 mb-2'>
                <TextField
                  id="country"
                  label="Country"
                  variant="outlined"
                  fullWidth
                  value={formData.country}
                  onChange={handleinputchange}
                />
                {/* {renderDropdown('Country')} */}
              </div>
              <div className='col-md-4 mb-2'>
                {/* <TextField id="outlined-basic-2" label="State/Provide" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, state: e.target.value })}/> */}
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
              <div className='col-md-4 mb-2'>
                {/* <TextField id="outlined-basic-3" label="Zip/Postal Code" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}/> */}
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
            <ModalFooter className="">
              <div className="d-flex gap-3 justify-content-center">
                <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7', fontSize: '12px', fontWeight: 'bold' }} onClick={handleCancel}></Button>
                <Button label="Save Changes" style={{ backgroundColor: '#0f3995', fontSize: '12px', fontWeight: 'bold' }} onClick={handleSaveClick}></Button>
              </div>
            </ModalFooter>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default StaffCreationForm;