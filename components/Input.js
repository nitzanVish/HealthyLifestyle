import React from 'react'
import { Form } from 'react-bootstrap'

function Input(props) {
    
    const onTrigger = (event) => {
        props.parentCallback(event);
    }

    return (
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{props.label}</Form.Label>
            <Form.Control type={props.type} placeholder={props.placeholder} name={props.fieldName} autoComplete={props.autoComplete} onChange={onTrigger}  data-validation={props.dataValidation}/>
        </Form.Group>
    )
}


export default Input