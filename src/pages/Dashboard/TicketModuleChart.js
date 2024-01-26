
import React, {useState, useEffect, useRef} from 'react';
import {Card, CardBody} from 'reactstrap'
import { Chart, Series, CommonSeriesSettings, Legend, Export , Tooltip, ArgumentAxis} from 'devextreme-react/chart'
import { useSelector, useDispatch } from 'react-redux'
import Toolbar, { Item } from 'devextreme-react/toolbar'
import notify from 'devextreme/ui/notify';
import 'devextreme/ui/select_box';
import { groupBy, size, map } from 'lodash';
import isEmpty from 'helpers/isEmpty_helper';
import { getApps } from 'store/actions';

const TicketModuleChart = () => {
    const dashTicket = useSelector(state => state.dash.dashTicket)
    const dsApps = useSelector(state => state.misc.allApps)
    const [cData, setcData] = useState([])
    const [endArgument, setEndArgument] = useState('December')
    const [appSelection, setappSelection] = useState()
    const [dsMoth, setdsMoth] = useState([
        { "abbreviation": "Jan", "name": "January", 'value': '0' },
        { "abbreviation": "Feb", "name": "February", 'value': '1' },
        { "abbreviation": "Mar", "name": "March", 'value': '2' },
        { "abbreviation": "Apr", "name": "April", 'value': '3' },
        { "abbreviation": "May", "name": "May", 'value': '4' },
        { "abbreviation": "Jun", "name": "June", 'value': '5' },
        { "abbreviation": "Jul", "name": "July", 'value': '6', },
        { "abbreviation": "Aug", "name": "August", 'value': '7' },
        { "abbreviation": "Sep", "name": "September", 'value': '8' },
        { "abbreviation": "Oct", "name": "October", 'value': '9' },
        { "abbreviation": "Nov", "name": "November", 'value': '10' },
        { "abbreviation": "Dec", "name": "December", 'value': '11' }
    ])
    const dispatch = useDispatch()

    const refChartModule = useRef(null)
      const refreshButtonOptions = {
        icon: 'refresh',
        hint: 'Refresh',
        onClick: () => {
            refChartModule.current.instance.render();
        //  notify('Refresh button has been clicked!');
        }
      };
      const printImgBtnOption = {
        icon: 'bx bx-download',
        hint: 'Export to image',
        onClick: () => {
            if(refChartModule){
                try {
                    refChartModule.current.instance.exportTo('ticket-module-report', 'JPEG')
                } catch (error) {
                    notify('Sorry, Download Failed !');
                }
            }
        }
      };
      const printPdfBtnOption = {
        icon: 'bx bx-printer',
        hint: 'Print',
        onClick: () => {
            if(refChartModule){
                try {
                    refChartModule.current.instance.print()
                } catch (error) {
                    notify('Sorry, Download Failed !');
                }
            }
        }
      };
      
      const selectBoxOptions = {
        width: 140,
        items: dsApps,
        valueExpr: 'id',
        displayExpr: 'name',
        value: appSelection,
        onValueChanged: (args) => {
            setappSelection(args.value)
        }
      };
      
      function renderLabel() {
        return <div className="toolbar-label">Ticket Modules</div>;
      }
      const contentWidth = document.getElementById('root').clientWidth;
      if (contentWidth <= 575) {
            if(endArgument !== 'April') setEndArgument('April');  
      }
    if(contentWidth <= 575 && !isEmpty(initRef.current)){ refChartModule.current.instance.render();}
    
    useEffect(() => {
        dispatch(getApps()) 
    }, [])

    useEffect(() => {
        setappSelection(1);
    }, [dsApps])


    useEffect(() => {
        if(!isEmpty(dashTicket)){
            let byApp = dashTicket.filter(f => f.apps.id === appSelection);
            let byMonth = groupBy(byApp, el => el.createdAt.substring(0, 7))
            let reData = [];
            if(appSelection === 1 || appSelection === 2){
                reData = map(byMonth, (items, date) => {
                    let mn = dsMoth.find(f => parseInt(f.value) + 1 === parseInt(date.substring(5)))
                    return {
                                date: parseInt(date.substring(5)),
                                month : mn.abbreviation,
                                media: size(items.filter(f => f.modules.name === "Media" )),
                                production: size(items.filter(f => f.modules.name === "Production")),
                                finance: size(items.filter(f => f.modules.name === "Finance")),
                                system: size(items.filter(f => f.modules.name === "System")),
                                maintenance: size(items.filter(f => f.modules.name === "Maintenance"))
                            }
                });
                reData.sort((a, b) => a.date - b.date);
            }
            setcData(reData);
        }
    }, [dashTicket, appSelection])
    
    return (
        <>
        <Card>
            <CardBody>
                <Toolbar>
                    <Item location="before"
                        locateInMenu="never"
                        render={renderLabel} />
                    <Item location="after"
                        cssClass="btnPImg"
                        widget="dxButton"
                        options={printImgBtnOption} />
                    <Item location="after"
                        cssClass="btnPPdf"
                        widget="dxButton"
                        options={printPdfBtnOption} />
                    <Item location="after"
                        cssClass="btnRefresh"
                        widget="dxButton"
                        options={refreshButtonOptions} />
                    <Item location="after"
                        locateInMenu="auto"
                        widget="dxSelectBox"
                        options={selectBoxOptions} />
                </Toolbar>
                <Chart
                    id="chart"
                    palette="Material"
                    ref={refChartModule}
                    dataSource={cData}
                >
                    <CommonSeriesSettings argumentField="month" type="bar" ignoreEmptyPoints={true} />
                    <ArgumentAxis defaultVisualRange={{ startValue: 'January', endValue: endArgument }} />
                    <Series  argumentField="month"  valueField="media" name="Media" />
                    <Series valueField="production" name="Production" />
                    <Series valueField="finance" name="Finance" />
                    <Series valueField="system" name="System" />
                    <Series valueField="maintenance" name="Maintenance" />
                    <Tooltip enabled={true} />
                    <Legend verticalAlignment="bottom" horizontalAlignment="center" />
                    {/* <Export enabled={true}/> */}
                </Chart>
            </CardBody>
        </Card>
        </>
    )

}

export default React.memo(TicketModuleChart)
