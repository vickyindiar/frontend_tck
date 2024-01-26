// ALL IN THIS FOLDER ARE CLIENT SIDE VIEW
// CLIENT AUTHENTICATON
// CLIENT TICKET PAGE
// :URL/{page}


import React, { useState, useRef, useEffect, useCallback } from 'react'
import {Row, Col, Card, Container, Button}  from 'reactstrap'
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import fd_wm_home from '../../assets/images/homepage/fd_women_call.png';
import {useSelector, useDispatch} from 'react-redux'
import {onSearchValueChange} from 'store/actions'
import isEmpty from 'helpers/isEmpty_helper'
import HomeSearchList from './HomeSearchList'

function index() {
  const dispatch = useDispatch()
  const searchValue = useSelector(state => state.homeClient.searchValue)
  const onValueSearch = (e) => {
    dispatch(onSearchValueChange(e.target.value))
  }
  
  const scrollDown = useCallback( (e) => {
        let el = document.getElementById("client-index-search-container");
        if(el) el.scrollIntoView({ behavior: "smooth" });
  },[]);
  const scrollUp = useCallback( (e) => {
        let el = document.getElementById("root");
        if(el) el.scrollIntoView({ behavior: "smooth" });
  },[]);

  useEffect(() => {
    if(!isEmpty(searchValue)){
      const timeOutId = setTimeout(() =>{ scrollDown() }, 500);
      let el = document.getElementById("home-big-search")
      if(!isEmpty(el)) el.focus();
      return () => clearTimeout(timeOutId);
    }
    else
    {
      const timeOutId = setTimeout(() =>{ scrollUp() } , 500);
      let el = document.getElementById("home-small-search")
      if(!isEmpty(el)) el.focus();
      return () => clearTimeout(timeOutId);
    }
  }, [searchValue])
    return (

    <React.Fragment>
      <div>
        <MetaTags>
          <title>Home | Ticketing</title>
        </MetaTags>
  
        
        <Container fluid className="container-client-home">
          <section id='home-top-section' style={{height:'90vh'}}>
          <Row className="mb-4">
               <Col>
                <Row className="mb-2">
                    <Col>
                      <div className="home-big-text">
                          <p><b>Quality</b></p>
                          <p><b>Services you</b></p>
                          <p><b>Really Want.</b></p>
                      </div> 
                    </Col>
                </Row>
                <Row className="mb-0 d-none d-md-block d-lg-block">
                    <Col>
                      <div className="home-small-text">
                          <p className="align-self-center">Ask Questions, Browse Articles, Find Answer.</p>
                      </div> 
                    </Col>
                </Row>
                <Row className="mt-0 d-none d-md-block d-lg-block">
                  <Col className="home-search-col">
                  <form className="app-search home-app-search">
                    <div className="position-relative home-search-container">
                      <input type="text" id='home-small-search' className="form-control form-control-lg form-home-custom shadow-sm" value={searchValue} onChange={onValueSearch} placeholder="Search..." />
                      <i className="bx bx-search-alt form-home-icon-search" />
                    </div>
                  </form>
                  </Col>
                </Row>
               </Col>
               <Col className="img-fd-wm-col d-flex justify-content-center">
                 <div>
                   <img className="img-fd-wm" src={fd_wm_home}/>
                 </div>
               </Col>
           </Row>
           {/* MOBILE PURPOSE */}
           <Row className="mb-0 d-md-none d-lg-none">
                    <Col>
                      <div className="home-small-text">
                          <p className="align-self-center">Ask Questions, Browse Articles, Find Answer.</p>
                      </div> 
                    </Col>
            </Row>
           <Row className="mt-0 d-md-none d-lg-none">
                  <Col className="home-search-col">
                  <form className="app-search home-app-search">
                    <div className="home-search-container">
                      <input type="text" className="form-control form-control-lg form-home-custom shadow-sm" placeholder="Search..."  />
                      <i className="bx bx-search-alt form-home-icon-search" />
                    </div>
                  </form>
                  </Col>
            </Row>
            {/* END MOBILE PURPOSE */}
           <Row>
               {/* <Col lg="3" md="6" sm="12">
                <Card>
                <Link to="#">
                  <Row className="icons-demo-content p-2">
                    <Col lg="2" md="2" sm="2" xs="2">
                      <i className="mdi-rocket-launch mdi-48px mdi"/>
                    </Col>
                    <Col  xs="8" className="justify-content-center d-flex align-self-center" >
                      <h5 className=""><strong> Getting Strated </strong></h5>
                    </Col>
                  </Row>
                  </Link>
                </Card>
              </Col> */}
               <Col lg="4" md="6" sm="12">
                 <Card>
                   <Link to="faq">
                    <Row className="p-2">
                      <Col md="2" sm="2" xs="2">
                        <i className="mdi-frequently-asked-questions mdi-48px mdi"/>
                      </Col>
                      <Col xs="8" className="justify-content-center d-flex align-self-center" >
                        <h5 className=""><strong> FAQ </strong></h5>
                      </Col>
                    </Row>
                   </Link>
                  </Card>
               </Col>

               <Col lg="4" md="6" sm="12" >
                 <Card>
                  <Link to="knowledgebase">
                    <Row className="p-2">
                      <Col xs="2" sm="2" md="2" lg="2">
                        <i className="mdi-book-open-page-variant mdi-48px mdi"/>
                      </Col>
                      <Col xs="8" className="justify-content-center d-flex align-self-center" >
                        <h5 className=""><strong> Knowledge Base </strong></h5>
                      </Col>
                    </Row>
                   </Link> 
                  </Card>
                </Col>
               <Col lg="4" md="12" sm="12">
               <Card>
               <Link to="create-ticket">
                    <Row className="p-2">
                      <Col xs="2" md="2" sm="2" lg="2">
                        <i className="mdi-ticket-account mdi-48px mdi"/>
                      </Col>
                      <Col xs="8" className="justify-content-center d-flex align-self-center" >
                        <h5 className=""><strong> Create Ticket </strong></h5>
                      </Col>
                    </Row>
                   </Link> 
               </Card>
                </Col>
           </Row>
          </section>
          {
              !isEmpty(searchValue) && (<HomeSearchList searchValue={searchValue} onValueSearch = {(e) => onValueSearch(e)} />)
          }
        </Container>
      </div>
    </React.Fragment>
    )
}

export default index
