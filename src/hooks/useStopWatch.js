import { useState, useEffect } from "react";
import moment from "moment";

const useStopWatch = (startTime, endTime = null) => {
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    const startTimestamp = moment(startTime).valueOf(); // Convert Moment.js timestamp to JavaScript timestamp
    const endTimestamp = endTime ? moment(endTime).valueOf() : null; // Convert endTime to JavaScript timestamp if provided

    const calculateTime = () => {
      const currentTime = endTimestamp || moment().valueOf(); // Use endTimestamp if provided, otherwise use current time
      const diff = currentTime - startTimestamp;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTime(
        `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes
        }`
      );
    };

    if (endTimestamp) {
      calculateTime();
    } else {
      const interval = setInterval(calculateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  return time;
};

export default useStopWatch;
