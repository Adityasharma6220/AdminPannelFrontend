import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container, Box } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Page not found
        </Typography>
        <Button
          component={Link}
          to="/admin/dashboard"
          variant="contained"
          color="primary"
          size="large"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
