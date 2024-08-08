/*!

=========================================================
* BLK Design System React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import classnames from "classnames";
import pfpstrsmart from 'assets/img/pfpstrsmart.png';
import LightSpeed from 'react-reveal/Fade';
import { ReactTyped } from "react-typed";
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Form,
  Input,
  FormText,
  NavItem,
  NavLink,
  Nav,
  Table,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  UncontrolledCarousel,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";

const carouselItems = [
  {
    src: require("assets/img/img_3115.jpg"),
    altText: "Slide 1",
    caption: "Coming Soon",
  },
  {
    src: require("assets/img/img_3115.jpg"),
    altText: "Slide 2",
    caption: "Coming",
  },
  {
    src: require("assets/img/img_3115.jpg"),
    altText: "Slide 3",
    caption: "Soon",
  },
];

let ps = null;

export default function AboutPage() {
  const [tabs, setTabs] = React.useState(1);
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("profile-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
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
          <img
            alt="..."
            className="dots"
            src={require("assets/img/dots.png")}
          />
          <img
            alt="..."
            className="path"
            src={require("assets/img/path4.png")}
          />
          <Container className="text-center">
          <Row className="justify-content-between align-items-center">
        <Col>
        <h1 style={{ fontSize: "6rem", fontWeight: 400, position: "relative" }}>
          <LightSpeed>
          <ReactTyped strings={["About StrandSmart"]} typeSpeed={300} />
          </LightSpeed>
          <animated.div
            style={{
              position: "absolute",
              bottom: "70%",
              left: 0,
              height: "8px",
              backgroundColor: "rgba(255, 0, 0, 0.9)",

            }}
          />
        </h1>
        <div style={{ fontSize: '1.5rem', marginTop: '10px', color: '#ffff' }}>
        Support and Community for Trichotillomania          </div>
        <p style={{ fontSize: '1rem', marginTop: '15px', color: '#ffff' }}>
        StrandSmart is dedicated to helping individuals navigate their journey with trichotillomania. 
        We provide resources, support, and a community where you can find understanding and encouragement.
          </p>
        </Col>
      </Row>
          </Container>
          <Container className="align-items-center" style={{ padding: '60px 20px' }}>
            <Row>
              <Col lg="6" md="6">
                <h1 className="profile-title text-left">Aadi Garg</h1>
                <h5 className="text-on-back">01</h5>
                <p className="profile-description">
                Walking through trichotillomania is a journey only a few can take. Unlike other paths, the journey is filled with an invisible enemy; your mental fortitude crumbles and 
                </p>
              </Col>
              <Col>
              <div style={{ fontSize: '2.2rem', marginLeft: '100px',
               marginTop: '40px', fontFamily: 'Poppins, sans-serif'}}>

                <b>The Creator's Story</b></div>
              <img
              src={pfpstrsmart} 
              alt="Profile" 
              style={{ 
                maxWidth: '375px', // Increase size as needed
                height: '375px', // Set fixed height for cropping effect
                objectFit: 'cover', // Crop the sides
                display: 'block', // Centering
                margin: '20px auto 0' // Centering
            }} 
            />
              </Col>
            </Row>
            <Row>
              <break/>
            </Row>
          </Container>
        </div>
        <div className="section">
          <Container>
            <Row className="justify-content-between">
              <Col md="6">
                <Row className="justify-content-between align-items-center">
                  <UncontrolledCarousel items={carouselItems} />
                </Row>
              </Col>
              <Col md="5">
                <h1 className="profile-title text-left">Projects</h1>
                <h5 className="text-on-back">02</h5>
                <p className="profile-description text-left">
                 Coming Soon
                </p>

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
                            <Input defaultValue="John" type="name" />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label>Email address</label>
                            <Input placeholder="strandsmart@example.com" type="email" />
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
                        data-placement="right"
                        id="tooltip341148792"
                        type="button"
                      >
                        Send Email
                      </Button>
                      <UncontrolledTooltip
                        delay={0}
                        placement="right"
                        target="tooltip341148792"
                      >
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
                      StrandSmart Team <br />
                      strandsmart@example.com <br />
                      Th - Sun, 8:00-22:00
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
}
