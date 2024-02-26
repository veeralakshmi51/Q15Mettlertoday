import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { baseURL, successCode } from "../../configuration/url";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Autocomplete,
  TextField,
} from "@mui/material";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from "primereact/button";
import { getAllBeacon } from "../../slices/thunk";
interface FormData {
  id: string;
  uuid: string;
  deviceName: string;
  deviceId: string;
  BeaconType: string;
  modelNumber: string;
  orgId: string;
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
interface BeaconCreationFormProps {
  modal: boolean;
  toggle: () => void;
  deviceType:string;
  uuid:string;
  modelNumber:string;
}
const initialFormData: FormData = {
  id: "",
  uuid: "",
  deviceName: "",
  deviceId: "",
  BeaconType: "",
  modelNumber: "",
  orgId: "",
};
const BeaconCreation: React.FC<BeaconCreationFormProps> = ({
  modal,
  toggle,
  deviceType,
  uuid,
  modelNumber,
}) => {
  const initSelect = {
    BeaconType: null,
  };
  const { organization } = useSelector((state: any) => state.Login);
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const [search, setSearch] = useState("");
  const [formValues, setFormValues] = useState<FormData>(initialFormData);
  const [selectedValues, setSelectedValues] = useState<any>(initSelect);
  const dispatch = useDispatch<any>();
  const resetForm = () => {
    setFormValues(initialFormData);
  };
  const handleCancelClick = () => {
    toggle();
    resetForm();
    setSelectedValues(initSelect);
  };
  const handleSaveClick = async () => {
    const requestBody = {
      id: "",
      uuid: formValues.uuid,
      deviceName: formValues.deviceName,
      deviceId: formValues.deviceId,
      deviceType: selectedValues.BeaconType?.value,
      modelNumber: formValues.modelNumber,
      orgId: organization,
    };
    try {
      if (!formValues.uuid || !formValues.deviceId || !formValues.deviceName) {
        toast.error("Please fill the required fields");
        return;
      }
      const response = await axios.post(
        `${baseURL}/sensor/register`,
        requestBody
      );
      if (
        response.data.message &&
        response.data.message.code === successCode
      ) {
        toast.success(response.data.message.description);
        toggle();
        resetForm();
        handleCancelClick();
        getAllBeacon(dispatch,organization)
      } else {
        toast.warning(response.data.message.description);
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error("beaconCreate: ", error);
    }
  };

  const handleSelectChange = (fieldName: string, value: any) => {
    setFormValues({ ...formValues, [fieldName]: value });
  };

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    deviceType: false,
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

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      size="lg"
      centered
      style={{ width: "580px" }}
    >
      <div className="d-flex align-items-center justify-content-center m-20">
        <div className="row w-100">
          <div className="container col-md-12">
          
            <ModalHeader toggle={toggle}>Beacon Registration</ModalHeader>
            <ModalBody>
            <div
              className="row w-100"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
                <div className="col-md-12 mb-2">
                <TextField
                  id="outlined-basic-1"
                  label="Unique Id(UUID)"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setFormValues({ ...formValues, uuid: e.target.value })
                  }
                />
              </div>
            </div>
            <div
              className="row w-100"
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <div className="col-md-6 mb-2">
                <TextField
                  id="outlined-basic-1"
                  label="Mac Address"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setFormValues({ ...formValues, deviceId: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <TextField
                  id="outlined-basic-1"
                  label="Device Type"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      modelNumber: e.target.value,
                    })
                  }
                />
              </div>
              
            </div>
            <div
              className="row w-100"
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
            <div className="col-md-6 mb-2">
                <TextField
                  id="outlined-basic-1"
                  label="Serial Number"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setFormValues({ ...formValues, deviceName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <Autocomplete
                  id="Model"
                  options={(
                    dropdownData.find(
                      (dropdown) => dropdown.dropdown === "BeaconType"
                    )?.list || []
                  ).filter((item: DropdownItem) =>
                    item.value
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )}
                  getOptionLabel={(option: any) => option.value}
                  value={selectedValues.BeaconType}
                  onChange={(event: any, value: any) => {
                    setSelectedValues({ ...selectedValues, BeaconType: value });
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Model"
                      placeholder="Enter BeaconType"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>
            </ModalBody>
          </div>

          <ModalFooter className="">
            <div className="d-flex gap-3 justify-content-center">
              <Button
                label="Cancel"
                severity="secondary"
                style={{
                  color: "#000",
                  backgroundColor: "#94a0b7",
                  fontWeight: "bold",
                }}
                onClick={handleCancelClick}
              ></Button>
              <Button
                label="Save Changes"
                style={{ backgroundColor: "#0f3995", fontWeight: "bold" }}
                onClick={handleSaveClick}
              ></Button>
            </div>
          </ModalFooter>

          <ToastContainer />
        </div>
      </div>
    </Modal>
  );
};

export default BeaconCreation;
