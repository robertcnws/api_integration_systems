import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { StoreProductReviewItem } from './store-product-review-item';

// ----------------------------------------------------------------------

export function StoreProductReviewList({ reviews, refetch }) {
  return (
    <>
      {reviews.map((review) => (
        <StoreProductReviewItem key={review.id} review={review} refetch={refetch} />
      ))}

      <Pagination
        count={Math.ceil(reviews.length / 5)}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: { my: 5, mx: 'auto', justifyContent: 'center' },
        }}
      />
    </>
  );
}
