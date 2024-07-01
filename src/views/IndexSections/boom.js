import React from 'react';
import { Container } from 'reactstrap';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import LightSpeed from 'react-reveal/Fade';
import { ReactTyped } from "react-typed";
import { Row } from 'reactstrap';

export default function Boom() {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger the animation once
  });

  const [props, set] = useSpring(() => ({
    width: '0%',
    from: { width: '0%' },
    config: { duration: 2500 },
  }));

  React.useEffect(() => {
    set({ width: '100%' });
  }, [inView, set]);

  return (
    <div className="section section-basic" id="basic-elements">
      <img alt="Path" className="path" src={require("assets/img/path4.png")} />
      <Container className="d-flex flex-column justify-content-center align-items-center text-center">
        <Row>
        <h1 style={{ fontSize: "7rem", fontWeight: 400, position: "relative" }}>
          <LightSpeed>
          Disorder {" "}
          <ReactTyped strings={["Journey"]} typeSpeed={300} loop />
          </LightSpeed>
          <animated.div
            style={{
              position: "absolute",
              bottom: "70%",
              left: 0,
              height: "8px",
              backgroundColor: "rgba(255, 0, 0, 0.9)",
              width: props.width,

            }}
          />
        </h1>
        </Row>
      </Container>
    </div>
  );
}