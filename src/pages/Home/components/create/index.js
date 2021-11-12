import React from 'react';
import './index.scss';
import topHui from '../../../../static/images/top_hui.png'
import titleHui from '../../../../static/images/title_hui.png'
import mainHui from '../../../../static/images/main_hui.png'

import backImg from '../../../../static/images/back_icon.png'
import sureImg from '../../../../static/images/sure_icon.png'

import lanImg from '../../../../static/images/sticker_lan.png'
import huiImg from '../../../../static/images/sticker_hui.png'
import hongImg from '../../../../static/images/sticker_hong.png'
import heiImg from '../../../../static/images/sticker_hei.png'


const Create = (props) => {
    console.log(props)
    const stickerList = [
        {
            key:1,
            img:lanImg
        },
        {
            key:2,
            img:huiImg
        },
        {
            key:3,
            img:hongImg
        },
        {
            key:4,
            img:heiImg
        }
    ]
    return (
        <div className="create_box">
            <div className="top_box">
                <img  className="top_bg" src={topHui}></img>
                <img  className="top_title" src={titleHui}></img>
            </div>
            <div className="main_box">
                <img className="main_kuang" src={mainHui}></img>
                <div className="add_avatar">
                    <span className="add_icon">+</span>
                    <span>添加照片</span>
                </div>
                {/* <img className="avatar_view" src={titleHui}></img> */}
            </div>
            <div className="footer_box">
                <div className="footer_info">
                    <span><img src={mainHui}></img></span>
                    <span>|</span>
                    <span>生活需要仪式感</span>
                    <span>|</span>
                    <span>2021</span>
                </div>
                <div className="footer_desc">sdsdsdsds</div>
            </div>
            <div className='sticker_box'>
                <div className='sticker_header'>
                    <img src={backImg}></img>
                    <span>贴纸</span>
                    <img src={sureImg}></img>
                </div>
                <div className="sticker_list">
                {
                    stickerList.map((item,index)=>(
                        <div key={index} className="sticker_item">
                            <img src={item.img}></img>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}

export default Create;