
import Radio from '../components/Radio'
import Input from '../components/Input'
import Checkbox from '../components/Checkbox'
import Select from '../components/Select'
import Card from '../components/Card'

const componentsMapper = {
    Radio,
    Input,
    Checkbox,
    Select,
    Card
}
// Return component by given name
const getComponent = (componentName)=>{
   return componentsMapper[componentName]
}
//Generate list by req values
const listByRange = (obj) => {
    let list = []
    for(let i = Number(obj.min); i <= Number(obj.max) ; i = i+ Number(obj.index)){
        list.push({value: i, label: i, name:obj.name, type:obj.type})
    }
    return list
}

const calculateBMI = (values) => {
    let meters = values.height * 0.01
    let bmiVal = Math.round(values.weight/(meters*meters))
    let data = []
    data.push(`Your BMI: ${bmiVal}`)

    switch(bmiVal){
        case bmiVal <= 18.5:
            data += "Underweight <br>"
            break;
        case bmiVal > 18.5 && bmiVal < 25:
            data += "Normal weight <br>"
            break;
        case bmiVal >= 25 && bmiVal < 30:
            data += "Overweight <br>"
            break;
        case bmiVal >= 30:
            data += "Obesity <br>"
            break;

    }
    data.push("What Next? Take Action Towards Better Health:","Maintaining a healthy weight is important for your heart health",
     "Moving more can lower your risk factors for heart disease.", "Eating a healthy diet is the key to heart disease prevention." )
    
    return data
}

export default {getComponent, listByRange, calculateBMI}
