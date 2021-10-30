import React, { useEffect, useState } from "react";
import { TextField, Button } from "@material-ui/core";

function BloodForm() {
    const[groupText, setGroupText] = useState("");

    const onGroupChange = (e) => setGroupText(e.target.value);
    const onSubmit = () => {
        console.log(groupText);
        fetch(`http://localhost:8080/blood/save?group=` + groupText, {method: `POST`})
            .then((response) => response.json())
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }

    return(
        <div>
            <div style={{border: "1px solid #2BA84A", display: "inline-block", padding: "5px", boxShadow: "5px 5px #2BA84A"}}>
                <TextField label="Blood Group" value={groupText} onChange={onGroupChange} />
                <Button variant="outlined" size="large" onClick={onSubmit} style={{marginLeft: "20px"}}>Add</Button>
            </div>
        </div>
    )
}

function BloodInfo() {
    const[data, setData] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/blood`)
        .then((response) => response.json())
        .then(setData)
        .then(setLoading(false))
        .catch(setError);
    }, []);

    if (loading) return <h1>Loading...</h1>
    if (error) return <pre>Error loading data: {JSON.stringify(error, null, 2)}</pre>
    if (!data || data.length === 0) return <h1>No Blood Group data available...</h1>

    return(
        <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

function Blood() {
    return(
        <>
            <h1>Blood Groups</h1>
            <BloodForm />
            <BloodInfo />
        </>
    );
}

export default Blood;