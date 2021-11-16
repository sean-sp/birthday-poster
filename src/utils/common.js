import qs from 'qs';

export const getXStreamIdOrParentId = (isParentId = false) => {
  const queryList = window.location.href.split('?');
  const queryStr = queryList[1];
  const { x_stream_id, parentId } = qs.parse(queryStr, { ignoreQueryPrefix: true });
  return isParentId ? parentId : x_stream_id;
}

export const isWeChat = () => {
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  const ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    return true;
  } else {
    return false;
  }
}