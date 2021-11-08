import React, { useEffect, useState } from 'react';
// import { Button } from 'react-vant';
import Comments from './components/comments';
import Bubble from './components/bubble';
// import imgng from '../../static/images/bg1.png';
// import audioSrc from '../../static/audio/birthday.mp3';
import { request } from '../../utils';
import APIS from '../../configs';
import './index.scss';

const dataList = [
  {
      name:'丽丽',
      text:'生日快乐'
  },
{
  name:'爱德华兹',
  text:'生日快乐'
},
{
  name:'flying',
  text:'生日快乐'
},
]

const Home = () => {
  const [commentsList, setCommentsList] = useState(dataList);
  useEffect(() => {
    request.get(APIS.detail, { recordId: 1 }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }, []);

  const sendCommentsCb = (comment) => {
    setCommentsList([
      ...commentsList,
      {
        name: `海马体${parseInt( Math.random() * 10)}`,
        text: comment
      }
    ])
  }
  // const [autioSrc,setAutioSrc] = this.useState('./audio/birthday.mp3')
  return (
    <div className="content">
      <header>BIRTHDAY STAR</header>
      {/* <div className='mask'>
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
      <img src={imgng} /> */}
      <Bubble commentsList={commentsList}/>
      <Comments sendCommentsCb={sendCommentsCb}/>
    </div>
  )
}

export default Home;