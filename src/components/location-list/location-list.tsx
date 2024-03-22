import { Link } from 'react-router-dom';
import { CITIES, CityName } from '../../constants/const';
import classNames from 'classnames';
import { useAppDispatch } from '../../hooks/store';
import { offersAction } from '../../store/slices/offers';

type LocationListProps = {
  currentCity: CityName;
}

function LocationList({currentCity}: LocationListProps): JSX.Element {
  const dispatch = useAppDispatch();
  return (
    <ul className="locations__list tabs__list">
      {CITIES.map((city) => (
        <li className="locations__item" key={city.name}>
          <Link
            className={classNames('locations__item-link tabs__item', {
              'tabs__item--active': city.name === currentCity,
            })}
            onClick={(evt) => {
              evt.preventDefault();
              dispatch(offersAction.setCity(city.name));
            }}
            to={`/${city.slug}`}
          >
            <span>{city.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default LocationList;
