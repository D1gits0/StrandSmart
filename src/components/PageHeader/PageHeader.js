import React from "react";
import Bounce from "react-reveal/Fade";
import { motion } from "framer-motion";
import { Button, Row, Col, Container } from "reactstrap";
import { hero } from "data/content";

const PageHeader = () => (
  <div className="page-header header-filter">
    <div className="squares square1" />
    <div className="squares square2" />
    <div className="squares square3" />
    <div className="squares square4" />
    <div className="squares square5" />
    <div className="squares square6" />
    <div className="squares square7" />
    <Container>
      <div className="content-center brand">
        <Row>
          <Col>
            <Bounce>
              <h1
                className="h1-seo"
                style={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                {hero.heading}
              </h1>
            </Bounce>
          </Col>
        </Row>
        <Row>
          <Col>
            <Bounce>
              <h3
                className="d-none d-sm-block"
                style={{
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  opacity: 0.85,
                  marginBottom: "2rem",
                }}
              >
                {hero.subtext}
              </h3>
            </Bounce>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="btn-round"
              color="primary"
              href={hero.primaryCta.href}
              style={{
                borderRadius: "6px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                padding: "0.65rem 2rem",
                boxShadow: "0 6px 20px rgba(0,200,100,0.35)",
              }}
            >
              {hero.primaryCta.label}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="btn-simple btn-round"
              color="primary"
              href={hero.secondaryCta.href}
              style={{
                borderRadius: "6px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                padding: "0.65rem 2rem",
              }}
            >
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </div>
    </Container>
  </div>
);

export default PageHeader;
