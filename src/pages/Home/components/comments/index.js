import React, { useState } from 'react';
import { VoiceSvgComponent, ImgSvgComponent, SendSvgComponent, KeyboardSvgComponent } from './svg'
import './index.scss';

const Comments = (props) => {
  const { sendCommentsCb, uploadImg } = props;
  const [inputVal, setInputVal] = useState('');
  const [sendVisible, setSendVisible] = useState(false);
  const [voiceBtnVisible, setVoiceBtnVisible] = useState(false);
  const [voiceBtnClickOff, setVoiceBtnClickOff] = useState(false);
  const [longClick, setLongClick] = useState(0);
  const [timeOutEvent, setTimeOutEvent] = useState(null);

  const onCommentsInput = (e) => {
    const value = e.target.value;
    setInputVal(value);
    setSendVisible(!!value.length);
  }

  const onVoiceClick = () => {
    setVoiceBtnVisible(!voiceBtnVisible);
  }

  const start = (e) => {
    setVoiceBtnClickOff(true);
    setTimeOutEvent(setTimeout(() => {
      setLongClick(1)
    }, 1000))
  }

  const move = (e) => {
    clearTimeout(timeOutEvent)
    setLongClick(0);
    setVoiceBtnClickOff(false);
  }

  const end = (e) => {
    clearTimeout(timeOutEvent)
    setLongClick(0);
    setVoiceBtnClickOff(false);
    if (timeOutEvent !== null && longClick === 0) {
      console.log('说话时间太短');
      return;
    }
    console.log('发送语音');
  }

  const sendComments = () => {
    if (inputVal) {
      sendCommentsCb(inputVal);
    }
  }

  return (
    <div className="comments-btn-box">
      {voiceBtnVisible ? <div className={`voice-btn ${voiceBtnClickOff ? 'active' : ''}`}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      >
        {voiceBtnClickOff ? '松开结束' : '按住说话'}
      </div> :
        <div className="text-input">
          <input placeholder="请留下您的祝福..." onInput={onCommentsInput} />
        </div>}
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