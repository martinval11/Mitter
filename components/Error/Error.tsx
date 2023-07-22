import { Alert } from '@mui/material';

const Error = ({ message }: any) => {
  return (
    <Alert
      severity="error"
      sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 10 }}
    >
      {message}
    </Alert>
  );
};

export default Error;
