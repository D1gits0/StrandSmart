import React, { useState } from "react";
import classnames from "classnames";
import Fade from "react-reveal/Fade";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { signup } from "data/content";

const Signup = () => {
  const [fullNameFocus, setFullNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      // TODO: replace with API call, e.g.:
      // await api.subscribe({ fullName, email });
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="section section-signup">
      <Container>
        <div className="squares square-1" />
        <div className="squares square-2" />
        <div className="squares square-3" />
        <div className="squares square-4" />
        <Row className="row-grid justify-content-between align-items-center">
          <Col lg="6">
            <h3 className="display-3 text-white">
              <Fade>{signup.heading}</Fade>
            </h3>
            <p className="text-white mb-3">
              <Fade>{signup.body}</Fade>
            </p>
          </Col>

          <Col className="mb-lg-auto" lg="6">
            <Card
              className="card-register"
              style={{ borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.45)" }}
            >
              <CardHeader>
                <CardImg
                  alt="Strandsmart"
                  src={require("assets/img/green-square-background.jpg")}
                  style={{ marginTop: "-25px", borderRadius: "8px 8px 0 0" }}
                />
                <CardTitle tag="h4">{signup.form.title}</CardTitle>
              </CardHeader>

              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <InputGroup className={classnames({ "input-group-focus": fullNameFocus })}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText style={{ borderRadius: "6px 0 0 6px" }}>
                        <i className="tim-icons icon-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder={signup.form.fields.fullName.placeholder}
                      type={signup.form.fields.fullName.type}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFullNameFocus(true)}
                      onBlur={() => setFullNameFocus(false)}
                      style={{ borderRadius: "0 6px 6px 0" }}
                    />
                  </InputGroup>

                  <InputGroup className={classnames({ "input-group-focus": emailFocus })}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText style={{ borderRadius: "6px 0 0 6px" }}>
                        <i className="tim-icons icon-email-85" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder={signup.form.fields.email.placeholder}
                      type={signup.form.fields.email.type}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      style={{ borderRadius: "0 6px 6px 0" }}
                    />
                  </InputGroup>

                  {submitError && (
                    <p className="text-danger mt-2" style={{ fontSize: "0.85rem" }}>
                      {submitError}
                    </p>
                  )}
                </Form>
              </CardBody>

              <CardFooter>
                <motion.div
                  whileHover={{ scale: 1.04, transition: { duration: 0.12 } }}
                  whileTap={{ scale: 0.96, transition: { duration: 0.08 } }}
                >
                  <Button
                    className="btn-round"
                    color="primary"
                    size="lg"
                    onClick={handleSubmit}
                    style={{
                      borderRadius: "6px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      boxShadow: "0 4px 14px rgba(0,200,100,0.3)",
                    }}
                  >
                    {signup.form.submitLabel}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
