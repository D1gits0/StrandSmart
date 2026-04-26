import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
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
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";

const CAROUSEL_ITEMS = [
  { src: require("assets/img/denys.jpg"), altText: "Slide 1", caption: "Big City Life, United States" },
  { src: require("assets/img/fabien-bazanegue.jpg"), altText: "Slide 2", caption: "Somewhere Beyond, United States" },
  { src: require("assets/img/mark-finn.jpg"), altText: "Slide 3", caption: "Stocks, United States" },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(1);
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

  const handleTabClick = (e, tabIndex) => {
    e.preventDefault();
    setActiveTab(tabIndex);
  };

  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper">
        <div className="page-header">
          <img alt="" className="dots" src={require("assets/img/dots.png")} />
          <img alt="" className="path" src={require("assets/img/path4.png")} />

          <Container className="align-items-center">
            <Row>
              <Col lg="6" md="6">
                <h1 className="profile-title text-left">Mike Schneider</h1>
                <h5 className="text-on-back">01</h5>
                <p className="profile-description">
                  Offices parties lasting outward nothing age few resolve. Impression to
                  discretion understood to we interested he excellence. Him remarkably use
                  projection collecting. Going about eat forty world has round miles.
                </p>
              </Col>

              <Col className="ml-auto mr-auto" lg="4" md="6">
                <Card className="card-coin card-plain">
                  <CardHeader>
                    <img
                      alt="Mike Schneider"
                      className="img-center img-fluid rounded-circle"
                      src={require("assets/img/mike.jpg")}
                    />
                    <h4 className="title">Transactions</h4>
                  </CardHeader>
                  <CardBody>
                    <Nav className="nav-tabs-primary justify-content-center" tabs>
                      {[
                        { index: 1, label: "Wallet" },
                        { index: 2, label: "Send" },
                        { index: 3, label: "News" },
                      ].map(({ index, label }) => (
                        <NavItem key={index}>
                          <NavLink
                            className={classnames({ active: activeTab === index })}
                            onClick={(e) => handleTabClick(e, index)}
                            href="#"
                          >
                            {label}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>

                    <TabContent className="tab-subcategories" activeTab={`tab${activeTab}`}>
                      <TabPane tabId="tab1">
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                            <tr>
                              <th>COIN</th>
                              <th>AMOUNT</th>
                              <th>VALUE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>BTC</td><td>7.342</td><td>48,870.75 USD</td></tr>
                            <tr><td>ETH</td><td>30.737</td><td>6,453.30 USD</td></tr>
                            <tr><td>XRP</td><td>19.242</td><td>18,354.96 USD</td></tr>
                          </tbody>
                        </Table>
                      </TabPane>

                      <TabPane tabId="tab2">
                        <Row>
                          <Col sm="3"><label>Pay to</label></Col>
                          <Col sm="9">
                            <FormGroup>
                              <Input placeholder="e.g. 1Nasd92348hU984353hfid" type="text" />
                              <FormText color="default" tag="span">
                                Please enter a valid address.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="3"><label>Amount</label></Col>
                          <Col sm="9">
                            <FormGroup>
                              <Input placeholder="1.587" type="text" />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button
                          className="btn-simple btn-icon btn-round float-right"
                          color="primary"
                          type="submit"
                        >
                          <i className="tim-icons icon-send" />
                        </Button>
                      </TabPane>

                      <TabPane tabId="tab3">
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                            <tr><th>Latest Crypto News</th></tr>
                          </thead>
                          <tbody>
                            <tr><td>The Daily: Nexo to Pay on Stable...</td></tr>
                            <tr><td>Venezuela Begins Public of Nation...</td></tr>
                            <tr><td>PR: BitCanna – Dutch Blockchain...</td></tr>
                          </tbody>
                        </Table>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
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
                <p className="profile-description text-left">
                  An artist of considerable range, Ryan — the name taken by Melbourne-raised,
                  Brooklyn-based Nick Murphy — writes, performs and records all of his own
                  music, giving it a warm, intimate feel with a solid groove structure.
                </p>
                <div className="btn-wrapper pt-3">
                  <Button className="btn-simple" color="primary" href="#">
                    <i className="tim-icons icon-book-bookmark" /> Bookmark
                  </Button>
                  <Button className="btn-simple" color="info" href="#">
                    <i className="tim-icons icon-bulb-63" /> Check it!
                  </Button>
                </div>
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
                            <Input placeholder="hello@example.com" type="email" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label>Phone</label>
                            <Input type="text" placeholder="+1 000 000 0000" />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label>Company</label>
                            <Input type="text" placeholder="Your company" />
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
                        id="profile-contact-btn"
                        type="button"
                        style={{ borderRadius: "6px", fontWeight: 600 }}
                      >
                        Send Message
                      </Button>
                      <UncontrolledTooltip delay={0} placement="right" target="profile-contact-btn">
                        Can't wait for your message
                      </UncontrolledTooltip>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              <Col className="ml-auto" md="4">
                <div className="info info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-square-pin" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Find us at the office</h4>
                    <p>
                      Bld Mihail Kogalniceanu, nr. 8 <br />
                      7652 Bucharest, Romania
                    </p>
                  </div>
                </div>
                <div className="info info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-mobile" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Give us a ring</h4>
                    <p>
                      Michael Jordan <br />
                      +40 762 321 762 <br />
                      Mon – Fri, 8:00–22:00
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

export default ProfilePage;
