import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { Table } from "semantic-ui-react"

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
            <div style={{border: "1px solid #2BA84A", boxShadow: "5px 5px #2BA84A", display: "inline-block", padding: "5px"}}>
                <TextField label="Blood Group" variant="filled" value={groupText}
                    size="small" onChange={onGroupChange} />
                <Button variant="outlined" size="medium" onClick={onSubmit} style={{marginLeft: "20px"}}>Add</Button>
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
            <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Blood Group</Table.HeaderCell>
                            <Table.HeaderCell>Units Available</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {data.map(el => {
                        return (
                        <Table.Row>
                            <Table.Cell>{el.bloodGroup}</Table.Cell>
                            <Table.Cell>{el.unitsAvailable}</Table.Cell>
                        </Table.Row>
                        );
                    })}
                    </Table.Body>
                </Table>
        </div>
    );
}

function Blood() {
    return(
        <>
            <h1>Blood Groups</h1>
            <BloodForm /> <br />
            <BloodInfo />
        </>
    );
}

export default Blood;