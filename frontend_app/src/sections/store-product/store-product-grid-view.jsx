import { useRef, useMemo, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { wsEndpoints } from 'src/utils/axios';

import { useRewardStoreProductSelectionBuyByUsername } from 'src/_mock/__reward-store-product-selection-buys';
import { useRewardStoreProductSelectionCartByUsername } from 'src/_mock/__reward-store-product-selection-carts';

import { Iconify } from 'src/components/iconify';

import { useDataContext } from 'src/auth/context/data/data-context';
import { fieldsRewardStoreProductSelectionBuys, fieldsRewardStoreProductSelectionCarts } from 'src/auth/context/data/field-descriptors/field-descriptors-reward-store-product-selection';

import { StoreProductFolderItem } from './store-product-folder-item';
import { StoreProductActionSelected } from './store-product-action-selected';


// ----------------------------------------------------------------------

export function StoreProductGridView({
  table,
  dataFiltered,
  onDeleteItem,
  onViewRow,
  onEditRow,
  onManageActiveRow,
  onOpenConfirm,
  setTableData,
  refetchStoreProducts,
}) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const folders = useBoolean();

  const containerRef = useRef(null);

  const {
    loadedRewardPoints,
    refetchRewardPoints,
    loadingRewardPoints,
    errorRewardPoints
  } = useDataContext();


  const {
    loading: loadingStoreProductSelectionCarts,
    error: errorStoreProductSelectionCarts,
    data: storeProductSelectionCarts,
    refetch: refetchStoreProductSelectionCarts
  } = useRewardStoreProductSelectionCartByUsername(
    userLogged?.data?.username,
    fieldsRewardStoreProductSelectionCarts
  );

  const {
    loading: loadingStoreProductSelectionBuys,
    error: errorStoreProductSelectionBuys,
    data: storeProductSelectionBuys,
    refetch: refetchStoreProductSelectionBuys
  } = useRewardStoreProductSelectionBuyByUsername(
    userLogged?.data?.username,
    fieldsRewardStoreProductSelectionBuys
  );

  useEffect(() => {
    let socket;
    if (userLogged) {
      const username = userLogged?.data?.username;
      const url = wsEndpoints.rewardPoints.storeProductSelectionBuy.byUsername(username);
      socket = new WebSocket(url);

      socket.onerror = (errorEvent) => {
        console.error('WebSocket error:', errorEvent);
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (
          message.type === 'created' ||
          message.type === 'updated' ||
          message.type === 'deleted'
        ) {
          refetchStoreProductSelectionBuys().catch((err) => console.error('Error fetching product data:', err));
          refetchRewardPoints().catch((err) => console.error('Error fetching reward points:', err));
          refetchStoreProducts?.().catch((err) => console.error('Error fetching store products:', err));
        }
      };
    }
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userLogged, refetchStoreProductSelectionBuys, refetchRewardPoints, refetchStoreProducts]);

  return (
    <Box ref={containerRef}>
        {/* <ProjectPanel
          title="Folders"
          subtitle={`${dataFiltered.filter((item) => item.type === 'folder').length} folders`}
          onOpen={newFolder.onTrue}
          collapse={folders.value}
          onCollapse={folders.onToggle}
        /> */}

        <Collapse in={!folders.value} unmountOnExit>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
          >
            {dataFiltered
              // .filter((i) => i.type === 'folder')
              .map((folder) => (
                <StoreProductFolderItem
                  key={folder.id}
                  folder={folder}
                  selected={selected.includes(folder.id)}
                  onSelect={() => onSelectItem(folder.id)}
                  onDelete={() => onDeleteItem(folder.id)}
                  onViewRow={() => onViewRow(folder.id)}
                  onEditRow={() => onEditRow(folder.id)}
                  onManageActiveRow={() => onManageActiveRow(folder.id)}
                  setTableData={setTableData}
                  refetchStoreProducts={refetchStoreProducts}
                  storeProductSelectionCarts={storeProductSelectionCarts}
                  storeProductSelectionBuys={storeProductSelectionBuys}
                  loadingStoreProductSelectionCarts={loadingStoreProductSelectionCarts}
                  loadingStoreProductSelectionBuys={loadingStoreProductSelectionBuys}
                  errorStoreProductSelectionCarts={errorStoreProductSelectionCarts}
                  errorStoreProductSelectionBuys={errorStoreProductSelectionBuys}
                  refetchStoreProductSelectionCarts={refetchStoreProductSelectionCarts}
                  refetchStoreProductSelectionBuys={refetchStoreProductSelectionBuys}
                  loadedRewardPoints={loadedRewardPoints}
                  refetchRewardPoints={refetchRewardPoints}
                  loadingRewardPoints={loadingRewardPoints}
                  errorRewardPoints={errorRewardPoints}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse>

        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />

        {/* <ProjectPanel
          title="Files"
          subtitle={`${dataFiltered.filter((item) => item.type !== 'folder').length} files`}
          onOpen={upload.onTrue}
          collapse={files.value}
          onCollapse={files.onToggle}
        />

        <Collapse in={!files.value} unmountOnExit>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {dataFiltered
              .filter((i) => i.type !== 'folder')
              .map((file) => (
                <ProjectFileItem
                  key={file.id}
                  file={file}
                  selected={selected.includes(file.id)}
                  onSelect={() => onSelectItem(file.id)}
                  onDelete={() => onDeleteItem(file.id)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse> */}

        {!!selected?.length && (
          <StoreProductActionSelected
            numSelected={selected.length}
            rowCount={dataFiltered.length}
            selected={selected}
            onSelectAllItems={(checked) =>
              onSelectAllItems(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <Button
                  size="small"
                  color="error"
                  variant="contained"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={onOpenConfirm}
                  sx={{ mr: 1, mb: 2 }}
                >
                  Delete
                </Button>
            }
          />
        )}
      </Box>
  );
}
