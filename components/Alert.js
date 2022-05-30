import React from 'react'
import { Alert } from 'react-bootstrap'

function AlertComp(props) {
    
    const onTrigger = (event) => {
        props.closeAlert()
    }

    return (
        <>
            {
                props.toShow && props.body.length > 0 &&
                <Alert variant="danger" onClose={onTrigger} dismissible className={props.className}>
                    <Alert.Heading>{props.title}</Alert.Heading>
                      {props.body.map((option, i) => <p  key={i}>{option}</p>)}
                </Alert>
            }
        </>
    )
}

export default AlertComp