import {ROLE} from './actions'
// Role Reducer
const initialState = {
    value: "",
  };
  
  const roleReducer = (state = initialState, action) => {
    switch (action.type) {
      case ROLE:
        return {
          ...state,
          value: action.payload,
        };
      
      default:
        return state;
    }
  };

  export default roleReducer;
  