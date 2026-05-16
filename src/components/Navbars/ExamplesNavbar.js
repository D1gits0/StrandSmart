import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [scrolled, setScrolled]         = useState(false);
  const { currentUser }                 = useAuth();
  const { discreetMode, toggleDiscreetMode, label } = usePrivacy();
  const location                        = useLocation();

  // On the Dashboard page, always use solid background (Requirement 11.1, 11.2)
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        document.documentElement.scrollTop > 99 ||
        document.body.scrollTop > 99
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply solid bg-info immediately on dashboard; otherwise use scroll threshold
  const navColor = (isDashboard || scrolled) ? "bg-info" : "navbar-transparent";

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
                aria-label="Toggle discreet mode"
                title={discreetMode ? "Discreet Mode ON — click to disable" : "Enable Discreet Mode"}
                style={{
                  background:   discreetMode
                    ? "rgba(74,144,217,0.15)"
                    : "transparent",
                  border:       discreetMode
                    ? "1px solid rgba(74,144,217,0.4)"
                    : "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  color:        discreetMode ? "#4a90d9" : "rgba(255,255,255,0.6)",
                  cursor:       "pointer",
                  fontSize:     "1rem",
                  padding:      "0.3rem 0.55rem",
                  margin:       "0.25rem 0 0.25rem 0.5rem",
                  transition:   "all 0.2s ease",
                  display:      "flex",
                  alignItems:   "center",
                  lineHeight:   1,
                }}
              >
                <i className={discreetMode ? "fas fa-arrow-up-from-bracket" : "far fa-arrow-up-from-bracket"} />
              </button>
            </NavItem>

            {/* ── Settings link (authenticated users only) ── */}
            {currentUser && (
              <NavItem>
                <NavLink tag={Link} to="/settings" title="Settings">
                  <i className="tim-icons icon-settings" />
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default ExamplesNavbar;
