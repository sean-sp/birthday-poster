/* eslint-disable */
import React, { forwardRef } from 'react';
import './index.scss';

import titleHui from '../../../../static/images/title_hui.png'
import logo from '../../../../static/images/logo.png'

import topHui from '../../../../static/images/top_hui.png'
import topHei from '../../../../static/images/top_hei.png'
import topHong from '../../../../static/images/top_hong.png'
import topLan from '../../../../static/images/top_lan.png'

import mainHui from '../../../../static/images/main_hui.png'
import mainHei from '../../../../static/images/main_hei.png'
import mainHong from '../../../../static/images/main_hong.png'
import mainLan from '../../../../static/images/main_lan.png'


const Poster = (props, ref) => {
    const { posterUrl, active } = props;

    return (
        <div ref={ref} className="poster_box" style={{ background: active === 1 ? 'linear-gradient(55deg, #9DB6CF, #607798)' : active === 2 ? 'linear-gradient(-55deg, #A2A2AB, #92929B)' : active === 3 ? 'linear-gradient(-55deg, #F0BCC0, #934A55)' : 'linear-gradient(-55deg, #9B9BA7, #8A8793)' }}>
            <div className="top_box">
                <img className="top_bg" src={active === 1 ? topLan : active === 2 ? topHui : active === 3 ? topHong : topHei}></img>
                <img className="top_title" src={titleHui}></img>
            </div>
            <div className="main_box">
                <img className="main_kuang" src={active === 1 ? mainLan : active === 2 ? mainHui : active === 3 ? mainHong : mainHei}></img>
                {
                    posterUrl && <img className="avatar_view" src={posterUrl}></img>
                }
            </div>
            <div className="footer_box" >
                <div className="footer_info">
                    <span><img src={logo}></img></span>
                    <div>
                        <span>大梦不觉，又是一年</span>
                        <span>新的一岁你想对我说的是什么？快来扫码吧～</span>
                    </div>
                </div>
                <div className="qr_box">
                    <canvas id="img"></canvas>
                </div>
            </div>

        </div>
    )
}

export default forwardRef(Poster);