import React, { useState } from 'react';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import '../App.css';

function Home() {
  const [activeScreen, setActiveScreen] = useState("Screen1");

  const handleButtonClick = (screenName) => {
    setActiveScreen(screenName);
  };

  return (
    <div className="app">

      <div className="nav">
        <h1>Umm's</h1>
      </div>
      
      <div className='app-conntent'>
          <div className="button-container">
            <button className='menubtn' onClick={() => handleButtonClick("Screen1")}>내 동네 배출정보</button>
            <button className='menubtn' onClick={() => handleButtonClick("Screen2")}>배출도구 안내</button>
            <button className='menubtn' onClick={() => handleButtonClick("Screen3")}>알림 서비스</button>
          </div>
          <div className="screen-container">
            {activeScreen === "Screen1" && <Screen1 />}
            {activeScreen === "Screen2" && <Screen2 />}
            {activeScreen === "Screen3" && <Screen3 />}
          </div>
      </div>
    
    </div>
  );
}

export default Home;
