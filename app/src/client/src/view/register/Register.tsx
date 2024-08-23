import React from "react";
import { useForm } from "react-hook-form";

import { Title, InputAndLabel, Button /*Error*/ } from "../../styled";

type FormValues = {
  username: string;
  password: string;
  passwordConfirm: string;
};

const Register: React.FC = () => {
  const onSubmit = async (data: FormValues) => {
    console.log("register, data: ", data);
    /*

    let { username, password } = values;
    username = username.trim();
    password = password.trim();

    try {
      await registerUser(username, password);
      await loginUser(username, password);
      await getCurrentUser(dispatch);
    } catch (error) {
      this.setState({ error: error.data });
    }
    setSubmitting(false);
    */
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { username: "", password: "", passwordConfirm: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>Register a new user {/*error && <Error>{error}</Error>*/}</Title>

      <InputAndLabel label="Username" id="username" {...register("username")} />

      <InputAndLabel
        label="Password"
        id="password"
        type="password"
        {...register("password")}
      />

      <InputAndLabel
        label="Confirm password"
        id="passwordConfirm"
        placeholder="Confirm password"
        type="password"
        {...register("passwordConfirm")}
      />

      <Button
        buttonStyle="button-grey"
        type="submit"
        disabled={/*isSubmitting || */ Object.entries(errors).length !== 0}
      >
        Register
      </Button>
    </form>
  );
};

export default Register;
