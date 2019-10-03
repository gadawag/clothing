import React from 'react';
import AdminLogin from './AdminLogin/AdminLogin';
import AdminLayout from './AdminLayout/AdminLayout';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import classes from './Admin.module.scss';

const LazyAdminCategory = React.lazy(() => import('./AdminCategory/AdminCategory'));
const LazyAdminProduct = React.lazy(() => import('./AdminProduct/AdminProduct'));

class Admin extends React.Component {
    render() {
        return (
            <div className={classes.Admin}>
                {/** If the path is /admin/categories then we pass it to our AdminLogin component to redirect there after user's login */}
                {!this.props.isAuth && <AdminLogin path={this.props.location.path} />}
                {this.props.isAuth && 
                    <AdminLayout>
                        <React.Suspense fallback={<h1>Loading...</h1>}>
                            <Switch>
                                <Route exact path="/admin/categories" render={() => <LazyAdminCategory />} />
                                <Route exact path="/admin/products" render={() => <LazyAdminProduct />} />
                                <Route exact path="/admin" render={() => <h1>Dashboard page</h1>} />
                            </Switch>
                        </React.Suspense>
                    </AdminLayout>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.admin.token !== ''
    }
}

export default connect(mapStateToProps)(withRouter(Admin));