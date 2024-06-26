import { memo } from 'react';
import { REVIEWS_LIMIT } from '../../../constants/const';
import { useAppSelector } from '../../../hooks/store';
import { reviewsSelectors } from '../../../store/slices/reviews';
import ReviewsItem from '../reviews-item/reviews-item';

function ReviewsList_(): JSX.Element {
  const reviews = useAppSelector(reviewsSelectors.lastReview);

  return (
    <ul className="reviews__list">
      {reviews
        .slice(0,REVIEWS_LIMIT)
        .map((review) => (
          <ReviewsItem key={review.id} {...review}/>
        ))}
    </ul>
  );
}

const ReviewsList = memo(ReviewsList_);

export default ReviewsList;
