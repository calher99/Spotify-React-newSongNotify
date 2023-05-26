import { Button, Container } from "@mui/material";
import React from "react";

function Login() {
  const handleLoginClick = () => {
    window.location.href = `${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}&scope=${process.env.REACT_APP_SCOPE}`;
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Button
          onClick={handleLoginClick}
          variant="contained"
          size="large"
          sx={{ backgroundColor: "#1DB954" }}
        >
          Log in
        </Button>
      </Container>
    </>
  );
}

export default Login;
