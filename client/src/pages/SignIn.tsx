import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

interface signInForm {
  email: string;
  password: string;
}
function SignIn() {
  let navigate = useNavigate();
  const ctx = React.useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email("Not a proper email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const methods = useForm<signInForm>({
    resolver: yupResolver(formSchema),
  });

  const submitFormHandler: SubmitHandler<signInForm> = async (
    data: signInForm
  ) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:4080/api/users/signin",
        "POST",
        JSON.stringify({
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
        <Avatar sx={{ m: 1, bgcolor: "#1DB954" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitFormHandler)}
            style={{ marginTop: "15px" }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...methods.register("email")}
              error={!!methods.formState.errors.email}
              helperText={methods.formState.errors.email?.message ?? ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...methods.register("password")}
              error={!!methods.formState.errors.password}
              helperText={methods.formState.errors.password?.message ?? ""}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#1DB954" }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
              </Grid>
              <Grid item>
                <Link to="/sign-up">
                  <Typography color="secondary">
                    Don't have an account? Sign Up
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

export default SignIn;
