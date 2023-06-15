import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { AuthContext } from "../context/auth-context";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";

interface signInForm {
  email: string;
  password: string;
}
function SignIn() {
  const ctx = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorEmail, setErrorEmail] = React.useState<boolean>(false);
  const [errorPassword, setErrorPassword] = React.useState<boolean>(false);
  const [errorServerMessageEmail, setErrorServerMessageEmail] =
    React.useState<string>("");
  const [errorServerMessagePassword, setErrorServerMessagePassword] =
    React.useState<string>("");

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
    setLoading(true);
    try {
      let responseData = await axios(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signin`,
        {
          method: "POST",
          data: { email: data.email, password: data.password },
        }
      );
      ctx.onLogin(responseData.data.userId, responseData.data.token);
      setLoading(false);
      window.location.href = `${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}&scope=${process.env.REACT_APP_SCOPE}`;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.message === "Incorrect email") {
          setErrorEmail(true);
          setErrorServerMessageEmail(error.response.data.message);
          setErrorPassword(false);
          setErrorServerMessagePassword("");
        } else if (error.response.data.message === "Incorrect password") {
          setErrorPassword(true);
          setErrorServerMessagePassword(error.response.data.message);
          setErrorEmail(false);
          setErrorServerMessageEmail("");
        }
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
                error={!!methods.formState.errors.email || errorEmail}
                helperText={
                  methods.formState.errors.email?.message ||
                  errorServerMessageEmail ||
                  ""
                }
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
                error={!!methods.formState.errors.password || errorPassword}
                helperText={
                  methods.formState.errors.password?.message ||
                  errorServerMessagePassword ||
                  ""
                }
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#1DB954" }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign In"}
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

export default SignIn;
