import { useState } from "react";

export const VideoDuration = ({ src }) => {
  const [duration, setDuration] = useState("00:00");

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
    <video
      src={`http://localhost:5000${src}`}
      className="w-20 h-20 object-cover"
      preload="metadata"
      onLoadedMetadata={(e) => {
        setDuration(formatTime(e.target.duration));
      }}
    >
       
      
    </video>
     <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-md">
            {duration}
        </div>
        </>
  );
};
