import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import roleReducer from './roleReducer';
import languageReducer from './languageReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  roleReducer:roleReducer,
  languageReducer:languageReducer
});

export default reducer;
