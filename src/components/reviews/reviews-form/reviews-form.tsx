import { FormEvent, memo, useRef, useState} from 'react';
import FormRating from '../../form-rating/form-rating';
import { useActionCreators } from '../../../hooks/store';
import { reviewActions } from '../../../store/slices/reviews';
import { toast } from 'react-toastify';
import { ReviewForm, normalizeToReviewToSend, shouldDisableForm } from './helper';


function ReviewsForm_({offerId}: {offerId: string}) {
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const formRef = useRef(null);
  const {postComment} = useActionCreators(reviewActions);
  const [isDisabled, setDisabled] = useState(false);

  const handleFormChange = (evt: React.FormEvent<ReviewForm>) => {
    setSubmitDisabled(shouldDisableForm(evt.currentTarget));
  };

  const handleFormSubmit = (evt: FormEvent<ReviewForm>) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const body = normalizeToReviewToSend(form, offerId);
    setDisabled(true);
    toast.promise(postComment(body).unwrap(), {
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
  };

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
          disabled={isSubmitDisabled || isDisabled}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

const ReviewsForm = memo(ReviewsForm_);

export default ReviewsForm;
