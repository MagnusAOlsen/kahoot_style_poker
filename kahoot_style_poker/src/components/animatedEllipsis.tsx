import React, { useState, useEffect } from "react";

function AnimatedEllipsis() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 650); // change speed here
    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

export default AnimatedEllipsis;
