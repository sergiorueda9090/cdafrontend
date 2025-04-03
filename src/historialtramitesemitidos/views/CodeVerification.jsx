import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import TokenImage from "../../assets/images/token.svg";

const CodeVerification = () => {
  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", backgroundColor: "#f4f5f7" }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        sx={{ textAlign: "center", p: 3 }}
      >
        <Box>
          <img
            src={TokenImage}
            alt="Token Verification"
            style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
          />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Enter Verification Code
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          We’ve sent a code to your email. Please enter the code below to verify
          your account.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {[...Array(6)].map((_, index) => (
            <Grid item xs={2} key={index}>
              <TextField
                variant="outlined"
                inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, py: 1.5, backgroundColor: "#673ab7" }}
        >
          Verify Code
        </Button>

        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Didn’t receive the code? <Button variant="text">Resend</Button>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CodeVerification;
