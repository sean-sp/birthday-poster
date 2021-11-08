import React from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import './index.scss';

const Bubble = (props) => {
    const { commentsList } = props;

    return (
        <div className="bubble_box">
            <ReactSeamlessScroll speed={30} style={{ width: '4rem', height: '2rem' }}>
                <div className="bubble_item">
                    {
                        commentsList.map((item, index) => (
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