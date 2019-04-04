import { user } from "../../api";

export const getCurrentUser = () => ({
  type: "GET_CURRENT_USER",
  payload: user.getCurrentUser()
});

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CURRENT_USER_FULFILLED":
      console.log("GET_CURRENT_USER", action);
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
