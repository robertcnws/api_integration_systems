import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { EmptyContent } from '../empty-content';

// ----------------------------------------------------------------------

export function TableNoData({ notFound, sx, colSpan = 12 }) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={colSpan}>
          <EmptyContent filled sx={{ py: 10, ...sx }} />
        </TableCell>
      ) : (
        <TableCell colSpan={colSpan} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
