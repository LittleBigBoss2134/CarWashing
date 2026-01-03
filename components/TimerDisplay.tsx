import React, { useState, useEffect, useRef } from 'react';
import { Routine, Task } from '../types';
import { speakGuide } from '../services/geminiService';
import { playTTSSpeech } from '../services/audioService';

interface TimerDisplayProps {
  routine: Routine;
  onFinish: (earnings: number, totalSeconds: number) => void;
  onCancel: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ routine, onFinish, onCancel }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(routine.tasks[0].duration);
  const [isActive, setIsActive] = useState(true);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [earningsInput, setEarningsInput] = useState('');
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fix: Replaced NodeJS.Timeout with any to resolve namespace errors in the browser environment
  const timerRef = useRef<any>(null);
  const currentTask = routine.tasks[currentTaskIndex];

  // TTS Trigger Effect
  useEffect(() => {
    const playGuide = async () => {
      if (currentTask?.guide) {
        setIsSpeaking(true);
        const audioBase64 = await speakGuide(currentTask.guide);
        if (audioBase64) {
          await playTTSSpeech(audioBase64);
        }
        setIsSpeaking(false);
      }
    };
    
    playGuide();
  }, [currentTaskIndex, routine.tasks]);

  // Main Timer Effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTotalElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextTask();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleNextTask = () => {
    if (currentTaskIndex < routine.tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      setTimeLeft(routine.tasks[nextIndex].duration);
    } else {
      setIsActive(false);
      setShowEarningsModal(true);
    }
  };

  const handleSkip = () => {
    handleNextTask();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = ((currentTask.duration - timeLeft) / currentTask.duration) * 100;

  if (showEarningsModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-sm">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-check text-green-400 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Wash Complete!</h2>
          <p className="text-slate-400 text-center text-sm mb-6">How much did you earn for this wash?</p>
          
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">$</span>
            <input 
              type="number"
              step="0.01"
              value={earningsInput}
              onChange={(e) => setEarningsInput(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-3xl font-bold text-blue-400 text-center focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid gap-3">
            <button 
              onClick={() => onFinish(parseFloat(earningsInput) || 0, totalElapsedTime)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all"
            >
              Submit & Finish
            </button>
            <button 
              onClick={() => onFinish(0, totalElapsedTime)}
              className="w-full text-slate-500 text-sm font-semibold hover:text-slate-400 py-2"
            >
              Skip Earnings Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[70vh] items-center justify-between py-8 space-y-12">
      {/* Task Info */}
      <div className="text-center space-y-2 px-6">
        <p className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Step {currentTaskIndex + 1} of {routine.tasks.length}</p>
        <h2 className="text-3xl font-black text-slate-100">{currentTask.title}</h2>
        <div className="flex items-center justify-center gap-2 text-slate-400 mt-4 h-12">
          {isSpeaking && (
            <div className="flex gap-1 items-center">
              <div className="w-1 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-1 h-3 bg-blue-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          )}
          <p className="text-sm italic font-medium max-w-xs">{currentTask.guide}</p>
        </div>
      </div>

      {/* Circle Timer */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90">
          <circle 
            cx="144" cy="144" r="135" 
            stroke="currentColor" strokeWidth="8" fill="transparent" 
            className="text-slate-800"
          />
          <circle 
            cx="144" cy="144" r="135" 
            stroke="currentColor" strokeWidth="10" fill="transparent" 
            strokeDasharray={2 * Math.PI * 135}
            strokeDashoffset={2 * Math.PI * 135 * (1 - timeLeft / currentTask.duration)}
            className="text-blue-500 transition-all duration-1000 ease-linear rounded-full"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-center z-10">
          <p className="text-7xl font-black tracking-tighter text-slate-100">{formatTime(timeLeft)}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">remaining</p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs space-y-4">
        <div className="flex gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${isActive ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40'}`}
          >
            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
            {isActive ? 'Pause' : 'Resume'}
          </button>
          
          <button 
            onClick={handleSkip}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all"
          >
            <i className="fa-solid fa-forward-step"></i>
            Skip
          </button>
        </div>

        <button 
          onClick={() => {
            if(window.confirm('Cancel this wash session? No progress will be saved.')) onCancel();
          }}
          className="w-full text-slate-600 hover:text-red-400 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Cancel Session
        </button>
      </div>

      {/* Next Preview */}
      {currentTaskIndex < routine.tasks.length - 1 && (
        <div className="w-full bg-slate-900/50 p-4 rounded-t-3xl border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <i className="fa-solid fa-forward text-slate-500 text-xs"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Up Next</p>
              <p className="text-sm font-bold text-slate-300">{routine.tasks[currentTaskIndex + 1].title}</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-slate-500">{formatTime(routine.tasks[currentTaskIndex + 1].duration)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;