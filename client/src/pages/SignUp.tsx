import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

interface signUpForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

function SignUp() {
  let navigate = useNavigate();
  const ctx = React.useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const formSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Not a proper email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const methods = useForm<signUpForm>({
    resolver: yupResolver(formSchema),
  });

  const submitFormHandler: SubmitHandler<signUpForm> = async (
    data: signUpForm
  ) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:4080/api/users/signup",
        "POST",
        JSON.stringify({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
        { "Content-Type": "application/json" }
      );

      ctx.onLogin(responseData.userId, responseData.token);
      window.location.href = `${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}&scope=${process.env.REACT_APP_SCOPE}`;
      // navigate("../playlists");
    } catch (error) {
      console.log(error);
      //So that if there is an error we dont log in
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, backgroundColor: "#1DB954" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitFormHandler)}
            style={{ marginTop: "15px" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  fullWidth
                  id="firstName"
                  label="First Name *"
                  autoFocus
                  {...methods.register("name")}
                  error={!!methods.formState.errors.name}
                  helperText={methods.formState.errors.name?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="family-name"
                  {...methods.register("lastName")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address *"
                  autoComplete="email"
                  {...methods.register("email")}
                  error={!!methods.formState.errors.email}
                  helperText={methods.formState.errors.email?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password *"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...methods.register("password")}
                  error={!!methods.formState.errors.password}
                  helperText={methods.formState.errors.password?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#1DB954" }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/sign-in">
                  <Typography color="secondary">
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
}

export default SignUp;
