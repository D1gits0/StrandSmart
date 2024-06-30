import React from "react";
import { Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import LightSpeed from 'react-reveal/Fade';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

// plugin that creates slider


// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function More() {
    const { ref, inView } = useInView({
      triggerOnce: true, // Animation triggers only once when in view
      threshold: 0.1, // Adjust the threshold as needed
});

  return (
    <div className="section section-basic" id="basic-elements">
      <img alt="..." className="path" src={require("assets/img/path2.png")} />
      <Container
         className="d-flex flex-column justify-content-center align-items-center text-center"
         style={{ minHeight: "100vh" }}
      >
        <LightSpeed>
          <h1 className="title"> Community</h1>
          </LightSpeed>
        <Fade>
          <h3>
            <blockquote>Connect with others who understand your experience. 
              Share your story, ask questions, and find support in our safe and welcoming community.</blockquote>
  </h3>
  </Fade>
        <Row>
          <Col>
        <motion.div
                ref ={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 4, delay: 0.5 }}
              >
                 <a href="https://www.reddit.com/r/trichotillomania" target="blank" rel="nooopener noreferrer">
                <Button className="btn-round btn-orange" type="button">
                <i className="fab fa-reddit" style={{ marginRight: "5px"}}/> 
                Join Us on Reddit 
                  </Button>
                  </a>
              </motion.div>
          </Col>
        </Row> 
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
          <h1 classname="title">
          <LightSpeed>
          Get Involved
          </LightSpeed>
          </h1>
        <Row/>
      <Row>
        <h3>
         <LightSpeed>
         Join us in raising awareness about trichotillomania.
          Participate in campaigns, share our resources, and help make a difference.
         </LightSpeed>
         </h3>
      </Row>
      <Row>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 4, delay: 0.5 }}
        >
        <Button className="btn-round" color="primary" type="button">
          Learn How 
        </Button>
        </motion.div>
      </Row>
        <br />
      </Container>
    </div>
  );
}
