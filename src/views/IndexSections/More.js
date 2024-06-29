import React from "react";
import { Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import LightSpeed from 'react-reveal/Fade';
import { motion } from "framer-motion";
// plugin that creates slider


// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function More() {
  return (
    <div className="section section-basic" id="basic-elements">
      <img alt="..." className="path" src={require("assets/img/path1.png")} />
      <Container
         className="d-flex flex-column justify-content-center align-items-center text-center"
         style={{ minHeight: "100vh" }}
      >
        <LightSpeed>
          <h1 className="title"> Community</h1>
          </LightSpeed>
        <Fade>
          <h3>
            <blockquote>"<strong>StrandSmart</strong> is dedicated to providing resources, support, and community for those dealing with <em>trichotillomania</em>. 
            Our mission is to <u>normalize</u> the condition and offer practical guidance for managing it."</blockquote>
  </h3>
  </Fade>
        <Row>
          <Col>
        <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 4, delay: 0.5 }}
              >
                <Button className="btn-round" color="primary" type="button">
                  Read Our Story
                </Button>
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
          Resources
          </LightSpeed>
          </h1>
        <Row/>
        <Row>
          <Col>
          </Col>
          <Col>
          <h4 style={{ textAlign: "left" }}>
            <LightSpeed>

          Discover information to help you understand and manage trichotillomania. Our articles, guides, and stories offer practical tips, expert advice, and support. Learn about the condition, explore coping strategies, and connect with others.
          </LightSpeed>
          </h4>
          </Col>
          <Col className="mt-5 mt-sm-0" sm="3" xs="6">
              <motion.img
                alt="..."
                className="img-fluid rounded-circle shadow-lg"
                src={require("assets/img/openhands.png")}
                style={{ width: "150px" }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 3 }}
              />
            </Col>
            <Col>

            </Col>
        </Row>
        <br/>
        <br/>
        <br/>
        <Row>
        <Col sm="6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3 }}
          whileHover={{ scale: 0.9 }}
        >
          <Link to="landing-page">
            <img
              alt="..."
              className="img-raised"
              src={require("assets/img/strandsmartlogo.png")}
            />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            className="btn-simple btn-round"
            color="primary"
            to="landing-page"
            tag={Link}
          >
            See Articles
          </Button>
        </motion.div>
      </Col>
      <Col sm="6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3 }}
          whileHover={{ scale: 0.9 }}
        >
          <Link to="profile-page">
            <img
              alt="..."
              className="img-raised"
              src={require("assets/img/strandsmartlogo.png")}
            />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            className="btn-simple btn-round"
            color="primary"
            to="profile-page"
            tag={Link}
          >
            See Blog
          </Button>
        </motion.div>
      </Col>
        </Row>
        <br />
      </Container>
    </div>
  );
}
