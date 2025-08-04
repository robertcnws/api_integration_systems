import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function FormHead({ sx, icon, title, description, isCompound = false, ...other }) {
  return (
    <>
      {icon && (
        <Box component="span" display="inline-flex" sx={{ mx: 'auto', mb: 3 }}>
          {icon}
        </Box>
      )}

      <Box
        gap={1.5}
        display="flex"
        flexDirection="column"
        sx={{ mb: 5, textAlign: 'center', whiteSpace: 'pre-line', ...sx }}
        {...other}
      >
        <Typography variant="h5">{title}</Typography>

        {(description && !isCompound) ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        ) : description}
      </Box>
    </>
  );
}
