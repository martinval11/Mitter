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
      } as any,
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehaviour,
        },
      },
    } as any,
    palette: {
      mode: 'dark',
    }
  });
};
