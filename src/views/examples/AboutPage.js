import React, { useEffect, useRef } from "react";
import pfpstrsmart from "assets/img/pfpstrsmart.png";
import Fade from "react-reveal/Fade";
import { ReactTyped } from "react-typed";
import PerfectScrollbar from "perfect-scrollbar";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  UncontrolledCarousel,
} from "reactstrap";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";

const CAROUSEL_ITEMS = [
  { src: require("assets/img/img_3115.jpg"), altText: "Slide 1", caption: "Coming Soon" },
  { src: require("assets/img/img_3115.jpg"), altText: "Slide 2", caption: "Coming" },
  { src: require("assets/img/img_3115.jpg"), altText: "Slide 3", caption: "Soon" },
];

const AboutPage = () => {
  const psRef = useRef(null);

  useEffect(() => {
    const isWindows = navigator.platform.indexOf("Win") > -1;
    if (isWindows) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      document.documentElement.classList.remove("perfect-scrollbar-off");
      const tables = document.querySelectorAll(".table-responsive");
      tables.forEach((table) => {
        psRef.current = new PerfectScrollbar(table);
      });
    }
    document.body.classList.toggle("profile-page");

    return () => {
      if (isWindows && psRef.current) {
        psRef.current.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("profile-page");
    };
  }, []);

  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper">
        <div className="page-header">
          <img alt="" className="dots" src={require("assets/img/dots.png")} />
          <img alt="" className="path" src={require("assets/img/path4.png")} />

          <Container className="text-center">
            <Row className="justify-content-between align-items-center">
              <Col>
                <h1 style={{ fontSize: "6rem", fontWeight: 400, position: "relative" }}>
                  <Fade>
                    <ReactTyped strings={["About Strandsmart"]} typeSpeed={300} />
                  </Fade>
                </h1>
                <div style={{ fontSize: "1.5rem", marginTop: "10px", color: "#fff" }}>
                  Support and Community for Trichotillomania
                </div>
                <p style={{ fontSize: "1rem", marginTop: "15px", color: "#fff" }}>
                  Strandsmart is dedicated to helping individuals navigate their journey with
                  trichotillomania. We provide resources, support, and a community where you
                  can find understanding and encouragement.
                </p>
              </Col>
            </Row>
          </Container>

          <Container style={{ padding: "60px 20px" }}>
            <Row>
              <Col lg="6" md="6">
                <h1 className="profile-title text-left">Aadi Garg</h1>
                <h5 className="text-on-back">01</h5>
                <p className="profile-description">
                  Walking through trichotillomania is a journey only a few can take. Unlike
                  other paths, the journey is filled with an invisible enemy; your mental
                  fortitude crumbles and
                </p>
              </Col>
              <Col>
                <div
                  style={{
                    fontSize: "2.2rem",
                    marginLeft: "100px",
                    marginTop: "40px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <b>The Creator's Story</b>
                </div>
                <img
                  src={pfpstrsmart}
                  alt="Aadi Garg — Strandsmart founder"
                  style={{
                    maxWidth: "375px",
                    height: "375px",
                    objectFit: "cover",
                    display: "block",
                    margin: "20px auto 0",
                  }}
                />
              </Col>
            </Row>
          </Container>
        </div>

        <div className="section">
          <Container>
            <Row className="justify-content-between">
              <Col md="6">
                <Row className="justify-content-between align-items-center">
                  <UncontrolledCarousel items={CAROUSEL_ITEMS} />
                </Row>
              </Col>
              <Col md="5">
                <h1 className="profile-title text-left">Projects</h1>
                <h5 className="text-on-back">02</h5>
                <p className="profile-description text-left">Coming Soon</p>
              </Col>
            </Row>
          </Container>
        </div>

        <section className="section">
          <Container>
            <Row>
              <Col md="6">
                <Card className="card-plain">
                  <CardHeader>
                    <h1 className="profile-title text-left">Contact</h1>
                    <h5 className="text-on-back">03</h5>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label>Your Name</label>
                            <Input type="text" placeholder="Your name" />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label>Email address</label>
                            <Input placeholder="hello@strandsmart.com" type="email" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Message</label>
                            <Input placeholder="Hello there!" type="text" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button
                        className="btn-round float-right"
                        color="primary"
                        id="contact-submit-btn"
                        type="button"
                        style={{ borderRadius: "6px", fontWeight: 600 }}
                      >
                        Send Email
                      </Button>
                      <UncontrolledTooltip delay={0} placement="right" target="contact-submit-btn">
                        Can't wait for your message
                      </UncontrolledTooltip>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              <Col className="ml-auto" md="4">
                <div className="info info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-mobile" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Email Us</h4>
                    <p>
                      Strandsmart Team <br />
                      hello@strandsmart.com <br />
                      Thu – Sun, 8:00–22:00
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
