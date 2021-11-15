/* eslint-disable */
import React, { useEffect, useState } from 'react';
import wx from 'weixin-js-sdk';
import qs from 'qs';
import { Toast } from 'react-vant';
import Create from './components/create'
import Content from './components/content'
import { request } from '../../utils';
import APIS from '../../configs';
import './index.scss';

const myConfig = {
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: 'wxcdb66d9a27951efe', // 必填，公众号的唯一标识
  timestamp: '1636964029', // 必填，生成签名的时间戳
  nonceStr: 'test', // 必填，生成签名的随机串
  signature: 'b869d215abd7474fd0cd40e36462804f0c4c22d7',// 必填，签名
  jsApiList: [
    'checkJsApi',
    'chooseImage',
    'getLocalImgData',
    'uploadImage',
    'previewImage',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'uploadVoice'
  ] // 必填，需要使用的JS接口列表
};

const Home = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isCreate, setIsCreate] = useState(true);
  const [recordId, setRecord] = useState(1);

  useEffect(() => {
    const queryList = window.location.href.split('?');
    const queryStr = queryList[1];
    const { x_stream_id } = qs.parse(queryStr, { ignoreQueryPrefix: true });
    if (!x_stream_id) {
      wx.miniProgram.navigateTo({ url: '/pagesB/user/loginByPhone/index?back=true&notPass=1' });
      return;
    }
    window.localStorage.setItem('xStreamId', x_stream_id);
    request.get(APIS.getJsConfig, { xStreamId: x_stream_id }).then((res) => {
      const wxConfig = JSON.parse(res.data).msg;
      // console.log(wxConfig)
      wx.config(myConfig);
      wx.ready(() => {
        const isMiniProgram = /miniProgram/i.test(navigator.userAgent.toLowerCase());
        // console.log(isMiniProgram);
      });
      wx.error((res) => {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log(res);
      });
    }).catch((err) => {
      Toast(err.msg);
    });
    request.get(APIS.getUserInfo, { xStreamId: x_stream_id }).then((res) => {
      const data = JSON.parse(res.data);
      setUserInfo(data.msg || {});
      setIsCreate(data.isCreate);
    }).catch((err) => {
      // Toast(err.msg);
    })
  }, []);

  const closeCreate = () => {
    setIsCreate(false);
  }

  const setRecordIdCb = (recordId) => {
    setRecord(recordId);
  }

  return (
    <div className="content">
      {isCreate ?
        <Content
          recordId={recordId}
          userInfo={userInfo}
        /> :
        <Create
          userInfo={userInfo}
          closeCreate={closeCreate}
          setRecordIdCb={setRecordIdCb}
        />}
    </div >
  )
}

export default Home;