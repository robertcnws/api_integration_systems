
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemText from '@mui/material/ListItemText';

import { fDateTime } from 'src/utils/format-time';
import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function StoreProductReviewItem({ review, refetch }) {

  const userLogged = JSON.parse(sessionStorage.getItem('userLogged') || '{}');

  const numberReactionsByType = (type) => review.reactions?.filter((reaction) => reaction.reactionType === type).length || 0;

  const currentUserHasReacted = (type) => review.reactions?.some(
    (reaction) => reaction.user.id === userLogged?.data?.id && reaction.reactionType === type
  );

  const makeReaction = async (type) => {
    if (!currentUserHasReacted(type)) {
      try {
        const promise = axiosInstanceBackend.post(
          endpoints.rewardPoints.manage.storeProductReviewReaction.item(review?.id),
          {
            userReporter: JSON.stringify(userLogged?.data),
            reactionType: type,
          });
        await promise;
        refetch?.();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'row', md: 'column' }}
      sx={{ width: { md: 240 }, textAlign: { md: 'center' } }}
    >
      <Avatar
        src={review.user.avatarUrl}
        sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
      />

      <ListItemText
        primary={`${review.user.firstName} ${review.user.lastName}`}
        secondary={fDateTime(review.createdTime)}
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2', mb: 0.5 }}
        secondaryTypographyProps={{ noWrap: true, typography: 'caption', component: 'span' }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack spacing={1} flexGrow={1}>
      <Rating size="small" value={review.rating} precision={0.1} readOnly />

      {review.isPurchased && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{ color: 'success.main', typography: 'caption' }}
        >
          <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
          Verified purchase
        </Stack>
      )}

      <Typography variant="body2">{review.comment}</Typography>

      {!!review.attachments?.length && (
        <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ pt: 1 }}>
          {review.attachments.map((attachment) => (
            <Box
              key={attachment}
              component="img"
              alt={attachment}
              src={attachment}
              sx={{ width: 64, height: 64, borderRadius: 1.5 }}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
        <Tooltip
          title={currentUserHasReacted('like') ? "You reacted with like" : "React with like"}
          arrow
        >
          <ButtonBase
            disableRipple
            sx={{
              gap: 0.5,
              typography: 'caption',
              color: currentUserHasReacted('like') ? 'info.main' : 'inherit',
              fontWeight: currentUserHasReacted('like') ? 'bold' : 'normal',
            }}
            onClick={() => makeReaction('like')}
          >
            <Iconify
              icon={currentUserHasReacted('like') ? "solar:like-bold" : "solar:like-broken"}
              width={currentUserHasReacted('like') ? 27 : 20}
            />
            {numberReactionsByType('like')}
          </ButtonBase>
        </Tooltip>

        <Tooltip
          title={currentUserHasReacted('dislike') ? "You reacted with dislike" : "React with dislike"}
          arrow
        >
          <ButtonBase
            disableRipple
            sx={{
              gap: 0.5,
              typography: 'caption',
              color: currentUserHasReacted('dislike') ? 'error.main' : 'inherit',
              fontWeight: currentUserHasReacted('dislike') ? 'bold' : 'normal',
            }}
            onClick={() => makeReaction('dislike')}
          >
            <Iconify
              icon={currentUserHasReacted('dislike') ? "solar:dislike-bold" : "solar:dislike-broken"}
              width={currentUserHasReacted('dislike') ? 27 : 20}
            />
            {numberReactionsByType('dislike')}
          </ButtonBase>
        </Tooltip>

        <Tooltip
          title={currentUserHasReacted('love') ? "You reacted with love" : "React with love"}
          arrow
        >
          <ButtonBase
            disableRipple
            sx={{
              gap: 0.5,
              typography: 'caption',
              color: currentUserHasReacted('love') ? '#2859c5' : 'inherit',
              fontWeight: currentUserHasReacted('love') ? 'bold' : 'normal',
            }}
            onClick={() => makeReaction('love')}
          >
            <Iconify
              icon={currentUserHasReacted('love') ? "streamline-color:smiley-in-love-flat" : "hugeicons:in-love"}
              width={currentUserHasReacted('love') ? 25 : 20}
            />
            {numberReactionsByType('love')}
          </ButtonBase>
        </Tooltip>

        <Tooltip
          title={currentUserHasReacted('care') ? "You reacted with care" : "React with care"}
          arrow
        >
          <ButtonBase
            disableRipple
            sx={{
              gap: 0.5,
              typography: 'caption',
              color: currentUserHasReacted('care') ? 'warning.main' : 'inherit',
              fontWeight: currentUserHasReacted('care') ? 'bold' : 'normal',
            }}
            onClick={() => makeReaction('care')}
          >
            <Iconify
              icon={currentUserHasReacted('care') ? "fluent-emoji-flat:hugging-face" : "emojione-monotone:hugging-face"}
              width={currentUserHasReacted('care') ? 27 : 20}
            />
            {numberReactionsByType('care')}
          </ButtonBase>
        </Tooltip>

        <Tooltip
          title={currentUserHasReacted('funny') ? "You reacted with funny" : "React with funny"}
          arrow
        >
          <ButtonBase
            disableRipple
            sx={{
              gap: 0.5,
              typography: 'caption',
              color: currentUserHasReacted('funny') ? 'warning.main' : 'inherit',
              fontWeight: currentUserHasReacted('funny') ? 'bold' : 'normal',
            }}
            onClick={() => makeReaction('funny')}
          >
            <Iconify
              icon={currentUserHasReacted('funny') ? "noto:rolling-on-the-floor-laughing" : "emojione-monotone:face-with-tears-of-joy"}
              width={currentUserHasReacted('funny') ? 27 : 20}
            />
            {numberReactionsByType('funny')}
          </ButtonBase>
        </Tooltip>

        <Tooltip
          title={currentUserHasReacted('angry') ? "You reacted with anger" : "React with anger"}
          arrow
        >
          <ButtonBase
            disableRipple
            sx={{
              gap: 0.5,
              typography: 'caption',
              color: currentUserHasReacted('angry') ? '#8e2698' : 'inherit',
              fontWeight: currentUserHasReacted('angry') ? 'bold' : 'normal',
            }}
            onClick={() => makeReaction('angry')}
          >
            {/* bxs:donate-heart */}
            <Iconify
              icon={currentUserHasReacted('angry') ? "noto:angry-face-with-horns" : "hugeicons:angry"}
              width={currentUserHasReacted('angry') ? 27 : 20}
            />
            {numberReactionsByType('angry')}
          </ButtonBase>
        </Tooltip>

        <Tooltip
          title={currentUserHasReacted('sad') ? "You reacted with sadness" : "React with sadness"}
          arrow
        >
          <ButtonBase
            disableRipple
            sx={{
              gap: 0.5,
              typography: 'caption',
              color: currentUserHasReacted('sad') ? '#fbbf67' : 'inherit',
              fontWeight: currentUserHasReacted('sad') ? 'bold' : 'normal',
            }}
            onClick={() => makeReaction('sad')}
          >
            {/* bxs:donate-heart */}
            <Iconify
              icon={currentUserHasReacted('sad') ? "emojione-v1:sad-but-relieved-face" : "fa6-regular:face-sad-tear"}
              width={currentUserHasReacted('sad') ? 27 : 20}
            />
            {numberReactionsByType('sad')}
          </ButtonBase>
        </Tooltip>

      </Stack>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 5, px: { xs: 2.5, md: 0 } }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
