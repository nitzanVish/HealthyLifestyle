import { Card, Col } from 'react-bootstrap'
import { useStores } from '../stores/RootStore'

function Summary() {
    const { UserStore } = useStores();

    function generateKeyName(key){
        key = key.replace('_', ' ')
        return key[0].toUpperCase() + key.slice(1)
    }

    return (
        <Col xs={12} md={6}>
            <Card>
                <Card.Body key="summary">
                    <Card.Title className="mb-4">Data Summary</Card.Title>
                    {
                        Object.keys(UserStore.screenAnswers[1]).map((option, i) =><Card.Text key={i}>{generateKeyName(option)}: {UserStore.screenAnswers[1][option]}</Card.Text>)
                    }
                </Card.Body>
            </Card>
        </Col>

    )
}

export default Summary