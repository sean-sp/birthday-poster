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

    //θΏειζ©
    const back = () => {
        if (avatar) {
            setAvatar('')
        } else {
            setActive(1)
        }
    }

    //ηθ¨
    const message = () => {
        setShowMessage(!showMessage)
    }

    const close = () => {
        setMsgValue('');
        setShowMessage(false);
    }
    const submit = () => {
        if (!val) {
            Toast('θ―·θΎε₯ζ¨ηηθ¨');
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
            count: 1, // ι»θ?€9
            sizeType: ['original', 'compressed'], // ε―δ»₯ζε?ζ―εεΎθΏζ―εηΌ©εΎοΌι»θ?€δΊθι½ζ
            sourceType: ['album', 'camera'], // ε―δ»₯ζε?ζ₯ζΊζ―ηΈεθΏζ―ηΈζΊοΌι»θ?€δΊθι½ζ
            success: (res) => {
                const imgLocalIds = res.localIds; // θΏειε?η§ηηζ¬ε°IDεθ‘¨οΌlocalIdε―δ»₯δ½δΈΊimgζ η­Ύηsrcε±ζ§ζΎη€ΊεΎη
                localId = imgLocalIds[0];
                if (!window.__wxjs_is_wkwebview) {
                    setAvatar(localId);
                    return;
                }
                wx.getLocalImgData({
                    localId, // εΎηηlocalID
                    success: (res) => {
                        const localData = res.localData; // localDataζ―εΎηηbase64ζ°ζ?οΌε―δ»₯η¨imgζ η­ΎζΎη€Ί
                        setAvatar(localData);
                    }
                });
            }
        });
    }

    const create = () => {
        if (!avatar) {
            Toast('θ―·εδΈδΌ η§η');
            return;
        }
        setIsCreating(true);
        wx.uploadImage({
            localId, // ιθ¦δΈδΌ ηεΎηηζ¬ε°IDοΌη±chooseImageζ₯ε£θ·εΎ
            isShowProgressTips: 1, // ι»θ?€δΈΊ1οΌζΎη€ΊθΏεΊ¦ζη€Ί
            success: (res) => {
                const serverId = res.serverId; // θΏεεΎηηζε‘ε¨η«―ID
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
                            message: 'εε»Ίζε',
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
                Toast('θ―·ζ£ζ₯ζ₯ε£ζι');
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
                                <span>ζ·»ε η§η</span>
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
                        <div className="message_title">η₯η¦ηθ¨</div>
                        <img className="message_close" src={closeIcon} onClick={close} ></img>
                        <Field
                            className="text"
                            rows="2"
                            autosize
                            type="textarea"
                            maxlength="50"
                            placeholder="θ―·θΎε₯ζ¨ηηθ¨"
                            show-word-limit
                            onChange={onMsgChange}
                        />
                        <div className="message_sure" style={{ background: active == 1 ? '#8499B0' : active == 2 ? '#AEB1BC' : active == 3 ? '#D99FA6' : '#A9A7B4' }} onClick={submit}>η‘?ε?</div>
                    </div> : null
            }
            <div className='sticker_box'>
                <div className='sticker_header'>
                    <img src={backImg} onClick={back}></img>
                    <span>θ΄΄ηΊΈ</span>
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