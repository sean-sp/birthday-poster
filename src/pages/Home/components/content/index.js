/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Toast } from 'react-vant';
import wx from 'weixin-js-sdk';
import { request, isLogin } from '../../../../utils';
import APIS from '../../../../configs';
import Comments from '../comments';
import Bubble from '../bubble';
import Poster from '../poster';
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
    // {
    //     avatar,
    //     nickname: '爱德华兹',
    //     wishContent: '生日快乐',
    //     wishType: 'text',
    //     recordId: 2233,
    //     wishPicUrl: '',
    //     wishVoiceUrl: ''
    // }
];

const Content = (props) => {
    const { recordId, userInfo, xStreamId } = props;
    const [detail, setDetail] = useState({});
    const [commentsList, setCommentsList] = useState(dataList);
    const [isOneself, setIsOneself] = useState(false);
    const [showPoster, setShowPoster] = useState(false)

    useEffect(() => {
        request.get(APIS.getDetail, { recordId }).then((res) => {
            const data = res.data || {};
            const { birthdayInfoDTO, birthdayWishDTOList, isOneself } = data;
            setDetail(birthdayInfoDTO || {});
            setIsOneself(isOneself);
            setCommentsList(birthdayWishDTOList || []);
        }).catch((err) => {
            Toast(err.msg || '网络开小差了');
        })
    }, []);

    const deleteComment = (item) => {
        request.post(APIS.deleteBirthdayWish, { recordId: item.recordId }).then(() => {
            request.get(APIS.getBirthdayWish, { birthdayInfoRecordId: recordId }).then((res) => {
                setCommentsList(res.data || []);
                Toast('删除成功');
            })
        }).catch((err) => {
            Toast(err.msg);
        })
    }

    const sendCommentsCb = (comment) => {
        const { id, name, avatar } = userInfo;
        request.post(APIS.submitBirthdayWish, { birthdayInfoRecordId: recordId, nickname: name, userId: id, avatar, wishContent: comment, wishType: 'text' }).then(() => {
            request.get(APIS.getBirthdayWish, { birthdayInfoRecordId: recordId }).then((res) => {
                setCommentsList(res.data || []);
                Toast('提交成功');
            })
        }).catch((err) => {
            Toast(err.msg);
        })
    }

    const sendVoice = (voiceLocalId) => {
        wx.uploadVoice({
            localId: voiceLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res) => {
                const serverId = res.serverId; // 返回音频的服务器端ID
                request.get(APIS.uploadFile, { fileType: 2, mediaId: serverId, xstreamId: xStreamId }).then((res) => {
                    const { id, name, avatar } = userInfo;
                    request.post(APIS.submitBirthdayWish, { birthdayInfoRecordId: recordId, nickname: name, userId: id, avatar, wishVoiceUrl: res.data, wishType: 'voice' }).then(() => {
                        request.get(APIS.getBirthdayWish, { birthdayInfoRecordId: recordId }).then((res) => {
                            setCommentsList(res.data || []);
                            Toast('提交成功');
                        })
                    }).catch((err) => {
                        Toast(err.msg);
                    })
                }).catch((err) => {
                    Toast(err.msg);
                })
            }
        });
    }

    const uploadImg = () => {
        if (!isLogin()) return;
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
                        request.get(APIS.uploadFile, { fileType: 1, mediaId: serverId, xstreamId: xStreamId }).then((res) => {
                            const { id, name, avatar } = userInfo;
                            request.post(APIS.submitBirthdayWish, { birthdayInfoRecordId: recordId, nickname: name, userId: id, avatar, wishPicUrl: res.data, wishType: 'img' }).then((res) => {
                                request.get(APIS.getBirthdayWish, { birthdayInfoRecordId: recordId }).then((res) => {
                                    setCommentsList(res.data || []);
                                    Toast('提交成功');
                                })
                            }).catch((err) => {
                                Toast(err.msg);
                            })
                        }).catch((err) => {
                            Toast(err.msg);
                        })
                    }
                });
            }
        });
    }

    const posterClick = () =>{
        setShowPoster(true)
    }

    const setPropsShow = (item) =>{
        setShowPoster(item)
    }

    const { posterUrl, backgroundMusicUrl, modeType } = detail;
    const active = modeType + 1;

    return (
        <div className="content_box" style={{ background: active === 1 ? 'linear-gradient(55deg, #9DB6CF, #607798)' : active === 2 ? 'linear-gradient(-55deg, #A2A2AB, #92929B)' : active === 3 ? 'linear-gradient(-55deg, #F0BCC0, #934A55)' : 'linear-gradient(-55deg, #9B9BA7, #8A8793)' }}>
            <div>
                <div className="top_box">
                    <img className="top_bg" src={active === 1 ? topLan : active === 2 ? topHui : active === 3 ? topHong : topHei}></img>
                    <img className="top_title" src={titleHui}></img>
                </div>
                <img className="share_icon" src={shareIcon} onClick={posterClick}></img>
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
            <Bubble
                commentsList={commentsList}
                isOneself={isOneself}
                deleteComment={deleteComment}
            />
            <Comments
                sendCommentsCb={sendCommentsCb}
                uploadImg={uploadImg}
                sendVoice={sendVoice}
                xStreamId={xStreamId}
            />
            {backgroundMusicUrl && <audio
                src={backgroundMusicUrl}
                autoPlay
                loop
            >
                Your browser does not support the <code>audio</code> element.
            </audio>}
            {
                showPoster ?  <Poster posterUrl={posterUrl} active={active} setPropsShow={setPropsShow} /> : null
            }
        </div>
    )
}

export default Content;