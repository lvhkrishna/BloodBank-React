import React, { useEffect, useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from "semantic-ui-react"

function Staff() {
    return(
        <>
            <h1>Staff</h1>
            <StaffForm /> <br />
            <StaffInfo />
        </>
    )
}

function StaffForm() {
    // **************************** Accordion Details ****************************
    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
    }));
    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
          expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
          {...props}
        />
    ))(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
          transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
          marginLeft: theme.spacing(1),
        },
    }));
      
    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));
    const [expanded, setExpanded] = useState('');
    const handleChange = (panel) => (_event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    // **************************** Accordion Details ****************************

    const [staff, setStaff] = useState({name: '', email: '', mobile: '', type: '', plotNo: '',
                            street: '', city: '', state: '', pincode: '', degree: '',
                            licenseNo: '', ambulanceNo: ''})

    const onValueChange = (e, key) => {
        if (key === "type") { setStaff({...staff, [key]: parseInt(e.target.value, 10)}); }
        else { setStaff({...staff, [key]: e.target.value}); }
    }

    const onSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(staff)
        }
        fetch(`http://localhost:8080/staff/add`, requestOptions)
            .then((response) => response.json())
            .then(result => success(result))
            .catch(error => failure(error));
    }

    const success = (result) => {
        console.log(result)
        toast.success("Staff details updated successfully");

    }
    const failure = (error) => {
        console.log(error)
        toast.error("Error updating Staff details");
    }

    return(
        <div>
            <div className="form-border">
                <Accordion expanded={expanded === "addpanel"} onChange={handleChange('addpanel')}>
                    <AccordionSummary aria-controls="addpaneld-content" id="addpaneld-header">
                        <Typography style={{marginTop: "10px"}}>Add Staff</Typography>
                        <ToastContainer />
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{width: "50%", float: "left"}}>
                            <TextField label="Staff name" variant="filled" value={staff.name}
                                            size="small" onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "name")}
                                            style={{width: "25vw"}} /> <br />
                            <TextField label="Staff email" variant="filled" value={staff.email}
                                            size="small" style={{width: "25vw"}} onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "email")} /> <br />
                            <TextField label="Staff mobile" variant="filled" value={staff.mobile}
                                            size="small" style={{width: "25vw"}} onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "mobile")} /> <br />
                            <FormControl variant="filled" size="small" style={{width: "25vw"}}>
                                <InputLabel id="staff-type">Staff Role</InputLabel>
                                <Select labelId="staff-type" id="staff-type" value={staff.type}
                                                label="Staff Type" onChange={(e) => onValueChange(e, "type")}>
                                    <MenuItem value={"1"}>Medical Staff</MenuItem>
                                    <MenuItem value={"2"}>Driver</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField label="Degree" variant="filled" value={staff.degree}
                                size="small" style={{width: "25vw", display: staff.type === 1 ? 'block' : 'none'}}
                                onInputCapture={(e) => e.stopPropagation()}
                                onChange={(e) => onValueChange(e, "degree")} />
                            <TextField label="Driving License No" variant="filled" value={staff.licenseNo}
                                size="small" style={{width: "25vw", display: staff.type === 2 ? 'block' : 'none'}}
                                onInputCapture={(e) => e.stopPropagation()}
                                onChange={(e) => onValueChange(e, "licenseNo")} />
                            <TextField label="Ambulance No" variant="filled" value={staff.ambulanceNo}
                                size="small" style={{width: "25vw", display: staff.type === 2 ? 'block' : 'none'}}
                                onInputCapture={(e) => e.stopPropagation()}
                                onChange={(e) => onValueChange(e, "ambulanceNo")} />
                        </div>
                        <div style={{width: "50%", float: "right"}}>
                            <TextField label="Plot No" variant="filled" value={staff.plotNo}
                                            size="small" style={{width: "25vw"}} onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "plotNo")} /> <br />
                            <TextField label="Street" variant="filled" value={staff.street}
                                            size="small" style={{width: "25vw"}} onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "street")}/> <br />
                            <TextField label="City" variant="filled" value={staff.city}
                                            size="small" style={{width: "25vw"}} onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "city")} /> <br />
                            <TextField label="State" variant="filled" value={staff.state}
                                            size="small" style={{width: "12vw", marginRight: "1vw"}} onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "state")} />
                            <TextField label="Pincode" variant="filled" value={staff.pincode}
                                            size="small" style={{width: "12vw"}} onInputCapture={(e) => e.stopPropagation()}
                                            onChange={(e) => onValueChange(e, "pincode")} /> <br/>
                            <Button variant="outlined" size="medium" style={{marginTop: "5px"}} onClick={onSubmit}>Add</Button>
                        </div>
                    </AccordionDetails>
                </Accordion>
                
            </div>
        </div>
    )
}

function StaffInfo() {
    const[data, setData] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/staff`)
        .then((response) => response.json())
        .then(setData)
        .then(setLoading(false))
        .catch(setError);
    }, []);

    if (loading) return <h1>Loading...</h1>
    if (error) return <pre>Error loading data: {JSON.stringify(error, null, 2)}</pre>
    if (!data || data.length === 0) return <h1>No Staff data available...</h1>

    return(
        <>
            <div>
                <h3>Medical Staff</h3>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Mobile</Table.HeaderCell>
                            <Table.HeaderCell>Plot No</Table.HeaderCell>
                            <Table.HeaderCell>Street</Table.HeaderCell>
                            <Table.HeaderCell>City</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell>Pincode</Table.HeaderCell>
                            <Table.HeaderCell>Degree</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {data.filter(staff => staff.type === 1).map(el => {
                        return (
                        <Table.Row>
                            <Table.Cell>{el.name}</Table.Cell>
                            <Table.Cell>{el.email}</Table.Cell>
                            <Table.Cell>{el.mobile}</Table.Cell>
                            <Table.Cell>{el.plotNo}</Table.Cell>
                            <Table.Cell>{el.street}</Table.Cell>
                            <Table.Cell>{el.city}</Table.Cell>
                            <Table.Cell>{el.state}</Table.Cell>
                            <Table.Cell>{el.pincode}</Table.Cell>
                            <Table.Cell>{el.degree}</Table.Cell>
                        </Table.Row>
                        );
                    })}
                    </Table.Body>
                </Table>
            </div> <br />
            <div>
                <h3>Drivers</h3>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Mobile</Table.HeaderCell>
                            <Table.HeaderCell>Plot No</Table.HeaderCell>
                            <Table.HeaderCell>Street</Table.HeaderCell>
                            <Table.HeaderCell>City</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell>Pincode</Table.HeaderCell>
                            <Table.HeaderCell>Driving License</Table.HeaderCell>
                            <Table.HeaderCell>Ambulance No</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {data.filter(staff => staff.type === 2).map(el => {
                        return (
                        <Table.Row>
                            <Table.Cell>{el.name}</Table.Cell>
                            <Table.Cell>{el.email}</Table.Cell>
                            <Table.Cell>{el.mobile}</Table.Cell>
                            <Table.Cell>{el.plotNo}</Table.Cell>
                            <Table.Cell>{el.street}</Table.Cell>
                            <Table.Cell>{el.city}</Table.Cell>
                            <Table.Cell>{el.state}</Table.Cell>
                            <Table.Cell>{el.pincode}</Table.Cell>
                            <Table.Cell>{el.licenseNo}</Table.Cell>
                            <Table.Cell>{el.ambulanceNo}</Table.Cell>
                        </Table.Row>
                        );
                    })}
                    </Table.Body>
                </Table>
            </div>
        </>
    );
}

export default Staff;