import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Clock, Flag } from 'lucide-react';

interface LapTime {
  id: number;
  time: string;
  totalTime: string;
  isFastest: boolean;
  isSlowest: boolean;
}

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number): string => {
    const totalMs = milliseconds;
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLapTimes([]);
  };

  const handleLap = () => {
    if (time > 0) {
      const newLap: LapTime = {
        id: lapTimes.length + 1,
        time: formatTime(time - (lapTimes.length > 0 ? lapTimes[lapTimes.length - 1].totalTime.split(':').reduce((acc, part, index) => {
          if (index === 0) return parseInt(part) * 60000;
          const [sec, ms] = part.split('.');
          return acc + parseInt(sec) * 1000 + parseInt(ms) * 10;
        }, 0) : 0)),
        totalTime: formatTime(time),
        isFastest: false,
        isSlowest: false
      };

      const updatedLaps = [...lapTimes, newLap];
      
      // Calculate fastest and slowest laps
      if (updatedLaps.length > 1) {
        const lapDurations = updatedLaps.map(lap => {
          const [min, secMs] = lap.time.split(':');
          const [sec, ms] = secMs.split('.');
          return parseInt(min) * 60000 + parseInt(sec) * 1000 + parseInt(ms) * 10;
        });

        const minDuration = Math.min(...lapDurations);
        const maxDuration = Math.max(...lapDurations);

        updatedLaps.forEach((lap, index) => {
          const duration = lapDurations[index];
          lap.isFastest = duration === minDuration && minDuration !== maxDuration;
          lap.isSlowest = duration === maxDuration && minDuration !== maxDuration;
        });
      }

      setLapTimes(updatedLaps);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Stopwatch Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-6 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Stopwatch</h1>
            </div>
            
            {/* Time Display */}
            <div className="bg-black/30 rounded-2xl p-6 mb-6">
              <div className="text-5xl md:text-6xl font-mono font-bold text-white tracking-wider">
                {formatTime(time)}
              </div>
              <div className="text-sm text-gray-400 mt-2">MM:SS.MS</div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex items-center justify-center w-16 h-16 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <Pause className="w-6 h-6 text-white" />
                </button>
              )}

              <button
                onClick={handleLap}
                disabled={time === 0}
                className="flex items-center justify-center w-16 h-16 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <Flag className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Button Labels */}
            <div className="flex justify-center space-x-4 mt-3">
              <span className="text-xs text-gray-400 w-16 text-center">
                {!isRunning ? 'Start' : 'Pause'}
              </span>
              <span className="text-xs text-gray-400 w-16 text-center">Lap</span>
              <span className="text-xs text-gray-400 w-16 text-center">Reset</span>
            </div>
          </div>
        </div>

        {/* Lap Times */}
        {lapTimes.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Flag className="w-5 h-5 mr-2" />
              Lap Times
            </h2>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {lapTimes.slice().reverse().map((lap, index) => (
                <div
                  key={lap.id}
                  className={`flex justify-between items-center p-3 rounded-xl transition-all duration-300 ${
                    lap.isFastest
                      ? 'bg-green-500/20 border border-green-500/30'
                      : lap.isSlowest
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm w-12">
                      #{lapTimes.length - index}
                    </span>
                    {lap.isFastest && (
                      <span className="text-green-400 text-xs ml-2 px-2 py-1 bg-green-500/20 rounded-full">
                        Fastest
                      </span>
                    )}
                    {lap.isSlowest && (
                      <span className="text-red-400 text-xs ml-2 px-2 py-1 bg-red-500/20 rounded-full">
                        Slowest
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-mono text-lg">
                      {lap.time}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Total: {lap.totalTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-2">How to Use</h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• Press <span className="text-green-400">Start</span> to begin timing</p>
              <p>• Press <span className="text-blue-400">Lap</span> to record split times</p>
              <p>• Press <span className="text-red-400">Reset</span> to clear everything</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;