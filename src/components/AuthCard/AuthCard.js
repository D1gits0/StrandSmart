import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
} from "reactstrap";

/**
 * Shared card shell for Register and Login pages.
 *
 * Props:
 *   title        — card heading (string)
 *   submitLabel  — primary button text (string)
 *   onSubmit     — form submit handler (function)
 *   linkPrompt   — text before the cross-link, e.g. "Already have an account?" (string)
 *   linkLabel    — cross-link anchor text, e.g. "Sign In" (string)
 *   linkTo       — react-router path for the cross-link (string)
 *   children     — form fields rendered inside CardBody
 */
const AuthCard = ({
  title,
  submitLabel,
  onSubmit,
  linkPrompt,
  linkLabel,
  linkTo,
  children,
}) => (
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
      <CardTitle tag="h4">{title}</CardTitle>
    </CardHeader>

    <CardBody>{children}</CardBody>

    <CardFooter>
      <motion.div
        whileHover={{ scale: 1.04, transition: { duration: 0.12 } }}
        whileTap={{ scale: 0.96, transition: { duration: 0.08 } }}
      >
        <Button
          className="btn-round"
          color="primary"
          size="lg"
          onClick={onSubmit}
          style={{
            borderRadius: "6px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            boxShadow: "0 4px 14px rgba(0,200,100,0.3)",
          }}
        >
          {submitLabel}
        </Button>
      </motion.div>
      {linkPrompt && linkLabel && linkTo && (
        <p className="text-muted mt-3" style={{ fontSize: "0.85rem" }}>
          {linkPrompt}{" "}
          <Link
            to={linkTo}
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            {linkLabel}
          </Link>
        </p>
      )}
    </CardFooter>
  </Card>
);

export default AuthCard;
