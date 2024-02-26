import React, { useEffect, useRef, useState } from "react";
import Calendar from "../../components/calendar";
import './staffconfig.css'
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { BrowserMultiFormatReader } from "@zxing/library";
import{
FaCalendar, FaQrcode
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getAllRNIncharge, getAllSocialWorkers, getPSConfigByDate } from "../../slices/thunk";
import ErrorPopup from "../../components/errorPopup";
import { closeErrorPopup } from "../../slices/staffConfiguration/reducer";
import { getOrgByID } from "../../slices/organization/thunk";
import { saveOrganization } from "../../slices/login/reducer";
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { HttpLogin } from "../../utils/Http";
import { Button } from "primereact/button";
import Modal from 'react-bootstrap/Modal';
import { baseURL, successCode } from "../../configuration/url";

const Q15StaffConfiguration = () => {
    const dispatch = useDispatch<any>()
    const { loading, shiftData, isOpen, errorMsg } = useSelector((state: any) => state.PSConfig)
    const { shiftStartTime } = useSelector((state: any) => state.Org)
    const { organization } = useSelector((state: any) => state.Login)
    const [selectedDate, setSelectedDate] = useState(new Date());
    let [shiftTimeName1] = useState<any>(0);
    const startTime = new Date(`2000-01-01T${shiftStartTime}`);
    const endTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000);
    const shiftAEndTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    const BEndTime = new Date(endTime.getTime() + 8 * 60 * 60 * 1000);
    const shiftBEndTime = `${BEndTime.getHours().toString().padStart(2, '0')}:${BEndTime.getMinutes().toString().padStart(2, '0')}`;
    const formatDate = (date: any) => {
        const options = { day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };
    let [incharge, setIncharge] = useState<any>('');
    let [newIndex, setNewIndex] = useState<any>('');
    let [newEvent, setNewEvent] = useState<any>('');    
    let [newRegister, setNewRegister] = useState<any>('');
    // Calculate time slots based on start time
    const slot1StartTime = shiftStartTime;
    const slot2StartTime = addHours(slot1StartTime, 2);
    const slot3StartTime = addHours(slot2StartTime, 2);
    const slot4StartTime = addHours(slot3StartTime, 2);
    // Calculate time slots based on end time
    const slot1EndTime = slot2StartTime;
    const slot2EndTime = slot3StartTime;
    const slot3EndTime = slot4StartTime;
    const slot4EndTime = shiftAEndTime;
    const { rnInchargeList, socialWorkerList } = useSelector((state: any) => state.PSConfig)
    const Bslot1StartTime = slot4EndTime;
    const Bslot2StartTime = addHours(Bslot1StartTime, 2);
    const Bslot3StartTime = addHours(Bslot2StartTime, 2);
    const Bslot4StartTime = addHours(Bslot3StartTime, 2);
    // Calculate time slots based on end time
    const Bslot1EndTime = Bslot2StartTime;
    const Bslot2EndTime = Bslot3StartTime;
    const Bslot3EndTime = Bslot4StartTime;
    const Bslot4EndTime = shiftBEndTime;
    
    const Cslot1StartTime = Bslot4EndTime;
    const Cslot2StartTime = addHours(Cslot1StartTime, 2);
    const Cslot3StartTime = addHours(Cslot2StartTime, 2);
    const Cslot4StartTime = addHours(Cslot3StartTime, 2);
    // Calculate time slots Cased on end time
    const Cslot1EndTime = Cslot2StartTime;
    const Cslot2EndTime = Cslot3StartTime;
    const Cslot3EndTime = Cslot4StartTime;
    const Cslot4EndTime = shiftStartTime;
    const [selectedTab, setSelectedTab] = useState('Shift-A');
  
      const renderDateBoxes = () => {      
        const dateBoxes = [];
      
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(selectedDate);
            currentDate.setDate(selectedDate.getDate() + i);        
            const date = selectedDate.getDate().toString().padStart(2, '0');
            const year = selectedDate.getFullYear();
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');           
            window.localStorage.setItem("getByDate",`${year}${month}${date}`)
            dateBoxes.push(
                <Calendar
                    key={i}
                    day={currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
                    date={formatDate(currentDate)}
                    onClick={() => setSelectedDate(currentDate)}
                    isSelected={selectedDate?.toDateString() === currentDate.toDateString()}
                />
            );
        }
        return dateBoxes;
    };
    const closePopup = () => {
        dispatch(closeErrorPopup())
    }

    let addSlotRegister1 = [{
        roomRange: [],
        deviceId:"",
        staff: "",
        startRoomNo:"",
        endRoomNo:""  
    }]
    let addSlotRegister2 = [{
        roomRange: [],
        deviceId:"",
        staff: "",
        startRoomNo:"",
        endRoomNo:""  
    }]
    let addSlotRegister3 = [{
        roomRange: [],
        deviceId:"",
        staff: "",
        startRoomNo:"",
        endRoomNo:""  
    }]
    let addSlotRegister4 = [{
        roomRange: [],
        deviceId:"",
        staff: "",
        startRoomNo:"",
        endRoomNo:""  
    }]
    const videoRef = useRef(null);
    const codeReader = new BrowserMultiFormatReader();
    const [scanning, setScanning] = useState(false);
    useEffect(() => {
        const date = selectedDate.getDate().toString().padStart(2, '0');
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');  
        console.log(JSON.stringify(`${year}${month}${date}`));
        console.log(JSON.stringify(`${baseURL}/PSConfig/getByDate/${year}${month}${date}`));
        HttpLogin.axios().get(`/api/PSConfig/getByDate/${year}${month}${date}`)
        .then((response) => {
            if(response.data.message.code === 'MHC - 0200'){
                let newData = response.data.data.shift.length > 0 ? response.data.data.shift.filter((l:any) => (l.shiftName === selectedTab)).map((k:any)=>{return k}) : [];
                console.log(JSON.stringify(newData[0]?.schedule[0]?.bedStaff));
                setIncharge(newData[0]?.rnIncharge);
                setSlotRegister1(newData[0]?.schedule[0]?.bedStaff !== null && newData[0]?.schedule[0]?.bedStaff !== undefined ? newData[0].schedule[0].bedStaff: addSlotRegister1)
                setSlotRegister2(newData[0]?.schedule[1]?.bedStaff !== null && newData[0]?.schedule[1]?.bedStaff !== undefined ? newData[0].schedule[1].bedStaff: addSlotRegister2)
                setSlotRegister3(newData[0]?.schedule[2]?.bedStaff !== null && newData[0]?.schedule[2]?.bedStaff !== undefined ? newData[0].schedule[2].bedStaff: addSlotRegister3)
                setSlotRegister4(newData[0]?.schedule[3]?.bedStaff !== null && newData[0]?.schedule[3]?.bedStaff !== undefined ? newData[0].schedule[3].bedStaff: addSlotRegister4)
            }else{
                setIncharge("");
                setSlotRegister1(addSlotRegister1);
                setSlotRegister2(addSlotRegister2);
                setSlotRegister3(addSlotRegister3);
                setSlotRegister4(addSlotRegister4);
            }
        })
        
        //getPSConfigByDate(dispatch, `${year}${month}${date}`)
    }, [dispatch,selectedDate,selectedTab])

    const getShiftData = (shiftName:string) => {
        return shiftData?.find((shift:any) => shift?.shiftName === shiftName) || {};
    };

    const handleTabClick = (tabId:any) => {
        setSelectedTab(tabId);
        const date = selectedDate.getDate().toString().padStart(2, '0');
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');  
        console.log(JSON.stringify(`${year}${month}${date}`));
        HttpLogin.axios().get(`/api/PSConfig/getByDate/${year}${month}${date}`)
        .then((response) => {
            if(response.data.message.code === 'MHC - 0200'){
                let newData = response.data.data.shift.length > 0 ? response.data.data.shift.filter((l:any) => (l.shiftName === tabId)).map((k:any)=>{return k}) : [];
                setIncharge(newData[0]?.rnIncharge);
                setSlotRegister1(newData[0]?.schedule[0]?.bedStaff !== null && newData[0]?.schedule[0]?.bedStaff !== undefined ? newData[0].schedule[0].bedStaff: addSlotRegister1)
                setSlotRegister2(newData[0]?.schedule[1]?.bedStaff !== null && newData[0]?.schedule[1]?.bedStaff !== undefined ? newData[0].schedule[1].bedStaff: addSlotRegister2)
                setSlotRegister3(newData[0]?.schedule[2]?.bedStaff !== null && newData[0]?.schedule[2]?.bedStaff !== undefined ? newData[0].schedule[2].bedStaff: addSlotRegister3)
                setSlotRegister4(newData[0]?.schedule[3]?.bedStaff !== null && newData[0]?.schedule[3]?.bedStaff !== undefined ? newData[0].schedule[3].bedStaff: addSlotRegister4)
            }
        })
    }

    useEffect(() => {
        saveOrganization(dispatch)
        getAllRNIncharge(dispatch, 'Registered Nurses', organization)
        getAllSocialWorkers(dispatch, 'Social Workers', organization)
        getOrgByID(dispatch, organization)
    },[dispatch,selectedDate])
  // Helper function to add hours to a given time
    function addHours(time:any, hours:any) {
        const baseTime = new Date(`2000-01-01T${time}`);
        const newTime = new Date(baseTime.getTime() + hours * 60 * 60 * 1000);
        return `${newTime.getHours().toString().padStart(2, '0')}:${newTime.getMinutes().toString().padStart(2, '0')}`;
    }

    let [slotRegister1, setSlotRegister1] = useState(new Array<any>(addSlotRegister1));
    let [slotRegister2, setSlotRegister2] = useState(new Array<any>(addSlotRegister2));
    let [slotRegister3, setSlotRegister3] = useState(new Array<any>(addSlotRegister3));
    let [slotRegister4, setSlotRegister4] = useState(new Array<any>(addSlotRegister4));
    let [allStaffData, setAllStaffData] = useState(new Array<any>());  
    let [addStaffData, setAddStaffData] = useState(new Array<any>());       

    const date1 = selectedDate.getDate().toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const forDate = `${year}${month}${date1}`



const handleCancel = () => {  
    setIncharge(incharge);
}

useEffect(() => {  
    setAllStaffData(socialWorkerList !== null && socialWorkerList !== undefined ? socialWorkerList: []);
    setAddStaffData(socialWorkerList !== null && socialWorkerList !== undefined ? socialWorkerList.map((k: any) => { return k.name[0].given + " " + k.name[0].family }): [])    
}, [dispatch])
 
useEffect(() => {      
    
    setIncharge(incharge);
}, []);

    const [roomNumbers, setRoomNumbers] = useState(new Array<any>());
    const [selectedRoomNumbers, setSelectedRoomNumbers] = useState([]);
 
    useEffect(() => {
        fetch(`${baseURL}/Q15Bed/getByOccupied/${organization}`)
        .then(response => response.json())
        .then(data => {
            const rooms = data.data.map((item:any) => item.roomNo);
            setRoomNumbers(rooms);
        })
        .catch(error => console.error('Error fetching room numbers:', error));
    }, []);

    useEffect(() => {
        if (scanning) {
            startScanning();
        } else {
            codeReader.reset();
            setNewEvent('');
            setNewIndex('');
            setNewRegister([]);
        }

        return () => {
            codeReader.reset();
        };
    }, [scanning]);

    const startScanning = async () => {
        try {
            setScanning(true);
            console.log((newEvent));
            console.log((newIndex));
            console.log((newRegister));
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
                    if(newRegister === "1"){
                        slotRegister1[newIndex].deviceId = result.getText();                 
                        setSlotRegister1(slotRegister1);                  
                        console.log(JSON.stringify(slotRegister1));   
                    }else if(newRegister === "2"){
                        slotRegister2[newIndex].deviceId = result.getText();                 
                        setSlotRegister2(slotRegister2);                              
                    }else if(newRegister === "3"){
                        slotRegister3[newIndex].deviceId = result.getText();                 
                        setSlotRegister3(slotRegister3); 
                    } else if(newRegister === "4"){
                        slotRegister4[newIndex].deviceId = result.getText();                 
                        setSlotRegister4(slotRegister4); 
                    }         
                  //setDeviceId(result.getText());
                           handleClose()
                  // Automatically open the modal                  
                  const modal = document.getElementById("exampleModal");
                  if (modal) {
                    modal.classList.add("show");
                    modal.style.display = "block";
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
    
      const handleClose = () => { 
        setShow(false)
        setScanning(false)  
        setNewIndex('');
        setNewRegister('');
        codeReader.reset()
      };
 
    
    const closeModalAndRec = () => {
      setShow(false)
      setScanning(false)
      codeReader.reset()
    }
   
    const handleFieldRemove1 = (index:any) => {
        const list = [...slotRegister1];
        list.splice(index, 1);
        setSlotRegister1(list);
    };
   
    const handleFieldAdd1 = () => {
   
        setSlotRegister1([...slotRegister1,
        {
            roomRange: [],
            deviceId:"",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };
    const handleFieldRemove2 = (index:any) => {
        const list = [...slotRegister2];
        list.splice(index, 1);
        setSlotRegister2(list);
    };

    const handleFieldAdd2 = () => {
        setSlotRegister2([...slotRegister2,
        {
            roomRange: [],
            deviceId:"",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };

    const handleFieldRemove3 = (index:any) => {
        const list = [...slotRegister3];
        list.splice(index, 1);
        setSlotRegister3(list);
    };

    const handleFieldAdd3 = () => {
        setSlotRegister3([...slotRegister3,
        {
            roomRange: [],
            deviceId:"",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };

    const handleFieldRemove4 = (index:any) => {
        const list = [...slotRegister4];
        list.splice(index, 1);
        setSlotRegister4(list);
    };

    const handleFieldAdd4 = () => {
        setSlotRegister4([...slotRegister4,
        {
            roomRange: [],
            deviceId:"",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };

    const handleDateChange = (e: any) => {
        try {
            const newDate = new Date(e.target.value);
            setSelectedDate(newDate);
            const date = newDate.getDate().toString().padStart(2, '0');
            const year = newDate.getFullYear();
            const month = (newDate.getMonth() + 1).toString().padStart(2, '0');      
            HttpLogin.axios().get(`/api/PSConfig/getByDate/${year}${month}${date}`)
            .then((response) => {
            if(response.data.message.code === 'MHC - 0200'){
                    let newData = response.data.data.shift.length > 0 ? response.data.data.shift.filter((l:any) => (l.shiftName === selectedTab)).map((k:any)=>{return k}) : [];
                    console.log(JSON.stringify(newData));
                    console.log(JSON.stringify(`${baseURL}/PSConfig/getByDate/${year}${month}${date}`));
                    setIncharge(newData[0]?.rnIncharge);
                    setSlotRegister1(newData[0]?.schedule[0]?.bedStaff !== null && newData[0]?.schedule[0]?.bedStaff !== undefined ? newData[0].schedule[0].bedStaff: addSlotRegister1)
                    setSlotRegister2(newData[0]?.schedule[1]?.bedStaff !== null && newData[0]?.schedule[1]?.bedStaff !== undefined ? newData[0].schedule[1].bedStaff: addSlotRegister2)
                    setSlotRegister3(newData[0]?.schedule[2]?.bedStaff !== null && newData[0]?.schedule[2]?.bedStaff !== undefined ? newData[0].schedule[2].bedStaff: addSlotRegister3)
                    setSlotRegister4(newData[0]?.schedule[3]?.bedStaff !== null && newData[0]?.schedule[3]?.bedStaff !== undefined ? newData[0].schedule[3].bedStaff: addSlotRegister4)
                }
            })
        } catch (error) {
            alert(error)
        }
    };

    const handleQrClick = (index:any, newSlotRegister:any)=> {
        setShow(true);
        setScanning(!scanning);  
        setNewIndex(index);
        setNewRegister(newSlotRegister);
    }

    const handleSubmit = async() => {
        try {
            let bodyData;
            const bodyA = {
                id:"",date:forDate,createdAt:"",updatedAt:"",shift :[{shiftName:"Shift-A",rnIncharge:incharge,startTime,endTime,schedule:[{time:slot1StartTime + "-" + slot1EndTime,bedStaff:slotRegister1 !== null ? slotRegister1.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]} ,{time:slot2StartTime + "-" + slot2EndTime,bedStaff:slotRegister2 !== null ? slotRegister2.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]},{time:slot3StartTime + "-" + slot3EndTime,bedStaff:slotRegister3 !== null ? slotRegister3.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]},{time:slot4StartTime + "-" + slot4EndTime,bedStaff:slotRegister4 !== null ? slotRegister4.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})): []}]}]} 
            const bodyB = {
                id:"",date:forDate,createdAt:"",updatedAt:"",shift :[{shiftName:"Shift-B",rnIncharge:incharge,startTime,endTime,schedule:[{time:Bslot1StartTime + "-" + Bslot1EndTime,bedStaff:slotRegister1 !== null ? slotRegister1.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})): []},{time:Bslot2StartTime + "-" + Bslot2EndTime,bedStaff:slotRegister2 !== null ? slotRegister2.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]},{time:Bslot3StartTime + "-" + Bslot3EndTime,bedStaff:slotRegister3 !== null ? slotRegister3.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]},{time:Bslot4StartTime + "-" + Bslot4EndTime,bedStaff:slotRegister4 !== null ? slotRegister4.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]}]}]}
            const bodyC = {
                id:"",date:forDate,createdAt:"",updatedAt:"",shift :[{shiftName:"Shift-C",rnIncharge:incharge,startTime,endTime,schedule:[{time:Cslot1StartTime + "-" + Cslot1EndTime,bedStaff:slotRegister1 !== null ? slotRegister1.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})): []},{time:Cslot2StartTime + "-" + Cslot2EndTime,bedStaff:slotRegister2 !== null ? slotRegister2.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]},{time:Cslot3StartTime + "-" + Cslot3EndTime,bedStaff:slotRegister3 !== null ? slotRegister3.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]},{time:Cslot4StartTime + "-" + Cslot4EndTime,bedStaff:slotRegister4 !== null ? slotRegister4.map((k) => ({roomRange: [], staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`,deviceId: `${k.deviceId}`})):[]}]}]}

            if(selectedTab === "Shift-A"){bodyData = { ...bodyA };} else if(selectedTab === "Shift-B")bodyData = { ...bodyB };else bodyData = { ...bodyC };
        
            const response = await axios.post(`${baseURL}/PSConfig/register`, bodyData);   
            if (response.data.message.code === successCode) {
                toast.success(response.data.message.description)
            
            } else {
                toast.error("Login failed: " + response.data.message.description);
            }
        } catch (error) {
            toast.error("An error occurred during register.");
        }
}

    return (
        <React.Fragment>
            {loading && <Loader />}
            <div className="w-100" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            
                <div className="d-flex gap-3">
                    {renderDateBoxes()}
                    <div className="inpMain">
                        <input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                        />
                        <FaCalendar className="react-icons"/>
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-center">
        <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <button
            className={`nav-link ${selectedTab === 'Shift-A' ? 'active' : ''}`}
            id="Shift-A-tab"
            type="button"
            role="tab"
            aria-controls="Shift-A"
            aria-selected={selectedTab === 'Shift-A'}
            onClick={() => handleTabClick('Shift-A')}
            style={{ backgroundColor: selectedTab === 'Shift-A' ? '#0f3995' : '', color: selectedTab === 'Shift-A' ? '' : '#0f3995' }}
        >
            Shift-A
            </button>
            <button
            className={`nav-link ${selectedTab === 'Shift-B' ? 'active' : ''}`}
            id="Shift-B-tab"
            type="button"
            role="tab"
            aria-controls="Shift-B"
            aria-selected={selectedTab === 'Shift-B'}
            onClick={() => handleTabClick('Shift-B')}
            style={{ backgroundColor: selectedTab === 'Shift-B' ? '#0f3995' : '', color: selectedTab === 'Shift-B' ? '' : '#0f3995' }}
            >
            Shift-B
            </button>
            <button
            className={`nav-link ${selectedTab === 'Shift-C' ? 'active' : ''}`}
            id="Shift-C-tab"
            type="button"
            role="tab"
            aria-controls="Shift-C"
            aria-selected={selectedTab === 'Shift-C'}
            onClick={() => handleTabClick('Shift-C')}
            style={{ backgroundColor: selectedTab === 'Shift-C' ? '#0f3995' : '', color: selectedTab === 'Shift-C' ? '' : '#0f3995' }}
            >
            Shift-C
            </button>       
            {/* Repeat similar structure for other tabs */}
        </div>
        <div className="tab-content-container" >
        <div  id={`${selectedTab === 'Shift-A' ? 'Shift-A' : selectedTab === 'Shift-B'?'Shift-B':selectedTab === 'Shift-C'?'Shift-C':''}`} role="tabpanel" aria-labelledby={`${selectedTab === 'Shift-A' ? 'Shift-A' : selectedTab === 'Shift-B'?'Shift-B':selectedTab === 'Shift-C'?'Shift-C':''}-tab`}>
        <div className="p-3">
                <div className="d-flex justify-content-center align-items-center rounded p-1" style={{ backgroundColor: '#0f3995' }}>
                    <span className='text-white'>{selectedTab} Configuration</span>
                </div>
                <div className='row mt-1 p-1'>
                    <div className="form-floating mb-3 col-md-2 p-1" >
                        <input type="text" value={selectedTab === 'Shift-A' ? shiftStartTime : selectedTab === 'Shift-B'?shiftAEndTime:selectedTab === 'Shift-C'?shiftBEndTime:shiftStartTime} className="form-control" id="floatingStartTime" disabled placeholder='start time' />
                        <label htmlFor="floatingStartTime">Start Time</label>
                    </div>
                    <div className="form-floating mb-3 col-md-2 p-1">
                        <input type="text" value={selectedTab === 'Shift-A' ? shiftAEndTime : selectedTab === 'Shift-B'?shiftBEndTime:selectedTab === 'Shift-C'?shiftStartTime:shiftAEndTime} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                        <label htmlFor="floatingEndTime">End Time</label>
                    </div>
                    <div className="mb-3 col-md-6 form-floating p-1">
                        <select className="form-select" id="floatingSelect" onChange={ (e:any) => setIncharge(e.target.value) } value={incharge ? incharge : ""}>
                        <option value="">Select RN Incharge</option>
                            {
                                rnInchargeList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect'>Shift Incharge</label>
                    </div>
                </div>
                <div className="row" style={{height:'30px'}}><div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2">
                <div className="form-floating mb-3 col-md-5"></div>
                <div className="mb-3 col-md-4">
                <label htmlFor="floatingEndTime" style={{fontSize:'14px'}}>Room Number</label>
                </div>                
                <div className="mb-3 col-md-2">
                <label htmlFor="floatingEndTime" style={{fontSize:'14px'}}>Device Id</label>                
                </div>
                <div className="form-floating mb-3 col-md-1"></div>
                </div>
                </div><div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2">
                <div className="form-floating mb-3 col-md-5"></div>
                <div className="mb-3 col-md-4">
                <label htmlFor="floatingEndTime" style={{fontSize:'14px'}}>Room Number</label>
                </div>                
                <div className="mb-3 col-md-2">
                <label htmlFor="floatingEndTime" style={{fontSize:'14px'}}>Device Id</label> 
                </div>
                </div>
                </div></div>
                <div className="row">
                <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2 d-flex flex-column">
                {(slotRegister1.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={selectedTab === "Shift-A"? slot1StartTime + "-" + slot1EndTime:selectedTab === "Shift-B"? Bslot1StartTime + "-" + Bslot1EndTime:Cslot1StartTime + "-" + Cslot1EndTime} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 1</label></>}                              
                            </div>
                            <div className="mb-3 col-md-3 form-floating p-1">   
                            <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) =>   {let data = [...slotRegister1];
                                data[index].staff = e.target.value;                                                        
                            setSlotRegister1(data)}} value={addField.staff}>
                        <option value="">Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Social Workers</label>                                                 
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                                let data = [...slotRegister1];
                                data[index].startRoomNo = e.target.value;                                                        
                            setSlotRegister1(data)
                        }} value={addField.startRoomNo}>    
                        <option value="">-select-</option>                   
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Start</label>     
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">                                                                      
                    <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                                let data = [...slotRegister1];
                                data[index].endRoomNo = e.target.value;                                                
                            setSlotRegister1(data)
                            }} value={addField.endRoomNo}>      
                            <option value="">-select-</option>                                
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>End</label>              
                    </div> 
                    <div className="form-floating mb-2 col-md-2 p-1">
                        <input 
                            type="text" 
                            className="form-control" 
                            style={{fontSize:'10px'}} 
                            id="floatingStartTime" 
                            value={addField.deviceId} 
                            onChange={(e:any) => {
                                let data = [...slotRegister1];
                                data[index].deviceId = e.target.value;                                                
                                setSlotRegister1(data);
                            }} 
                        />
                        <FaPlusCircle className="position-absolute top-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer', }} />
                        <FaQrcode onClick={() => handleQrClick(index, "1")} className="position-absolute bottom-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer' }} />
                        </div>
                    <div className='col-md-1 d-flex align-items-center' style={{position:'relative', left:'5px'}} role='button'>{slotRegister1.map((addField, index) => (
                                    slotRegister1.length - 1 === index &&
                                <FaPlusCircle  onClick={handleFieldAdd1}/>
                                ))}{slotRegister1.length !== 1 && (
                                    <FaMinusCircle style={{position:'relative', left:'5px'}} onClick={() => handleFieldRemove1(index)}/>
                                    )}</div>                                                                                    
                                    </div>
                                    
                            )))}  
                                </div>
                </div>
                <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2 d-flex flex-column">
                {(slotRegister2.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={selectedTab === "Shift-A"? slot2StartTime + "-" + slot2EndTime:selectedTab === "Shift-B"? Bslot2StartTime + "-" + Bslot2EndTime:Cslot2StartTime + "-" + Cslot2EndTime} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 2</label></>}                              
                            </div>
                            <div className="mb-3 col-md-3 form-floating p-1">   
                            <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) =>   {let data = [...slotRegister2];
                                data[index].staff = e.target.value;                                                        
                            setSlotRegister2(data)}} value={addField.staff}>
                        <option value="">Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Social Workers</label>                                                 
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                              let data = [...slotRegister2];
                              data[index].startRoomNo = e.target.value;                                                        
                          setSlotRegister2(data)
                        }} value={addField.startRoomNo}>    
                        <option value="">-select-</option>                   
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Start</label>     
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">                                                                      
                    <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                                let data = [...slotRegister2];
                                data[index].endRoomNo = e.target.value;                                                
                            setSlotRegister2(data)
                            }} value={addField.endRoomNo}>      
                            <option value="">-select-</option>                                
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>End</label>              
                    </div> 
                    <div className="form-floating mb-2 col-md-2 p-1">
                        <input type="text" className="form-control" style={{fontSize:'12px'}} id="floatingStartTime" value={addField.deviceId} onChange={(e:any) => {
                                let data = [...slotRegister2];
                                data[index].deviceId = e.target.value;                                                
                            setSlotRegister2(data)
                        }} />
                        <FaPlusCircle className="position-absolute top-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer', }} />
                        <FaQrcode onClick={() => handleQrClick(index, "2")} className="position-absolute bottom-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer' }} />
                    </div>    
                                                                        
                    <div className='col-md-1 d-flex align-items-center' style={{position:'relative', left:'5px'}} role='button'>{slotRegister2.map((addField, index) => (
                                        slotRegister2.length - 1 === index &&
                                <FaPlusCircle  onClick={handleFieldAdd2}/>
                                ))}{slotRegister2.length !== 1 && (
                                    <FaMinusCircle style={{position:'relative', left:'5px'}} onClick={() => handleFieldRemove2(index)}/>
                                    )}</div>                                                                                    
                                    </div>
                                    
                            )))}  
                                </div>
                </div>
                </div>
                <div className="row">
                <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2 d-flex flex-column">
                {(slotRegister3.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={selectedTab === "Shift-A"? slot3StartTime + "-" + slot3EndTime:selectedTab === "Shift-B"? Bslot3StartTime + "-" + Bslot3EndTime:Cslot3StartTime + "-" + Cslot3EndTime} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 3</label></>}                              
                            </div>
                            <div className="mb-3 col-md-3 form-floating p-1">   
                            <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) =>   {let data = [...slotRegister3];
                              data[index].staff = e.target.value;                                                        
                          setSlotRegister3(data)}} value={addField.staff}>
                        <option value="">Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Social Workers</label>                                                 
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                              let data = [...slotRegister3];
                              data[index].startRoomNo = e.target.value;                                                        
                          setSlotRegister3(data)
                        }} value={addField.startRoomNo}>    
                        <option value="">-select-</option>                   
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Start</label>     
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">                                                                      
                    <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                              let data = [...slotRegister3];
                              data[index].endRoomNo = e.target.value;                                                
                          setSlotRegister3(data)
                        }} value={addField.endRoomNo}>      
                         <option value="">-select-</option>                                
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>End</label>              
                    </div> 
                    <div className="form-floating mb-2 col-md-2 p-1">
                        <input type="text" className="form-control" style={{fontSize:'12px'}} id="floatingStartTime" value={addField.deviceId} onChange={(e:any) => {
                              let data = [...slotRegister3];
                              data[index].deviceId = e.target.value;                                                
                          setSlotRegister3(data)
                        }} />
                        <FaPlusCircle className="position-absolute top-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer', }} />
                        <FaQrcode onClick={() => handleQrClick(index, "3")} className="position-absolute bottom-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer' }} />
                    </div>                                                               
                    <div className='col-md-1 d-flex align-items-center' style={{position:'relative', left:'5px'}} role='button'>{slotRegister3.map((addField, index) => (
                                          slotRegister3.length - 1 === index &&
                                <FaPlusCircle  onClick={handleFieldAdd3}/>
                                ))}{slotRegister3.length !== 1 && (
                                    <FaMinusCircle style={{position:'relative', left:'5px'}} onClick={() => handleFieldRemove3(index)}/>
                                    )}</div>                                                                                    
                                    </div>
                                    
                            )))}  
                                </div>
                </div>
                <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2 d-flex flex-column">
                {(slotRegister4.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={selectedTab === "Shift-A"? slot4StartTime + "-" + slot4EndTime:selectedTab === "Shift-B"? Bslot4StartTime + "-" + Bslot4EndTime:Cslot4StartTime + "-" + Cslot4EndTime} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 4</label></>}                              
                            </div>
                            <div className="mb-3 col-md-3 form-floating p-1">   
                            <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) =>   {let data = [...slotRegister4];
                              data[index].staff = e.target.value;                                                        
                          setSlotRegister4(data)}} value={addField.staff}>
                        <option value="">Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Social Workers</label>                                                 
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                              let data = [...slotRegister4];
                              data[index].startRoomNo = e.target.value;                                                        
                          setSlotRegister4(data)
                        }} value={addField.startRoomNo}>    
                        <option value="">-select-</option>                   
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>Start</label>     
                        </div>                       
                        <div className="form-floating mb-3 col-md-2 p-1">                                                                      
                    <select className="form-select" id="floatingSelect" style={{fontSize:'12px'}} onChange={ (e:any) => {
                              let data = [...slotRegister4];
                              data[index].endRoomNo = e.target.value;                                                
                          setSlotRegister4(data)
                        }} value={addField.endRoomNo}>      
                         <option value="">-select-</option>                                
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label style={{fontSize:'12px'}} htmlFor='floatingSelect'>End</label>              
                    </div> 
                    <div className="form-floating mb-2 col-md-2 p-1">
                        <input type="text" className="form-control" style={{fontSize:'12px'}} id="floatingStartTime" value={addField.deviceId} onChange={(e:any) => {
                              let data = [...slotRegister4];
                              data[index].deviceId = e.target.value;                                                
                          setSlotRegister4(data)
                        }} />
                        <FaPlusCircle className="position-absolute top-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer', }} />
                        <FaQrcode onClick={() => handleQrClick(index, "4")} className="position-absolute bottom-0 m-3" style={{ fontSize: '0.8rem',color:'#000',right: '0', cursor:'pointer' }} />
                    </div>                                                               
                    <div className='col-md-1 d-flex align-items-center' style={{position:'relative', left:'5px'}} role='button'>{slotRegister4.map((addField, index) => (
                                          slotRegister4.length - 1 === index &&
                                <FaPlusCircle  onClick={handleFieldAdd4}/>
                                ))}{slotRegister4.length !== 1 && (
                                    <FaMinusCircle style={{position:'relative', left:'5px'}} onClick={() => handleFieldRemove4(index)}/>
                                    )}</div>                                                                                    
                                    </div>
                                    
                            )))}  
                                </div>
                </div>
                </div> 
               
                <div className="d-flex gap-3 justify-content-end mt-3">
                <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7',fontSize:'12px', fontWeight:'bold'}} onClick={handleCancel}></Button>
                <Button label="Save Changes" style={{ backgroundColor: '#0f3995',fontSize:'12px',fontWeight:'bold'}} onClick={handleSubmit}></Button>
            </div>
            </div>
        </div>        
      </div>
    </div>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Scanning</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <video ref={videoRef} style={{ display: scanning ? "block" : "none", width: '100%', height: '400px' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button label={'Close'} variant="secondary" onClick={handleClose} >
          </Button>
          <Button label={scanning ? "Stop Scanning" : "Start Scanning"} style={{ backgroundColor: '#0f3995' }} onClick={closeModalAndRec}/>
        </Modal.Footer>
      </Modal>
    
            <ErrorPopup
                closePopup={closePopup}
                errorMsg={errorMsg}
                open={isOpen}
            />
        </React.Fragment>
    );
};

export default Q15StaffConfiguration;