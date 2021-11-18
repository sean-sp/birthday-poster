/**
 * api reduce
 */
import apis from './apis';
const isDev = process.env.NODE_ENV === 'development';

const res = Object.keys(apis).reduce((all, c) => {
  all[c] = isDev
    ? apis[c]
    : `http://47.242.179.86:8001${apis[c]}`;
  return all;
}, {});

export default res;
