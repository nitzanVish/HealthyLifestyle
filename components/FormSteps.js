import React, {useState} from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { useStores } from '../stores/RootStore'
import generalSrv from '../services/general'
import validationSrv from '../services/validation'
import Alert from '../components/Alert'
import Toast from '../components/Toast'
import Summary from '../components/Summary'

function FormSteps(props) {

    const [screenTitle, setScreenTitle] = useState('')
    const [enableBtn, setEnableBtn] = useState(false)
    const { GenericStore, UserStore } = useStores();
    const [errorMessages, setErrorMessages] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [toastData, setToastData] = useState('toast data')
    const [showToast, setShowToast] = useState(false)
    const [isActiveGenerateScreen, setIsActiveGenerateScreen] = useState(true)
    const [currentStep, setCurrentStep] = useState(GenericStore.formScreens.currentStep)
    const { ScreenSettingStore } = useStores();
    const [finalStep, setFinalStep] = useState(false)
    
    //set screen title
    ScreenSettingStore.screenSetting[currentStep].title &&  ScreenSettingStore.screenSetting[currentStep].title != screenTitle 
        ? setScreenTitle(ScreenSettingStore.screenSetting[currentStep].title) 
        : ''

    function handleChange(event){
        updateUserData(event)
        // Check If componentsActions prop exists inside settings
        if(ScreenSettingStore.screenSetting[currentStep].componentsActions) takeAction()
        enableBtnLogic()
    }

    function updateUserData(event){

        let fieldVal = !event.target ? event.value : event.target.value;
        
        let fieldName = !event.target ? event.name : event.target.name //.attributes['data-field-name'].value;
        // Add action after value selection
        let isActionNeeded = event.target && event.target.attributes['data-action'] ? true : false

        // check if multiple values can be selected
        let multipleSelect = !event.target && event.type == 'select' 
            ? false
            : (event.target.type == 'checkbox' ? true : false)

        let screenAnswerStep = UserStore.screenAnswers[currentStep]
        let screenActionStep = UserStore.screenActions[currentStep]

        if(!screenAnswerStep[fieldName]){
            screenAnswerStep[fieldName] = []
            if (isActionNeeded) screenActionStep[fieldName] = []
        }
        let screenAnswerStepField = screenAnswerStep[fieldName]
        let screenActionStepField = isActionNeeded ? screenActionStep[fieldName] : ''

        if(multipleSelect){
            let isExists = screenAnswerStepField.includes(fieldVal)
            
            if(isExists && event.target.checked){
                return
            }
            // Remove checked val
            if(isExists && !event.target.checked){
                let index = screenAnswerStepField.findIndex(val => val == fieldVal)
                screenAnswerStepField.splice(index, 1)
                if(screenActionStepField) screenActionStepField.splice(index, 1)
            }
            // Add checked val
            if(!isExists){ 
                screenAnswerStepField.push(fieldVal)
                // Add step action if exists
                if(screenActionStepField) screenActionStepField.push(event.target.attributes['data-action'].value)
            }
        } else {
            //Remove selected value
            screenAnswerStepField.splice(0, screenAnswerStepField.length)
            if(screenActionStepField) screenActionStepField.splice(0, screenActionStepField.length)

            if(!fieldVal) return
            screenAnswerStepField.push(fieldVal)
            // Add checked val
            let actionVal = event.target && event.target.attributes['data-action'] ? event.target.attributes['data-action'].value : ''
             // Add step action if exists
            if(screenActionStepField && actionVal) screenActionStepField.push(actionVal)
        }

    }

    function enableBtnLogic(){
        // Check if all required fields exists and change btn status accordingly
        let validationFields = ScreenSettingStore.screenSetting[currentStep].validationField
        // we have the ability to defined and/or methods for required fields
        if(validationFields.method == 'and'){
            andLogic()
        } 
    } 

    function takeAction(){
        let comAction = ScreenSettingStore.screenSetting[currentStep].componentsActions
        comAction.forEach(action => {
            let toContinue = true 
            let values = {}
            //check if required field exists
            if(action.requiredFields && action.requiredFields.length > 0){
                action.requiredFields.forEach(reqField => {
                    toContinue = !UserStore.screenAnswers[currentStep][reqField] || UserStore.screenAnswers[currentStep][reqField][0].length < 0 ? false : toContinue
                    // Add data to value's object
                    if(toContinue) values[reqField] = UserStore.screenAnswers[currentStep][reqField][0]
                })
            }
             //Continue if required fields exists
            if(!toContinue) return
            // Get relevant info
            let info = generalSrv[action.functionName](values)
            setToastData(info)
            setShowToast(true)
            
        })
    }

    function andLogic(){
        let validationFields = ScreenSettingStore.screenSetting[currentStep].validationField
        let isValid = true;
        
        validationFields.values.forEach(rule => {
            //Search for field's value inside screenAnswerStep
            if(!UserStore.screenAnswers[currentStep][rule] ||
                UserStore.screenAnswers[currentStep][rule] && UserStore.screenAnswers[currentStep][rule].length < 1
            ){
                isValid = false
            }
        })
        setEnableBtn(isValid)
    }

    function generateScreens(){
        //generate fields
        let screenData = ScreenSettingStore.screenSetting[currentStep]

        return screenData.componentsData.map((compData, i) => {
            let customOptions = compData.attributes.options
            let value = compData.value

            //Dynamic option- defined inside screen settings
            if(customOptions && !Array.isArray(customOptions) && customOptions.includes('$')){
                let aOptions = customOptions.split('|')
                aOptions.splice(0,1)
                let obj = {}
                let splitField = ''

                aOptions.map(field => {
                    splitField = field.split(':')
                    obj[splitField[0]] = splitField[1]
                })

                let func = obj.functionName
                obj.name = compData.attributes.name
                obj.type = compData.attributes.type
                value = obj.default
                customOptions = generalSrv[func](obj)
            }

            let componentObject = {
                key: compData.attributes.name+'_'+i,
                parentCallback: handleChange,
                subtitle: compData.attributes.subtitle,
                options: customOptions,
                type: compData.attributes.type,
                inline: compData.attributes.inline,
                value,
                label: compData.attributes.label,
                placeholder: compData.attributes.placeholder,
                fieldName: compData.attributes.fieldName,
                className: compData.attributes.className,
                dataValidation: compData.attributes.dataValidation
            }
            // Dynamic components (name+props)
            let ComponentName = generalSrv.getComponent(compData.name)
            return <Col xs={compData.cols.xs} md={compData.cols.md} className={screenData.className} key={componentObject.key}>
                {React.createElement(ComponentName, componentObject)}
            </Col>

        })
        
    }

    function nextPage(){
        setShowAlert(false)
        setErrorMessages([])
        // Check data validation
        if(handleValidation()) return
        // Check if next screen exists
        if(GenericStore.formScreens.currentStep < Object.keys(ScreenSettingStore.screenSetting).length){
            setIsActiveGenerateScreen(false)
            GenericStore.formScreens.currentStep++
            setCurrentStep(GenericStore.formScreens.currentStep)
            // If its the last screen
            if(GenericStore.formScreens.currentStep == Object.keys(ScreenSettingStore.screenSetting).length) setFinalStep(true)
            changePage()
        }if(GenericStore.formScreens.currentStep == Object.keys(ScreenSettingStore.screenSetting).length){
            //saveUserData in fireStore
            saveUserData()
        }
    }

    function saveUserData(){
        fetch('/api/screens-settings',{
            method: "POST",
            body: JSON.stringify({userData: UserStore.screenAnswers, collectionName:'users_data'})
        })
        .then(res=>{
            res.json().then(val =>{
                // console.log('data saved' , val)
            })
        })
    }

    function changePage(){
        if(GenericStore.formScreens.currentStep < Object.keys(ScreenSettingStore.screenSetting).length) setEnableBtn(false)
        // Check if next screen matches to conditions
        if (ScreenSettingStore.screenSetting[GenericStore.formScreens.currentStep].showIf){
            let showComRes = showScreenLogic()
             //If screen isn't match to required condition continue to next page
            if(!showComRes){
                nextPage()
                return
            }
        }
        //Show screen
        setIsActiveGenerateScreen(true)
    }

    function showScreenLogic(){
        // Check if screen has conditions (show if actions exists)
        let stepShowObj = ScreenSettingStore.screenSetting[GenericStore.formScreens.currentStep].showIf
        let method = stepShowObj.condition.method
        //If actions is match to req condition in screen's settings
        switch(method){
            case "eq":
            let aActionsPerReqStep = UserStore.screenActions[stepShowObj.questionIds][stepShowObj.questionKey]
           return  aActionsPerReqStep && aActionsPerReqStep.includes(stepShowObj.condition.value)
        }
    }

    function handleValidation(){
        let screenData = ScreenSettingStore.screenSetting[currentStep]
        let errors = false
        setErrorMessages([])
        screenData.componentsData.forEach((compData, i) => {
            // Dynamic validation per field
            if(compData.attributes.dataValidation){
                // if we have multi validation, split them
                compData.attributes.dataValidation.split(',').forEach( rule => {
                    // Rule is function's name for validate this field
                    let validationRes = validationSrv[rule](UserStore.screenAnswers[currentStep][compData.attributes.fieldName][0], compData.attributes.label)
                    //If invalid , update error messages
                    if(!validationRes.isValid){
                        setErrorMessages(values => ([...values, validationRes.error]) )
                        errors = true
                        return true
                    }
                })
            }
        })
        // If errors, show alert
        errors ? setShowAlert(true) : setShowAlert(false)
        return errors
    }

    function handleAlert(event){
        setShowAlert(false)
    }

    function handleToast(event){
        setShowToast(false)
    }
    
    return (
        <div className={ScreenSettingStore.screenSetting[currentStep].className}>
            <div className="form-wrapper rounded-3 bg-white p-5 my-5 animate fadeIn">
                <div className={ScreenSettingStore.screenSetting[currentStep].titleClassName}>
                    {screenTitle}
                </div>
                <Row>
                    {/* Summary data */}
                    {finalStep && <Summary />}

                    {/* Screen's settings */}
                    {isActiveGenerateScreen && generateScreens()}

                    {!finalStep && <Button className="col-3 mt-4 mx-auto" variant="primary" type="submit" disabled={!enableBtn} onClick={nextPage}>Next</Button>}

                    {/* Error messages */}
                    <div className="col-12">
                        <Alert title="You got an error!" body={errorMessages} toShow={showAlert} closeAlert={handleAlert} className="mt-4"/>
                    </div>

                    <div>
                        <Toast title="BMI Result" body={toastData} toShow={showToast} closeToast={handleToast} position="middle-end" variant="Warning"/>
                    </div>
    
                </Row>
            </div>
        </div>
    )
}

export default FormSteps