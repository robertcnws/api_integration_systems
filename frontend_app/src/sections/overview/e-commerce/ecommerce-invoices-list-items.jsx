import { useContext } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableHeadCustom } from 'src/components/table';

import { LoadingContext } from 'src/auth/context/loading-context';

// ----------------------------------------------------------------------

export function EcommerceInvoicesListItems({ title, subheader, tableData, headLabel, ...other }) {

  const { isMobile } = useContext(LoadingContext);
  
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 422, maxHeight: 422, overflowY: 'auto' }}>
        <Table sx={{ minWidth: 422, position: 'relative' }} stickyHeader>
          <TableHeadCustom headLabel={headLabel} />
          {tableData?.length > 0 ? (
            <TableBody>
              {tableData.map((row, index) => (
                <RowItem key={`${row.id}-${index}`} row={row} isMobile={isMobile}/>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableNoData notFound={tableData?.length === 0} />
            </TableBody>
          )}
        </Table>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function RowItem({ row, isMobile }) {

  return (
    <TableRow>

      <TableCell align="left">{fDate(row?.date)}</TableCell>

      <TableCell width={!isMobile ? 300 : 'auto'}>{row?.invoiceNumber}</TableCell>

      <TableCell align="center">{fNumber(row?.lineItems?.length)}</TableCell>

      <TableCell align="right">
        <Label color="success">
          {fCurrency(row?.paymentMade)}
        </Label>
      </TableCell>


      {/* <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} src={row.avatarUrl} />
          {row.name}
        </Box>
      </TableCell> */}

      {/* <TableCell align="center">
        <FlagIcon code={row.countryCode} />
      </TableCell> */}

      {/* <TableCell align="right">
        <Label
          variant="soft"
          color={
            (row.rank === 'Top 1' && 'primary') ||
            (row.rank === 'Top 2' && 'secondary') ||
            (row.rank === 'Top 3' && 'info') ||
            (row.rank === 'Top 4' && 'warning') ||
            'error'
          }
        >
          {row.rank}
        </Label>
      </TableCell> */}
    </TableRow>
  );
}
