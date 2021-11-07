import React, { useState } from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import './index.scss';


const Bubble = () =>{

    const dataList = [
        {
            name:'张三',
            text:'生日快乐'
        },
        {
            name:'张三1',
            text:'生日快乐'
        },
        {
            name:'张三2',
            text:'生日快乐'
        },
        {
            name:'张三3',
            text:'生日快乐'
        },
        {
            name:'张三4',
            text:'生日快乐'
        },
        {
            name:'张三5',
            text:'生日快乐'
        },
        {
            name:'张三6',
            text:'生日快乐'
        },
        {
            name:'张三7',
            text:'生日快乐'
        }
    ]

    const optionSetting = () =>{
        return {
            step:1,//速度，值越大，速度越快
            hoverStop:true,//鼠标悬停效果，false为关闭该效果
　　　　　　　 singleHeight: 26,//单行停顿
　　　　　　　 waitTime: 2500,//单行停顿的时间
　　　　　}
    }

    return (
        <div className="bubble_box">
            <ReactSeamlessScroll class-option="optionSetting" style={{width: '200px', height: '100px'}}>
                <div className="bubble_item">
                    {
                        dataList.map((item,index) =>(
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