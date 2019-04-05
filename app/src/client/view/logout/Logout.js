import * as React from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { getCurrentUser } from "../../state/ducks/user";
import { logout as logoutUser } from "../../api/user";

class Logout extends React.Component {
  componentDidMount = async () => {
    const { dispatchGetCurrentUser } = this.props;
    await logoutUser();
    await dispatchGetCurrentUser();
  };

  render() {
    const { user, location } = this.props;

    console.log("logout, user", user);

    if (!user) {
      return (
        <Redirect to={{ pathname: "/login", state: { from: location } }} />
      );
    }

    return null;
  }
}

export default connect(
  ({ user }) => ({
    user: user.current
  }),
  dispatch => ({
    dispatchGetCurrentUser: getCurrentUser(dispatch)
  })
)(Logout);
