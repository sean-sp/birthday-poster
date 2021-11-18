/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Toast, Dialog } from 'react-vant';
import wx from 'weixin-js-sdk';
import QRCode from "qrcode";
import html2canvas from "html2canvas"
import { request } from '../../../../utils';
import APIS from '../../../../configs';
import './index.scss';

import titleHui from '../../../../static/images/title_hui.png'
import logo from '../../../../static/images/logo.png'

// import shareIcon from '../../../../static/images/share.png'


import topHui from '../../../../static/images/top_hui.png'
import topHei from '../../../../static/images/top_hei.png'
import topHong from '../../../../static/images/top_hong.png'
import topLan from '../../../../static/images/top_lan.png'

import mainHui from '../../../../static/images/main_hui.png'
import mainHei from '../../../../static/images/main_hei.png'
import mainHong from '../../../../static/images/main_hong.png'
import mainLan from '../../../../static/images/main_lan.png'


const Poster = (props) => {
    const { posterUrl, active } = props;
    // const [active] = useState(1);
    const [qr, setQr] = useState('')
    const [posterImg, setposterImg] = useState('')
    const article = useRef()
    const [show, setShow] = useState(false);
    useEffect(() => {
        QRCode.toCanvas(document.getElementById("img"), 'https://www.baidu.com/', {
            margin: 1,
        })

        // 获取自定义海拔的dom  元素
        var copyDom = document.getElementById("posterDom");
        var width = copyDom.offsetWidth;
        var height = copyDom.offsetHeight;
        // 定义canvas对象
        let canvas = document.createElement("canvas");
        var scale = 1; // 放大图片6倍
        canvas.width = width * scale;
        canvas.height = height * scale;
        //  设置图片为2d
        canvas.getContext("2d").scale(scale, scale);

        // 调用html2canvas 生成海报的方法  这样写是为了兼容部分手机不能显示
        //  this.$refs.article  就是定义的海报dom元素
        // useCORS: true   设置图片可以跨域
        // canvas.toDataURL()方法会生成一个  图片url 可以直接拿来用
        (window.html2canvas || html2canvas)(article.current, {
            useCORS: true,
            logging: false,
        }).then((canvas) => {
            setposterImg(canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
            // savePicture(posterImg)
            setShow(true)
        });

    }, [])

    const savePicture = (Url) => {
        var blob = new Blob([''], { type: 'application/octet-stream' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = Url;
        a.download = `poster.png`;
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', false, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        URL.revokeObjectURL(url);
    }


    return (
        <div style={{ height: '100%' }}>
            <div className="poster_box" id="posterDom" ref={article} style={{ background: active === 1 ? 'linear-gradient(55deg, #9DB6CF, #607798)' : active === 2 ? 'linear-gradient(-55deg, #A2A2AB, #92929B)' : active === 3 ? 'linear-gradient(-55deg, #F0BCC0, #934A55)' : 'linear-gradient(-55deg, #9B9BA7, #8A8793);' }}>
                <div className="top_box">
                    <img className="top_bg" src={active === 1 ? topLan : active === 2 ? topHui : active === 3 ? topHong : topHei}></img>
                    <img className="top_title" src={titleHui}></img>
                </div>
                {/* <img className="share_icon" src={shareIcon}></img> */}
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
                            <span>换新亮相NEW LOOK</span>
                            <span>生日体还海马照F/W</span>
                        </div>
                    </div>
                    <div className="qr_box">
                        <canvas id="img"></canvas>
                    </div>
                </div>
                
            </div>
            {/* <img src={posterImg}></img> */}
            <Dialog
                visible={show}
                title="海报预览"
                closeable={true}
                showConfirmButton={false}
                className="poster_dialog"
                onClose={() => setShow(false)}
                >
                <img className="poster_img" src={posterImg} alt="海报" />
                <p className="poster_desc">长按上方图片分享给好友</p>
            </Dialog>
        </div>
    )
}

export default Poster;