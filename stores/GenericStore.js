import { makeAutoObservable } from "mobx";

class GenericStore {
    formScreens = {
        currentStep: 1,
    }
    
    constructor() {
        makeAutoObservable(this);
    }
}

export default GenericStore;