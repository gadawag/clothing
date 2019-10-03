import React from 'react';
import {connect} from 'react-redux';
import {errorHelper} from '../../utilities/utilities';
import axios from '../../utilities/axios';
import {fetchCategory} from '../../store/actions/userAction';
import CategoryItem from './CategoryItem/CategoryItem';
import {withRouter} from 'react-router-dom';
import Loader from '../Loader/Loader';
import classes from './Categories.module.scss';

class Categories extends React.Component {
    constructor() {
        super();
        this.state = {
            error: [],
            loading: false
        }
        this.linkHandler = this.linkHandler.bind(this);
    }

    componentDidMount() {
        this.fetchCategory();
        this._flag = true;
    }

    componentWillUnmount() {
        this._flag = false;
    }

    showError(e) {
        this.setState({
            error: [...e],
            loading: false
        });
    }

    async fetchCategory() {
        if (this.props.category.length < 1) {
            this.setState({
                loading: true
            });

            try {
                const response = await axios.get('/category');
                this.props.fetchCategory(response.data.category);
                // It's okay to setState after an update in our store, because we are not using any async on our action creators (thunk)
                if (this._flag) {
                    this.setState({
                        loading: false
                    });
                }
            } catch (e) {
                // Show server validation error
                if (e.response) {
                    return this.showError(e.response.data.error);
                }
    
                // Show internal error if server is not responding
                return this.showError([e.message]);
            }
        }
    }

    linkHandler(slug) {
        this.props.history.push(`/category/${slug}`);
    }

    displayCategory() {
        let count = 0;
        return this.props.category.map((e, i, arr) => {
            count++; // I can access count because of closure
            let large = false;

            if ((count === 4 || count === 5)) {
                large = true;
            }

            count = count > 5 ? 1 : count;

            return (<CategoryItem 
                        key={e._id} 
                        title={e.title} 
                        image={e.image} 
                        large={large}
                        slug={e.slug}
                        click={this.linkHandler} />);
        });
    }

    render() {
        const error = errorHelper(this.state);
        let content = <Loader />;

        if (!this.state.loading) {
            content = (
                <div className={classes.Categories}>
                    {error}
                    
                    {this.displayCategory()}
                </div>
            );
        }

        return content;
    }
}

const mapStateToProps = (state) => {
    return {
        category: state.user.category
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCategory: (category) => {dispatch(fetchCategory(category))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Categories));