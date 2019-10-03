import React, {Suspense} from 'react';
import Layout from './containers/Layout/Layout';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {calculateRemainingTime, registerExpiraton, getLocalStorageData, cartToStore} from './utilities/utilities';
import {authorizeUser, logout} from './store/actions/authAction';
import {authorizeAdmin, logoutAdmin} from './store/actions/adminAction';
import {saveCartToStore} from './store/actions/cartAction';
import Loader from './components/Loader/Loader';

// import(); is a way to import a function in nodejs
const LazyHome = React.lazy(() => import('./containers/pages/HomePage/HomePage'));
const LazyLogin = React.lazy(() => import('./containers/pages/LoginPage/LoginPage'));
const LazyAdmin = React.lazy(() => import('./containers/pages/Admin/Admin'));
const LazyCategory = React.lazy(() => import('./containers/pages/CategoryPage/CategoryPage'));
const LazyCart = React.lazy(() => import('./containers/pages/CartPage/CartPage'));
const LazyOrders = React.lazy(() => import('./containers/pages/OrderPage/OrderPage'));

class App extends React.Component {
  async componentDidMount() {
    const time = calculateRemainingTime();
    if (time) {
      // Authorize user
      const data = getLocalStorageData();
      this.props.authUser(data.token, data.name);

      // Register a logout
      registerExpiraton(this.props.logoutUser);
    }

    const timeAdmin = calculateRemainingTime(true); // true for admin
    if (timeAdmin) {
      // Authorize admin
      const dataAdmin = getLocalStorageData(true); // true for admin
      this.props.authAdmin(dataAdmin.token, dataAdmin.name);

      // Register a logout
      registerExpiraton(this.props.logoutAdmin, true); // true for admin
    }

    // Run initially even though the user is logged-in or not
    await cartToStore(this.props.isAuth, this.props.token, this.props.storeCart);
  }

  async componentDidUpdate() {
    // This function will run if the user is authorized (logged-in or signed-up)
    // No worries if we are changing the cart in our STORE because this app is not dependent on cart so this wont produce an infinite loop
    await cartToStore(this.props.isAuth, this.props.token, this.props.storeCart);
  }

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route path='/category/:slug' render={() => <LazyCategory />} />
              <Route path='/cart' render={() => <LazyCart />} />
              <Route path='/admin' render={() => <LazyAdmin />} />
              {this.props.isAuth && <Route path='/orders' render={() => <LazyOrders />} />}
              {!this.props.isAuth && <Route  path='/login' render={() => <LazyLogin />} />}
              <Route exact path='/' render={() => <LazyHome />} />
              <Route path='*' render={() => <h1>Error 404.</h1>} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== '',
    token: state.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authUser: (token, name) => dispatch(authorizeUser(token, name)),
    logoutUser: () => dispatch(logout()),
    authAdmin: (token, name) => dispatch(authorizeAdmin(token, name)),
    logoutAdmin: () => dispatch(logoutAdmin()),
    storeCart: (cart) => {dispatch(saveCartToStore(cart))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);