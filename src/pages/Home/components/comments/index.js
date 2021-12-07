import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'react-vant';
import wx from 'weixin-js-sdk';
import { isLogin } from '../../../../utils';
import { VoiceSvgComponent, ImgSvgComponent, SendSvgComponent, KeyboardSvgComponent } from '../svg'
import './index.scss';

let timer = null;
let startTime = 0;
let endTime = 0;
// let moveOff = false;

const Comments = (props) => {
  const voiceBtnRef = useRef();
  const { sendCommentsCb, uploadImg, sendVoice } = props;
  const [inputVal, setInputVal] = useState('');
  const [sendVisible, setSendVisible] = useState(false);
  const [voiceBtnVisible, setVoiceBtnVisible] = useState(false);
  const [voiceBtnClickOff, setVoiceBtnClickOff] = useState(false);

  useEffect(() => {
    const voiceBtnDom = voiceBtnRef.current;
    voiceBtnDom.addEventListener('touchstart', start, { passive: false });
    // voiceBtnDom.addEventListener('touchmove', move, { passive: false });
    voiceBtnDom.addEventListener('touchend', end, { passive: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initRecordPermission = () => {
    if (!window.localStorage.getItem('rainAllowRecord')) {
      wx.startRecord({
        success: () => {
          window.localStorage.setItem('rainAllowRecord', 1);
          wx.stopRecord();
        },
        cancel: () => {
          Toast('用户拒绝授权录音');
        }
      });
    }
  }

  const onCommentsInput = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;
    setInputVal(value);
    setSendVisible(!!value.length);
  }

  const onVoiceClick = () => {
    if (!isLogin()) return;
    setVoiceBtnVisible(!voiceBtnVisible);
    if (!voiceBtnVisible) {
      initRecordPermission();
    }
  }

  const start = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVoiceBtnClickOff(true);
    // moveOff = false;
    startTime = new Date().getTime();
    timer = setTimeout(() => {
      wx.startRecord({
        success: () => {
          // 录音不能超过一分钟 超过一分钟自动停止 并触发该事件
          wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: (res) => {
              // 给出提示
              Toast('最多只能录制一分钟');
              // 记录录音的临时ID
              sendVoice(res.localId);
            }
          });
        },
        cancel: () => {
          Toast('用户拒绝授权录音');
        }
      });
    }, 300);
    e.stopPropagation();
    e.preventDefault();
  }

  // const move = (e) => {
  //   setVoiceBtnClickOff(false);
  //   moveOff = true;
  //   clearTimeout(timer);
  //   Toast({
  //     message: '取消发送',
  //     icon: 'warning',
  //   });
  //   setTimeout(() => {
  //     wx.stopRecord();
  //   }, 800);
  //   e.stopPropagation();
  //   e.preventDefault();
  // }

  const end = (e) => {
    // if (moveOff) return;
    setVoiceBtnClickOff(false);
    endTime = new Date().getTime();
    if (endTime - startTime < 1000) {
      startTime = 0;
      endTime = 0;
      //小于300ms，不录音
      clearTimeout(timer);
      Toast({
        message: '说话时间太短',
        icon: 'warning',
      });
      setTimeout(() => {
        wx.stopRecord();
      }, 800);
    } else {
      wx.stopRecord({
        success: (res) => {
          sendVoice(res.localId);
        },
        fail: (res) => {
          // alert(JSON.stringify(res));
        }
      });
    }
    e.stopPropagation();
    e.preventDefault();
  }

  const sendComments = () => {
    if (!isLogin()) return;
    if (inputVal) {
      setInputVal('');
      setSendVisible(false);
      sendCommentsCb(inputVal);
    }
  }

  return (
    <div className="comments-btn-box">
      <div className="input-voice-box">
        <div className={`voice-btn ${voiceBtnClickOff ? 'active' : ''}`}
          // onTouchStart={start}
          // onTouchMove={move}
          // onTouchEnd={end}
          ref={voiceBtnRef}
          style={{ visibility: voiceBtnVisible ? 'initial' : 'hidden' }}
        >
          {voiceBtnClickOff ? '松开结束' : '按住说话'}
        </div>
        <div className="text-input" style={{ visibility: voiceBtnVisible ? 'hidden' : 'initial' }}>
          <input placeholder="请留下您的祝福..." onInput={onCommentsInput} value={inputVal} />
        </div>
      </div>
      <div className="voice-svg" onClick={onVoiceClick}>
        {voiceBtnVisible ? <KeyboardSvgComponent /> : <VoiceSvgComponent />}
      </div>
      {sendVisible ? <div className="img-svg" onClick={sendComments}>
        <SendSvgComponent />
      </div> : <div className="img-svg" onClick={uploadImg}>
        <ImgSvgComponent />
      </div>}
    </div>
  )
}

export default Comments;