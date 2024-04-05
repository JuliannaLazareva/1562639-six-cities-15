import { FormEvent, memo, useCallback, useRef, useState} from 'react';
import FormRating from '../../form-rating/form-rating';
import { useActionCreators } from '../../../hooks/store';
import { reviewActions } from '../../../store/slices/reviews';
import { toast } from 'react-toastify';
import { ReviewToSend } from '../../../types/review';

const REVIEW_MIN_LENGTH = 50;
const REVIEW_MAX_LENGTH = 300;

type Form = HTMLFormElement & {
  rating: RadioNodeList;
  review: HTMLTextAreaElement;
}

const shouldDisableForm = (form: Form): boolean => {
  const rating = form.rating.value;
  const review = form.review.value;
  return review.length < REVIEW_MIN_LENGTH || review.length > REVIEW_MAX_LENGTH || !rating;
};

function ReviewsForm_({offerId}: {offerId: string}) {
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const formRef = useRef(null);
  const {postComment} = useActionCreators(reviewActions);
  const [isDisabled, setDisabled] = useState(false);

  const handleFormChange = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
    const form = evt.currentTarget as Form;

    setSubmitDisabled(shouldDisableForm(form));
  },[]);

  const handleFormSubmit = useCallback((evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = evt.currentTarget as Form;
    const reviewToSend: ReviewToSend = {
      offerId,
      body: {
        comment: form.review.value,
        rating: +form.rating.value,
      },
    };
    setDisabled(true);
    toast.promise(postComment(reviewToSend).unwrap(), {
      pending: 'Sending review...',
      success: {
        render: () => {
          setDisabled(false);
          setSubmitDisabled(true);
          form.reset();
          return 'Review sent!';
        }
      },
      error: {
        render() {
          setDisabled(false);
          return 'Failed to send review. Please try again';
        }
      }
    });
  }, [offerId, postComment]);

  return (
    <form className="reviews__form form" action="#" method="post" onChange={handleFormChange} onSubmit={handleFormSubmit} ref={formRef}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <FormRating isDisabled={isDisabled} />
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        disabled={isDisabled}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe
          your stay with at least{' '}
          <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

const ReviewsForm = memo(ReviewsForm_);

export default ReviewsForm;
