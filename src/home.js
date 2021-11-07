import React, { useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import Moment from 'react-moment';
import { Link } from "react-router-dom";

function Home() {
    return(
        <div>
            <PendingReqs />
        </div>
    )
}

function PendingReqs() {
    const[deliverData, setDeliverData] = useState(null);
    const[deliverError, setDeliverError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/request/pending`)
        .then((response) => response.json())
        .then(setDeliverData)
        .catch(setDeliverError);
    }, []);

    return(
        <>
            <div>
                <h3>Pending Requests</h3>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Hospital</Table.HeaderCell>
                            <Table.HeaderCell>Blood Group</Table.HeaderCell>
                            <Table.HeaderCell>Requested Date</Table.HeaderCell>
                            <Table.HeaderCell>Requested Units</Table.HeaderCell>
                            <Table.HeaderCell>Delivered Units</Table.HeaderCell>
                            <Table.HeaderCell>To be Delivered</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {deliverData ? deliverData.map(el => {
                        return (
                        <Table.Row key={el.id}>
                            <Table.Cell>{el.hospitalName}</Table.Cell>
                            <Table.Cell>{el.bloodGroup}</Table.Cell>
                            <Table.Cell>
                                <Moment format="DD/MM/yyyy hh:mm:ss A">
                                    {new Date(el.requestDate)}
                                </Moment>
                            </Table.Cell>
                            <Table.Cell>{el.unitsNeeded}</Table.Cell>
                            <Table.Cell>{el.unitsDelivered}</Table.Cell>
                            <Table.Cell>{el.unitsNeeded - el.unitsDelivered}</Table.Cell>
                            <Table.Cell>
                                <Link to={{pathname: "/request", state: {hpId: el.hospitalId, bg: el.bloodGroup}}}
                                >
                                    Deliver
                                </Link>
                            {/* <Button variant="primary" onClick={deliverBlood}>
                                Deliver
                            </Button> */}
                            </Table.Cell>
                        </Table.Row>
                        );
                    }) : null}
                    {deliverError? deliverError : null}
                    </Table.Body>
                </Table>
            </div>
        </>
    )
}

export default Home;