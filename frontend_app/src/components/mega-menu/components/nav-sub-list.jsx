import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { removeLastSlash } from 'src/routes/utils';

import { NavLi, NavUl } from '../../nav-section';

// ----------------------------------------------------------------------

export function NavSubList({ data, slotProps, ...other }) {
  const pathname = usePathname();

  console.log('NavSubList data:', data);

  return (
    <>
      {data.map((list, index) => (
        <Stack
          component={NavLi}
          key={`${list?.subheader ?? list.items[0].title}-${index}`}
          spacing={1}
          {...other}
        >
          {list?.subheader && (
            <Typography variant="subtitle2" noWrap sx={slotProps?.subheader}>
              {list.subheader}
            </Typography>
          )}

          <NavUl sx={{ gap: 1 }} key={`${list?.subheader ?? list.items[0].title}-${index}-navUl`}>
            {list.items.map((item, index2) => (
              <NavSubItem
                key={`${item.title}-${index2}-${index}`}
                title={item.title}
                path={item.path}
                active={item.path === removeLastSlash(pathname)}
                slotProps={slotProps?.subItem}
              />
            ))}
          </NavUl>
        </Stack>
      ))}
    </>
  );
}

// ----------------------------------------------------------------------

export const NavSubItem = forwardRef(({ key, title, path, active, slotProps }, ref) => (
  <NavLi key={key}>
    <Link
      ref={ref}
      component={RouterLink}
      href={path}
      noWrap
      sx={{
        position: 'relative',
        color: 'text.secondary',
        fontSize: (theme) => theme.typography.pxToRem(13),
        lineHeight: (theme) => theme.typography.body2.lineHeight,
        transition: (theme) => theme.transitions.create('color'),
        '&:hover': { color: 'text.primary' },
        ...(active && {
          color: 'text.primary',
          textDecoration: 'underline',
          fontWeight: 'fontWeightSemiBold',
        }),
        ...slotProps,
      }}
    >
      {title}
    </Link>
  </NavLi>
));
