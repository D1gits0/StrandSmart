import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";
import AuthCard from "components/AuthCard/AuthCard.js";
import useParallaxSquares from "hooks/useParallaxSquares.js";
import { auth } from "firebaseConfig";
import { loginPage } from "data/content";

const SQUARE_IDS_LARGE = [1, 2, 3, 4, 5, 6];

const LoginPage = () => {
  const navigate = useNavigate();
  const { squaresLarge, squaresSmall } = useParallaxSquares();

  const [emailFocus,    setEmailFocus]    = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("login-page");
    return () => document.body.classList.toggle("login-page");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(friendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const { form } = loginPage;

  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <div className="square square-7" id="square7" style={{ transform: squaresSmall }} />
                  <div className="square square-8" id="square8" style={{ transform: squaresSmall }} />

                  <AuthCard
                    title={form.title}
                    submitLabel={loading ? "Signing in…" : form.submitLabel}
                    onSubmit={handleSubmit}
                    linkPrompt={form.registerPrompt}
                    linkLabel={form.registerLabel}
                    linkTo={form.registerHref}
                  >
                    <Form onSubmit={handleSubmit}>
                      {/* Email */}
                      <InputGroup className={classnames({ "input-group-focus": emailFocus })}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText style={{ borderRadius: "6px 0 0 6px" }}>
                            <i className="tim-icons icon-email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder={form.fields.email.placeholder}
                          type={form.fields.email.type}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setEmailFocus(true)}
                          onBlur={() => setEmailFocus(false)}
                          style={{ borderRadius: "0 6px 6px 0" }}
                          required
                        />
                      </InputGroup>

                      {/* Password */}
                      <InputGroup className={classnames({ "input-group-focus": passwordFocus })}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText style={{ borderRadius: "6px 0 0 6px" }}>
                            <i className="tim-icons icon-lock-circle" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder={form.fields.password.placeholder}
                          type={form.fields.password.type}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setPasswordFocus(true)}
                          onBlur={() => setPasswordFocus(false)}
                          style={{ borderRadius: "0 6px 6px 0" }}
                          required
                        />
                      </InputGroup>

                      {submitError && (
                        <p className="text-danger mt-2" style={{ fontSize: "0.85rem" }}>
                          {submitError}
                        </p>
                      )}
                    </Form>
                  </AuthCard>
                </Col>
              </Row>

              <div className="register-bg" />
              {SQUARE_IDS_LARGE.map((n) => (
                <div
                  key={n}
                  className={`square square-${n}`}
                  id={`square${n}`}
                  style={{ transform: squaresLarge }}
                />
              ))}
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

/** Converts Firebase error codes into user-friendly messages. */
const friendlyAuthError = (code) => {
  const map = {
    "auth/user-not-found":         "No account found with this email.",
    "auth/wrong-password":         "Incorrect password. Please try again.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/invalid-credential":     "Invalid email or password.",
    "auth/user-disabled":          "This account has been disabled.",
    "auth/too-many-requests":      "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your connection.",
  };
  return map[code] || "Sign in failed. Please try again.";
};

export default LoginPage;
