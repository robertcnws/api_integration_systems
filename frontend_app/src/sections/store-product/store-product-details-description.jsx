import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export function StoreProductDetailsDescription({ description, sx }) {
  return (
    <Markdown
      children={description}
      sx={{
        p: 3,
        '& p, li, ol, table': {
          typography: 'body2',
        },
        '& table': {
          mt: 2,
          maxWidth: 640,
          '& td': { px: 2 },
          '& td:first-of-type': { color: 'text.secondary' },
          'tbody tr:nth-of-type(odd)': { bgcolor: 'transparent' },
        },
        ...sx,
      }}
    />
  );
}
