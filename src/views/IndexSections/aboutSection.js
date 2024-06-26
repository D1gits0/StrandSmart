import React from "react";
import { Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';
// plugin that creates slider


// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function About() {
  return (
    <div className="section section-basic" id="basic-elements">
      <img alt="..." className="path" src={require("assets/img/path1.png")} />
      <Container
         className="d-flex flex-column justify-content-center align-items-center text-center"
         style={{ minHeight: "100vh" }}
      >
        <Fade>
          <h1 className="title">About Us</h1>
          </Fade>
        <Fade>
          <h3>
            <blockquote>"<strong>StrandSmart</strong> is dedicated to providing resources, support, and community for those dealing with <em>trichotillomania</em>. 
            Our mission is to <u>normalize</u> the condition and offer practical guidance for managing it."</blockquote>
  </h3>
  </Fade>
        <Row>
          <Col>
          <Button className="btn-round" color="primary" type="button">
              Read Our Story
            </Button>
          </Col>
        </Row> 
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Row>
        <h1 classname="title">
        <Fade>
        Resources
        </Fade>
        </h1>
          <h4 style={{ textAlign: "left" }}>
          Discover a wealth of information designed to help you understand
          <br/>
          and manage trichotillomania. Our curated articles, guides, and personal stories provide practical tips, expert advice, and emotional support to assist you on your journey.
            Dive into our resources to learn more about the condition, explore effective coping strategies, and connect with others who share similar experiences.
          </h4>
        </Row>
        <br/>
        <br/>
        <br/>
        <Row>
          <Col sm="6">
            <Link to="landing-page">
              <img
                alt="..."
                className="img-raised"
                src={require("assets/img/strandsmartlogo.png")}
              />
            </Link>
            
            <Button
              className="btn-simple btn-round"
              color="primary"
              to="landing-page"
              tag={Link}
            >
    
              See Articles
            </Button>
          </Col>
          <Col sm="6">
            <Link to="profile-page">
              <img
                alt="..."
                className="img-raised"
                src={require("assets/img/strandsmartlogo.png")}
              />
            </Link>
            <Button
              className="btn-simple btn-round"
              color="primary"
              to="profile-page"
              tag={Link}
            >
              See Blog
            </Button>
          </Col>
        </Row>
        <br />
      </Container>
    </div>
  );
}
