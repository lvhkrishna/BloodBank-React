import React, { useEffect, useState } from "react";
import cloneDeep from 'lodash/cloneDeep';
import { FormControl, InputLabel, Select, MenuItem, TextField, FormControlLabel, Checkbox, Button, FormHelperText } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

function Donation() {
    return(
        <>
            <h1>Donor Donations</h1>
            <DonorForm />
        </>
    );
}

function DonorForm() {
    const [donation, setDonation] = useState({staffId: '', donorAadharId: '', testResult: '', donatedUnits: '', eventId: ''})
    const [refreshScreen, setRefreshScreen] = useState(false);
    const [validationError, setValidationError] = useState(false);

    const onValueChange = (e, key) => {
        var value = e.target.value;
        if (key === "donatedUnits") {
            if (isNaN(value)) {
                setValidationError(true);
            }
            else {
                var floatValue = parseFloat(value);
                if (floatValue <= 0 || floatValue > 3) {
                    setValidationError(true);
                }
                else {
                    setValidationError(false);
                }
            }
        }
        setDonation({...donation, [key]: value});
    }
    const[staffData, setStaffData] = useState(null);
    const[staffError, setStaffError] = useState(null);
    const[donorData, setDonorData] = useState(null);
    const[donorError, setDonorError] = useState(null);
    const[eventData, setEventData] = useState(null);
    const[eventError, setEventError] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/medicalstaff`)
        .then((response) => response.json())
        .then(setStaffData)
        .catch(setStaffError);
    }, [refreshScreen]);

    useEffect(() => {
        fetch(`http://localhost:8080/eligibledonors`)
        .then((response) => response.json())
        .then(setDonorData)
        .catch(setDonorError);
    }, [refreshScreen]);

    useEffect(() => {
        fetch(`http://localhost:8080/events`)
        .then((response) => response.json())
        .then(setEventData)
        .catch(setEventError);
    }, [refreshScreen]);

    const onEventChange = (e) => setChecked(e.target.checked);

    const onSubmit = () => {
        console.log(donation);
        var error = false;
        var units = 0;
        if(!isNaN(donation.donatedUnits)) {
            units = parseFloat(donation.donatedUnits);
        }
        if(donation.testResult !== "0" && donation.testResult !== "1") {
            toast("Please select a test result");
            error = true;
        }

        if(donation.staffId > 0) {}
        else { toast("Please select a staff personnel"); error = true; }
        if(donation.donorAadharId > 0) {}
        else { toast("Please select a donor"); error = true; }
        if(donation.testResult && (units <= 0 || units > 3)) {
            toast("Units donated should lie between (0, 3]");
            error = true;
        }
        if(checked && (donation.eventId === "" || donation.eventId <= 0)) {
            toast("Please select an event");
            error = true;
        }

        if (!error) {
            var jsonData = cloneDeep(donation);
            jsonData.testResult = donation.testResult === "1" ? true : false;
            jsonData.donatedUnits = jsonData.testResult ? units : 0;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(jsonData)
            }
            fetch(`http://localhost:8080/donation/add`, requestOptions)
                .then((response) => response.json())
                .then(result => success(result))
                .catch(error => failure(error));
        }
    }
    const success = (result) => {
        if(result > 0 || result === -1) {
            toast.success("Details updated successfully");
            setDonation({staffId: '', donorAadharId: '', testResult: '', donatedUnits: '', eventId: ''});
            setRefreshScreen(!refreshScreen);
        }
        else if(result.status >= 200 && result.status < 300)
            toast.success("Details updated successfully");
        else {
            toast.error(result.error + " " + result.message);
        }
    }
    const failure = (error) => {
        console.log(error)
        toast.error("Error updating Staff details");
    }

    return(
        <div>
            <FormControl variant="filled" size="small" style={{width: "25vw"}}>
                <InputLabel id="staff">Medical Staff in-charge</InputLabel>
                <Select labelId="staff" id="staff-dd" value={donation.staffId}
                                label="Medical Staff" onChange={(e) => onValueChange(e, "staffId")}>
                    <MenuItem key="" value="">-- Select a Staff --</MenuItem>
                    { staffData ? staffData.map(staff => (
                        <MenuItem key={staff.id} value={staff.id}>{staff.name}</MenuItem>
                    )) : null }
                    { staffError ? <MenuItem value={null}>Error fetching data...</MenuItem> : null }
                </Select>
            </FormControl> <br />

            <FormControl variant="filled" size="small" style={{width: "25vw", marginTop: "10px"}}>
                <InputLabel id="donor">Donor</InputLabel>
                <Select labelId="donor" id="donor-dd" value={donation.donorAadharId}
                                label="Donor" onChange={(e) => onValueChange(e, "donorAadharId")}>
                    <MenuItem key="" value="">-- Select a donor --</MenuItem>
                    { donorData ? donorData.map(donor => (
                        <MenuItem key={donor.aadharId} value={donor.aadharId}>
                            <span>{donor.name}</span>
                            <span>&nbsp;({donor.bloodGroup.bloodGroup})</span>
                        </MenuItem>
                    )) : null }
                    { donorError ? <MenuItem value={null}>Error fetching data...</MenuItem> : null }
                </Select>
            </FormControl> <br />

            <FormControl variant="filled" size="small" style={{width: "25vw", marginTop: "10px"}}>
                <InputLabel id="result">Test Result</InputLabel>
                <Select labelId="result" id="result-dd" value={donation.testResult}
                                label="Test Result" onChange={(e) => onValueChange(e, "testResult")}>
                    <MenuItem key="1" value="1">Pass</MenuItem>
                    <MenuItem key="0" value="0">Fail</MenuItem>
                </Select>
            </FormControl> <br />

            <FormControl>
                <TextField label="Units Donated" variant="filled" value={donation.donatedUnits}
                        size="small" onChange={(e) => onValueChange(e, "donatedUnits")}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error={validationError} aria-describedby="units-donated-error-text"
                        style={{width: "25vw", marginTop: "10px", display: donation.testResult === "1" ? 'block' : 'none'}} />
                <FormHelperText id="units-donated-error-text"
                    style={{color: "red", visibility: validationError ? "visible" : "hidden"}}>
                        Only numbers between (0, 3] are considered valid input.
                </FormHelperText>
            </FormControl> <br />
            
            <FormControlLabel value="start" control={<Checkbox />}
                            label="Event?" labelPlacement="start"
                            onChange={onEventChange} /> <br />
            
            <FormControl variant="filled" size="small"
                style={{width: "25vw", marginTop: "10px", display: checked ? 'block' : 'none'}}>
                <InputLabel id="event">Event</InputLabel>
                <Select labelId="event" id="event-dd" value={donation.eventId} style={{width: "25vw"}}
                                label="Event" onChange={(e) => onValueChange(e, "eventId")}>
                    <MenuItem key="" value="">-- Select an event --</MenuItem>
                    { eventData ? eventData.map(event => (
                        <MenuItem key={event.id} value={event.id}>{event.name}</MenuItem>
                    )) : null }
                    { eventError ? <MenuItem value={null}>Error fetching data...</MenuItem> : null }
                </Select>
            </FormControl> <br />

            <Button variant="outlined" size="medium" onClick={onSubmit} style={{marginLeft: "5px"}}>Update</Button>
            <ToastContainer />
        </div>
    )
}

export default Donation;