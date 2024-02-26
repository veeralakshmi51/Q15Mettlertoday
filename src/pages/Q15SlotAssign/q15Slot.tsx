import React, { useEffect, useState } from "react";
import { DialogContent, DialogContentText } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import { DateCalendar, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { HttpLogin } from "../../utils/Http";
import bottomImage from '../../assets/images/bg.svg';
import MaskGroupImage from '../../assets/images/Mask group.svg';
import calendarMuiImage from '../../assets/images/calendarMuiImage.svg';
import '../../pages/Q15SlotAssign/q15Slot.css';
import moment from "moment";
import {
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    Select,
    Stack,
    AlertTitle,
    Alert
} from "@mui/material";
import { useSelector } from "react-redux";
import { successCode } from "../../configuration/url";

const Q15SlotAssign: React.FC = () => {

    let Q15RegistryData = {
        "id": "",
        "q15Date": "",
        "q15Slot": "",
        "q15Time": "",
        "enteredBy": "",
        "timestampCreatedAt": "",
        "timestampUpdatedAt": "",
        "breathing": true,
        "remarks": "",
        "shift": "",
        "shiftIncharge": "",
        "timeStamp": "",
        "location": "",
        "activity": "",
        "pid": ""
    }
    let [displayData, setDisplayData] = useState(new Array<any>());
    const { patientData } = useSelector((state: any) => state.Patient);
    const { staffData } = useSelector((state: any) => state.Staff);
    let [inputQ15Date, setInputQ15Date] = useState<any>('');
    let [inputUserName, setInputUserName] = useState<any>('');
    let [displayLocationData, setDisplayLocationData] = useState(new Array<any>());
    let [displayActivityData, setDisplayActivityData] = useState(new Array<any>());
    const [showQ15CheckView, setQ15CheckView] = useState(false);
    let [timeSlotChange, setTimeSlotChange] = useState(1);
    let [calendarChange, setCalendarChange] = useState(4);
    const [displayDialogQ15Data, setDisplayDialogQ15Data] = useState(false);
    let [showCalendarView, setShowCalendarVew] = useState(false);
    let [inputQ15Data, setInputQ15Data] = useState(Q15RegistryData);
    let [calendarDate, setCalendarDate] = useState<any>(new Date());
    const firstDay = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 3)), "DDD MMM DD YYYY HH:mm:ss").format("ddd");
    const secondDay = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 2)), "DDD MMM DD YYYY HH:mm:ss").format("ddd");
    const thirdDay = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 1)), "DDD MMM DD YYYY HH:mm:ss").format("ddd");
    const forthDay = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate())), "DDD MMM DD YYYY HH:mm:ss").format("ddd");
    const firstDate = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 3)), "DDD MMM DD YYYY HH:mm:ss").format("DD");
    const secondDate = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 2)), "DDD MMM DD YYYY HH:mm:ss").format("DD");
    const thirdDate = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 1)), "DDD MMM DD YYYY HH:mm:ss").format("DD");
    const forthDate = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate())), "DDD MMM DD YYYY HH:mm:ss").format("DD");
    let [alertMessage, setAlertMessage] = useState("");
    useEffect(() => {        
        setInputUserName(localStorage.getItem("userDetailUsername")); 
        HttpLogin.axios().get("/api/q15form/get/wg2rzH0Yjj")
            .then((newInData) => {
                if (newInData.data.message.code === successCode) {
                    let newOutData = newInData.data.data.location;
                    let entries = Object.entries(newOutData).map(([key, value]) => ({
                        label: `${value}`,
                        value: `${key}`
                    }));
                    setDisplayLocationData(entries);
                } else {
                    alert(newInData.data.message.description);
                }
            })
        HttpLogin.axios().get("/api/q15form/get/l6gsqwczMR")
            .then((newInData) => {
                if (newInData.data.message.code === successCode) {
                    let newOutData = newInData.data.data.activity;
                    let entries = Object.entries(newOutData).map(([key, value]) => ({
                        label: `${value}`,
                        value: `${key}`
                    }));
                    setDisplayActivityData(entries);
                } else {
                    alert(newInData.data.message.description);
                }
            })

    }, []);   

    const handleShowCalendar = () => {
        setShowCalendarVew(true);
    }

    const handleCalendarChange = (event: any) => {
        if (event === 1) {
            inputQ15Date = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 3)), "DDD MMM DD YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss.000Z")
        } else if (event === 2) {
            inputQ15Date = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 2)), "DDD MMM DD YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss.000Z")
        } else if (event === 3) {
            inputQ15Date = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 1)), "DDD MMM DD YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss.000Z")
        } else if (event === 4) {
            inputQ15Date = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate())), "DDD MMM DD YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss.000Z")
        } 
        setInputQ15Date(inputQ15Date);   
        setInputQ15Data({ ...inputQ15Data });
        let newDependDate = inputQ15Date !== "" ? moment(inputQ15Date,"YYYY-MM-DDTHH:mm:ss.000+05:30").format("YYYYMMDD") : moment(new Date(),"YYYY-MM-DDTHH:mm:ss.000+05:30").format("YYYYMMDD");            
            if (inputQ15Data.pid !== "" && newDependDate !== null && newDependDate !== "" && newDependDate !== undefined) {   
            //    console.log(JSON.stringify(`/loginapi/config/getById/${inputQ15Data.pid}/date/${newDependDate}`));
                HttpLogin.axios().get(`/api/config/getById/${inputQ15Data.pid}/date/${newDependDate}`)
                    .then((response) => {
                        if (response.data.data !== undefined) {                            
                            setDisplayData(response.data.data);
                            if (localStorage.getItem("CREATEQ15") !== null && localStorage.getItem("CREATEQ15") !== "" && localStorage.getItem("CREATEQ15") !== "No") {
                                let timeAddSlotChange;
                                let newCalendarChange;
                                let newCalendarDate;
                             
                                timeAddSlotChange = localStorage.getItem("TIMESLOTCHANGE");
                                setTimeSlotChange(timeAddSlotChange !== "" && timeAddSlotChange !== null ? parseInt(timeAddSlotChange) : 1);
                                newCalendarChange = localStorage.getItem("Q15CALENDARCHANGE");
                                setCalendarChange(newCalendarChange !== "" && timeAddSlotChange !== null ? parseInt(timeAddSlotChange) : 4);
                                newCalendarDate = localStorage.getItem("Q15DATE");
                                setCalendarDate(newCalendarDate !== "" && newCalendarDate !== null ? new Date(newCalendarDate):calendarDate);
                                inputQ15Date = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate())), "DDD MMM DD YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss.000Z")
                                setInputQ15Date(inputQ15Date);
                                inputQ15Data.q15Date = inputQ15Date;
                                setInputQ15Data({ ...inputQ15Data });
                                localStorage.setItem("CREATEQ15", "No");
                                setQ15CheckView(true);
                            }
                        } else {
                            // alert(response.data.message.description);
                        }
                    })
            }               
        calendarChange = event;
        setCalendarChange(event);
        setCalendarDate(calendarDate);

        setDisplayDialogQ15Data(false);
    }

    const handleTimeSlotChange = (event: any) => {
        timeSlotChange = event;
        setTimeSlotChange(event);
    //    console.log(JSON.stringify(inputQ15Date));
    }

    const handleQ15Close = () => {
        localStorage.setItem("CREATEQ15", "No");
        setQ15CheckView(false);
    }

    const handleNewClose = () => {
        localStorage.setItem("CREATEQ15", "No");
        setQ15CheckView(false);
        setDisplayDialogQ15Data(false);
    }


    let [timeSlotSectionChange, setTimeSlotSectionChange] = useState(null);
    const handleDisplayDialogQ15Data = (event: any, newString: any, addData: any) => {
        if (addData != "") {
            inputQ15Data.id = addData.id;
            inputQ15Date = new Date(moment(addData.q15Date, "YYYYMMDD").format("YYYY-MM-DDTHH:mm:ss.000Z"));
            inputQ15Data.q15Slot = addData.q15Slot;
            let newStaffData = staffData !== null && staffData !== undefined && staffData.filter((t: any) => t.id === addData.enteredBy).map((k: any) => { return k.name[0].given + " " + k.name[0].family });
            inputQ15Data.enteredBy = newStaffData[0];
            inputQ15Data.q15Time = addData.q15Time;
            inputQ15Data.location = addData.location;
            inputQ15Data.activity = addData.activity;                       
            inputQ15Data.q15Date = inputQ15Date;
            setInputQ15Date(inputQ15Date);
            setInputQ15Data({ ...inputQ15Data });
        } else {
            if (calendarChange === 1) {
                inputQ15Date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 3);
            } else if (calendarChange === 2) {
                inputQ15Date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 2);
            } else if (calendarChange === 3) {
                inputQ15Date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 1);
            } else if (calendarChange === 4) {
                inputQ15Date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());
            }
            inputQ15Data.q15Date = inputQ15Date;
            setInputQ15Date(inputQ15Date);
            inputQ15Data.q15Slot = event;
            inputQ15Data.q15Time = newString;
            inputQ15Data.location = "";
            inputQ15Data.activity = "";
            inputQ15Data.enteredBy = inputUserName;
            timeSlotSectionChange = event;
           
            setTimeSlotSectionChange(event);
            setInputQ15Data({ ...inputQ15Data });
        }
        localStorage.setItem("TIMESLOTCHANGE", timeSlotChange.toString());
        localStorage.setItem("Q15CALENDARCHANGE", calendarChange.toString());
        localStorage.setItem("Q15DATE", inputQ15Date);
        
        setDisplayDialogQ15Data(true);       
    }


    const handleInputChange = (event: any) => {
        if (event.target.id === "patientId") {
            inputQ15Data.pid = event.target.value;
            let newDependDate = inputQ15Date !== "" ? moment(inputQ15Date,"YYYY-MM-DDTHH:mm:ss.000+05:30").format("YYYYMMDD") : moment(new Date(),"YYYY-MM-DDTHH:mm:ss.000+05:30").format("YYYYMMDD");            
            if (event.target.value !== "" && newDependDate !== null && newDependDate !== "" && newDependDate !== undefined) {   
            //    console.log(JSON.stringify(`/loginapi/config/getById/${event.target.value}/date/${newDependDate}`));
                HttpLogin.axios().get(`/api/config/getById/${event.target.value}/date/${newDependDate}`)
                    .then((response) => {
                        if (response.data.data !== undefined) {
                            
                            setDisplayData(response.data.data);
                            if (localStorage.getItem("CREATEQ15") !== null && localStorage.getItem("CREATEQ15") !== "" && localStorage.getItem("CREATEQ15") !== "No") {
                                let timeAddSlotChange;
                                let newCalendarChange;
                                let newCalendarDate;
                             
                                timeAddSlotChange = localStorage.getItem("TIMESLOTCHANGE");
                                setTimeSlotChange(timeAddSlotChange !== "" && timeAddSlotChange !== null ? parseInt(timeAddSlotChange) : 1);
                                newCalendarChange = localStorage.getItem("Q15CALENDARCHANGE");
                                setCalendarChange(newCalendarChange !== "" && timeAddSlotChange !== null ? parseInt(timeAddSlotChange) : 4);
                                newCalendarDate = localStorage.getItem("Q15DATE");
                                setCalendarDate(newCalendarDate !== "" && newCalendarDate !== null ? new Date(newCalendarDate):calendarDate);
                                inputQ15Date = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate())), "DDD MMM DD YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss.000Z")
                                setInputQ15Date(inputQ15Date);
                                inputQ15Data.q15Date = inputQ15Date;
                                setInputQ15Data({ ...inputQ15Data });
                                localStorage.setItem("CREATEQ15", "No");
                                setQ15CheckView(true);
                            }
                        } else {
                            // alert(response.data.message.description);
                        }
                    })
            }else{
                inputQ15Data.pid = event.target.value;
            }
        }
        setInputQ15Data({ ...inputQ15Data });
    }

    const [showAlertup, setShowAlertup] = useState(false);
    const [showAlertcr, setShowAlertcr] = useState(false);
    const [showAlerter, setShowAlerter] = useState(false);
    const handleQ15ClickChange = () => {
        localStorage.setItem("CREATEQ15", "Yes");
        inputQ15Data.pid = inputQ15Date;
        setInputQ15Data({ ...inputQ15Data });
        // setAlertMessage("Please enter all given required data");

        if (inputQ15Data.activity === "" && inputQ15Data.location === "") {
            setShowAlerter(true);
            setTimeout(() => {
                setShowAlerter(false);
            }, 1000);
            setAlertMessage("Some datas are missing");
        } else {

        }
    }

    return (
        <div className='row w-97' style={{ height: '625px', width: '97%', display: 'flex', flexDirection: 'column' }}>
            <div className="mb-3 row">
                <div className="col-sm-3"></div>
                <label htmlFor="Patient Name" style={{ textAlign: 'right', paddingTop: '1px' }} className="col-sm-2 col-form-label">Patient Name:</label>
                <div className="col-sm-3">
                    <select className="form-select form-select-sm" id="patientId" aria-label=".form-select-sm example" value={inputQ15Data.pid} onChange={handleInputChange}>
                        <option value="">Select Patient</option>
                        {
                            patientData?.map((item: any) => {
                                return (
                                    <option value={item?.id}>{item?.basicDetails[0]?.name[0]?.given + ' ' + item?.basicDetails[0]?.name[0]?.family}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col-sm-4"></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <a style={{ cursor: 'pointer' }} onClick={() => handleCalendarChange(1)}><div style={{ position: 'relative', left: '20px', top: '15px' }} className={calendarChange === 1 ? "patient-Q15-CalendarSelectOutline" : "patient-Q15-CalendarUnselectOutline"}>
                    <div style={{ position: 'relative', left: '2px', top: '49px' }} className={calendarChange === 1 ? "patient-Q15-CalendarSelectLine" : "patient-Q15-CalendarUnSelectLine"}>
                        <div style={{ position: 'relative', left: '16px', top: '-41px' }} className="patient-Q15-CalendarText">{firstDate}</div>
                        <div style={{ position: 'relative', left: '18px', top: '-32px', fontSize: '12px' }} className="patient-Q15-CalendarText">{firstDay}</div>
                    </div>
                </div></a>
                <a style={{ cursor: 'pointer' }} onClick={() => handleCalendarChange(2)}>
                    <div style={{ position: 'relative', left: '39px', top: '15px' }} className={calendarChange === 2 ? "patient-Q15-CalendarSelectOutline" : "patient-Q15-CalendarUnselectOutline"}>
                        <div style={{ position: 'relative', left: '1.5px', top: '49px' }} className={calendarChange === 2 ? "patient-Q15-CalendarSelectLine" : "patient-Q15-CalendarUnSelectLine"}>
                            <div style={{ position: 'relative', left: '16px', top: '-41px' }} className="patient-Q15-CalendarText">{secondDate}</div>
                            <div style={{ position: 'relative', left: '18px', top: '-32px', fontSize: '12px' }} className="patient-Q15-CalendarText">{secondDay}</div>
                        </div>
                    </div></a>
                <a style={{ cursor: 'pointer' }} onClick={() => handleCalendarChange(3)}><div style={{ position: 'relative', left: '58px', top: '15px' }} className={calendarChange === 3 ? "patient-Q15-CalendarSelectOutline" : "patient-Q15-CalendarUnselectOutline"}>
                    <div style={{ position: 'relative', left: '1.5px', top: '49px' }} className={calendarChange === 3 ? "patient-Q15-CalendarSelectLine" : "patient-Q15-CalendarUnSelectLine"}>
                        <div style={{ position: 'relative', left: '16px', top: '-41px' }} className="patient-Q15-CalendarText">{thirdDate}</div>
                        <div style={{ position: 'relative', left: '18px', top: '-32px', fontSize: '12px' }} className="patient-Q15-CalendarText">{thirdDay}</div>
                    </div>
                </div></a>
                <a style={{ cursor: 'pointer' }} onClick={() => handleCalendarChange(4)}><div style={{ position: 'relative', left: '77px', top: '15px' }} className={calendarChange === 4 ? "patient-Q15-CalendarSelectOutline" : "patient-Q15-CalendarUnselectOutline"}>
                    <div style={{ position: 'relative', left: '1.5px', top: '49px' }} className={calendarChange === 4 ? "patient-Q15-CalendarSelectLine" : "patient-Q15-CalendarUnSelectLine"}>
                        <div style={{ position: 'relative', left: '16px', top: '-41px' }} className="patient-Q15-CalendarText">{forthDate}</div>
                        <div style={{ position: 'relative', left: '18px', top: '-32px', fontSize: '12px' }} className="patient-Q15-CalendarText">{forthDay}</div>
                    </div>
                </div></a>
                <a style={{ cursor: 'pointer' }} onClick={handleShowCalendar}><div style={{ position: 'relative', left: '96px', top: '15px' }} className="patient-Q15-CalendarUnselectOutline">
                    <img style={{ position: 'relative', left: '17px', top: '21px', width: '32px', height: '32px' }} src={calendarMuiImage} />
                </div>
                </a>
            </div>

            <div>
                <div style={{ position: 'relative', left: '20px', top: '30px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(1)}><div className={timeSlotChange === 1 ? "patient-Q15-TimeSlotSelect" : "patient-Q15-TimeSlotUnSelect"}>0:00 - 5:45</div></a>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(2)}><div style={{ position: 'relative', left: '25px' }} className={timeSlotChange === 2 ? "patient-Q15-TimeSlotSelect" : "patient-Q15-TimeSlotUnSelect"}>6:00 - 11:45</div></a>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(3)}><div style={{ position: 'relative', left: '50px' }} className={timeSlotChange === 3 ? "patient-Q15-TimeSlotSelect" : "patient-Q15-TimeSlotUnSelect"}>12:00 - 17:45</div></a>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(4)}><div style={{ position: 'relative', left: '73px' }} className={timeSlotChange === 4 ? "patient-Q15-TimeSlotSelect" : "patient-Q15-TimeSlotUnSelect"}>18:00 - 23:45</div></a>
                </div>
                <div style={{ position: 'relative', left: '-105px', top: '39px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(1)}><div className={timeSlotChange === 1 ? "patient-Q15-TimeSlotSelectLine" : ""}></div></a>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(2)}><div style={{ position: 'relative', left: '99px' }} className={timeSlotChange === 2 ? "patient-Q15-TimeSlotSelectLine" : ""}></div></a>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(3)}><div style={{ position: 'relative', left: '208px' }} className={timeSlotChange === 3 ? "patient-Q15-TimeSlotSelectLine" : ""}></div></a>
                    <a style={{ cursor: 'pointer' }} onClick={() => handleTimeSlotChange(4)}><div style={{ position: 'relative', left: '322px' }} className={timeSlotChange === 4 ? "patient-Q15-TimeSlotSelectLine" : ""}></div></a>
                </div>
                <div>
                    {timeSlotChange === 1 ? <>
                        <div style={{ position: 'relative', left: '42px', top: '61px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A00", "0000-0015", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A00", "0000-0015", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A00" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">00.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B00", "0015-0030", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B00", "0015-0030", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B00" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">00.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C00", "0030-0045", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C00", "0030-0045", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C00" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">00.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D00" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D00", "0045-0100", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D00", "0045-0100", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D00" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D00" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">00.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '69px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A01", "0100-0115", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A01", "0100-0115", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A01" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">01.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B01", "0115-0130", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B01", "0115-0130", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B01" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">01.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C01", "0130-0145", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C01", "0130-0145", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C01" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">01.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D01" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D01", "0145-0200", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D01", "0145-0200", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D01" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D01" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">01.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '76px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A02", "0200-0215", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A02", "0200-0215", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A02" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">02.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B02", "0215-0230", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B02", "0215-0230", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B02" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">02.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C02", "0230-0245", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C02", "0230-0245", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C02" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">02.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D02" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D02", "0245-0300", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D02", "0245-0300", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D02" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D02" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">02.45</span>
                                    </div></a>
                            }
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '83px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A03", "0300-0315", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A03", "0300-0315", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A03" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">03.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B03", "0315-0330", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B03", "0315-0330", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B03" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">03.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C03", "0330-0345", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C03", "0330-0345", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C03" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">03.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D03" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D03", "0345-0400", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D03", "0345-0400", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D03" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D03" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">03.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '90px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A04", "0400-0415", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A04", "0400-0415", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A04" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">04.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B04", "0415-0430", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B04", "0415-0430", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B04" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">04.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C04", "0430-0445", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C04", "0430-0445", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C04" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">04.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D04" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D04", "0445-0500", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D04", "0445-0500", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D04" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D04" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">04.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '97px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A05", "0500-0515", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A05", "0500-0515", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A05" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">05.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B05", "0515-0530", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B05", "0515-0530", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B05" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">05.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C05", "0530-0545", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C05", "0530-0545", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C05" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">05.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D05" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D05", "0545-0600", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D05", "0545-0600", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D05" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D05" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">05.45</span>
                                    </div></a>}
                        </div>
                    </> : timeSlotChange === 2 ? <>
                        <div style={{ position: 'relative', left: '42px', top: '61px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A06", "0600-0615", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A06", "0600-0615", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A06" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">06.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B06", "0615-0630", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B06", "0615-0630", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B06" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">06.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C06", "0630-0645", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C06", "0630-0645", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C06" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">06.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D06" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D06", "0645-0700", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D06", "0645-0700", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D06" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D06" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">06.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '69px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A07", "0700-0715", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A07", "0700-0715", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A07" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">07.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B07", "0715-0730", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B07", "0715-0730", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B07" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">07.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C07", "0730-0745", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C07", "0730-0745", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C07" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">07.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D07" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D07", "0745-0800", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D07", "0745-0800", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D07" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D07" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">07.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '76px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A08", "0800-0815", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A08", "0800-0815", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A08" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">08.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B08", "0815-0830", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B08", "0815-0830", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B08" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">08.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C08", "0830-0845", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C08", "0830-0845", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C08" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">08.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D08" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D08", "0845-0900", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D08", "0845-0900", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D08" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D08" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">08.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '83px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A09", "0900-0915", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A09", "0900-0915", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A09" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">09.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B09", "0915-0930", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B09", "0915-0930", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B09" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">09.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C09", "0930-0945", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C09", "0930-0945", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C09" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">09.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D09" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D09", "0945-1000", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D09", "0945-1000", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D09" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D09" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">09.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '90px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A10", "1000-1015", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A10", "1000-1015", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A10" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">10.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B10", "1015-1030", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B10", "1015-1030", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B10" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">10.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C10", "1030-1045", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C10", "1030-1045", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C10" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">10.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D10" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D10", "1045-1100", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D10", "1045-1100", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D10" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D10" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">10.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '97px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A11", "1100-1115", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A11", "1100-1115", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A11" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">11.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B11", "1115-1130", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B11", "1115-1130", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B11" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">11.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C11", "1130-1145", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C11", "1130-1145", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C11" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">11.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D11" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D11", "1145-1200", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D11", "1145-1200", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D11" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D11" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">11.45</span>
                                    </div></a>}
                        </div>
                    </> : timeSlotChange === 3 ? <>
                        <div style={{ position: 'relative', left: '42px', top: '61px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A12", "1200-1215", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A12", "1200-1215", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A12" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">12.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B12", "1215-1230", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B12", "1215-1230", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B12" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">12.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C12", "1230-1245", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C12", "1230-1245", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C12" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">12.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D12" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D12", "1245-1300", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D12", "1245-1300", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D12" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D12" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">12.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '69px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A13", "1300-1315", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A13", "1300-1315", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A13" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">13.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B13", "1315-1330", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B13", "1315-1330", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B13" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">13.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C13", "1330-1345", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C13", "1330-1345", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C13" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">13.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D13" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D13", "1345-1400", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D13", "1345-1400", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D13" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D13" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">13.45</span>
                                    </div></a>
                            }
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '76px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A14", "1400-1415", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A14", "1400-1415", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A14" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">14.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B14", "1415-1430", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B14", "1415-1430", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B14" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">14.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C14", "1430-1445", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C14", "1430-1445", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C14" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">14.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D14" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D14", "1445-1500", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D14", "1445-1500", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D14" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D14" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">14.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '83px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A15", "1500-1515", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A15", "1500-1515", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A15" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">15.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B15", "1515-1530", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B15", "1515-1530", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B15" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">15.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C15", "1530-1545", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C15", "1530-1545", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C15" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">15.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D15" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D15", "1545-1600", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D15", "1545-1600", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D15" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D15" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">15.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '90px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A16", "1600-1615", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A16", "1600-1615", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A16" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">16.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B16", "1615-1630", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B16", "1615-1630", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B16" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">16.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C16", "1630-1645", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C16", "1630-1645", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C16" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">16.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D16" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D16", "1645-1700", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D16", "1645-1700", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D16" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D16" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">16.45</span>
                                    </div></a>
                            }
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '97px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A17", "1700-1715", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A17", "1700-1715", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A17" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">17.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B17", "1715-1730", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B17", "1715-1730", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B17" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">17.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C17", "1730-1745", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C17", "1730-1745", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C17" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">17.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D17" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D17", "1745-1800", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D17", "1745-1800", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D17" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D17" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">17.45</span>
                                    </div></a>}
                        </div>
                    </> : timeSlotChange === 4 ? <>
                        <div style={{ position: 'relative', left: '42px', top: '61px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A18", "1800-1815", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A18", "1800-1815", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A18" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">18.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B18", "1815-1830", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B18", "1815-1830", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B18" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">18.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C18", "1830-1845", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C18", "1830-1845", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C18" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">18.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D18" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D18", "1845-1900", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D18", "1845-1900", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D18" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D18" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">18.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '69px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A19", "1900-1915", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A19", "1900-1915", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A19" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">19.00</span>
                                    </div></a>}

                            {displayData.filter(i => i.q15Slot === "B19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B19", "1915-1930", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B19", "1915-1930", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B19" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">19.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C19", "1930-1945", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C19", "1930-1945", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C19" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">19.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D19" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D19", "1945-2000", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D19", "1945-2000", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D19" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D19" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">19.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '76px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A20", "2000-2015", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A20", "2000-2015", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A20" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">20.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B20", "2015-2030", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B20", "2015-2030", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B20" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">20.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C20", "2030-2045", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C20", "2030-2045", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C20" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">20.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D20" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D20", "2045-2100", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D20", "2045-2100", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D20" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D20" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">20.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '83px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A21", "2100-2115", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A21", "2100-2115", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A21" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">21.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B21", "2115-2130", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B21", "2115-2130", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B21" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">21.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C21", "2130-2145", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C21", "2130-2145", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C21" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">21.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D21" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D21", "2145-2200", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D21", "2145-2200", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D21" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D21" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">21.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '90px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A22", "2200-2215", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A22", "2200-2215", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A22" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">22.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B22", "2215-2230", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B22", "2215-2230", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B22" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">22.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C22", "2230-2245", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C22", "2230-2245", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C22" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">22.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D22" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D22", "2245-2200", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D22", "2245-2200", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D22" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D22" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">22.45</span>
                                    </div></a>}
                        </div>
                        <div style={{ position: 'relative', left: '42px', top: '97px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {displayData.filter(i => i.q15Slot === "A23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "A23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A23", "2300-2315", k)}>
                                    <div style={{ background: timeSlotSectionChange === "A23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("A23", "2300-2315", "")}>
                                    <div style={{ background: timeSlotSectionChange === "A23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "A23" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">23.00</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "B23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "B23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B23", "2315-2330", k)}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("B23", "2315-2330", "")}>
                                    <div style={{ position: 'relative', left: '10px', background: timeSlotSectionChange === "B23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "B23" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">23.15</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "C23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "C23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C23", "2330-2345", k)}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("C23", "2330-2345", "")}>
                                    <div style={{ position: 'relative', left: '20px', background: timeSlotSectionChange === "C23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "C23" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">23.30</span>
                                    </div></a>}
                            {displayData.filter(i => i.q15Slot === "D23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map((k) => { return k; }).length > 0 ? displayData.filter(i => i.q15Slot === "D23" && i.q15Date === moment(inputQ15Date).format("YYYYMMDD")).map(k => (
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D23", "2345-0000", k)}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <><img src={MaskGroupImage} style={{ width: '103px', height: '51px', borderRadius: '5px', position: 'relative', left: '-35px', top: '-13.1px' }}></img>
                                            <span style={{ position: 'relative', top: '-51px' }} className="patient-Q15-OccupiedSlot-Text">{k.location + "-" + k.activity}</span></>
                                    </div></a>)) :
                                <a style={{ cursor: 'pointer' }} onClick={() => handleDisplayDialogQ15Data("D23", "2345-0000", "")}>
                                    <div style={{ position: 'relative', left: '30px', background: timeSlotSectionChange === "D23" ? "#4977D9" : "" }} className="patient-Q15-SlotSection">
                                        <span style={{ color: timeSlotSectionChange === "D23" ? "#FFF" : "" }} className="patient-Q15-SlotSection-Text">23.45</span>
                                    </div></a>}
                        </div>
                    </> : <></>}
                </div>
            </div>
            <Dialog maxWidth={'md'} PaperProps={{ sx: { position: 'absolute', width: '316px', height: '570px', maxHeight: 'calc(100% - 237px)' } }} style={{ left: '826px', top: '42px', height: '570px' }} open={showCalendarView} onClose={() => setShowCalendarVew(false)} >
                <DialogContent style={{ padding: '0px', overflow: 'hidden' }}>
                    <DialogContentText>
                        <div style={{}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateCalendar className="patient-Q15-Calendar"
                                    value={calendarDate}
                                    onChange={(newValue: any) => {
                                        calendarDate = newValue;
                                        setCalendarDate(calendarDate);                                          
                                        setInputQ15Date(newValue);
                                        setCalendarChange(4);
                                        inputQ15Data.q15Date = newValue;
                                        let newDependDate = newValue !== "" ? moment(newValue,"YYYY-MM-DDTHH:mm:ss.000+05:30").format("YYYYMMDD") : moment(new Date(),"YYYY-MM-DDTHH:mm:ss.000+05:30").format("YYYYMMDD");            
                                        if (inputQ15Data.pid !== "" && newDependDate !== null && newDependDate !== "" && newDependDate !== undefined) {   
                                            //console.log(JSON.stringify(`/loginapi/config/getById/${inputQ15Data.pid}/date/${newDependDate}`));
                                            HttpLogin.axios().get(`/api/config/getById/${inputQ15Data.pid}/date/${newDependDate}`)
                                                .then((response) => {
                                                    if (response.data.data !== undefined) {                            
                                                        setDisplayData(response.data.data);
                                                        if (localStorage.getItem("CREATEQ15") !== null && localStorage.getItem("CREATEQ15") !== "" && localStorage.getItem("CREATEQ15") !== "No") {
                                                            let timeAddSlotChange;
                                                            let newCalendarChange;
                                                            let newCalendarDate;
                                                         
                                                            timeAddSlotChange = localStorage.getItem("TIMESLOTCHANGE");
                                                            setTimeSlotChange(timeAddSlotChange !== "" && timeAddSlotChange !== null ? parseInt(timeAddSlotChange) : 1);
                                                            newCalendarChange = localStorage.getItem("Q15CALENDARCHANGE");
                                                            setCalendarChange(newCalendarChange !== "" && timeAddSlotChange !== null ? parseInt(timeAddSlotChange) : 4);
                                                            newCalendarDate = localStorage.getItem("Q15DATE");
                                                            setCalendarDate(newCalendarDate !== "" && newCalendarDate !== null ? new Date(newCalendarDate):calendarDate);
                                                            inputQ15Date = moment((new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate())), "DDD MMM DD YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss.000Z")
                                                            setInputQ15Date(inputQ15Date);
                                                            inputQ15Data.q15Date = inputQ15Date;
                                                            setInputQ15Data({ ...inputQ15Data });
                                                            localStorage.setItem("CREATEQ15", "No");
                                                            setQ15CheckView(true);
                                                        }
                                                    } else {
                                                        // alert(response.data.message.description);
                                                    }
                                                })
                                        }  
                                        setInputQ15Data({...inputQ15Data});
                                        setShowCalendarVew(false);
                                    }} />
                            </LocalizationProvider>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Dialog maxWidth={'md'} PaperProps={{ sx: { position: 'absolute', width: '397px', height: '570px' } }} style={{ left: '826px', top: '42px', height: '570px' }} open={displayDialogQ15Data} onClose={handleNewClose} >
                <DialogContent style={{ padding: '0px', overflow: 'hidden' }}>
                    <DialogContentText>
                        <div style={{ display: "flex", position: "fixed", top: "10px", width: "96%", zIndex: 999, justifyContent: "end", left: "20px" }}>
                            {showAlertcr && (
                                <Stack style={{ height: "83px", width: "380px" }} spacing={2} >
                                    <Alert style={{}} severity="success" >
                                        <AlertTitle>{alertMessage}</AlertTitle>

                                    </Alert>
                                </Stack>
                            )}

                            {showAlerter && (
                                <Stack style={{ height: "83px", width: "332px" }} spacing={2} >
                                    <Alert style={{}} severity="error">
                                        <AlertTitle>{alertMessage}</AlertTitle>

                                    </Alert>
                                </Stack>
                            )}
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div style={{ position: 'relative', left: '22px', top: '20px' }}>
                                <div style={{ fontSize: '16px' }} className="patient-Q15-dialogTitle">Enter Date and Time</div>
                                <div style={{ fontSize: '16px', position: 'relative', left: '0px', top: '1px', opacity: '0.5' }} className="patient-Q15-dialogTitle">{inputQ15Data.q15Time.slice(0, 2) + "." + inputQ15Data.q15Time.slice(2, 4)} - {inputQ15Data.q15Time.slice(5, 7) + "." + inputQ15Data.q15Time.slice(7, 9)}</div>

                                <div style={{ width: '354px', position: 'relative', top: '22px', left: '1px', height: '48px' }}>
                                    <DatePicker autoFocus={displayDialogQ15Data}
                                        label="Date"
                                        value={inputQ15Date}
                                        onChange={(newValue) => {
                                            inputQ15Date = newValue;
                                            setInputQ15Data({ ...inputQ15Data });
                                        }}
                                        slotProps={{
                                            textField: {
                                                variant: "outlined",
                                                size: "medium",
                                                fullWidth: true,
                                                color: "primary",
                                            },
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', height: '48px' }}>
                                    <TextField
                                        id="q15TimePeriod" value={inputQ15Data.q15Time.slice(0, 2) + "." + inputQ15Data.q15Time.slice(2, 4)}
                                        style={{ position: 'relative', left: '1px', top: '46px', width: '170px' }}
                                        color="primary"
                                        variant="outlined"
                                        type="text"
                                        label="Start Time"
                                        placeholder="Placeholder"
                                        size="medium"
                                        margin="none"
                                    />
                                    <TextField
                                        id="q15TimePeriod1" value={inputQ15Data.q15Time.slice(5, 7) + "." + inputQ15Data.q15Time.slice(7, 9)}
                                        style={{ position: 'relative', left: '14px', top: '46px', width: '170px' }}
                                        color="primary"
                                        variant="outlined"
                                        type="text"
                                        label="End Time"
                                        placeholder="Placeholder"
                                        size="medium"
                                        margin="none"
                                    />
                                </div>

                                <div style={{ position: 'relative', top: '70px' }}>
                                    <TextField
                                        id="q15EnteredBy" value={inputQ15Data.enteredBy} disabled={true}
                                        style={{ width: '354px' }}
                                        color="primary"
                                        variant="outlined"
                                        type="text"
                                        label="Enter Staff Name"
                                        placeholder="Placeholder"
                                        size="medium"
                                        margin="none"
                                        required
                                    />
                                </div>
                                <div style={{ position: 'relative', top: '85px', height: '48px' }}>
                                    <FormControl style={{ width: '354px' }} variant="outlined">
                                        <InputLabel color="primary">Location Legend</InputLabel>
                                        <Select color="primary" size="medium" label="Location Legend" name="q15Location" value={inputQ15Data.location} onChange={(e) => {
                                            inputQ15Data.location = e.target.value;
                                            setInputQ15Data({ ...inputQ15Data });
                                        }}>
                                            {displayLocationData.map((newData, i) => {
                                                return (
                                                    <MenuItem key={i} value={newData.value}>{newData.label}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                        <FormHelperText />
                                    </FormControl>
                                    <FormControl style={{ width: '354px', top: '12px' }} className="name-input41" variant="outlined">
                                        <InputLabel color="primary">Condition Legend</InputLabel>
                                        <Select color="primary" size="medium" label="Condition Legend" name="q15Activity" value={inputQ15Data.activity} onChange={(e) => {
                                            inputQ15Data.activity = e.target.value;
                                            setInputQ15Data({ ...inputQ15Data });
                                        }}>
                                            {displayActivityData.map((newData, i) => {
                                                return (
                                                    <MenuItem key={i} value={newData.value}>{newData.label}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                        <FormHelperText />
                                    </FormControl>
                                </div>

                                <div style={{ position: 'relative', top: '183px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <button style={{ cursor: 'pointer' }} className="btn btn-danger"
                                        onClick={handleNewClose}
                                    >Cancel</button>
                                    <button style={{ cursor: 'pointer' }} className="btn btn-primary"
                                        onClick={handleQ15ClickChange}
                                    >Save</button>

                                </div>
                            </div>
                        </LocalizationProvider>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Q15SlotAssign