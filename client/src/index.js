import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';
import { Provider } from 'react-redux';
// import { getStore } from '@/redux/store';
import store from '@/redux/store'
import  "react-app-polyfill/ie11";
import  "react-app-polyfill/stable";

// 维持登录（刷新）、自动登录（关闭浏览器）
// 将用户信息存入内存
// const user = storageUtils.getUser()
// if (user && user._id) {
//   memoryUtils.user = user
// }
// const store = getStore()
// console.log(store.getState())
// console.log(store.getState())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
