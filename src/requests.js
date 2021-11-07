import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, FormHelperText, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import cloneDeep from 'lodash/cloneDeep';
import { useLocation } from 'react-router-dom';

function Request(props) {
    // const location = useLocation();
    // console.log(location.hpId);
    // console.log(props);
    const Profile = () => {
        const data = useLocation();
        console.log(data);
     }

    return(
        <>
        
            <h1>Hospital Requests</h1>
            <RequestForm />
        </>
    );
}

function RequestForm() {
    // console.log(this.props.location.state.params.hpId);
    const [request, setRequest] = useState({hospitalId: '', bloodGroup: '', unitsNeeded: '', driver:'', ambulanceNo: ''})
    const [refreshScreen, setRefreshScreen] = useState(false);
    const [validationError, setValidationError] = useState(false);


    const onValueChange = (e, key) => {
        var value = e.target.value
        if (key === "unitsNeeded") {
            if (isNaN(value)) {
                setValidationError(true);
            }
            else {
                setValidationError(false);
            }
        }
        setRequest({...request, [key]: value});
    }

    const[hospitalData, setHospitalData] = useState(null);
    const[hospitalError, setHospitalError] = useState(null);
    const[bloodData, setBloodData] = useState(null);
    const[bloodError, setBloodError] = useState(null);
    const[driverData, setDriverData] = useState(null);
    const[driverError, setDriverError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/hospitals`)
        .then((response) => response.json())
        .then(setHospitalData)
        .catch(setHospitalError);
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/blood`)
        .then((response) => response.json())
        .then(setBloodData)
        .catch(setBloodError);
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/staff/drivers`)
        .then((response) => response.json())
        .then(setDriverData)
        .catch(setDriverError);
    }, []);

    const onSubmit = () => {
        console.log(request);
        var error = false;
        var units = 0;
        if(!isNaN(request.unitsNeeded)) {
            units = parseFloat(request.unitsNeeded);
        } else { error = true; }

        if(request.hospitalId > 0) {}
        else { toast("Please select an hospital"); error = true; }
        if(request.bloodGroup === "") { toast("Please select a blood group"); error = true; }
        if(request.driver > 0) {}
        else { toast("Please assign a driver"); error = true; }
        if(request.ambulanceNo === "") { toast("Please assign an ambulance to deliver"); error = true; }

        if (!error) {
            var jsonData = cloneDeep(request);
            request.unitsNeeded = units;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(jsonData)
            }
            fetch(`http://localhost:8080/request/serve`, requestOptions)
                .then((response) => response.json())
                .then(result => success(result))
                .catch(error => failure(error));
        }
    }

    const success = (result) => {
        if(result === parseFloat(request.unitsNeeded)) {
            toast.success("Requested units of blood will be delivered shortly");
            setRequest({hospitalId: '', bloodGroup: '', unitsNeeded: '', ambulanceNo: ''});
            setRefreshScreen(!refreshScreen);
        }
        else if(result < parseFloat(request.unitsNeeded)) {
            toast.success("Only " + result + " units of blood is available at the moment and will be delivered shortly")
            setRequest({hospitalId: '', bloodGroup: '', unitsNeeded: '', ambulanceNo: ''});
            setRefreshScreen(!refreshScreen);
        }
        else {
            toast.success("Blood unavailable at the moment")
            setRequest({hospitalId: '', bloodGroup: '', unitsNeeded: '', ambulanceNo: ''});
            setRefreshScreen(!refreshScreen);
        }
    }
    const failure = (error) => {
        console.log(error)
        toast.error("Error capturing your request");
    }

    return(
        <div>
            <FormControl variant="filled" size="small" style={{width: "25vw"}}>
                <InputLabel id="hospital">Hospital</InputLabel>
                <Select labelId="hospital" id="hospital-dd" value={request.hospitalId}
                                label="Hospital" onChange={(e) => onValueChange(e, "hospitalId")}>
                    <MenuItem key="" value="">-- Requested Hospital --</MenuItem>
                    { hospitalData ? hospitalData.map(hospital => (
                        <MenuItem key={hospital.id} value={hospital.id}>{hospital.name}</MenuItem>
                    )) : null }
                    { hospitalError ? <MenuItem value={null}>Error fetching data...</MenuItem> : null }
                </Select>
            </FormControl> <br />

            <FormControl variant="filled" size="small" style={{width: "25vw", marginTop: "10px"}}>
                <InputLabel id="blood-group">Blood Group</InputLabel>
                <Select labelId="blood-group" id="blood-group-dd" value={request.bloodGroup}
                                label="Blood Group" onChange={(e) => onValueChange(e, "bloodGroup")}>
                    <MenuItem key="" value="">-- Requested Blood Group --</MenuItem>
                    { bloodData ? bloodData.map(blood => (
                        <MenuItem key={blood.bloodGroup} value={blood.bloodGroup}>{blood.bloodGroup}</MenuItem>
                    )) : null }
                    { bloodError ? <MenuItem value={null}>Error fetching data...</MenuItem> : null }
                </Select>
            </FormControl> <br />

            <FormControl>
                <TextField label="Units needed" variant="filled" value={request.unitsNeeded}
                        size="small" onChange={(e) => onValueChange(e, "unitsNeeded")}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error = {validationError}
                        style={{width: "25vw", marginTop: "10px"}}
                        aria-describedby="component-error-text" />
                <FormHelperText id="component-error-text"
                    style={{color: "red", display: validationError ? "block" : "none"}}>
                        Only numbers are considered valid input.
                </FormHelperText>
            </FormControl> <br />

            <FormControl variant="filled" size="small" style={{width: "25vw", marginTop: "10px"}}>
                <InputLabel id="driver">Driver</InputLabel>
                <Select labelId="driver" id="driver-dd" value={request.driver}
                                label="Driver" onChange={(e) => onValueChange(e, "driver")}>
                    <MenuItem key="" value="">-- Assign a driver --</MenuItem>
                    { driverData ? driverData.map(driver => (
                        <MenuItem key={driver.id} value={driver.id}>{driver.name}</MenuItem>
                    )) : null }
                    { driverError ? <MenuItem value={null}>Error fetching data...</MenuItem> : null }
                </Select>
            </FormControl> <br />

            <TextField label="Assign an Ambulance (No)" variant="filled" value={request.ambulanceNo}
                        size="small" onChange={(e) => onValueChange(e, "ambulanceNo")}
                        style={{width: "25vw", marginTop: "10px"}} /> <br />

            <br />
            <Button variant="outlined" size="medium" onClick={onSubmit} style={{marginLeft: "5px"}}>Add request</Button>
            <ToastContainer />
        </div>
    )
}

export default Request;