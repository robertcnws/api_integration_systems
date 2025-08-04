import { forwardRef } from 'react';

import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

export const IncrementerText = forwardRef(
  ({
    quantity,
    max, 
    min,
    onChange,
    onIncrease,
    onDecrease,
    disabledIncrease,
    disabledDecrease,
    sx,
    ...other
  }, ref) => (
    <Stack
      ref={ref}
      flexShrink={0}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 0.5,
        width: 'fit-content',
        minWidth: 80,
        borderRadius: 1,
        typography: 'subtitle2',
        border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
        ...sx,
      }}
      {...other}
    >
      <IconButton
        size="small"
        onClick={onDecrease}
        disabled={disabledDecrease}
        sx={{ borderRadius: 0.75 }}
      >
        <Iconify icon="eva:minus-fill" width={16} />
      </IconButton>

      <TextField
        type='number'
        min={min}
        max={max}
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10) || 0;
          onChange(val);
        }}
        onFocus={(e) => e.target.select()}
        onClick={(e) => e.target.select()}
        variant="outlined"
        size="small"
        sx={{ width: 'auto', textAlign: 'center' }}
        // inputProps={{
        //   style: { textAlign: 'center', width: '2.5ch' }
        // }}
      />

      <IconButton
        size="small"
        onClick={onIncrease}
        disabled={disabledIncrease}
        sx={{ borderRadius: 0.75 }}
      >
        <Iconify icon="mingcute:add-line" width={16} />
      </IconButton>
    </Stack>
  )
);
