import { Helmet } from 'react-helmet-async';
import { FormEvent, useRef } from 'react';
import { userActions } from '../../store/slices/user';
import { useActionCreators } from '../../hooks/store';
import { RandomCity } from '../../components/random-city/random-city';
import Header from '../../components/header/header';

type HTMLLoginForm = HTMLFormElement & {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

function LoginPage(): JSX.Element {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const { login } = useActionCreators(userActions);

  function handleSubmit(event: FormEvent<HTMLLoginForm>) {
    event.preventDefault();

    if (loginRef.current !== null && passwordRef.current !== null) {
      login({
        email: loginRef.current.value,
        password: passwordRef.current.value,
      });
    }
  }

  return (
    <div className="page page--gray page--login">
      <Helmet>
        <title>6 Cities - Login</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  ref={loginRef}
                  className="login__input form__input"
                  type="email"
                  name="email"
                  pattern="([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  ref={passwordRef}
                  className="login__input form__input"
                  type="password"
                  name="password"
                  pattern="^(?=.*[a-zA-Z])(?=.*\d).+$"
                  placeholder="Password"
                  required
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </section>
          <RandomCity />
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
