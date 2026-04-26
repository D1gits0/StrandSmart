import React, { useEffect } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import PageHeader from "components/PageHeader/PageHeader.js";
import Footer from "components/Footer/Footer.js";
import Boom from "views/IndexSections/boom.js";
import About from "views/IndexSections/aboutSection";
import More from "views/IndexSections/More.js";
import Signup from "views/IndexSections/Signup.js";

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
          <Signup />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
