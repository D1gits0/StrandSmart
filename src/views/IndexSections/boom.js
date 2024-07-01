import React from 'react';
import { Container } from 'reactstrap';
import { useSpring, animated } from 'react-spring';

export default function Boom() {
  const [props, set] = useSpring(() => ({
    width: '0%',
    from: { width: '0%' },
    config: { duration: 1000 },
  }));

  React.useEffect(() => {
    set({ width: '100%' });
  }, [set]);

  return (
    <div className="section section-basic" id="basic-elements">
      <img alt="Path" className="path" src={require("assets/img/path4.png")} />
      <Container className="d-flex flex-column justify-content-center align-items-center text-center">
        <h1 style={{ fontSize: "7rem", fontWeight: 400, position: "relative" }}>
          Disorder
          <animated.div
            style={{
              position: "absolute",
              bottom: "50%",
              left: 0,
              height: "8px",
              backgroundColor: "#ffffff",
              width: props.width,
            }}
          />
        </h1>
      </Container>
    </div>
  );
}