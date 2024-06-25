import React from "react";
import classnames from "classnames";
// plugin that creates slider
import Slider from "nouislider";

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
          <h1 className="title">About Us</h1>
          <h3>
            <blockquote>"<strong>StrandSmart</strong> is dedicated to providing resources, support, and community for those dealing with <u>trichotillomania</u>. 
            Our mission is to <ins>normalize</ins> the condition and offer practical guidance for managing it."</blockquote>
  </h3>
        <Row>
          <Col>
          <Button className="btn-round" color="primary" type="button">
              Read Our Story
            </Button>
          </Col>
        </Row>
        <br />
      </Container>
    </div>
  );
}
