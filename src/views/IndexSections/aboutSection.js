import React from "react";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
import { motion } from "framer-motion";
import { Button, Container, Row, Col } from "reactstrap";
import { about } from "data/content";

// Shared motion config for card image/button entrance
const cardEntrance = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const About = () => (
  <div className="section section-basic" id="about">
    <img alt="" className="path" src={require("assets/img/path1.png")} />
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "100vh" }}
    >
      <Fade>
        <h1 className="title">{about.heading}</h1>
      </Fade>

      <Fade>
        <h3>
          <blockquote>
            "<strong>Strandsmart</strong>{" "}
            {about.quote.replace(/^Strandsmart\s+/, "")}
          </blockquote>
        </h3>
      </Fade>

      <Row>
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.12 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          >
            <Button
              className="btn-round"
              color="primary"
              href={about.primaryCta.href}
              style={{ borderRadius: "6px", fontWeight: 600 }}
            >
              {about.primaryCta.label}
            </Button>
          </motion.div>
        </Col>
      </Row>

      <div style={{ margin: "5rem 0 3rem" }}>
        <Fade>
          <h1 className="title">{about.resources.heading}</h1>
        </Fade>
        <Row className="align-items-center justify-content-center">
          <Col md="6">
            <h4 style={{ textAlign: "left" }}>
              <Fade>{about.resources.body}</Fade>
            </h4>
          </Col>
          <Col md="3" xs="6">
            <motion.img
              alt="Open hands"
              className="img-fluid rounded-circle shadow-lg"
              src={require("assets/img/openhands.png")}
              style={{ width: "150px" }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </Col>
        </Row>
      </div>

      <Row>
        {about.cards.map((card) => (
          <Col sm="6" key={card.id}>
            <motion.div
              {...cardEntrance}
              whileHover={{ scale: 0.95 }}
            >
              <Link to={card.linkTo}>
                <img
                  alt={card.alt}
                  className="img-raised"
                  src={require(`assets/img/${card.image}`)}
                />
              </Link>
            </motion.div>
            <motion.div
              {...cardEntrance}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.12 } }}
              whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
            >
              <Button
                className="btn-simple btn-round"
                color="primary"
                to={card.linkTo}
                tag={Link}
                style={{ borderRadius: "6px", fontWeight: 600 }}
              >
                {card.cta}
              </Button>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  </div>
);

export default About;
