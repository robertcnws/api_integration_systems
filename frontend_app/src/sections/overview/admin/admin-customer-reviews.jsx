import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import AutoHeight from 'embla-carousel-auto-height';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Tooltip, IconButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';
import { listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';

import { StoreProductFolderItemCarousel } from 'src/sections/store-product/store-product-folder-item-carousel';

// ----------------------------------------------------------------------

export function AdminCustomerReviews({
  title,
  subheader,
  list,
  onDeleteReview,
  openConfirmDeleteReview,
  onConfirmDeleteReview,
  onCancelDeleteReview,
  ...other
}) {

  const plugins = useMemo(() => (list?.length > 0 ? [AutoHeight()] : []), [list]);
  const carousel = useCarousel({ align: 'start' }, plugins);

  const customerInfo = list?.find((_, index) => index === carousel.dots.selectedIndex);

  const router = useRouter();

  const sortedList = useMemo(
    () => list?.sort((a, b) => dayjs(b.createdTime) - dayjs(a.createdTime)),
    [list]
  );

  const [selectedItem, setSelectedItem] = useState(null);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

  return (
    <>
      <Card sx={{ height: 450 }} {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={<CarouselArrowBasicButtons {...carousel.arrows} />}
        />

        <Carousel sx={{mb: -1}} carousel={carousel}>
          {sortedList?.map((item) => (
            <Item key={item.id} item={item} router={router} sx={{height: 300}}/>
          ))}
        </Carousel>

        {listRolesAndSubroles(roleName).includes(CONFIG.roles.administrator) && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box sx={{ p: 2, gap: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'right' }}>
              <Tooltip title="Delete customer review" placement="top" arrow>
                <IconButton
                  color="error"
                  variant="soft"
                  onClick={() => {
                    setSelectedItem(customerInfo);
                    onConfirmDeleteReview();
                  }}
                >
                  <Iconify icon="mdi:delete-alert" width={25} height={25} />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        )}
      </Card>
      <ConfirmDialog
        open={openConfirmDeleteReview}
        onClose={onCancelDeleteReview}
        title="Delete Review"
        content={
          <>
            Are you sure want to delete this review <b>
              &ldquo;{selectedItem?.comment}&ldquo;
            </b> in product <b>
              ({selectedItem?.name})
            </b>, posted by <b>
              {selectedItem?.user.firstName} {selectedItem?.user.lastName}
            </b> and ranked <b>{selectedItem?.rating}</b>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteReview(selectedItem.id);
              onCancelDeleteReview();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function Item({
  item,
  router,
  sx,
  ...other
}) {

  const sortedReactions = useMemo(() => {
    const reactions = item?.reactions || [];
    return [...reactions].sort((a, b) =>
      a.reactionType.localeCompare(b.reactionType)
    );
  }, [item?.reactions]);

  const reactionCounts = useMemo(
    () => (sortedReactions || [])?.reduce((acc, { reactionType }) => {
      acc[reactionType] = (acc[reactionType] || 0) + 1;
      return acc;
    }, {}), [sortedReactions]
  );

  const reactionEntries = Object.entries(reactionCounts);

  return (
    <Box
      sx={{
        p: 3,
        gap: 2,
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        cursor: 'pointer',
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* <Avatar
          alt={item.user.firstName}
          src={item.user.avatarUrl}
          sx={{ width: 48, height: 48 }}
          onClick={() => router.push(paths.dashboard.storeProduct.details(item.productId))}
        /> */}

        <StoreProductFolderItemCarousel
          images={item.attachments ?? []}
          maxWidth={80}
          maxHeight={80}
          overflow='hidden'
        />

        <ListItemText
          primary={item.name}
          secondary={
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'space-between' }}>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'left',
                  gap: 1,
                  flexDirection: 'column'
                }}
                onClick={() => router.push(paths.dashboard.storeProduct.details(item.productId))}
              >
                <Typography component="span" variant="caption" color="text.disabled">
                  {`Posted by ${item.user.firstName} ${item.user.lastName}`}
                </Typography>
                <Typography component="span" variant="caption" color="text.disabled">
                  {`Posted at ${fDateTime(item.createdTime)}`}
                </Typography>
              </Box>
            </Box>
          }
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
          onClick={() => router.push(paths.dashboard.storeProduct.details(item.productId))}
        />
      </Box>

      <Tooltip
        title={`Rating: ${item.rating}`} placement="top-start"
        arrow
        onClick={() => router.push(paths.dashboard.storeProduct.details(item.productId))}
      >
        <span>
          <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Rating value={item.rating} size="small" readOnly precision={0.5} />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0 }}>
              {item.description || ''}
            </Typography>
          </Box>
        </span>
      </Tooltip>

      <Typography
        variant="body2"
        onClick={() => router.push(paths.dashboard.storeProduct.details(item.productId))}
      >
        {item.comment}
      </Typography>

      <Box
        sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}
        onClick={() => router.push(paths.dashboard.storeProduct.details(item.productId))}
      >
        {reactionEntries?.map(([type, count]) => (
          <Tooltip key={type} title={`${count} ${type} reactions`} placement="top" arrow>
            <Chip
              size="small"
              variant="soft"
              key={type}
              label={
                <Box
                  component="span"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: type === 'like' ? 'info.main' :
                      type === 'dislike' ? 'secondary.main' :
                        type === 'angry' ? 'error.main' :
                          type === 'love' ? 'success.main' :
                            type === 'care' ? 'primary.main' :
                              type === 'funny' ? 'warning.main' :
                                type === 'sad' ? 'secondary.light' : 'text.primary',
                  }}>
                  {type === 'like' ? <Iconify icon="bx:like" width={20} height={20} /> :
                    type === 'dislike' ? <Iconify icon="bx:dislike" width={20} height={20} /> :
                      type === 'angry' ? <Iconify icon="healthicons:angry-outline-24px" width={22} height={22} /> :
                        type === 'love' ? <Iconify icon="hugeicons:in-love" width={20} height={20} /> :
                          type === 'care' ? <Iconify icon="emojione-monotone:hugging-face" width={20} height={20} /> :
                            type === 'funny' ? <Iconify icon="streamline:smiley-laughing-3" width={18} height={18} /> :
                              type === 'sad' ? <Iconify icon="la:sad-tear" width={23} height={23} /> :
                                <Iconify icon="bxs:neutral" width={20} height={20} />
                  }
                  <Typography variant="caption">
                    {count}
                  </Typography>
                </Box>
              }
              sx={{ cursor: 'pointer' }}
            />
          </Tooltip>
        ))}
      </Box>
      <br />
    </Box>
  );
}
