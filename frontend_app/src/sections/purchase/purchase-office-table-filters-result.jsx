import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersOfficeResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function PurchaseOfficeTableFiltersResult({ filters, onResetPage, totalResults, sx }) {

  const handleRemoveKeyword = useCallback(
    (property) => {
      onResetPage();
      filters.setState({ [property]: '' });
    },
    [filters, onResetPage]
  );

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'not_used' });
  }, [filters, onResetPage]);

  const handleResetClient = useCallback(() => {
    onResetPage();
    filters.setState({ client: { id: '', name: '' } });
    localStorage.removeItem('purchaseFilterClient');
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
    filters.setState({
      status: 'not_used',
      client: { id: '', name: '' },
    });

  }, [filters, onResetPage]);

  return (
    <FiltersOfficeResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      {(filters.state.status !== 'all' && filters.state.status !== 'not_used') && (
        <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
          <Chip
            {...chipProps}
            label={
              filters.state.status === 'used' ?
                'Used' :
                filters.state.status === 'not_used' ?
                  'Not Used' :
                  filters.state.status === 'partially_used' ?
                    'Partially Used' :
                    filters.state.status === 'hasRequestedRefund' ?
                      'Refund Requested' :
                      filters.state.status
            }
            onDelete={handleRemoveStatus}
            sx={{ textTransform: 'capitalize' }}
          />
        </FiltersBlock>
      )}

      <FiltersBlock label="CONFIRMATION #:" isShow={!!filters.state.confirmationNumber}>
        <Chip
          {...chipProps}
          label={filters.state.confirmationNumber}
          onDelete={() => handleRemoveKeyword('confirmationNumber')}
        />
      </FiltersBlock>

      <FiltersBlock label="PIN #:" isShow={!!filters.state.pinNumber}>
        <Chip
          {...chipProps}
          label={filters.state.pinNumber}
          onDelete={() => handleRemoveKeyword('pinNumber')}
        />
      </FiltersBlock>

      <FiltersBlock label="Client:" isShow={!!filters.state.client.name}>
        <Chip
          {...chipProps}
          label={filters.state.client.name}
          onDelete={handleResetClient}
        />
      </FiltersBlock>
    </FiltersOfficeResult>
  );
}
