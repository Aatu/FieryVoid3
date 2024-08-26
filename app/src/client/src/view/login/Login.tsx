import React from "react";
import * as Yup from "yup";
import styled from "styled-components";

import {
  InputAndLabel,
  Button,
  Section,
  Link,
  TooltipContainer,
  TooltipHeader,
  Cell50,
  Error,
  Value,
} from "../../styled";
import { useLoginUser, useUser } from "../../state/userHooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ErrorContainer = styled.div`
  margin: 0 8px 8px 8px;
`;

type FormValues = {
  username: string;
  password: string;
};

const Login: React.FC<{ className?: string }> = ({ className }) => {
  const { data: currentUser } = useUser();
  const { mutate: login, isPending, error } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(
      Yup.object().shape({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
      })
    ),
  });

  const onSubmit = async (values: FormValues) => {
    login(values);
  };

  if (currentUser) {
    return (
      <TooltipContainer>
        <TooltipHeader>
          You are logged in as <Value>{currentUser.username}</Value>
        </TooltipHeader>

        <Link to="/logout">
          <Button buttonstyle="button-grey">Log out</Button>
        </Link>
      </TooltipContainer>
    );
  }

  return (
    <TooltipContainer
      className={className}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TooltipHeader>Login</TooltipHeader>
      <Section>
        <Cell50>
          <InputAndLabel
            label="Username"
            id="username"
            placeholder="Username"
            {...register("username")}
          />
        </Cell50>
        <Cell50>
          <InputAndLabel
            label="Password"
            id="password"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
        </Cell50>
      </Section>

      {error && (
        <ErrorContainer>
          <Error>{error?.message}</Error>
        </ErrorContainer>
      )}
      <Section>
        <Button
          buttonstyle="button-grey"
          type="submit"
          disabled={
            isSubmitting || isPending || Object.entries(errors).length !== 0
          }
        >
          Login
        </Button>
        <Button
          buttonstyle="button-grey"
          onClick={(e) => {
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
};

export default Login;
