import React from 'react';
import Header from '../../components/Header/Header';
import classes from './Layout.module.scss';

const Layout = (props) => {
    return (
        <div className={classes.Layout}>
            <Header />
            <main>
                {props.children}
            </main>
            <footer>
                <p>Built using ReactJS, NodeJS, Mongoose and Express.</p>
                <small>&copy; {new Date().getFullYear()} John Gabriel C. Adawag. All Rights Reserved.</small>
            </footer>
        </div>
    );
}

export default Layout;