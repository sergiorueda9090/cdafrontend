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
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        padding: { xs: 2, sm: 3, md: 0 }
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        xs={12}
        sm={10}
        md={6}
        lg={5}
        sx={{
          textAlign: "center",
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: { xs: 'white', sm: 'transparent' },
          borderRadius: { xs: 2, sm: 0 },
          boxShadow: { xs: 2, sm: 0 }
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <img
            src={TokenImage}
            alt="Token Verification"
            style={{
              maxWidth: "100%",
              width: window.innerWidth < 600 ? "200px" : "auto",
              height: "auto",
              marginBottom: "20px"
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
          }}
        >
          Enter Verification Code
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: { xs: 1, sm: 2 }
          }}
        >
          We've sent a code to your email. Please enter the code below to verify
          your account.
        </Typography>

        <Grid
          container
          spacing={{ xs: 1, sm: 2 }}
          justifyContent="center"
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          {[...Array(6)].map((_, index) => (
            <Grid item xs={2} sm={1.5} key={index}>
              <TextField
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: window.innerWidth < 600 ? "1rem" : "1.25rem",
                    padding: window.innerWidth < 600 ? "8px" : "12px"
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '40px', sm: '50px', md: '56px' }
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1.2, sm: 1.5 },
            backgroundColor: "#673ab7",
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              backgroundColor: "#5e35b1"
            }
          }}
        >
          Verify Code
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: { xs: 1.5, sm: 2 },
            color: "text.secondary",
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Didn't receive the code?{" "}
          <Button
            variant="text"
            size={window.innerWidth < 600 ? "small" : "medium"}
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Resend
          </Button>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CodeVerification;
