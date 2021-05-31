import {combineReducers} from 'redux';
import settingReducer from './settingReducer';
import popUpReducer from './popUpReducer';
import taskReducer from './taskReducer';

export default combineReducers({
  settings: settingReducer,
  popup: popUpReducer,
  task: taskReducer,
});
