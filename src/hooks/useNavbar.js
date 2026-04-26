import { useState, useEffect, useCallback } from "react";

/**
 * Shared navbar logic used by IndexNavbar and ExamplesNavbar.
 * Handles scroll-based color change and mobile collapse state.
 */
const SCROLL_THRESHOLD = 99;

const useNavbar = () => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [collapseOut, setCollapseOut] = useState("");
  const [navColor, setNavColor] = useState("navbar-transparent");

  const handleScroll = useCallback(() => {
    const scrolled =
      document.documentElement.scrollTop > SCROLL_THRESHOLD ||
      document.body.scrollTop > SCROLL_THRESHOLD;
    setNavColor(scrolled ? "bg-info" : "navbar-transparent");
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen((prev) => !prev);
  };

  const onCollapseExiting = () => setCollapseOut("collapsing-out");
  const onCollapseExited = () => setCollapseOut("");

  return {
    collapseOpen,
    collapseOut,
    navColor,
    toggleCollapse,
    onCollapseExiting,
    onCollapseExited,
  };
};

export default useNavbar;
