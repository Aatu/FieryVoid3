import * as React from "react";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { getCurrentUser } from "../../state/ducks/user";
import { login as loginUser, register as registerUser } from "../../api/user";

import {
  Title,
  InputAndLabel,
  PanelContainer,
  Button,
  Error
} from "../../styled";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }
  onSubmit = async (values, { setSubmitting }) => {
    const { getCurrentUser } = this.props;
    this.setState({ error: null });

    let { username, password } = values;
    username = username.trim();
    password = password.trim();

    try {
      await registerUser(username, password);
      await loginUser(username, password);
      await getCurrentUser();
    } catch (error) {
      this.setState({ error: error.data });
    }
    setSubmitting(false);
  };

  render() {
    const { error } = this.state;
    const { user, location } = this.props;

    if (user) {
      return <Redirect to={{ pathname: "/", state: { from: location } }} />;
    }

    return (
      <Formik
        initialValues={{ username: "", password: "", passwordConfirm: "" }}
        onSubmit={this.onSubmit}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(2, "Username must be atleast 2 characters")
            .required("Required"),
          password: Yup.string()
            .min(2, "Password must be atleast 16 characters")
            .required("Required"),
          passwordConfirm: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required")
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;

          return (
            <PanelContainer as="form" onSubmit={handleSubmit}>
              <Title>
                Register a new user {error && <Error>{error}</Error>}
              </Title>

              <InputAndLabel
                label="Username"
                id="username"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && errors.username}
              />

              <InputAndLabel
                label="Password"
                id="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                type="password"
              />

              <InputAndLabel
                label="Confirm password"
                id="passwordConfirm"
                placeholder="Confirm password"
                value={values.passwordConfirm}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.passwordConfirm && errors.passwordConfirm}
                type="password"
              />

              <Button
                buttonStyle="button-grey"
                type="submit"
                disabled={isSubmitting || Object.entries(errors).length !== 0}
              >
                Register
              </Button>
            </PanelContainer>
          );
        }}
      </Formik>
    );
  }
}

export default connect(
  ({ user }) => ({
    user: user.current
  }),
  { getCurrentUser }
)(Register);
