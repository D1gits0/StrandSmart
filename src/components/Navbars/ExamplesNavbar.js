import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useAuth } from "context/AuthContext";

const ExamplesNavbar = () => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [collapseOut, setCollapseOut]   = useState("");
  const [navColor, setNavColor]         = useState("navbar-transparent");
  const { currentUser }                 = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled =
        document.documentElement.scrollTop > 99 ||
        document.body.scrollTop > 99;
      setNavColor(scrolled ? "bg-info" : "navbar-transparent");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen((prev) => !prev);
  };

  return (
    <Navbar className={`fixed-top ${navColor}`} expand="lg">
      <Container>
        <div className="navbar-translate">
          {/* tag={Link} + to="/" — client-side navigation, no page refresh */}
          <NavbarBrand tag={Link} to="/" id="navbar-brand">
            <span>Strandsmart</span>
          </NavbarBrand>
          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>

        <Collapse
          className={`justify-content-end ${collapseOut}`}
          navbar
          isOpen={collapseOpen}
          onExiting={() => setCollapseOut("collapsing-out")}
          onExited={() => setCollapseOut("")}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <Link to="/">Strandsmart</Link>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>

          <Nav navbar>
            <NavItem>
              <NavLink tag={Link} to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/about-page">
                About
              </NavLink>
            </NavItem>
            <NavItem>
              {currentUser ? (
                <NavLink tag={Link} to="/dashboard">
                  Dashboard
                </NavLink>
              ) : (
                <NavLink tag={Link} to="/login-page">
                  Sign In
                </NavLink>
              )}
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default ExamplesNavbar;
