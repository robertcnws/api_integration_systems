import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function PurchaseTableFiltersResult({ filters, onResetPage, totalResults, hasNotAll = true, sx }) {
  
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({status: 'not_used'});
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
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
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

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>

      <FiltersBlock label="Client:" isShow={!!filters.state.client.name}>
        <Chip {...chipProps} label={filters.state.client.name} onDelete={handleResetClient} />
      </FiltersBlock>
    </FiltersResult>
  );
}
