/*!

=========================================================
* BLK Design System React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import Bounce from 'react-reveal/Fade';
import { motion } from "framer-motion"; 

import {
  Button,
  Row,
  Col,
} from "reactstrap";

// reactstrap components
import { Container } from "reactstrap";

export default function PageHeader() {
  return (
    <div className="page-header header-filter">
      <div className="squares square1" />
      <div className="squares square2" />
      <div className="squares square3" />
      <div className="squares square4" />
      <div className="squares square5" />
      <div className="squares square6" />
      <div className="squares square7" />
      <Container>
        <div className="content-center brand">
          <Row>
            <Col>
          <h1 className="h1-seo">
            <Bounce>
            StrandSmart
            </Bounce>
            </h1>
            </Col>
            </Row>
            <Row>
              <Col>
          <h3 className="d-none d-sm-block">
            <Bounce>
          Your Guide To Understanding And Managing Trichotillomania Together
          </Bounce>
          </h3>
          </Col>
          </Row>          
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button className="btn-round" color="primary" type="button">
          Join Us
        </Button>
      </motion.div>
     
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button className="btn-simple btn-round" color="primary" type="button">
          Learn More
        </Button>
      </motion.div>
  
        </div>
      </Container>
    </div>
  );
}
