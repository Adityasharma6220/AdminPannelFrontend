import {LANG} from './actions'
// Role Reducer
const initialState = {
    value: "",
  };
  
  const languageReducer = (state = initialState, action) => {
    switch (action.type) {
      case LANG:
        return {
          ...state,
          value: action.payload,
        };
      
      default:
        return state;
    }
  };

  export default languageReducer;
  