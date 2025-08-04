import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { IconButton, InputAdornment } from '@mui/material';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export function RHFTextField({ name, helperText, type, ...other }) {
  const { control, setValue, getValues } = useFormContext();

  const handleIncrement = () => {
    const currentValue = getValues(name) || 0;
    setValue(name, currentValue + 1);
  };

  const handleDecrement = () => {
    const currentValue = getValues(name) || 0;
    if (currentValue > 1) { 
      setValue(name, currentValue - 1);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              const {value} = event.target;
              setValue(name, value === '' ? '' : Number(value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
            min: type === 'number' ? 1 : undefined,
            ...other.inputProps,
          }}
          InputProps={
            type === 'number'
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleIncrement} edge="end" aria-label="Incrementar">
                        <Iconify icon="mingcute:add-line" />
                      </IconButton>
                      <IconButton onClick={handleDecrement} edge="end" aria-label="Decrementar">
                        <Iconify icon="ic:baseline-minus" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : {}
          }
          {...other}
        />
      )}
    />
  );
}