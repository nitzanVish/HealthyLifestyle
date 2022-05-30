
import React from 'react'
import { Form } from 'react-bootstrap'

function Radio(props) {

    const onTrigger = (event) => {
        props.parentCallback(event);
    }

    return (
      <Form.Group>
          {props.options.map((option, i) => 
              <Form.Check type={option.type} label={option.label} name={option.name} inline={props.inline} value={option.value} id={option.label+i} onChange={onTrigger} 
              key={i} data-action={option.action} className={option.className}
          />)}
        
      </Form.Group>
    )
}

export default Radio
