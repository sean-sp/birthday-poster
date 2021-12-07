import React, { useEffect, useState, useMemo } from 'react';
import { Dialog } from 'react-vant';
// import ReactSeamlessScroll from 'react-seamless-scroll';
// import JsSeamlessScroll from "react-seamless-scroll";
import CssSeamlessScroll from "react-seamless-scroll";

import { isLogin } from '../../../../utils';
import wx from 'weixin-js-sdk';
import './index.scss';
import voiceImg from '../../../../static/images/voice.png'
import voiceIcon from '../../../../static/images/voice.gif'

const Bubble = (props) => {
    const { commentsList, isOneself, deleteComment } = props;
    const audio = useMemo(() => new Audio(), []);
    const [activeVoice, setActiveVoice] = useState(-1)

    useEffect(() => {
        audio.addEventListener('ended', () => {
            setActiveVoice(-1);
        }, false);
    }, [audio]);

    const onCommentTap = (item) => {
        // console.log('dinaji',item)
        if (item.wishType === 'voice') {
            const posterMusic = document.getElementById('posterMusic');
            if (!posterMusic.paused) {
                posterMusic.pause();
            }
            audio.src = item.wishVoiceUrl;
            audio.play();
            setActiveVoice(item.recordId)
            return;
        }
        if (item.wishType === 'img') {
            if (!isLogin()) return;
            wx.previewImage({
                current: item.wishPicUrl, // 当前显示图片的http链接
                urls: [item.wishPicUrl] // 需要预览的图片http链接列表
            });
        }
    }

    const onParentTap = (ev) => {
        ev.stopPropagation();
        // console.log(ev.target,ev.target.dataset,ev.target.getAttribute("data-item"))
        if (ev.target.tagName === "DIV" || ev.target.tagName === "SPAN" || ev.target.tagName === "IMG") {
            let item = {
                wishType: ev.target.getAttribute("data-item"),
                wishVoiceUrl: ev.target.getAttribute("data-item1"),
                wishPicUrl: ev.target.getAttribute("data-item2"),
                recordId: Number(ev.target.getAttribute("data-id"))
            }
            if (ev.target.getAttribute("data-type") && ev.target.getAttribute("data-type") === 'delete') {
                deleteTap(item)
            } else {
                onCommentTap(item)
            }

        }
    }

    const deleteTap = (item) => {
        // e.stopPropagation();
        Dialog.confirm({
            title: '删除',
            message: '确认要删除该条评论？',
        }).then(() => {
            deleteComment(item);
        })
    }

    return (
        <div className="bubble_box" onClick={onParentTap}>
            <CssSeamlessScroll datas={commentsList} scrollSwitch={true} speed={20} style={{ width: '5rem', height: '3rem' }}>
                {
                    // onClick={() => onCommentTap(item)}
                    commentsList.map((item) => (
                        <div>
                            <div key={item.recordId} data-id={item.recordId} data-item={item.wishType} data-item1={item.wishVoiceUrl} data-item2={item.wishPicUrl} className="bubble_item">
                                <img className='avatar' data-id={item.recordId} data-item={item.wishType} data-item1={item.wishVoiceUrl} data-item2={item.wishPicUrl} src={item.avatar} alt="avatar"></img>
                                <span className="nickname" data-id={item.recordId} data-item={item.wishType} data-item1={item.wishVoiceUrl} data-item2={item.wishPicUrl}>{item.nickname}:</span>
                                {
                                    item.wishType === 'text' ? <span data-id={item.recordId} data-item={item.wishType}>{item.wishContent}</span> :
                                        item.wishType === 'img' ? <img className="bubble_img" data-id={item.recordId} data-item={item.wishType} data-item2={item.wishPicUrl} src={item.wishPicUrl} alt="avatar"></img> :
                                            <span className='voice_icon' data-id={item.recordId} data-item={item.wishType} data-item1={item.wishVoiceUrl}>
                                                <img src={activeVoice === item.recordId ? voiceIcon : voiceImg} data-id={item.recordId} data-item={item.wishType} data-item1={item.wishVoiceUrl} alt="voice" />
                                            </span>
                                }
                                {isOneself && <span className='delete' data-type='delete' data-id={item.recordId} >x</span>}
                                {/* onClick={(e) => deleteTap(e, item)} */}
                            </div>
                            <p className="zhan"></p>
                        </div>
                    ))
                }
            </CssSeamlessScroll>
        </div>
    )
}

export default Bubble;