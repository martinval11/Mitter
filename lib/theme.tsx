import { createTheme } from '@mui/material';
import NextLink from 'next/link';
import { forwardRef } from 'react';

export const theme = () => {
  const LinkBehaviour = forwardRef(function LinkBehaviour(
    props: any,
    ref: any
  ) {
    return <NextLink ref={ref} {...props} />;
  });

  return createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehaviour,
        },
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehaviour,
        },
      },
    },
    palette: {
      mode: 'dark'
    },
  });
};
