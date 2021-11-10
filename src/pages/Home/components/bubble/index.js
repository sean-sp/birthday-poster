import React, { useEffect, useMemo } from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import { VoiceSvgComponent } from '../svg'
// import wx from 'weixin-js-sdk';
import './index.scss';

let voiceId = '';

const Bubble = (props) => {
    const { commentsList } = props;
    const audio = useMemo(() => new Audio(), []);

    useEffect(() => {
        audio.addEventListener('ended', () => {
            console.log(`${voiceId}播放停止`);
        }, false);
    }, [audio]);

    const onCommentTap = (item) => {
        if (item.type === 'voice') {
            audio.src = item.content;
            audio.play();
            voiceId = item.name;
            return;
        }
        if (item.type === 'img') {
            // wx.previewImage({
            //     current: '', // 当前显示图片的http链接
            //     urls: [] // 需要预览的图片http链接列表
            // });
        }
    }

    return (
        <div className="bubble_box">
            <ReactSeamlessScroll speed={30} style={{ width: '4rem', height: '12rem' }}>
                <div className="bubble_item">
                    {
                        commentsList.map((item, index) => (
                            <div key={index} onClick={() => onCommentTap(item)}>
                                <span>{item.name}:</span>
                                {
                                    item.type === 'text' ? <span>{item.content}</span> : <span className='voice_icon'><VoiceSvgComponent /></span>
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