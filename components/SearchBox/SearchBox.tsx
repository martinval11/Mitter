import { TextField } from '@mui/material';
import styled from '@emotion/styled'

export const SearchBox = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: '4px 0 0 4px',
  },
}));
