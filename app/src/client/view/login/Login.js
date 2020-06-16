import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { getCurrentUser } from "../../state/actions";
import { login as loginUser } from "../../api/user";
import styled from "styled-components";

import {
  Title,
  InputAndLabel,
  PanelContainer,
  Button,
  Section,
  Link,
  TooltipContainer,
  TooltipHeader,
  Cell50,
  Error,
} from "../../styled";
import { StateStore, DispatchStore } from "../../state/StoreProvider";

const ErrorContainer = styled.div`
  margin: 0 8px 8px 8px;
`;

const Login = ({ className }) => {
  const dispatch = useContext(DispatchStore);
  const { currentUser } = useContext(StateStore);
  const [error, setError] = useState(null);

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await loginUser(values.username, values.password);
      await getCurrentUser(dispatch);
      setSubmitting(false);
    } catch (e) {
      if (e.status === 401) {
        setError("Wrong password or user not found.");
      }
    }

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
        password: Yup.string().required("Required"),
      })}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        const wrappedHandleChange = (event) => {
          setError(null);
          handleChange(event);
        };

        return (
          <TooltipContainer
            className={className}
            as="form"
            onSubmit={handleSubmit}
          >
            <TooltipHeader>Login</TooltipHeader>
            <Section>
              <Cell50>
                <InputAndLabel
                  label="Username"
                  id="username"
                  placeholder="Username"
                  value={values.username}
                  onChange={wrappedHandleChange}
                  onBlur={handleBlur}
                  error={touched.username && errors.username}
                />
              </Cell50>
              <Cell50>
                <InputAndLabel
                  label="Password"
                  id="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={wrappedHandleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  type="password"
                />
              </Cell50>
            </Section>

            {error && (
              <ErrorContainer>
                <Error>{error}</Error>
              </ErrorContainer>
            )}
            <Section>
              <Cell50>
                <Button
                  buttonStyle="button-grey"
                  type="submit"
                  disabled={isSubmitting || Object.entries(errors).length !== 0}
                >
                  Login
                </Button>
              </Cell50>
              <Cell50>
                <Button
                  buttonStyle="button-grey"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    alert("not implemented");
                  }}
                >
                  Register
                </Button>
              </Cell50>
            </Section>
          </TooltipContainer>
        );
      }}
    </Formik>
  );
};

export default Login;
