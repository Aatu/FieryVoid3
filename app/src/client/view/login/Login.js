import * as React from "react";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { getCurrentUser } from "../../state/ducks/user";
import { login as loginUser } from "../../api/user";

import {
  Title,
  InputAndLabel,
  PanelContainer,
  Button,
  Section,
  Link
} from "../../styled";

class Login extends React.Component {
  onSubmit = async (values, { setSubmitting }) => {
    const { dispatchGetCurrentUser } = this.props;
    await loginUser(values.username, values.password);
    console.log("user logged in!");
    await dispatchGetCurrentUser();
    setSubmitting(false);
  };

  render() {
    const { user, location } = this.props;

    if (user) {
      return <Redirect to={{ pathname: "/", state: { from: location } }} />;
    }

    return (
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={this.onSubmit}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Required"),
          password: Yup.string().required("Required")
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
              <Title>Wellcome:)</Title>
              <Section>
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
              </Section>

              <Section>
                <Button
                  buttonStyle="button-grey"
                  type="submit"
                  disabled={isSubmitting || Object.entries(errors).length !== 0}
                >
                  Login
                </Button>

                <Link to="/register">
                  <Button type="button" buttonStyle="button-grey">
                    Register
                  </Button>
                </Link>
              </Section>
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
  dispatch => ({
    dispatchGetCurrentUser: getCurrentUser(dispatch)
  })
)(Login);
