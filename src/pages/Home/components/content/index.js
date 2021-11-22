/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Toast, Dialog } from 'react-vant';
import wx from 'weixin-js-sdk';
import QRCode from "qrcode";
import html2canvas from "html2canvas";
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

import receiveCoupon1 from '../../../../static/images/receive_coupon1.png'
import couponTitle from '../../../../static/images/receive_coupon_title.png'
import receiveCoupon2 from '../../../../static/images/share_img.png'
import closeImg from '../../../../static/images/close_img.png'

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
    const posterRef = useRef();
    const { recordId, userInfo, xStreamId } = props;
    const [detail, setDetail] = useState({});
    const [commentsList, setCommentsList] = useState(dataList);
    const [isOneself, setIsOneself] = useState(false);
    const [posterShow, setPosterShow] = useState(false);
    const [posterImg, setPosterImg] = useState('');
    const [qrSrc, setQrSrc] = useState('');
    const [coupon1Show, setCoupon1Show] = useState(false);
    const [coupon2Show, setCoupon2Show] = useState(false);

    useEffect(() => {
        request.get(APIS.getDetail, { recordId }).then((res) => {
            const data = res.data || {};
            const { birthdayInfoDTO, birthdayWishDTOList, isOneself } = data;
            setDetail(birthdayInfoDTO || {});
            setIsOneself(isOneself);
            setCommentsList(birthdayWishDTOList || []);
        }).catch((err) => {
            Toast(err.msg || '网络开小差了');
        });
        setCoupon1Show(true);
        if (xStreamId) {
            request.post(APIS.getQrCode, {
                page: 'pages/index/index',
                scene: `parentId=${recordId}`,
                xstreamId: xStreamId
            }).then((res) => {
                setQrSrc(res.data);
            })
        }
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
        // setCoupon2Show(true);
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

    const onShare = () => {
        // QRCode.toCanvas(document.getElementById("img"), 'https://www.baidu.com/', {
        //     margin: 1,
        // });
        // 获取自定义的dom  元素
        const posterDom = posterRef.current;
        const width = posterDom.offsetWidth;
        const height = posterDom.offsetHeight;
        // 定义canvas对象
        const canvas = document.createElement("canvas");
        const scale = 1; // 放大图片6倍
        canvas.width = width * scale;
        canvas.height = height * scale;
        //  设置图片为2d
        canvas.getContext("2d").scale(scale, scale);

        // 调用html2canvas 生成海报的方法  这样写是为了兼容部分手机不能显示
        //  this.$refs.article  就是定义的海报dom元素
        // useCORS: true   设置图片可以跨域
        // canvas.toDataURL()方法会生成一个  图片url 可以直接拿来用
        (window.html2canvas || html2canvas)(posterDom, {
            useCORS: true,
            logging: false,
        }).then((canvas) => {
            setPosterImg(canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            setPosterShow(true);
        });
    }

    const closePoster = () => {
        setPosterShow(false);
    }

    const closeCoupon1 = () => {
        setCoupon1Show(false);
    }

    const closeCoupon2 = () => {
        setCoupon2Show(false);
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
                <img className="share_icon" src={shareIcon} onClick={onShare}></img>
                <div className="main_box">
                    <img className="main_kuang" src={active === 1 ? mainLan : active === 2 ? mainHui : active === 3 ? mainHong : mainHei}></img>
                    {
                        posterUrl && <img className="avatar_view" src={posterUrl}></img>
                    }
                </div>
                <div className="footer_box" >
                    <div className="footer_info">
                        <img src={logo}></img>
                        {/* <span></span> */}
                        <span style={{ opacity: 0.8 }}>|</span>
                        <span className="footer_txt">生活需要仪式感</span>
                        {/* <span>|</span>
                        <span>2021</span> */}
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
            {(coupon1Show || coupon2Show) && <div className="receive-coupon-mask">
                {coupon1Show ? <div className="coupon1-content">
                    <div className="coupon-content-content">
                        <img src={receiveCoupon1} alt="coupon" />
                        <div className="bottom-content">
                            <div className="title-img">
                                <img src={couponTitle} alt="couponTitle" />
                            </div>
                            <div className="btn">免费领取</div>
                        </div>
                    </div>
                    <div className="close">
                        <img src={closeImg} alt="close" onClick={closeCoupon1} />
                    </div>
                </div> : <div className="coupon2-content">
                    <div className="coupon-content-content">
                        <img src={receiveCoupon2} alt="coupon" />
                        <div className="btn">我也要拍照</div>
                    </div>
                    <div className="close">
                        <img src={closeImg} alt="close" onClick={closeCoupon2} />
                    </div>
                </div>}
            </div>}
            <Poster
                posterUrl={posterUrl}
                active={active}
                qrSrc={qrSrc}
                ref={posterRef}
            />
            <Dialog
                visible={posterShow}
                title="分享海报"
                closeable={true}
                showConfirmButton={false}
                className="poster_dialog"
                onClose={closePoster}
            >
                <img className="poster_img" src={posterImg} alt="海报" />
                <p className="poster_desc">长按上方图片分享给好友</p>
            </Dialog>
        </div>
    )
}

export default Content;