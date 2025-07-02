import React, { useState, useEffect } from "react";

//Movement of the dots after waiting for host to start or waiting for players
function AnimatedEllipsis() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 650);
    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

export default AnimatedEllipsis;
