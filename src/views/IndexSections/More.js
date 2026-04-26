import React from "react";
import Fade from "react-reveal/Fade";
import { motion } from "framer-motion";
import { Button, Container, Row, Col } from "reactstrap";
import { community } from "data/content";
import LiveSupportFeed from "components/LiveSupportFeed/LiveSupportFeed";

const More = () => (
  <div className="section section-basic" id="community">
    <img alt="" className="path" src={require("assets/img/path2.png")} />
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "100vh" }}
    >
      <Fade>
        <h1 className="title">{community.heading}</h1>
      </Fade>

      <Fade>
        <h3>
          <blockquote>{community.quote}</blockquote>
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
            <a
              href={community.redditCta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="btn-round"
                color="primary"
                style={{ borderRadius: "6px", fontWeight: 600 }}
              >
                <i className="fab fa-reddit" style={{ marginRight: "6px" }} />
                {community.redditCta.label}
              </Button>
            </a>
          </motion.div>
        </Col>
      </Row>

      <div style={{ margin: "5rem 0 2rem" }}>
        <Fade>
          <h1 className="title">{community.getInvolved.heading}</h1>
        </Fade>
        <Row>
          <Col>
            <h3>
              <Fade>{community.getInvolved.body}</Fade>
            </h3>
          </Col>
        </Row>
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
                href={community.getInvolved.cta.href}
                style={{ borderRadius: "6px", fontWeight: 600 }}
              >
                {community.getInvolved.cta.label}
              </Button>
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* ── Live Support Feed ── */}
      <div style={{ width: "100%", textAlign: "left" }}>
        <Fade>
          <LiveSupportFeed />
        </Fade>
      </div>

    </Container>
  </div>
);

export default More;
