import { useState, useEffect } from "react";
import moment from "moment";

const useStopWatch = (startTime, isStop = false) => {
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    const startTimestamp = moment(startTime).valueOf(); // Convert Moment.js timestamp to JavaScript timestamp

    const calculateTime = () => {
      const currentTime = moment().valueOf(); // Get current time using Moment.js
      const diff = currentTime - startTimestamp;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTime(
        `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }`
      );
    };

    if (isStop) {
      calculateTime();
    } else {
      const interval = setInterval(calculateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isStop]);

  return time;
};

export default useStopWatch;
