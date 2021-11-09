import React from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import { VoiceSvgComponent } from '../svg'
import wx from 'weixin-js-sdk';
import './index.scss';

const Bubble = (props) => {
    const { commentsList,palyVoice } = props;

    const onVoiceTap = (val)=>{
        console.log('dinajil',val)
        if(val.type = "voice"){
            palyVoice()
        }
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