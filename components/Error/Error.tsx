import { Alert } from '@mui/material';
import { useState } from 'react';

const Error = ({ message }: any) => {
  const [error, setError] = useState(true);

  const Component = () => {
    return (
      <Alert
        severity="error"
        sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 10 }}
      >
        {message}
      </Alert>
    );
  };

  setTimeout(() => {
    setError(false);
  }, 5000);

  return error ? <Component /> : null;
};

export default Error;
