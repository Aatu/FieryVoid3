import React, { useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { getCurrentUser } from "../../state/actions";
import { login as loginUser } from "../../api/user";

import {
  Title,
  InputAndLabel,
  PanelContainer,
  Button,
  Section,
  Link,
  TooltipContainer,
  TooltipHeader
} from "../../styled";
import { StateStore, DispatchStore } from "../../state/StoreProvider";

const Login = ({ className }) => {
  const dispatch = useContext(DispatchStore);
  const { currentUser } = useContext(StateStore);

  const onSubmit = async (values, { setSubmitting }) => {
    await loginUser(values.username, values.password);
    console.log("user logged in!");
    await getCurrentUser(dispatch);
    setSubmitting(false);
  };

  if (currentUser) {
    return null;
  }

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={onSubmit}
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
          <TooltipContainer
            className={className}
            as="form"
            onSubmit={handleSubmit}
          >
            <TooltipHeader>Login</TooltipHeader>
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

              <Button
                buttonStyle="button-grey"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  alert("not implemented");
                }}
              >
                Register
              </Button>
            </Section>
          </TooltipContainer>
        );
      }}
    </Formik>
  );
};

export default Login;
