import React, {useEffect} from 'react'
import {  setConnHub, getTickets, getClientTickets, getlatestCLog } from 'store/actions'
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import config from '../config'
import { useDispatch, useSelector } from 'react-redux'


function HubConfig() {
    const connHub = useSelector(state => state.notif.connHub)
    const dispatch = useDispatch()

    useEffect(() => {
      let token = null
        if(localStorage.getItem('_aat')){ 
            token = localStorage.getItem('_aat')
        }
        else if(localStorage.getItem('_cat')){
          token = localStorage.getItem('_cat')
        }
         
        if(token && connHub === null){
          const connect = new HubConnectionBuilder()
          .withUrl(`${config.baseURL}hubs?token=${token}`)
          .withAutomaticReconnect()
          .build();
          dispatch(setConnHub(connect));
        }
    }, [])
    useEffect(() => {
        if (connHub && connHub.state === 'Disconnected' && !connHub.connectionStarted) {
            console.log('connection hub starting')
            connHub.start()
            .then(() => {
              console.log('connection hub started')
              connHub.on("ReceiveTicketHub", (message) => {
                if(window.location.href.includes('admin/ticket')){
                  dispatch(getTickets())
                  console.log('ticket updated')
                }
              });
              connHub.on("ReceiveTickeClienttHub", (message) => {
                if(window.location.href.includes('myticket')){
                  dispatch( getClientTickets())
                  console.log('ticket updated')
                }
              });
              connHub.on("ReceiveCLogHub", (message) => {
                  dispatch( getlatestCLog())
                  console.log('clog updated')
              });
            })
            .catch((error) => console.log(error));
        }
    }, [connHub]);

    return (
        <>
        </>
    )
}

export default React.memo(HubConfig)
