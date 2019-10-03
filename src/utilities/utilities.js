import React from 'react';
import validator from 'validator';
import Error from '../components/Error/Error';
import axios from '../utilities/axios';

let _timeout;
let _timeoutAdmin;

export const loginSignupValidator = (state, type = 'login') => {
    const error = [];

    if (!validator.isEmail(state.email)) {
        error.push('Invalid email');
    }
    
    if (!validator.isLength(state.password, {min: 6})) {
        error.push('Password is too short');
    }

    if (type === 'signup') {
        if (!validator.equals(state.password, state.confirm)) {
            error.push('Password does not matched');
        }

        if (!validator.isLength(state.name, {min: 2})) {
            error.push('Name is invalid');
        }
    }

    return error;
}

export const getUrl = () => {
    return process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://gadawag-clothing-server.herokuapp.com';
}

const generateExpirationTime = () => {
    // 1hour
    const expiresIn = new Date(new Date().getTime() + (60 * 60 * 1000)).getTime();
    return expiresIn;
}

export const calculateRemainingTime = (isAdmin) => {
    const now = new Date().getTime();
    let expiration = JSON.parse(localStorage.getItem('gadawag-clothing'));

    if (isAdmin) {
        expiration = JSON.parse(localStorage.getItem('gadawag-clothing-admin'));
    }

    if (expiration) {
        expiration = expiration.expiresIn;
        return expiration - now;
    }

    return false;
}

export const cancelTimeout = (isAdmin = false) => {
    // console.log('Timeout for logout was cancelled. isAdmin = ' + isAdmin);
    if (isAdmin) {
        return clearTimeout(_timeoutAdmin);
    }

    clearTimeout(_timeout);
}

export const deleteUserToStorage = () => {
    localStorage.removeItem('gadawag-clothing');
}

export const deleteAdminToStorage = () => {
    localStorage.removeItem('gadawag-clothing-admin');
}

export const registerExpiraton = (cb, isAdmin = false) => {
    const timeRemaining = calculateRemainingTime(isAdmin);
    
    if (!isAdmin) {
        _timeout = setTimeout(() => {
            // console.log('Logged out');
            deleteUserToStorage();
            cb();
        }, timeRemaining);
    } else {
        _timeoutAdmin = setTimeout(() => {
            // console.log('Logged out admin');
            deleteAdminToStorage();
            cb();
        }, timeRemaining);
    }

    // let forIdentity = ' for user';

    // if (isAdmin) {
    //     forIdentity = ' for admin';
    // }

    // console.log('Logout has been registered', Math.round((timeRemaining / 1000)), 'seconds remaining' + forIdentity);
}

export const saveUserToStorage = (token, name, isAdmin = false) => {
    const expiresIn = generateExpirationTime();
    const obj = {token, name, expiresIn}

    if (!isAdmin) {
        return localStorage.setItem('gadawag-clothing', JSON.stringify(obj));
    }
    
    localStorage.setItem('gadawag-clothing-admin', JSON.stringify(obj));
}

export const getLocalStorageData = (isAdmin = false) => {
    if (isAdmin) {
        return JSON.parse(localStorage.getItem('gadawag-clothing-admin'));
    }

    return JSON.parse(localStorage.getItem('gadawag-clothing'));
}

export const errorHelper = (state) => {
    let hasError = '';

    if (state.error.length > 0) {
        hasError = (
            state.error.map((e, i) => <Error key={i} error={e} />)
        );
    }

    return hasError;
}

export const generateBase64FromImage = (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        const promise = new Promise((resolve, reject) => {
            // reader.onload is async function
            reader.onload = (result) => {
                resolve({base64: result.target.result, image: e.target.files[0]})
            };
        });
        
        reader.readAsDataURL(e.target.files[0]);

        return promise;
    } else {
        return Promise.reject(null);
    }
}

export const isFileImage = (file) => {
    return file && file['type'].split('/')[0] === 'image';
}

export const imageHandler = (e, component) => {
    if (e.target.files && e.target.files[0]) {

        if (!isFileImage(e.target.files[0])) {
            return component.setState({
                error: ['Invalid file'],
                image: '',
                imageBlob: ''
            });
        }
        
        const imageBlob = URL.createObjectURL(e.target.files[0]);

        // Revoke object blob in memory to avoid memory issues
        URL.revokeObjectURL(e.target.files[0]);      

        return component.setState({
            [e.target.name]: e.target.files[0],
            imageBlob,
            error: []
        });
    }

    // If no image uploaded
    return component.setState({
        [e.target.name]: '',
        imageBlob: '',
        error: ['No image was selected']
    });
}

const checkIfProductExists = (cart, productId) => {
    let isExists = false;
    for (const pic of cart) {
        if (pic._id === productId) {
            isExists = true;
            break;
        }
    }
    return isExists;
}

const addProductFromStorage = (product) => {
    const cart = JSON.parse(localStorage.getItem('gadawag-clothing-cart'));
    if (!cart) {
        const newCart = [{...product, quantity: 1}];
        return localStorage.setItem('gadawag-clothing-cart', JSON.stringify(newCart));
    }

    const isExists = checkIfProductExists(cart, product._id);
    if (isExists) {
        const pi = cart.findIndex(p => p._id === product._id);
        cart[pi].quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }

    localStorage.setItem('gadawag-clothing-cart', JSON.stringify(cart));
}

const decProductFromStorage = (productId) => {
    const cart = JSON.parse(localStorage.getItem('gadawag-clothing-cart'));

    if (cart) {
        const index = cart.findIndex(p => p._id === productId);
        let newCart = cart;
        if (cart[index].quantity === 1) {
            newCart = cart.filter(p => p._id !== productId);
        } else {
            newCart[index].quantity -= 1;
        }

        localStorage.setItem('gadawag-clothing-cart', JSON.stringify(newCart));
    }
}

const removeProductFromStorage = (productId) => {
    const cart = JSON.parse(localStorage.getItem('gadawag-clothing-cart'));

    if (cart) {
        const newCart = cart.filter(p => p._id !== productId);
        localStorage.setItem('gadawag-clothing-cart', JSON.stringify(newCart));
    }
}

const addProductToCartDB = async (productId, token) => {
    try {
        await axios.post('/add-to-cart', {productId}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.log(e);
    }
}

const lessProductToCartDB = async (productId, token) => {
    try {
        await axios.post('/less-to-cart', {productId}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.log(e);
    }
}

const removeProductToCartDB = async (productId, token) => {
    try {
        await axios.post('/remove-to-cart', {productId}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.log(e);
    }
}

export const getCartFromStorage = () => {
    const cart = JSON.parse(localStorage.getItem('gadawag-clothing-cart'));
    return cart;
}

export const getCartFromDB = async (token) => {
    try {
        const response = await axios.get('/get-cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.cart.map(i => {
            return {
                ...i.productId,
                quantity: i.quantity
            }
        });
    } catch (e) {
        return [];
    }
}

export const addToCart = async (product, isAuth, token) => {
    if (!isAuth) {
        return addProductFromStorage(product);
    }

    return await addProductToCartDB(product._id, token);
}

export const decreaseToCart = async (productId, isAuth, token) => {
    if (!isAuth) {
        return decProductFromStorage(productId);
    }

    return await lessProductToCartDB(productId, token);
}

export const removeToCart = async (productId, isAuth, token) => {
    if (!isAuth) {
        return removeProductFromStorage(productId);
    }

    return await removeProductToCartDB(productId, token);
}

export const cartToStore = async (isAuth, token, fncDispatch) => {
    let cart;
    if (!isAuth) {
        cart = getCartFromStorage();
        cart = cart === null ? [] : cart;
    } else {
        cart = await getCartFromDB(token);
    }
    
    fncDispatch(cart);
}

export const saveCartFromStorageToDB = async (token) => {
    let cart = getCartFromStorage();

    if (cart && cart.length > 0) {
        cart = cart.map(i => {
            return {
                productId: i._id,
                quantity: i.quantity
            }
        });

        try {
            await axios.post('/save-cart', {cart: JSON.stringify(cart)}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.removeItem('gadawag-clothing-cart');

        } catch (e) {
            console.log(e);
        }
    }
}