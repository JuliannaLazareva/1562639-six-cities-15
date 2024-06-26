import Header from '../../components/header/header';
import OfferGallery from '../../components/offers/offer-gallery/offer-gallery';
import OfferInside from '../../components/offers/offer-inside/offer-inside';
import NearPlaces from '../../components/offers/near-places/near-places';
import Map from '../../components/map/map';
import {
  ComponentEnvironment,
  NEAR_PLACES_LIMIT,
  RequestStatus,
} from '../../constants/const';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import NotFoundPage from '../not-found-page/not-found-page';
import { PremiumMark } from '../../components/premium-mark/premium-mark';
import { OfferHost } from '../../components/offers/offer-host/offer-host';
import { OfferFeatures } from '../../components/offers/offer-features/offer-features';
import { Rating } from '../../components/rating/rating';
import { Price } from '../../components/price/price';
import { useActionCreators, useAppSelector } from '../../hooks/store';
import { offerActions, offerSelector } from '../../store/slices/offer';
import { reviewActions } from '../../store/slices/reviews';
import { useEffect } from 'react';
import { Loader } from '../../components/loader/loader';
import { Reviews } from '../../components/reviews/reviews';
import { offersActions } from '../../store/slices/offers';
import { BookmarkButton } from '../../components/bookmark-button/bookmark-button';

const allActions = {
  ...offerActions,
  ...reviewActions,
  ...offersActions,
};

function OfferPage(): JSX.Element {
  const offer = useAppSelector(offerSelector.offer);
  const status = useAppSelector(offerSelector.offerStatus);
  const offersNearBy = useAppSelector(offerSelector.nearbyOffers).slice(0,3);

  const { fetchNearBy, fetchOffer, setActiveId, fetchComments } =
    useActionCreators(allActions);

  const { id } = useParams() as {id: string};

  useEffect(() => {
    setActiveId(id);
    if (id) {
      Promise.all([fetchOffer(id), fetchNearBy(id), fetchComments(id)]);
    }
  }, [fetchOffer, fetchNearBy, fetchComments, id, setActiveId]);

  if (status === RequestStatus.Idle || status === RequestStatus.Loading) {
    return <Loader />;
  }

  if (status === RequestStatus.Failed || !offer) {
    return <NotFoundPage />;
  }

  const nearOffersPlusCurrent = [
    offer,
    ...offersNearBy.slice(0, NEAR_PLACES_LIMIT),
  ];
  const {
    images,
    isPremium,
    title,
    isFavorite,
    rating,
    type,
    bedrooms,
    price,
    goods,
    host,
    maxAdults,
    description,
  } = offer;

  return (
    <div className="page">
      <Helmet>
        <title>6 Cities - offer</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <OfferGallery images={images} />
          <div className="offer__container container">
            <div className="offer__wrapper">
              {isPremium && <PremiumMark className={'offer__mark'} />}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{title}</h1>
                <BookmarkButton offerId={id} classStart={'offer'} width={31} height={33} isFavorite={isFavorite} />
              </div>
              <Rating rating={rating} classStart={'offer'} />
              <OfferFeatures
                type={type}
                bedrooms={bedrooms}
                maxAdults={maxAdults}
              />
              <Price price={price} classStart={'offer'} />
              <OfferInside goods={goods} />
              <OfferHost host={host} description={description} />
              <Reviews />
            </div>
          </div>
          <Map
            environment={ComponentEnvironment.Offer}
            offers={nearOffersPlusCurrent}
            city={offer.city.name}
          />
        </section>
        <div className="container">
          <NearPlaces offers={offersNearBy} />
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
