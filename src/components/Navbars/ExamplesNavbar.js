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
import { useAuth }    from "context/AuthContext";
import { usePrivacy } from "context/PrivacyContext";

const ExamplesNavbar = () => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [collapseOut, setCollapseOut]   = useState("");
  const [navColor, setNavColor]         = useState("navbar-transparent");
  const { currentUser }                 = useAuth();
  const { discreetMode, toggleDiscreetMode, label } = usePrivacy();

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

  const brandTo = currentUser ? "/dashboard" : "/";

  return (
    <Navbar className={`fixed-top ${navColor}`} expand="lg">
      <Container>
        <div className="navbar-translate">
          <NavbarBrand tag={Link} to={brandTo} id="navbar-brand">
            <span>{label("Strandsmart")}</span>
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
                <Link to={brandTo}>{label("Strandsmart")}</Link>
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
              <NavLink tag={Link} to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/about-page">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/resources">Resources</NavLink>
            </NavItem>
            <NavItem>
              {currentUser ? (
                <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
              ) : (
                <NavLink tag={Link} to="/login-page">Sign In</NavLink>
              )}
            </NavItem>

            {/* ── Discreet Mode toggle ── */}
            <NavItem>
              <button
                onClick={toggleDiscreetMode}
                title={discreetMode ? "Discreet Mode ON — click to disable" : "Enable Discreet Mode"}
                style={{
                  background:   discreetMode
                    ? "rgba(74,144,217,0.15)"
                    : "rgba(0,200,100,0.08)",
                  border:       discreetMode
                    ? "1px solid rgba(74,144,217,0.4)"
                    : "1px solid rgba(0,200,100,0.25)",
                  borderRadius: "6px",
                  color:        discreetMode ? "#4a90d9" : "rgba(255,255,255,0.6)",
                  cursor:       "pointer",
                  fontSize:     "0.72rem",
                  fontWeight:   600,
                  letterSpacing: "0.05em",
                  padding:      "0.3rem 0.7rem",
                  margin:       "0.25rem 0 0.25rem 0.5rem",
                  transition:   "all 0.2s ease",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "0.35rem",
                  whiteSpace:   "nowrap",
                }}
              >
                <i className={`tim-icons ${discreetMode ? "icon-lock-circle" : "icon-eye"}`}
                  style={{ fontSize: "0.75rem" }} />
                {discreetMode ? "Discreet ON" : "Discreet"}
              </button>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default ExamplesNavbar;
