import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Label,
  FormGroup,
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
import { auth, db } from "firebaseConfig";
import { registerPage } from "data/content";
import { EMAIL_REGEX } from "utils/emailValidation";

const SQUARE_IDS_LARGE = [1, 2, 3, 4, 5, 6];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { squaresLarge, squaresSmall } = useParallaxSquares();

  const [fullNameFocus, setFullNameFocus] = useState(false);
  const [emailFocus,    setEmailFocus]    = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [fullName,    setFullName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [agreed,      setAgreed]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [emailError,  setEmailError]  = useState(null);
  const [termsError,  setTermsError]  = useState(null);

  useEffect(() => {
    document.body.classList.toggle("register-page");
    return () => document.body.classList.toggle("register-page");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setEmailError(null);
    setTermsError(null);

    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!agreed) {
      setTermsError("Please agree to the Terms of Service to continue.");
      return;
    }

    if (password.length < 6) {
      setSubmitError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create the Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Set the display name on the Auth profile
      await updateProfile(user, { displayName: fullName });

      // 3. Create a Firestore user document for future data storage
      await setDoc(doc(db, "users", user.uid), {
        uid:         user.uid,
        displayName: fullName,
        email:       user.email,
        createdAt:   serverTimestamp(),
      });

      // 4. Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(friendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const { form } = registerPage;

  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper">
        <div className="page-header">
          <div className="page-header-image" style={{ background: "#0d2b1a" }} />
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <div className="square square-7" id="square7" style={{ transform: squaresSmall }} />
                  <div className="square square-8" id="square8" style={{ transform: squaresSmall }} />

                  <AuthCard
                    title={form.title}
                    submitLabel={loading ? "Creating account…" : form.submitLabel}
                    onSubmit={handleSubmit}
                    linkPrompt={form.loginPrompt}
                    linkLabel={form.loginLabel}
                    linkTo={form.loginHref}
                  >
                    <Form onSubmit={handleSubmit}>
                      {/* Full Name */}
                      <InputGroup className={classnames({ "input-group-focus": fullNameFocus })}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText style={{ borderRadius: "6px 0 0 6px" }}>
                            <i className="tim-icons icon-single-02" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder={form.fields.fullName.placeholder}
                          type={form.fields.fullName.type}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onFocus={() => setFullNameFocus(true)}
                          onBlur={() => setFullNameFocus(false)}
                          style={{ borderRadius: "0 6px 6px 0" }}
                          required
                        />
                      </InputGroup>

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
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError && EMAIL_REGEX.test(e.target.value)) {
                              setEmailError(null);
                            }
                          }}
                          onFocus={() => setEmailFocus(true)}
                          onBlur={() => setEmailFocus(false)}
                          style={{ borderRadius: "0 6px 6px 0" }}
                          required
                        />
                      </InputGroup>
                      {emailError && (
                        <p className="text-danger mt-1 mb-2" style={{ fontSize: "0.85rem" }}>
                          {emailError}
                        </p>
                      )}

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

                      {/* Terms */}
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => {
                              setAgreed(e.target.checked);
                              if (termsError && e.target.checked) {
                                setTermsError(null);
                              }
                            }}
                          />
                          <span className="form-check-sign" />
                          I agree to the <Link to="/terms">Terms of Service</Link>
                        </Label>
                      </FormGroup>
                      {termsError && (
                        <p className="text-danger mt-1 mb-2" style={{ fontSize: "0.85rem" }}>
                          {termsError}
                        </p>
                      )}

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
    "auth/email-already-in-use":    "An account with this email already exists.",
    "auth/invalid-email":           "Please enter a valid email address.",
    "auth/weak-password":           "Password must be at least 6 characters.",
    "auth/network-request-failed":  "Network error. Please check your connection.",
    "auth/too-many-requests":       "Too many attempts. Please try again later.",
  };
  return map[code] || "Registration failed. Please try again.";
};

export default RegisterPage;
