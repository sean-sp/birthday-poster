import React, { useEffect, useState } from 'react';
import wx from 'weixin-js-sdk';
import { Image } from 'react-vant';
import Comments from './components/comments';
import Bubble from './components/bubble';
// import audioSrc from '../../static/audio/birthday.mp3';
import { request } from '../../utils';
import APIS from '../../configs';
import './index.scss';

const dataList = [
  {
    name: '丽丽',
    text: '生日快乐',
    type: 'txt'
  },
  {
    name: '爱德华兹',
    text: '生日快乐',
    type: 'txt'
  },
  {
    name: 'flying',
    text: '生日快乐',
    type: 'txt'
  },
  {
    name: '大的文',
    text: '生日快乐',
    type: 'voice'
  },
]

const Home = () => {
  const [commentsList, setCommentsList] = useState(dataList);
  const [imgLocalData, setImgLocalData] = useState('');

  useEffect(() => {
    request.get(APIS.detail, { recordId: 1 }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }, []);

  useEffect(() => {
    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wx520eab2632bb4323', // 必填，公众号的唯一标识
      timestamp: '1636356266', // 必填，生成签名的时间戳
      nonceStr: 'test', // 必填，生成签名的随机串
      signature: '6685b282908e82efce6e987c214a46f420272312',// 必填，签名
      jsApiList: ['chooseImage', 'getLocalImgData'] // 必填，需要使用的JS接口列表
    });
    // wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
    // });
  }, [])

  const sendCommentsCb = (comment) => {
    setCommentsList([
      ...commentsList,
      {
        name: `海马体${parseInt(Math.random() * 10)}`,
        text: comment
      }
    ])
  }

  const uploadImg = () => {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const imgLocalIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        wx.getLocalImgData({
          localId: imgLocalIds[0], // 图片的localID
          success: function (res) {
            const localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            setImgLocalData(localData);
          }
        });
      }
    });
  }
  return (
    <div className="content">
      <header>BIRTHDAY STAR</header>
      <Bubble commentsList={commentsList} />
      <Comments
        sendCommentsCb={sendCommentsCb}
        uploadImg={uploadImg}
      />
      {imgLocalData && <Image width="1rem" height="1rem" round src={imgLocalData} />}
    </div>
  )
}

export default Home;