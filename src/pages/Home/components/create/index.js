/* eslint-disable */
import React, { useState } from 'react';
import { Toast, Field, Icon, Loading } from 'react-vant';
import wx from 'weixin-js-sdk';
import { request, isLogin } from '../../../../utils';
import APIS from '../../../../configs';
import './index.scss';

import titleHui from '../../../../static/images/title_hui.png'

import backImg from '../../../../static/images/back_icon.png'
import sureImg from '../../../../static/images/sure_icon.png'

import topHui from '../../../../static/images/top_hui.png'
import topHei from '../../../../static/images/top_hei.png'
import topHong from '../../../../static/images/top_hong.png'
import topLan from '../../../../static/images/top_lan.png'

import mainHui from '../../../../static/images/main_hui.png'
import mainHei from '../../../../static/images/main_hei.png'
import mainHong from '../../../../static/images/main_hong.png'
import mainLan from '../../../../static/images/main_lan.png'

import lanImg from '../../../../static/images/sticker_lan.png'
import huiImg from '../../../../static/images/sticker_hui.png'
import hongImg from '../../../../static/images/sticker_hong.png'
import heiImg from '../../../../static/images/sticker_hei.png'

import closeIcon from '../../../../static/images/close_icon.png'

let localId = '';
let val = '';

const Create = (props) => {
    const { userInfo, setRecordIdCb, xStreamId } = props;
    const stickerList = [
        {
            key: 1,
            img: lanImg
        },
        {
            key: 2,
            img: huiImg
        },
        {
            key: 3,
            img: hongImg
        },
        {
            key: 4,
            img: heiImg
        }
    ]

    const [active, setActive] = useState(1);
    const [avatar, setAvatar] = useState('');
    const [msgValue, setMsgValue] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const changeSticker = (val) => {
        setActive(val.key)
    }

    //返回选择
    const back = () => {
        if (avatar) {
            setAvatar('')
        } else {
            setActive(1)
        }
    }

    //留言
    const message = () => {
        setShowMessage(!showMessage)
    }

    const close = () => {
        setMsgValue('');
        setShowMessage(false);
    }
    const submit = () => {
        if (!val) {
            Toast('请输入您的留言');
            return;
        }
        setMsgValue(val);
        setShowMessage(false);
    }

    const onMsgChange = (value) => {
        val = value;
    }

    const previewImage = () => {
        if (!isLogin()) return;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                const imgLocalIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                localId = imgLocalIds[0];
                if (!window.__wxjs_is_wkwebview) {
                    setAvatar(localId);
                    return;
                }
                wx.getLocalImgData({
                    localId, // 图片的localID
                    success: (res) => {
                        const localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                        setAvatar(localData);
                    }
                });
            }
        });
    }

    const create = () => {
        if (!avatar) {
            Toast('请先上传照片');
            return;
        }
        setIsCreating(true);
        wx.uploadImage({
            localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res) => {
                const serverId = res.serverId; // 返回图片的服务器端ID
                request.post(APIS.uploadFile, { fileType: 1, mediaId: serverId, xstreamId: xStreamId }).then((res) => {
                    const posterUrl = res.data;
                    const { id, name, avatar } = userInfo;
                    request.post(APIS.create, {
                        avatar, nickname: name, posterUrl, userId: id,
                        modeType: active - 1, remark: msgValue || undefined,
                        xStreamId
                    }).then((res) => {
                        setIsCreating(false);
                        Toast({
                            message: '创建成功',
                            onClose: () => {
                                setRecordIdCb(res.data);
                            }
                        });
                    }).catch((err) => {
                        setIsCreating(false);
                        Toast(err.msg);
                    })
                }).catch((err) => {
                    setIsCreating(false);
                    Toast(err.msg);
                })
            },
            fail: () => {
                setIsCreating(false);
                Toast('请检查接口权限');
            }
        });
    }

    return (
        <div className="create_box" style={{ background: active == 1 ? 'linear-gradient(-55deg, #9DB6CF, #8AA2BD)' : active == 2 ? 'linear-gradient(-55deg, #A2A2AB, #C7C8D3)' : active == 3 ? 'linear-gradient(-55deg, #F0BCC0, #F2B8BD)' : 'linear-gradient(-55deg, #9B9BA7, #BBB9C7)' }}>
            <div className="has_padding">
                <div className="top_box">
                    <img className="top_bg" src={active == 1 ? topLan : active == 2 ? topHui : active == 3 ? topHong : topHei}></img>
                    <img className="top_title" src={titleHui}></img>
                </div>
                <div className="main_box">
                    <img className="main_kuang" src={active == 1 ? mainLan : active == 2 ? mainHui : active == 3 ? mainHong : mainHei}></img>
                    {
                        avatar ? <img className="avatar_view" src={avatar}></img> :
                            <div className="add_avatar"
                                style={{ background: active == 1 ? '#8499B0' : active == 2 ? '#AEB1BC' : active == 3 ? '#D99FA6' : '#A9A7B4' }}
                                onClick={previewImage}
                            >
                                <span className="add_icon">+</span>
                                <span>添加照片</span>
                            </div>
                    }
                </div>
                <div className="message" style={{ background: active == 1 ? '#8499B0' : active == 2 ? '#AEB1BC' : active == 3 ? '#D99FA6' : '#A9A7B4' }} onClick={message} >
                    <Icon name="chat-o" color="#fff" size="1rem" />
                </div>
            </div>
            {
                showMessage ?
                    <div className='message_box'>
                        <div className="message_title">祝福留言</div>
                        <img className="message_close" src={closeIcon} onClick={close} ></img>
                        <Field
                            className="text"
                            rows="2"
                            autosize
                            type="textarea"
                            maxlength="50"
                            placeholder="请输入您的留言"
                            show-word-limit
                            onChange={onMsgChange}
                        />
                        <div className="message_sure" style={{ background: active == 1 ? '#8499B0' : active == 2 ? '#AEB1BC' : active == 3 ? '#D99FA6' : '#A9A7B4' }} onClick={submit}>确定</div>
                    </div> : null
            }
            <div className='sticker_box'>
                <div className='sticker_header'>
                    <img src={backImg} onClick={back}></img>
                    <span>贴纸</span>
                    <img src={sureImg} onClick={create}></img>
                </div>
                <div className="sticker_list">
                    {
                        stickerList.map((item, index) => (
                            <div key={index} className={active === item.key ? 'sticker_active' : 'sticker_item'} onClick={() => changeSticker(item)}>
                                <img src={item.img}></img>
                            </div>
                        ))
                    }
                </div>
            </div>
            {isCreating && <Loading type="ball" className="center-loading" />}
        </div>
    )
}

export default Create;