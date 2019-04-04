import * as React from "react";
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
import { user } from "../../api";

class Login extends React.Component {
  onSubmit = async (values, { setSubmitting }) => {
    console.log("Hi?");
    await loginUser(values.username, values.password);
    setSubmitting(false);
  };

  render() {
    return (
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={this.onSubmit}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            //.min(2, "Username must be atleast 2 characters")
            .required("Required"),
          password: Yup.string()
            //.min(16, "Password must be atleast 16 characters")
            .required("Required")
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
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
                  disabled={
                    Object.keys(values).some(key => values[key] === "") ||
                    isSubmitting ||
                    Object.entries(errors).length !== 0
                  }
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
    user
  }),
  { getCurrentUser }
)(Login);
