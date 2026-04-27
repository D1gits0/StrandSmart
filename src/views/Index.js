import React, { useEffect } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import PageHeader from "components/PageHeader/PageHeader.js";
import Footer from "components/Footer/Footer.js";
import Boom from "views/IndexSections/boom.js";
import About from "views/IndexSections/aboutSection";
import More from "views/IndexSections/More.js";

const DISCLAIMER = "StrandSmart is a peer-support tool. Not a substitute for professional medical advice.";

const Index = () => {
  useEffect(() => {
    document.body.classList.toggle("index-page");
    return () => document.body.classList.toggle("index-page");
  }, []);

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <PageHeader />
        <div className="main">
          <Boom />
          <About />
          <More />
        </div>
        {/* Disclaimer replaces the Signup section */}
        <p style={{
          textAlign: "center",
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.3)",
          padding: "1.5rem 1rem",
          margin: 0,
        }}>
          {DISCLAIMER}
        </p>
        <Footer />
      </div>
    </>
  );
};

export default Index;
