import './index.scss';
import imgng from '../../images/bg1.png'
import audioSrc from '../../audio/birthday.mp3'

function Home() {
  // const [autioSrc,setAutioSrc] = this.useState('./audio/birthday.mp3')
  return (
    <div className="content">
      <header className="header_title">BIRTHDAY STAR11</header>
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