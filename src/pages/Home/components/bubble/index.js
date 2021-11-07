import React, { useState } from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import './index.scss';

const Bubble = (props) => {
    const {commentsList} = props;

    const optionSetting = () =>{
        return {
            step:0.2,//速度，值越大，速度越快
            limitMoveNum: 1,
            hoverStop:true,//鼠标悬停效果，false为关闭该效果
　　　　　　　 singleHeight: 26,//单行停顿
　　　　　　　 waitTime: 2500,//单行停顿的时间
　　　　　}
    }

    return (
        <div className="bubble_box">
            <ReactSeamlessScroll speed={30} style={{width: '4rem', height: '2rem'}}>
                <div className="bubble_item">
                    {
                        commentsList.map((item,index) =>(
                            <div key={index}>
                                <span>{item.name}:</span>
                                <span>{item.text}</span>
                            </div>
                        ))
                    }
                </div>
            </ReactSeamlessScroll>
        </div>
    )
}

export default Bubble;