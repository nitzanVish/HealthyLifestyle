import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import {Container, Row, Col} from 'react-bootstrap'
import { useStores } from '../stores/RootStore'
import FormSteps from '../components/FormSteps'
import screensMetaData from '../services/formSteps.json'

export default function Home() {
  const { ScreenSettingStore } = useStores();
  const [showScreens, setShowScreens] = useState(false)
 
  // get screens settings from fireStore
  // screensMetaData - is an example of this settings
  
  useEffect(() => {
    fetch('/api/screens-settings')
    .then((res) => res.json())
    .then((val) => {
      if(val.screens){
        ScreenSettingStore.screenSetting = val.screens
        ScreenSettingStore.screenID = val.screenID
        setShowScreens(true)
      }
    })
  });

  // check if setting exists
  if(Object.keys(ScreenSettingStore.screenSetting).length < 1) return
  
  // In order to update fireStore with screen's settings, this json settings should be created/updated by admin- will be developed 
  function updateSettings (){
    fetch('/api/screens-settings',{
          method: "POST",
          body: JSON.stringify({userData: screensMetaData, collectionName:'screens_settings'})
      })
      .then(res=>{
          res.json().then(val =>{
          // console.log('after json' , val)
          })
      })
  }

  return (
    <> 
      { 
          showScreens && 
          <div>
            <Head>
              <title>Healthier</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
              <Container fluid>
                  <Row>
                    <Col xs={12} md={7} lg={5} className="mx-auto">
                      <FormSteps />
                    </Col>
                  </Row>
              </Container>
            </main>
        </div> 
      }
    </>
  )
}
