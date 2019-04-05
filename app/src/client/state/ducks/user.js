import { user } from "../../api";
import User from "../../../model/User";

export const getCurrentUser = dispatch => () =>
  dispatch({
    type: "GET_CURRENT_USER",
    payload: user.getCurrentUser()
  });

const initialState = { current: undefined };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CURRENT_USER_FULFILLED":
      const user = action.payload.data
        ? new User().deserialize(action.payload.data)
        : null;

      console.log("GET_CURRENT_USER_FULFILLED", action, user);
      return {
        ...state,
        current: user
      };
    default:
      return state;
  }
};

export default reducer;
