import React, { useEffect, useState, useMemo } from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import { VoiceSvgComponent } from '../svg'
import wx from 'weixin-js-sdk';
import './index.scss';
import avatar from '../../../../static/images/bg1.png'
import voiceIcon from '../../../../static/images/voice.gif'

let voiceId = '';

const Bubble = (props) => {
    const { commentsList } = props;
    const audio = useMemo(() => new Audio(), []);
    const [activeVoice, setActiveVoice] = useState(-1)

    useEffect(() => {
        audio.addEventListener('ended', () => {
            console.log(`${voiceId}播放停止`);
            setActiveVoice(-1)
        }, false);
    }, [audio]);

    const onCommentTap = (item) => {
        if (item.type === 'voice') {
            audio.src = item.content;
            audio.play();
            voiceId = item.name;
            setActiveVoice(item.id)
            return;
        }
        if (item.type === 'img') {
            wx.previewImage({
                current: item.content, // 当前显示图片的http链接
                urls: [item.content] // 需要预览的图片http链接列表
            });
        }
    }

    const deleteTap = () =>{
        
    }

    return (
        <div className="bubble_box">
            <ReactSeamlessScroll speed={30} style={{ width: '5rem', height: '3rem' }}>
                <div className="bubble_item">
                    {
                        commentsList.map((item, index) => (
                            <div key={index} onClick={() => onCommentTap(item)}>
                                <img className='avatar' src={avatar} alt="avatar"></img>
                                <span className="nickname">{item.name}:</span>
                                {
                                    item.type === 'text' ? <span>{item.content}</span> : item.type === 'img' ? <img className="bubble_img" src={item.content}></img> : <span className='voice_icon'>{activeVoice === item.id ? <img src={voiceIcon}></img> : <VoiceSvgComponent />}</span>
                                }
                                <span className='delete' onClick={() => deleteTap(item)} >x</span>
                            </div>
                        ))
                    }
                </div>
            </ReactSeamlessScroll>
        </div>
    )
}

export default Bubble;