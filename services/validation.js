const { parsePhoneNumber } = require('libphonenumber-js');

const onlyLatinCharacters = (value, fieldName) => {
    try {
        const regex = /^[a-zA-Z\s]+$/
        return {isValid: regex.test(value), error: fieldName +' should contain Latin characters only'}
    } catch(err){
        return {isValid: false, error: 'Please type in Latin characters only'}
    }
}

const minChars = (value, fieldName) => {
    let isValid = value.length > 1 ? true : false
    return {isValid, error: fieldName +' should contain at least two letter'}
}

const phoneValidation = (value) => {
    try {
        let parsed = parsePhoneNumber(value, 'US');
        let isValid = parsed.isValid() ? true : false;
        return {isValid, error: 'The provided phone number is invalid'}
    } catch(err){
        return {isValid: false, error: 'The provided phone number is invalid'}
    }
}

const containNumbers = (value, fieldName) => {
    try{
        let containNum = value.match(/\d/) ? true : false
        return {isValid: containNum, error: fieldName + ' must contain number'}
    } catch(err){
        return {isValid: false, error: fieldName + ' must contain number'}
    }
}

const email = (value) => {
    try {
        const regex =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return {isValid: regex.test(value), error: 'Invalid email address'}
    } catch(err){
        return {isValid: false, error: 'Invalid email address'}
    }
}
export default {containNumbers, phoneValidation, onlyLatinCharacters, minChars, email}