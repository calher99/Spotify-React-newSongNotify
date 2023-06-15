import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";

interface signUpForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

function SignUp() {
  const ctx = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorEmail, setErrorEmail] = React.useState<boolean>(false);
  const [errorServerMessageEmail, setErrorServerMessageEmail] =
    React.useState<string>("");

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
    setLoading(true);
    try {
      let responseData = await axios(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
        {
          method: "POST",
          data: {
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
          },
        }
      );
      ctx.onLogin(responseData.data.userId, responseData.data.token);
      setLoading(false);
      window.location.href = `${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}&scope=${process.env.REACT_APP_SCOPE}`;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        if (
          error.response.data.message === "Email already exists" ||
          error.response.data.message === "email invalid"
        )
          console.log(error.response.data.message);
        setErrorEmail(true);
        setErrorServerMessageEmail(error.response.data.message);
      }
    }
  };
  return (
    <>
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
                    error={!!methods.formState.errors.email || errorEmail}
                    helperText={
                      methods.formState.errors.email?.message ||
                      errorServerMessageEmail ||
                      ""
                    }
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
                    helperText={
                      methods.formState.errors.password?.message ?? ""
                    }
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#1DB954" }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign Up"}
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
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography>
            Waking the server up! Could take up to 30 seconds...
          </Typography>
          <CircularProgress />
        </Box>
      </Backdrop>
    </>
  );
}

export default SignUp;
