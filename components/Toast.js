
import React from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

function ToastComp(props) {

    const onTrigger = (event) => {
        props.closeToast()
    }

    return (
        <>
            {
                props.toShow && props.body.length > 0 &&
                <ToastContainer className="p-3 animate fadeIn" position={props.position}>
                    <Toast onClose={onTrigger} animation variant={props.variant}>
                        <Toast.Header>
                            <strong className="me-auto">{props.title}</strong>
                        </Toast.Header>
                        <Toast.Body>
                            {props.body.map((option,i )=> <p key={i}>{option}</p>)}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            }
        </>
    )
}

export default ToastComp