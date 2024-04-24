import React, { useState, useEffect } from 'react';

// Define a type for the component props
type CountdownTimerProps = {
  startDateTimestamp: string;
  endDateTimestamp: string;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ startDateTimestamp, endDateTimestamp }) => {
  const [timeDisplay, setTimeDisplay] = useState<string>('');

  // Helper function to format the time as a string
  const formatTime = (duration: number): string => {
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const updateTimer = (): void => {
      const now = new Date().getTime();
      const start = new Date(startDateTimestamp).getTime();
      const end = new Date(endDateTimestamp).getTime();

      if (now < start) {
        // Time until the event starts
        const timeUntilStart = start - now;
        setTimeDisplay(`Time until event starts: ${formatTime(timeUntilStart)}`);
      } else if (now >= start && now <= end) {
        // Time since the event started
        const elapsedTime = now - start;
        setTimeDisplay(`Time since event started: ${formatTime(elapsedTime)}`);
      } else {
        // Event duration after it has ended
        const eventDuration = end - start;
        setTimeDisplay(`Event duration: ${formatTime(eventDuration)}`);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Run it once immediately to avoid delay

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [startDateTimestamp, endDateTimestamp]);

  return (
    <div>
      <p className='flex flex-col items-center justify-center'>
            <span>{timeDisplay.split(':')[0]}:</span>
            <span style={{ display: 'block' }}>{timeDisplay.split(':')[1]}</span>
      </p>
    </div>
  );
};

export default CountdownTimer;
