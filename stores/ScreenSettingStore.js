import { makeAutoObservable } from "mobx";

class ScreenSettingStore {
    
    screenSetting =''
    screenID =''
    
    constructor() {
        makeAutoObservable(this);
    }
}

export default ScreenSettingStore;