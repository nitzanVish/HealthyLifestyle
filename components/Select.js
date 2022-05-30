import React from 'react'
import { Form, Row,Col } from 'react-bootstrap'
import SelectReact from 'react-select'

function Select(props) {

    const onTrigger = (event) => {
        props.parentCallback(event);
    }
    
    return (
        <Form.Group className="mb-3" controlId="">
            <Form.Label>{props.label}</Form.Label>
            <Row>
                <Col className={props.className}>
                    <SelectReact options={props.options} onChange={onTrigger} name={props.name} />
                </Col>
            </Row>
        </Form.Group>
    )
}


export default Select