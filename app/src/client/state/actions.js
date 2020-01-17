import { user } from "../api";
import User from "../../model/User.mjs";

const actionTypes = {
  GET_CURRENT_USER: "GET_CURRENT_USER"
};

export const getCurrentUser = async dispatch => {
  const payload = await user.getCurrentUser();
  dispatch({
    type: actionTypes.GET_CURRENT_USER,
    payload: payload
  });
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "GET_CURRENT_USER":
      const user = action.payload.data
        ? new User().deserialize(action.payload.data)
        : null;
      return {
        ...state,
        currentUser: user
      };
    default:
      return state;
  }
};
