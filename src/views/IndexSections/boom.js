import React, { useEffect } from "react";
import { Container, Row } from "reactstrap";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import Fade from "react-reveal/Fade";
import { boom as boomContent } from "data/content";

const Boom = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const [springProps, setSpring] = useSpring(() => ({
    width: "0%",
    config: { duration: 2500 },
  }));

  // Only animate the underline once the section enters the viewport
  useEffect(() => {
    if (inView) {
      setSpring({ width: "100%" });
    }
  }, [inView, setSpring]);

  return (
    <div className="section section-basic" ref={ref}>
      <img alt="" className="path" src={require("assets/img/path4.png")} />
      <Container className="d-flex flex-column justify-content-center align-items-center text-center">
        <Row>
          <h1 style={{ fontSize: "7rem", fontWeight: 400, position: "relative" }}>
            <Fade>
              {boomContent.prefix}{" "}
              {boomContent.typedStrings[0]}
            </Fade>
            <animated.div
              style={{
                position: "absolute",
                bottom: "70%",
                left: 0,
                height: "8px",
                backgroundColor: "rgba(255, 0, 0, 0.9)",
                width: springProps.width,
              }}
            />
          </h1>
        </Row>
      </Container>
    </div>
  );
};

export default Boom;
