import { useState, useEffect, useCallback } from "react";

/**
 * Drives the 3D parallax squares animation on auth pages (Register, Login).
 * Returns two transform strings: one for squares 1–6, one for squares 7–8.
 */
const useParallaxSquares = () => {
  const [squaresLarge, setSquaresLarge] = useState("");
  const [squaresSmall, setSquaresSmall] = useState("");

  const handleMouseMove = useCallback((event) => {
    const posX = event.clientX - window.innerWidth / 2;
    const posY = event.clientY - window.innerWidth / 6;
    setSquaresLarge(
      `perspective(500px) rotateY(${posX * 0.05}deg) rotateX(${posY * -0.05}deg)`
    );
    setSquaresSmall(
      `perspective(500px) rotateY(${posX * 0.02}deg) rotateX(${posY * -0.02}deg)`
    );
  }, []);

  useEffect(() => {
    document.documentElement.addEventListener("mousemove", handleMouseMove);
    return () =>
      document.documentElement.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { squaresLarge, squaresSmall };
};

export default useParallaxSquares;
