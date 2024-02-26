import { useEffect } from "react"
import { FormControl, InputLabel, MenuItem, Select, TextField, OutlinedInput, Autocomplete } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getOrgByID, updateOrganizationDetails } from "../../slices/thunk"
import { Button } from "primereact/button"
// import Loader from "../../components/loader/Loader"
import { formatPhoneNumber } from "../../helpers/common"
import { baseURL } from "../../configuration/url"
import axios from 'axios';
import * as Constants from "../Constants/Constant";
import { ToastContainer, toast } from "react-toastify";
interface FormData {
    id: string
    name: string
    email: string
    mobileNumber: string
    websiteUrl: string
    type: string
    hippaPrivacyOfficerName: string
    proximityVerification: string
    geofencing: string
    q15Access: string
    duration: string
    startTime: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    zip: string
    cPerson: string
    cEmail: string
    cPhone: string
    npi: string
    tin: string
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

const ParticularOrgUpdate = () => {
    const dispatch = useDispatch<any>()
    const navigate = useNavigate()
    const params = useParams()
    const { orgData } = useSelector(
        (state: any) => state.Org
    )
    const { loading } = useSelector(
        (state: any) => state.Organization
    )
    const { organization } = useSelector(
        (state: any) => state.Login
    )
    const [orgdatabyId, setOrgdatabyId] = useState<any>(orgData);
    const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
    let [cityDropDown, setCityDropDown] = useState(new Array<any>());
    const [formData, setFormData] = useState<FormData>({
        id: "",
        name: "",
        email: "",
        mobileNumber: "",
        websiteUrl: "",
        type: "",
        hippaPrivacyOfficerName: "",
        proximityVerification: "",
        geofencing: "",
        q15Access: "",
        duration: "",
        startTime: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        cPerson: "",
        cEmail: "",
        cPhone: "",
        npi: "",
        tin: "",
    })

    useEffect(() => {
        if (!params?.id) return
        getOrgByID(dispatch, organization)
    }, [params?.id])

    useEffect(() => {
        setOrgdatabyId(orgData)
    }, [orgData])

    useEffect(() => {
        setFormData({
            id: orgdatabyId?.id,
            name: orgdatabyId?.organizationdetails && orgdatabyId?.organizationdetails[0]?.name || "",
            email: orgdatabyId?.email || "",
            mobileNumber: orgdatabyId?.mobileNumber || "",
            websiteUrl: orgdatabyId?.websiteUrl || "",
            type: orgdatabyId?.organizationdetails && orgdatabyId?.organizationdetails[0].type || "",
            hippaPrivacyOfficerName: orgdatabyId?.hippaprivacyofficer && orgdatabyId?.hippaprivacyofficer[0]?.name || "",
            startTime: orgdatabyId?.shift?.startTime || "",
            duration: orgdatabyId?.shift?.duration || "",
            proximityVerification: orgdatabyId?.proximityVerification || "",
            q15Access: orgdatabyId?.q15Access || "",
            geofencing: orgdatabyId?.geofencing || "",
            addressLine1: orgdatabyId?.contact && orgdatabyId.contact[0]?.addressLine1 || "",
            addressLine2: orgdatabyId?.contact && orgdatabyId.contact[0]?.addressLine2 || "",
            city: orgdatabyId?.contact && orgdatabyId.contact[0]?.city || "",
            state: orgdatabyId?.contact && orgdatabyId.contact[0]?.state || "",
            country: orgdatabyId?.contact && orgdatabyId.contact[0]?.country || "",
            zip: orgdatabyId?.contact && orgdatabyId.contact[0]?.zip || "",
            cPerson: orgdatabyId?.pointofcontact && orgdatabyId.pointofcontact[0]?.name || "",
            cEmail: orgdatabyId?.pointofcontact && orgdatabyId.pointofcontact[0]?.email || "",
            cPhone: orgdatabyId?.pointofcontact && orgdatabyId.pointofcontact[0]?.phoneNumber || "",
            npi: orgdatabyId?.organizationdetails && orgdatabyId?.organizationdetails[0]?.npi || "",
            tin: orgdatabyId?.organizationdetails && orgdatabyId?.organizationdetails[0]?.tin || "",
        })
    }, [orgdatabyId])      

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }
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

    const handleinputchange = (event: any) => {
        if (event.target.id === 'OrganizationName') {
            formData.name = event.target.value;
        } else if (event.target.id === 'OrganizationEmail') {
            formData.email = event.target.value;
        } else if (event.target.id === 'NPI') {
            formData.npi = event.target.value;
        } else if (event.target.id === 'TIN') {
            formData.tin = event.target.value;
        } else if (event.target.id === 'OrganizationType') {
            formData.type = event.target.value;
        } else if (event.target.id === 'AddressLine1') {
            formData.addressLine1 = event.target.value;
        } else if (event.target.id === 'AddressLine2') {
            formData.addressLine2 = event.target.value;
        } else if (event.target.id === 'city') {
            formData.city = event.target.value;
        } else if (event.target.id === 'state') {
            formData.state = event.target.value;
        }else if (event.target.id === 'country') {
            formData.country = event.target.value;
        }else if (event.target.id === 'MobileNumber') {
            formData.mobileNumber = event.target.value;
        }else if (event.target.id === 'WebsiteURL') {
            formData.websiteUrl = event.target.value;
        }else if (event.target.id === 'Contactperson') {
            formData.cPerson = event.target.value;
        }else if (event.target.id === 'ContactMobile') {
            formData.cPhone = event.target.value;
        }else if (event.target.id === 'Contactemail') {
            formData.cEmail = event.target.value;
        }
        setFormData({ ...formData });
    }
    const handleSelectChange = (fieldName: string, value: any) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
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
            <FormControl sx={{ marginLeft: "3px", width: "100%" }} key={dropdownName}>
                <InputLabel id={`demo-simple-name-label-${dropdownName}`}>
                    {dropdownName}
                </InputLabel>
                <Select
                    labelId={`demo-simple-name-label-${dropdownName}`}
                    id={`demo-simple-name-${dropdownName}`}
                    value={formData[dropdownName as keyof FormData]}
                    onChange={(e: any) => handleSelectChange(dropdownName, e.target.value)}
                    onClose={() => setOpenState({ ...openState, [dropdownName]: false })}
                    onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
                    open={openState[dropdownName]}
                    input={<OutlinedInput label={dropdownName} />}
                    MenuProps={{
                        PaperProps: {
                            style: menuStyle,
                        },
                    }}
                >
                    {dropdown.list.map((item: any) => (
                        <MenuItem key={item.id} value={item.value}>
                            {item.value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };
    const handleSaveChanges = () => {
        if (!params?.id) return
        else if (formData.zip.length > 0 && formData.city === "" && formData.state === "") {
            formData.city = "";
            formData.state = "";
            formData.country = "";
            toast.error("Please Enter Valid Zip Code");
            return;
          }
        const updatedFields = {
            id: params?.id,
            organizationdetails: [
                {
                    name: formData.name,
                    type: formData.type,
                    npi: formData.npi,
                    tin: formData.tin,
                },
            ],
            email: formData.email,
            websiteUrl: formData.websiteUrl,
            shift: {
                duration: formData.duration,
                startTime: formData.startTime,
            },
            contact: [
                {
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zip: formData.zip
                }
            ],
            pointofcontact: [
                {
                    name: formData.cPerson,
                    email: formData.cEmail,
                    phoneNumber: formData.cPhone,
                }
            ],
            proximityVerification: formData.proximityVerification,
            geofencing: formData.geofencing,
            q15Access: formData.q15Access,
            hippaprivacyofficer: [
                {
                    name: formData.hippaPrivacyOfficerName,
                },
            ],
            mobileNumber: formData.mobileNumber,
        }

        dispatch(updateOrganizationDetails(params?.id, updatedFields))
    }
    return (
        <div className="row w-100" >
            {/* {loading && <Loader />} */}
            <div className="col-md-2"></div>
            <div className="col-md-8">
                <div className="row w-100 " style={{ marginTop: "20px" }}>
                    <div className="col-md-6 mb-4">
                        <TextField
                            id="OrganizationName" disabled label="Organization Name"  variant="outlined" fullWidth  value={formData.name} name="name" />
                    </div>
                    <div className="col-md-6 mb-4">
                        <TextField id="OrganizationEmail" disabled label="Organization Email"  variant="outlined" fullWidth  value={formData.email} name="email" />
                    </div>

                </div>
                <div className="row w-100 ">
                    <div className="col-md-6 mb-4">
                        <TextField
                            id="NPI"  label="NPI#" disabled variant="outlined" fullWidth value={formData.npi} name="npi" />
                    </div>
                    <div className="col-md-6 mb-4">
                        <TextField id="TIN"  label="TIN" disabled variant="outlined" fullWidth  value={formData.tin} name="tin" />
                    </div>

                </div>
                <div className="row w-100 ">
                    <div className="col-md-4 mb-4">
                        <TextField id="OrganizationType" disabled label="Organization Type"  variant="outlined" fullWidth  value={formData.type} name="type" />
                    </div>
                    <div className="col-md-4 mb-4">
        <TextField 
            id="MobileNumber" 
            disabled 
            label="Mobile Number"  
            variant="outlined" 
            fullWidth  
            value={formatPhoneNumber(formData.mobileNumber)} 
            name="mobileNumber"
        />
    </div>
                    <div className="col-md-4 mb-4">
                        <TextField id="WebsiteURL" disabled label="Website URL"  variant="outlined" fullWidth  value={formData.websiteUrl} name="websiteUrl" />
                    </div>
                </div>

                <div className="row w-100 ">
                    <div className="col-md-4 mb-4">
                        <TextField id="Contactperson" label="Contact person" variant="outlined" fullWidth onChange={handleChange} value={formData.cPerson} name="cPerson" />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField id="ContactMobile" label="Contact Mobile " variant="outlined" fullWidth onChange={handleChange} value={formatPhoneNumber(formData.cPhone)} name="cPhone" />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField id="Contactemail" label="Contact email" variant="outlined" fullWidth onChange={handleChange} value={formData.cEmail} name="cEmail" />
                    </div>
                </div>

                <div className="row w-100">
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="AddressLine1"
                            label="Address Line 1"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.addressLine1}
                            name="addressLine1"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="AddressLine2"
                            label="Address Line 2"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.addressLine2}
                            name="addressLine2"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        {/* <TextField
                            id="outlined-state"
                            label="State"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.state}
                            name="state"
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
                </div>
                <div className="row w-100">
                    <div className="col-md-4 mb-4">
                    <TextField
                            id="zipcode"
                            label="Zip/Postal Code"
                            variant="outlined"
                            fullWidth
                            value={formData.zip}
                            onChange={handlePostalCodeChange}
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="country"
                            label="Country"
                            variant="outlined"
                            fullWidth
                            value={formData.country}
                            onChange={handleinputchange}
                        />
                    </div>
                    <div className="col-md-4 mb-4">
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

                <div className="row w-100 ">
                    <div className="mt-0">
                        <label htmlFor="organizationType" className="label">
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
                                onChange={handleChange}
                                value={formData.proximityVerification}
                                name="proximityVerification"
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
                                onChange={handleChange}
                                value={formData.q15Access}
                                name="q15Access"
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
                                onChange={handleChange}
                                value={formData.geofencing}
                                name="geofencing"
                            >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="row w-100">
                </div>
                <div className="d-flex gap-3 justify-content-end mt-4">
                    <Button
                        label="Cancel"
                        disabled
                        severity="secondary"
                        style={{
                            color: "#000",
                            backgroundColor: "#fff",
                            border: "2px solid #0f3995",
                        }}
                    />
                    <Button
                        label="Save"
                        style={{ backgroundColor: "#0f3995" }}
                        onClick={handleSaveChanges}
                    />
                </div>
            </div>
        </div>
    )
}
export default ParticularOrgUpdate