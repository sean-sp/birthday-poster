import React, { useEffect } from 'react';
import imgng from '../../static/images/bg1.png';
import audioSrc from '../../static/audio/birthday.mp3';
import { request } from '../../utils';
import APIS from '../../configs';
import './index.scss';

const Home = () => {
  useEffect(() => {
    request.get(APIS.detail, { recordId: 1 }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }, [])
  // const [autioSrc,setAutioSrc] = this.useState('./audio/birthday.mp3')
  return (
    <div className="content">
      <header className="header_title">BIRTHDAY STAR</header>
      <div className='mask'>
      </div>
      <div className='info'>
        <h4>HAPPY BIRTHDAY</h4>
        <p>HAPPY BIRTHDAY  HAPPY EVERDAY  HAPPY FROEVER</p>
        <div className="audio_box">
          <audio>
            <source src={audioSrc} type="audio/mp3" />
          </audio>
          <input className='audio_schedule' type="range" value='0' ></input>
          <div className="audio_times">
            <span>0</span>
            <span>1:30</span>
          </div>
        </div>
      </div>
      <img src={imgng} />
    </div>
  )
}

export default Home;