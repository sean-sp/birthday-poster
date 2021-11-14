/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Toast } from 'react-vant';
import wx from 'weixin-js-sdk';
import { request } from '../../../../utils';
import APIS from '../../../../configs';
import Comments from '../comments';
import Bubble from '../bubble';
import bell from '../../../../static/audio/bell.mp3';
import birthday from '../../../../static/audio/birthday.mp3';
import './index.scss';

import titleHui from '../../../../static/images/title_hui.png'
import logo from '../../../../static/images/logo.png'

import shareIcon from '../../../../static/images/share.png'


import topHui from '../../../../static/images/top_hui.png'
import topHei from '../../../../static/images/top_hei.png'
import topHong from '../../../../static/images/top_hong.png'
import topLan from '../../../../static/images/top_lan.png'

import mainHui from '../../../../static/images/main_hui.png'
import mainHei from '../../../../static/images/main_hei.png'
import mainHong from '../../../../static/images/main_hong.png'
import mainLan from '../../../../static/images/main_lan.png'

const dataList = [
    {
        name: '爱德华兹',
        content: '生日快乐',
        type: 'text'
    },
    {
        name: 'flying',
        content: '生日快乐',
        type: 'text'
    },
    {
        name: '大的文',
        content: bell,
        type: 'voice'
    },
    {
        name: '小的文',
        content: birthday,
        type: 'voice'
    }
];

const Content = (props) => {
    const { recordId } = props;
    const [detail, setDetail] = useState({});
    const [commentsList, setCommentsList] = useState(dataList);
    const [active] = useState(1);

    useEffect(() => {
        request.get(APIS.getDetail, { recordId }).then((res) => {
            const data = res.data || {};
            const { birthdayInfoDTO, birthdayWishDTOList } = data;
            setDetail(birthdayInfoDTO || {});
            setCommentsList(birthdayWishDTOList || []);
        }).catch((err) => {
            Toast(err.msg);
        })
    }, [])

    const sendCommentsCb = (comment) => {
        setCommentsList([
            ...commentsList,
            {
                name: `海马体${parseInt(Math.random() * 10)}`,
                content: comment,
                type: 'text'
            }
        ])
    }

    const sendVoice = (voiceLocalId) => {
        setCommentsList([
            ...commentsList,
            {
                name: `海马体${parseInt(Math.random() * 10)}`,
                content: voiceLocalId,
                type: 'voice'
            }
        ])
    }

    const uploadImg = () => {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                const imgLocalIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                wx.uploadImage({
                    localId: imgLocalIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: (res) => {
                        const serverId = res.serverId; // 返回图片的服务器端ID
                        request.get(APIS.uploadFile, { fileType: 1, mediaId: serverId, token: 'token' }).then((res) => {
                            console.log(res);
                        }).catch((err) => {
                            Toast(err.msg);
                        })
                    }
                });
            }
        });
    }

    const { posterUrl, backgroundMusicUrl } = detail;

    return (
        <div className="content_box" style={{ background: active === 1 ? 'linear-gradient(55deg, #9DB6CF, #607798)' : active === 2 ? 'linear-gradient(-55deg, #A2A2AB, #92929B)' : active === 3 ? 'linear-gradient(-55deg, #F0BCC0, #934A55)' : 'linear-gradient(-55deg, #9B9BA7, #8A8793);' }}>
            <div>
                <div className="top_box">
                    <img className="top_bg" src={active === 1 ? topLan : active === 2 ? topHui : active === 3 ? topHong : topHei}></img>
                    <img className="top_title" src={titleHui}></img>
                </div>
                <img className="share_icon" src={shareIcon}></img>
                <div className="main_box">
                    <img className="main_kuang" src={active === 1 ? mainLan : active === 2 ? mainHui : active === 3 ? mainHong : mainHei}></img>
                    {
                        posterUrl && <img className="avatar_view" src={posterUrl}></img>
                    }
                </div>
                <div className="footer_box" >
                    <div className="footer_info">
                        <span><img src={logo}></img></span>
                        <span>|</span>
                        <span>生活需要仪式感</span>
                        <span>|</span>
                        <span>2021</span>
                    </div>
                    {/* <div className="footer_desc">版权</div> */}
                </div>
            </div>
            <Bubble commentsList={commentsList} />
            <Comments
                sendCommentsCb={sendCommentsCb}
                uploadImg={uploadImg}
                sendVoice={sendVoice}
            />
            {backgroundMusicUrl && <audio
                src={backgroundMusicUrl}
                autoPlay
                loop
            >
                Your browser does not support the <code>audio</code> element.
            </audio>}
        </div>
    )
}

export default Content;