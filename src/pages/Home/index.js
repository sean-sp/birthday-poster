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
  timestamp: '1636877607', // 必填，生成签名的时间戳
  nonceStr: 'test', // 必填，生成签名的随机串
  signature: '3ed70a81c1bd5523c7ceaf892ccd335c66025018',// 必填，签名
  jsApiList: [
    'checkJsApi',
    'chooseImage',
    'getLocalImgData',
    'uploadImage',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd'
  ] // 必填，需要使用的JS接口列表
};

const Home = () => {
  const [userInfo, setUserInfo] = useState({});
  const [createShow, setCreateShow] = useState(true);
  const [recordId, setRecord] = useState(1);

  useEffect(() => {
    const queryList = window.location.href.split('?');
    const queryStr = queryList[1];
    const { x_stream_id } = qs.parse(queryStr, { ignoreQueryPrefix: true });
    if (!x_stream_id) {
      wx.miniProgram.navigateTo({ url: '/pagesB/user/loginByPhone/index?back=true&notPass=1' });
      return;
    }
    request.get(APIS.getJsConfig, { xStreamId: x_stream_id }).then((res) => {
      const wxConfig = JSON.parse(res.msg).msg;
      // console.log(wxConfig)
      wx.config(myConfig);
      wx.ready(() => {
        const isMiniProgram = /miniProgram/i.test(navigator.userAgent.toLowerCase());
        // console.log(isMiniProgram);
      });
    }).catch((err) => {
      Toast(err.msg);
    });
    request.get(APIS.getUserInfo, { xStreamId: x_stream_id }).then((res) => {
      setUserInfo(JSON.parse(res.msg).msg);
    }).catch((err) => {
      Toast(err.msg);
    })
  }, []);

  const closeCreate = () => {
    setCreateShow(false);
  }

  const setRecordIdCb = (recordId) => {
    setRecord(recordId);
  }

  return (
    <div className="content">
      {createShow ? <Create
        userInfo={userInfo}
        closeCreate={closeCreate}
        setRecordIdCb={setRecordIdCb}
      /> :
        <Content recordId={recordId} />}
    </div >
  )
}

export default Home;