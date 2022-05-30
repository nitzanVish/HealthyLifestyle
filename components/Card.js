import { Card } from 'react-bootstrap'

function CardComp(props) {
    
    return (
        <Card>
            <Card.Body>
                <Card.Title className="mb-4">{props.subtitle}</Card.Title>
                {
                    props.options.map((option, i) =><Card.Text key={i}>{option.text}</Card.Text>)
                }
            </Card.Body>
        </Card>
    )
}

export default CardComp
