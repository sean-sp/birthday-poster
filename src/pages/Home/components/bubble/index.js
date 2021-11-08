import React, { useEffect } from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import { VoiceSvgComponent } from '../svg'
import wx from 'weixin-js-sdk';
import './index.scss';

const Bubble = (props) => {
    const { commentsList } = props;

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

    const onVoiceTap = (val)=>{
        console.log('dinajil',val)
    }

    return (
        <div className="bubble_box">
            <ReactSeamlessScroll speed={30} style={{ width: '4rem', height: '12rem' }}>
                <div className="bubble_item">
                    {
                        commentsList.map((item, index) => (
                            <div key={index} onClick={() => onVoiceTap(item)}>
                                <span>{item.name}:</span>
                                {
                                    item.type == 'txt' ? <span>{item.text}</span> : <span className='voice_icon'><VoiceSvgComponent /></span>
                                }
                                
                            </div>
                        ))
                    }
                </div>
            </ReactSeamlessScroll>
        </div>
    )
}

export default Bubble;