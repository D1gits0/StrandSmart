import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useAuth } from "context/AuthContext";

const IndexNavbar = () => {
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

  // Brand routes to dashboard when logged in, home when not
  const brandTo = currentUser ? "/dashboard" : "/";

  return (
    <Navbar
      className={`fixed-top ${navColor}`}
      expand="lg"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <Container>
        <div className="navbar-translate">
          <NavbarBrand tag={Link} to={brandTo} id="navbar-brand">
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
                <Link to={brandTo}>Strandsmart</Link>
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
            <UncontrolledDropdown nav>
              <DropdownToggle
                caret
                color="default"
                data-toggle="dropdown"
                nav
                onClick={(e) => e.preventDefault()}
              >
                <i className="fa fa-cogs d-lg-none d-xl-none" />
                Explore
              </DropdownToggle>
              <DropdownMenu className="dropdown-with-icons">
                <DropdownItem tag={Link} to="/about-page">
                  <i className="fas fa-users" />
                  About
                </DropdownItem>
                <DropdownItem tag={Link} to="/resources">
                  <i className="fas fa-folder-open" />
                  Resources
                </DropdownItem>
                <DropdownItem tag={Link} to="/learn-more">
                  <i className="fas fa-book-open" />
                  Learn More
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <NavItem>
              {currentUser ? (
                <Button
                  className="nav-link d-none d-lg-block"
                  color="primary"
                  tag={Link}
                  to="/dashboard"
                  style={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    transition: "all 0.18s ease",
                    boxShadow: "0 4px 14px rgba(0,200,100,0.25)",
                  }}
                >
                  <i className="tim-icons icon-chart-pie-36" style={{ marginRight: 5 }} />
                  Dashboard
                </Button>
              ) : (
                <Button
                  className="nav-link d-none d-lg-block"
                  color="primary"
                  tag={Link}
                  to="/register-page"
                  style={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    transition: "all 0.18s ease",
                    boxShadow: "0 4px 14px rgba(0,200,100,0.25)",
                  }}
                >
                  <i className="fas fa-user-plus" style={{ marginRight: 5 }} /> Sign Up
                </Button>
              )}
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default IndexNavbar;
