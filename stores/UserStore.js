import { makeAutoObservable } from "mobx";

class UserStore {

    screenAnswers = {
        1:{},
        2:{},
        3:{},
        4:{}
    }

    screenActions = {
        1:{},
        2:{},
        3:{},
        4:{}
    }
    
    constructor() {
        makeAutoObservable(this);
    }
}

export default UserStore;