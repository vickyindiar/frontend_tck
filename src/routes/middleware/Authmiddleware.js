import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import { encryptData, decryptData, _slt } from '../../helpers/crypt_helper'


const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isAdmin,
  access,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if(localStorage.getItem('_ar')){
        let ar = JSON.parse(decryptData(localStorage.getItem('_ar'), _slt))
        if(access  && !access.includes(ar.roleId)){
          if(isAdmin)  return ( <Redirect to={{ pathname: "/admin/ticket", state: { from: props.location } }} /> )
          else  return ( <Redirect to={{ pathname: "/", state: { from: props.location } }} /> );
        }
      }
      if (isAuthProtected && !localStorage.getItem("_aat")) {
        if(isAdmin){
          return ( <Redirect to={{ pathname: "/admin/login", state: { from: props.location } }} /> )
        }
        // else{
        //   return ( <Redirect to={{ pathname: "/login", state: { from: props.location } }} /> )
        // }
      }
      if(props.location.pathname.includes('/mytickets')){
        const search = props.location.search;
        const ticketToken = new URLSearchParams(search).get('tcid');
        const ticketNumber = new URLSearchParams(search).get('tn');
        if( ticketToken ) {}
        else if( localStorage.getItem('_cat') ){}
        else{
          return ( <Redirect to={{ pathname: "/login", state: { from: props.location } }} /> )
        }
      }

      if(!props.location.pathname.includes('admin') && props.location.pathname.includes('/knowledgebase')){
         if( localStorage.getItem('_aat') ){
            return ( <Redirect to={{ pathname: "/admin/knowledgebase", state: { from: props.location } }} /> )
         }
      }
      if(!props.location.pathname.includes('admin') && props.location.pathname.includes('/faq')){
         if( localStorage.getItem('_aat') ){
            return ( <Redirect to={{ pathname: "/admin/faq", state: { from: props.location } }} /> )
         }
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      )
    }}
  />
)

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default Authmiddleware;
