import React, { useState, useEffect } from 'react';
import './index.scss';

import titleHui from '../../../../static/images/title_hui.png'
import logo from '../../../../static/images/logo.png'

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

import footerHei from '../../../../static/images/footer_hei.png'
import footerHui from '../../../../static/images/footer_hui.png'
import footerLan from '../../../../static/images/footer_lan.png'
import footerHong from '../../../../static/images/footer_hong.png'

const footer_hei = {
    background: `url(${footerHei}) no-repeat`,
};
const footer_hui = {
    background: `url(${footerHui}) no-repeat`,
};
const footer_lan = {
    background: `url(${footerLan}) no-repeat`,
};
const footer_hong = {
    background: `url(${footerHong}) no-repeat`,
};


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

    const [active, setActive] = useState(1);
    const [avatar, setAvatar] = useState('');
    const [isShow, setShow] = useState(true)

    //展示主页或创建样式
    useEffect(() => {
        // setShow(false)
    }, []);

    const changeSticker = (val) =>{
        setActive(val.key)
    }

    //返回选择
    const back = () =>{
        if(avatar){
            setAvatar('')
        }else{
            setActive(1)
        }
    }

    return (
        <div className="create_box" style={{background: active == 1 ? 'linear-gradient(-55deg, #9DB6CF, #8AA2BD)' : active == 2 ? 'linear-gradient(-55deg, #A2A2AB, #C7C8D3)' :active == 3 ? 'linear-gradient(-55deg, #F0BCC0, #F2B8BD)' :'linear-gradient(-55deg, #9B9BA7, #BBB9C7);'}}>
            <div className={isShow ? 'has_padding':''}>
                <div className="top_box">
                    <img  className="top_bg" src={active == 1 ? topLan : active == 2 ? topHui :active == 3 ? topHong :topHei}></img>
                    <img  className="top_title" src={titleHui}></img>
                </div>
                <div className="main_box">
                    <img className="main_kuang" src={active == 1 ? mainLan : active == 2 ? mainHui :active == 3 ? mainHong :mainHei}></img>
                    {
                        avatar ? <img className="avatar_view" src={avatar}></img> :
                        <div className="add_avatar" style={{background: active == 1 ? '#8499B0' : active == 2 ? '#AEB1BC' :active == 3 ? '#D99FA6' :'#A9A7B4'}}>
                            <span className="add_icon">+</span>
                            <span>添加照片</span>
                        </div>
                    }
                </div>
                {/* style={active == 1 ? footer_lan : active == 2 ? footer_hui :active == 3 ? footer_hong :footer_hei}> */}
                <div className="footer_box" >
                    <div className="footer_info">
                        <span><img src={logo}></img></span>
                        <span>|</span>
                        <span>生活需要仪式感</span>
                        <span>|</span>
                        <span>2021</span>
                    </div>
                    {/* <div className="footer_desc">版权</div> */}
                </div>
            </div>
            {
                isShow ? 
                <div className='sticker_box'>
                    <div className='sticker_header'>
                        <img src={backImg} onClick={back}></img>
                        <span>贴纸</span>
                        <img src={sureImg}></img>
                    </div>
                    <div className="sticker_list">
                    {
                        stickerList.map((item,index)=>(
                            <div key={index} className="sticker_item" onClick={()=>changeSticker(item)}>
                                <img src={item.img}></img>
                            </div>
                        ))
                    }
                    </div>
                </div> : null
            }
        </div>
    )
}

export default Create;