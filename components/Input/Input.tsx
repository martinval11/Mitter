import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { useState } from 'react';

const Input = ({ mt, type, ...props }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show: any) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  if (type === 'password') {
    return (
      <FormControl variant="outlined" sx={{ mt: 2 }}>
        <InputLabel htmlFor="outlined-adornment-password">
          Password *
        </InputLabel>

        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          {...props}
          required
        />
      </FormControl>
    );
  } else {
    return (
      <TextField
        id="outlined-basic"
        variant="outlined"
        autoComplete="on"
        required
        sx={{ mt: mt }}
        {...props}
      />
    );
  }
};

export default Input;
