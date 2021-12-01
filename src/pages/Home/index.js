/* eslint-disable */
import React, { useEffect, useState, useMemo } from 'react';
import wx from 'weixin-js-sdk';
import { Toast, Loading } from 'react-vant';
import Create from './components/create'
import Content from './components/content'
import { request, getXStreamIdOrParentId } from '../../utils';
import APIS from '../../configs';
import './index.scss';

const shareImg = require('../../static/images/share_img.png').default;

// const myConfig = {
//   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//   appId: 'wxcdb66d9a27951efe', // 必填，公众号的唯一标识
//   timestamp: '1636964029', // 必填，生成签名的时间戳
//   nonceStr: 'test', // 必填，生成签名的随机串
//   signature: 'b869d215abd7474fd0cd40e36462804f0c4c22d7',// 必填，签名
//   jsApiList: [
//     'checkJsApi',
//     'chooseImage',
//     'getLocalImgData',
//     'uploadImage',
//     'previewImage',
//     'startRecord',
//     'stopRecord',
//     'onVoiceRecordEnd',
//     'uploadVoice'
//   ] // 必填，需要使用的JS接口列表
// };

const Home = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isCreate, setIsCreate] = useState('');
  const [recordId, setRecordId] = useState('');
  const xStreamId = useMemo(() => getXStreamIdOrParentId(), []);
  const parentId = useMemo(() => getXStreamIdOrParentId(true), []);

  useEffect(() => {
    if (parentId) {
      setRecordId(parentId);
    }
    if (!xStreamId) {
      setTimeout(() => {
        setIsCreate('true');
      }, 1000)
      return;
    }
    request.get(APIS.getJsConfig, { baseURL: `${window.location.origin}/`, xStreamId }).then((res) => {
      const wxConfig = JSON.parse(res.data).msg;
      // console.log(wxConfig)
      wx.config(wxConfig);
      wx.error((res) => {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log(res);
      });
    }).catch((err) => {
      Toast(err.msg || '网络开小差了');
    });
    request.get(APIS.getUserInfo, { xStreamId }).then((res) => {
      const data = JSON.parse(res.data);
      setUserInfo(data.msg || {});
      setIsCreate(data.isCreate);
      if (!parentId) {
        setRecordId(data.recordId);
      }
    }).catch((err) => {
      Toast(err.msg || '网络开小差了');
    });
  }, []);

  useEffect(() => {
    try {
      wx.miniProgram.postMessage({
        data: {
          title: '生日照',
          imageUrl: `${window.location.origin}${shareImg}`,
          path: `/pages/webview/index?url=${window.location.origin}/-._/!parentId=${recordId}`
        }
      })
    } catch (error) {

    }
  }, [recordId]);

  const setRecordIdCb = (recordId) => {
    setRecordId(recordId);
  }

  return (
    <div className="content">
      {isCreate ? (recordId ?
        <Content
          recordId={recordId}
          userInfo={userInfo}
          xStreamId={xStreamId}
        /> :
        <Create
          userInfo={userInfo}
          setRecordIdCb={setRecordIdCb}
          xStreamId={xStreamId}
        />) : <Loading type="ball" className="center-loading" />}
    </div >
  )
}

export default Home;