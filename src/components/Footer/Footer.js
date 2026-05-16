import React from "react";
import { Link } from "react-router-dom";
import {
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <Container>
        <Row className="align-items-start">
          <Col md="3" className="mb-4 mb-md-0">
            <h4
              className="title"
              style={{
                fontWeight: 700,
                letterSpacing: "0.06em",
                fontSize: "1.1rem",
              }}
            >
              Strandsmart
            </h4>
            <p
              className="text-muted"
              style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}
            >
              Your Vision, Unified.
            </p>
          </Col>
          <Col md="3" className="mb-4 mb-md-0">
            <h6
              className="text-uppercase font-weight-bold mb-3"
              style={{ letterSpacing: "0.1em", fontSize: "0.75rem", opacity: 0.6 }}
            >
              Navigation
            </h6>
            <Nav className="flex-column">
              <NavItem>
                <NavLink to="/" tag={Link}>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/about-page" tag={Link}>
                  About
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/register-page" tag={Link}>
                  Resources
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md="3" className="mb-4 mb-md-0">
            <h6
              className="text-uppercase font-weight-bold mb-3"
              style={{ letterSpacing: "0.1em", fontSize: "0.75rem", opacity: 0.6 }}
            >
              Company
            </h6>
            <Nav className="flex-column">
              <NavItem>
                <NavLink href="/about-page">About Us</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="mailto:hello@strandsmart.com">Contact</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
                  License
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md="3">
            <h6
              className="text-uppercase font-weight-bold mb-3"
              style={{ letterSpacing: "0.1em", fontSize: "0.75rem", opacity: 0.6 }}
            >
              Legal
            </h6>
            <Nav className="flex-column mb-2">
              <NavItem>
                <NavLink tag={Link} to="/privacy">Privacy Policy</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/terms">Terms of Service</NavLink>
              </NavItem>
            </Nav>
            <p className="text-muted" style={{ fontSize: "0.82rem" }}>
              © {new Date().getFullYear()} Strandsmart. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
