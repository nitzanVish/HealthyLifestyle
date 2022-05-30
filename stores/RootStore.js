import UserStore from "./UserStore";
import React from 'react';
import GenericStore from './GenericStore'
import ScreenSettingStore from "./ScreenSettingStore";
class RootStore {
  constructor() {
    this.UserStore = new UserStore(this)
    this.GenericStore = new GenericStore(this)
    this.ScreenSettingStore = new ScreenSettingStore(this)
  }
}
const StoresContext = React.createContext(new RootStore());

export const useStores = () => React.useContext(StoresContext);