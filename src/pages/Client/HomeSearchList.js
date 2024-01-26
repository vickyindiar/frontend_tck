import React, {useState, useEffect}  from 'react'
import { useDispatch, useSelector } from "react-redux"
import { doFilterFaqs, getFaqs } from 'store/faq/actions';
import { doFilterKbases, getKbases } from 'store/kbase/actions';
import {Row, Col, Card, Container, Button}  from 'reactstrap'
import isEmpty from 'helpers/isEmpty_helper'
import { Link } from "react-router-dom"
import {  reqFreeToken } from 'store/actions'



const HomeSearchList = ({searchValue, onValueSearch}) => {
    const filteredKbases = useSelector(state => state.kbase.filteredKbases)
    const allKbases = useSelector(state => state.kbase.allKbases)
    const allFaqs = useSelector(state => state.faq.allFaqs)
    const filteredFaqs = useSelector(state => state.faq.filteredFaqs)

    const freeToken = useSelector(state => state.authClient.freeToken)
    const isAuthenticatedClient = useSelector(state => state.authClient.isAuthenticated)
    const isAuthenticatedUser = useSelector(state => state.Login.isAuthenticated)

    const dispatch = useDispatch()

     useEffect(() => {
        if(!isAuthenticatedUser && !isAuthenticatedClient){
          dispatch(reqFreeToken()) 
        }
        else{
          if(isEmpty(allKbases)){
            dispatch(getKbases(freeToken))
          }
          else{
              dispatch(doFilterKbases(searchValue))
          }
          if(isEmpty(allFaqs)){
            dispatch(getFaqs(freeToken))
          }
          else{
              dispatch(doFilterFaqs(searchValue))
          }
        }
    }, [])

    useEffect(() => {
        if(isAuthenticatedClient || !isEmpty(freeToken) ){
            if(isEmpty(allKbases)){
                dispatch(getKbases(freeToken))
            }
            else{
                dispatch(doFilterKbases(searchValue))
            }
            if(isEmpty(allFaqs)){
               dispatch(getFaqs(freeToken))
            }
            else{
                dispatch(doFilterFaqs(searchValue))
            }
        }
    }, [freeToken])

    useEffect(() => {
      dispatch(doFilterKbases(searchValue))
      dispatch(doFilterFaqs(searchValue))
    }, [searchValue, allFaqs, allKbases ])

    return (
            !isEmpty(searchValue) && (
              <section id='search-result-section' style={{height:'100vh'}}>
                <Row >
                    <div id="client-index-search-container" >
                        <Row className="mt-0 d-none d-md-block d-lg-block">
                          <Col className="home-search-col">
                          <form className="app-search home-app-search">
                            <div className="position-relative home-search-container">
                              <input type="text" id='home-big-search' className="form-control form-control-lg form-home-custom shadow-sm" value={searchValue} onChange={onValueSearch} placeholder="Search..." />
                              <i className="bx bx-search-alt form-home-icon-search" />
                            </div>
                          </form>
                          </Col>
                        </Row>
                    </div>
                </Row>
                <Row>
                    <Col>
                      <Row> <Col> <h3>FAQ</h3> </Col> </Row>
                      <Row>
                         <Col> 
                         <div className="list-group list-group-flush">
                              {
                                filteredFaqs.map((v, id) => {
                                    return (
                                        <div className="list-group-item text-muted"  key={`BIG_SEARCH_FAQ_${v.id}`} >
                                          <Link  className='text-muted' to={!isEmpty(freeToken) ? `/faq?app=${v.appId}&mod=${v.moduleId}&id=${v.id}` : `/admin/faq?app=${v.appId}&mod=${v.moduleId}&id=${v.id}`} >
                                              <i className="mdi mdi-circle-medium me-1"></i>{" "}
                                              { v.question }
                                          </Link>
                                       </div>
                                    )
                                })  
                              }
                          </div>
                       </Col>
                      </Row>
                    </Col>
                </Row>
                <hr />
                <Row>
                <Col>
                      <Row> <Col> <h3>Articles</h3> </Col> </Row>
                      <Row>
                         <Col> 
                         <div className="list-group list-group-flush">
                              {
                                filteredKbases.map((v, id) => {
                                    return (
                                        <div className="list-group-item text-muted"  key={`BIG_SEACRH_ARTICLES_KBASE_${v.id}`} >
                                          <Link  className='text-muted' to={!isEmpty(freeToken) ? `/knowledgebase/detail?id=${v.id}` : `/admin/knowledgebase/detail?id=${v.id}`} >
                                              <i className="mdi mdi-circle-medium me-1"></i>{" "}
                                              { v.title }
                                          </Link>
                                       </div>
                                    )
                                })  
                              }
                          </div>
                       </Col>
                      </Row>
                    </Col>
                </Row>
              </section>
              )
    )
}

export default React.memo(HomeSearchList)
