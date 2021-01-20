import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {

  const CorrectValue = (value) => {
    if(Number(value) < 10) {
      return `0${Number(value)}`
    }
    return value;
  }

  const correctTime = (time) => {
    let [min, sec] = time.split(':');
    return `${CorrectValue(min)}:${CorrectValue(sec)}`
  } 

  const initialSessionCount = 25;
  const initialBreakCount = 5;
  const [breakLength, setBreak] = useState(initialBreakCount);
  const [sessionLength, setSession] = useState(initialSessionCount);
  const [timer, updateTimer] = useState(correctTime(`${initialSessionCount}:00`));
  const [intervalId, setIntervalId] = useState();
  const [isPaused, togglePausePlay] = useState(true);
  const [inSession, toggleSession] = useState(true);
  const audioRef = useRef();
  

  const handleReset = ()=>{
    audioRef.current.currentTime=0;
    audioRef.current.pause();
    setBreak(initialBreakCount);
    setSession(initialSessionCount);
    updateTimer(correctTime(`${initialSessionCount}:00`));
    clearInterval(intervalId);
    togglePausePlay(true);
    toggleSession(true);
  }

  useEffect(()=>{
    if(inSession){
      updateTimer( correctTime(`${sessionLength}:00`));
    }else{
      updateTimer(correctTime(`${breakLength}:00`));
    }
  }, [inSession])

  useEffect(()=> {
    let minute = timer.split(":");
    if(Number(minute[0]) === 0 && Number(minute[1]) === 0){       
      toggleSession(prev => !prev);             
    }
  }, [timer])

  
  

  const play = ()=>{
    updateTimer(state => {
      let minute = state.split(":");
    
      if(Number(minute[0]) === 1 && Number(minute[1]) === 0){
        audioRef.current.play();
      }
      if(Number(minute[0]) > 0 && Number(minute[1]) === 0){     
        let minutesLeft = minute[0]-1;
        let secondsLeft = Number(minute[1])+60;
        minute.splice(0, 1, minutesLeft)
        minute.splice(1,1, secondsLeft)
      }
      if(Number(minute[1]) <=60 && Number(minute[1]) > 0){
          let secondsLeft = Number(minute[1])-1;
          minute.splice(1,1,secondsLeft);
      }
      
      let newTimer = minute.join(':')

      return correctTime(newTimer);
      }
    )
  }

  const pause = ()=>{
    clearInterval(intervalId)
  }
  
  const incrementBreakLength = ()=>{
    if(breakLength >=1 && breakLength < 60){
      setBreak(breakLength+1);
    }
  }
  const decrementBreakLength = ()=>{
    if(breakLength >1 && breakLength <= 60){
      setBreak(breakLength-1);
    }
  }

  const incrementSessionLength = ()=>{
    if(sessionLength >=1 && sessionLength < 60){
      setSession(state=> {
        let newLength = state+1;
        updateTimer(correctTime(`${newLength}:00`));
        return newLength;
      });
    }  
  }
  const decrementSessionLength = ()=> {
    if(sessionLength >1 && sessionLength <= 60){
      setSession(state=> {
        let newLength = state-1;
        updateTimer(correctTime(`${newLength}:00`));
        return newLength;
      });
    }
  }

  return (
    <div className="App">
      <h1
        style={{
          fontWeight: 500,
          fontStyle: "italic",
          textAlign: "center"
        }}
      >
        Pomodoro Clock
      </h1>
      <div className="break-session-wrapper">
        <div className="length-box">
          <p id="break-label">Break Length</p>
          <div className="inc-dec-wrapper">
            <button disabled={!isPaused} onClick={incrementBreakLength}>
              <i id="break-increment" className="fas fa-arrow-alt-circle-up" title="Increase" ></i>
            </button>
            <div id="break-length">{breakLength}</div>
            <button disabled={!isPaused} onClick={decrementBreakLength}>
              <i id="break-decrement" className="fas fa-arrow-alt-circle-down" title="Decrease"></i>
            </button>
            
          </div>
        </div>
        <div className="length-box">
          <p id="session-label">Session Length</p>
          <div className="inc-dec-wrapper">
            <button disabled={!isPaused} onClick={incrementSessionLength}>
             <i id="session-increment" className="fas fa-arrow-alt-circle-up" title="Increase"></i>
            </button>
            <div id="session-length">{sessionLength}</div>
            <button  disabled={!isPaused} onClick={decrementSessionLength}>
              <i id="session-decrement" className="fas fa-arrow-alt-circle-down" title="Decrease"></i>
            </button>
          </div>
        </div>
      </div>
      <div id="time-box">
      <p id="timer-label">{inSession ? 'Session': 'Break'}</p>
      <div id="time-left">{timer}</div>
      </div>
      <div id="time-setter-box">
        <button id="start_stop" onClick={()=>{
          const isPausedNow = !isPaused;
          if(!isPausedNow){
            const intervalid = setInterval(play, 1000)
            setIntervalId(intervalid)
          } else{
            pause();
          }
          togglePausePlay(isPreviouslyPaused => !isPreviouslyPaused);
        }
          
        }>
          {isPaused ? <i className="fas fa-play-circle" title="Play"></i> :<i className="fas fa-pause-circle" title="Pause"></i>}
        </button>
        <button id="reset" onClick={handleReset}><i className="fas fa-redo-alt" title="Refresh"></i></button>
        
      </div>
      <div>
        <audio id="beep" ref={audioRef} preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    </div>
  );
}
export default App;
