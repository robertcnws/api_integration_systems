import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function StoreProductFiltersResult({ filters, onResetPage, totalResults, sx }) {

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
    localStorage.removeItem('itemFilterName');
  }, [filters, onResetPage]);


  const handleReset = useCallback(() => {
    onResetPage();
    localStorage.removeItem('itemFilterName');
    localStorage.removeItem('itemFilterType');
    localStorage.removeItem('itemFilterStartDate');
    localStorage.removeItem('itemFilterEndDate');
    localStorage.removeItem('itemFilterInstaller');
    localStorage.removeItem('itemFilterCustom');
    filters.setState({
      // list: 'in progress',
      name: '',
      // type: [],
      // startDate: null,
      // endDate: null,
      // installer: { id: null, name: null },
      // custom: {
      //   hasPermission: false,
      //   isPreparation: { name: 'preparation', value: false },
      //   isCoordination: { name: 'coordination', value: false },
      //   isInstallation: { name: 'installation', value: false },
      //   isPermission: { name: 'permission', value: false },
      //   isClosing: { name: 'closing', value: false },
      //   hasComments: false,
      // }
    });
  }, [filters, onResetPage]);


  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
      
    </FiltersResult>
  );
}
