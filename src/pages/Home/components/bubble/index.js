import React, { useEffect, useState, useMemo } from 'react';
import { Dialog } from 'react-vant';
import ReactSeamlessScroll from 'react-seamless-scroll';
import { isLogin } from '../../../../utils';
import { VoiceSvgComponent } from '../svg'
import wx from 'weixin-js-sdk';
import './index.scss';
import voiceIcon from '../../../../static/images/voice.gif'

let voiceId = '';

const Bubble = (props) => {
    const { commentsList, isOneself, deleteComment } = props;
    const audio = useMemo(() => new Audio(), []);
    const [activeVoice, setActiveVoice] = useState(-1)

    useEffect(() => {
        audio.addEventListener('ended', () => {
            console.log(`${voiceId}播放停止`);
            setActiveVoice(-1)
        }, false);
    }, [audio]);

    const onCommentTap = (item) => {
        if (item.wishType === 'voice') {
            audio.src = item.wishVoiceUrl;
            audio.play();
            voiceId = item.recordId;
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

    const deleteTap = (e, item) => {
        e.stopPropagation();
        Dialog.confirm({
            title: '删除',
            message: '确认要删除该条评论？',
        }).then(() => {
            deleteComment(item);
        })
    }

    return (
        <div className="bubble_box">
            <ReactSeamlessScroll speed={30} style={{ width: '5rem', height: '3rem' }}>
                <div className="bubble_item">
                    {
                        commentsList.map((item) => (
                            <div key={item.recordId} onClick={() => onCommentTap(item)}>
                                <img className='avatar' src={item.avatar} alt="avatar"></img>
                                <span className="nickname">{item.nickname}:</span>
                                {
                                    item.wishType === 'text' ? <span>{item.wishContent}</span> : item.wishType === 'img' ? <img className="bubble_img" src={item.wishPicUrl} alt="avatar"></img> : <span className='voice_icon'>{activeVoice === item.recordId ? <img src={voiceIcon} alt="avatar"></img> : <VoiceSvgComponent />}</span>
                                }
                                {!isOneself && <span className='delete' onClick={(e) => deleteTap(e, item)} >x</span>}
                            </div>
                        ))
                    }
                </div>
            </ReactSeamlessScroll>
        </div>
    )
}

export default Bubble;