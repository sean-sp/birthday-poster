/**
 * rem adaptor
 */

var html = document.documentElement;
var { clientWidth: cW, clientHeight } = html;
var ua = window.YqbNativeUserAgentForTest || window.navigator.userAgent;
var androidRegExp = /1qianbao-android-(\\d+)(\\.\\d+)+/;
var iosRegExp = /1qianbao-ios-(\\d+)(\\.\\d+)+/;
var BASE_FONT_SIZE = 100;
var minWidth = Math.min(cW, clientHeight);
var arr = [];
var originClassName = html.className;
var timer = null;
var prevWidth = 0;
var isApp = false;

try {
  addRem(750);

  if (androidRegExp.test(ua) || iosRegExp.test(ua)) {
    isApp = true;
  }

  originClassName = originClassName ? originClassName + ' ' : '';
  originClassName = originClassName + (isApp ? 'ssr-inapp ' : '');

  function calculate_size(width) {
    if (timer) clearTimeout(timer);

    var { clientWidth } = html;

    if (
      !clientWidth ||
      (prevWidth !== 0 && this.frameElement && this.frameElement.tagName === 'IFRAME')
    )
      return (timer = setTimeout(calculate_size, 100));

    // 排除键盘弹起引起的窗口变化
    if (prevWidth === clientWidth) return;

    // 宽屏处理
    if (minWidth !== clientWidth) arr.push('wide-screen');
    // 大屏幕处理
    if (minWidth >= 1.3 * 375) arr.push('max-creen');

    html.className = originClassName + arr.join(' ');
    html.style.fontSize = BASE_FONT_SIZE * (clientWidth / width) + 'px';
    prevWidth = clientWidth;
  }

  function addRem(width) {
    calculate_size(width);

    if (document.addEventListener) {
      var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
      window.addEventListener(resizeEvt, calculate_size.bind(null, width), false);
      document.addEventListener('DOMContentLoaded', calculate_size.bind(null, width), false);
    } else {
      window.onload = () => calculate_size(width);
      window.onresize = window.onload;
    }
  }
} catch (e) {
  console.log('Rem adaptor initial error...');
  console.log(e);
}
