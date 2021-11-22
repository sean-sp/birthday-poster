/**
 * api reduce
 */
import apis from './apis';
const isDev = process.env.NODE_ENV === 'development';

const res = Object.keys(apis).reduce((all, c) => {
  all[c] = isDev
    ? apis[c]
    : `https://crm-birthday.dev.hzmantu.com${apis[c]}`;
  return all;
}, {});

export default res;
