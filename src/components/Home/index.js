import React, { useState } from "react"
import Collapsible from "react-collapsible"
import Input from "../../assets/js/Input"
import Button from "../../assets/js/Button"
import Select from "../../assets/js/Select"
import useAxios from "axios-hooks"
import moment from "moment"
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, makeWidthFlexible } from "react-vis"
import { Highlight } from "react-fast-highlight"
import FlexColumn from "../../assets/js/FlexColumn"
import FlexRow from "../../assets/js/FlexRow"
import KeyValueInputList, { emptyList, reduceList } from "../../assets/js/KeyValueInputList"
import { mkTrigger } from "../../assets/js/Collapsible"

const FlexibleXYPlot = makeWidthFlexible(XYPlot)

export default function Home() {
  const [method, setMethod] = useState("get")
  const onMethodChange = e => setMethod(e.target.value)

  const [url, setUrl] = useState("")
  const onUrlChange = e => setUrl(e.target.value)

  const [requestHeaders, setRequestHeaders] = useState(emptyList);
  const [queryParams, setQueryParams] = useState(emptyList)

  const requestConfig = {
    url,
    method,
    params: reduceList(queryParams),
    headers: reduceList(requestHeaders)
  }
  const [{ data, loading, error }, fetchUrl] = useAxios(requestConfig, { manual: true })
  const onRequestSubmitClick = e => url && fetchUrl()

  const [requestHeaderPaneOpen, setRequestHeaderPaneOpen] = useState(false)
  const onRequestHeaderPaneOpen = e => setRequestHeaderPaneOpen(true)
  const onRequestHeaderPaneClose = e => setRequestHeaderPaneOpen(false)

  const [requestQueryParamPaneOpen, setRequestQueryParamPaneOpen] = useState(false)
  const onRequestQueryParamPaneOpen = e => setRequestQueryParamPaneOpen(true)
  const onRequestQueryParamPaneClose = e => setRequestQueryParamPaneOpen(false)
  const requestOptionContent = (
    <FlexColumn size={1}>
      <Collapsible open={requestHeaderPaneOpen}
        trigger={mkTrigger(requestHeaderPaneOpen, "Request Headers")}
        onTriggerClosing={onRequestHeaderPaneClose}
        onTriggerOpening={onRequestHeaderPaneOpen}>
          <KeyValueInputList name="Request Headers" data={requestHeaders} setData={setRequestHeaders}>
          </KeyValueInputList>
      </Collapsible>
      <Collapsible open={requestQueryParamPaneOpen}
        trigger={mkTrigger(requestQueryParamPaneOpen, "Query Parameters")}
        onTriggerClosing={onRequestQueryParamPaneClose}
        onTriggerOpening={onRequestQueryParamPaneOpen}>
          <KeyValueInputList name="Query Parameters" data={queryParams} setData={setQueryParams}>
          </KeyValueInputList>
      </Collapsible>
    </FlexColumn>
  )

  const [responsePaneOpen, setResponsePaneOpen] = useState(true)
  const onResponsePaneOpen = e => setResponsePaneOpen(true)
  const onResponsePaneClose = e => setResponsePaneOpen(false)
  const requestResults = (
    <Collapsible className="highlighted"
      openedClassName="highlighted"
      trigger={mkTrigger(responsePaneOpen, "Response")}
      onTriggerOpening={onResponsePaneOpen}
      onTriggerClosing={onResponsePaneClose}
      open={responsePaneOpen}>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && !loading && !error && (
        <Highlight languages={['json']} style={{
          width: "100%",
          margin: "1em"
        }}>
          {JSON.stringify(data, null, 2) ?? '[]'}
        </Highlight>
      )}
      {!data && !loading && !error && (
        <div className="text--muted" style={{ "padding": "1em" }}>Make a request...</div>
      )}
    </Collapsible>
  )

  const [visualizations, setVisualizations] = useState([])
  const [visualizationsPaneOpen, setVisualizationsPaneOpen] = useState(true)
  const onVisualizationsPaneOpen = e => setVisualizationsPaneOpen(true)
  const onVisualizationsPaneClose = e => setVisualizationsPaneOpen(false)

  const handleVisualization = (vis, i) => {
    if (vis.type === 'line') {
      const seriesData = vis.series.map(series => data.map(row => ({ x: row[series.name], y: row[series.value] })))
      return (
        <>
          {seriesData.map(series => (
            <FlexRow key={i}>
              <FlexibleXYPlot height={600} xType="ordinal">
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickFormat={a => moment(a).format('MMM DD')}/>
                <YAxis/>
                <LineSeries data={series}/>
              </FlexibleXYPlot>
            </FlexRow>
          ))}
        </>
      )
    } else {
      return (
        <div key={i}>Whoops, something went wrong and we were unable to draw the visualization.</div>
      )
    }
  }

  const visualizationResults = (
    <Collapsible trigger={mkTrigger(visualizationsPaneOpen, "Visualizations")}
      onTriggerOpening={onVisualizationsPaneOpen}
      onTriggerClosing={onVisualizationsPaneClose}
      open={visualizationsPaneOpen}>
        {visualizations.length > 0 && data && (
          <div>
            {visualizations.map(handleVisualization)}
          </div>
        )}
        {visualizations.length > 0 && !data && <div className="text--muted" style={{ "padding": "1em" }}>Make a request...</div>}
        {visualizations.length === 0 && <div className="text--muted" style={{ "padding": "1em" }}>Add a Visualization...</div>}
    </Collapsible>
  )

  const [newVisualization, setNewVisualization] = useState({
    type: 'line',
    series: emptyList
  })
  const onVisualizationTypeChange = e => setNewVisualization({...newVisualization, type: e.target.value})
  const onVisualizationSeriesChange = series => setNewVisualization({ ...newVisualization, series })
  const onVisualizationAddClick = e => setVisualizations(visualizations.concat([newVisualization]))
  const contentByVisualizationType = (
    <>
      {newVisualization.type === "line" && (
        <>
          <KeyValueInputList data={newVisualization.series} setData={onVisualizationSeriesChange}>
          </KeyValueInputList>
          <div>
            <Button type="submit" onClick={onVisualizationAddClick}>Add Visualization</Button>
          </div>
        </> 
      )}
    </>
  )

  const [newVisualizationPaneOpen, setNewVisualizationPaneOpen] = useState(false)
  const onNewVisualizationPaneOpen = e => setNewVisualizationPaneOpen(true)
  const onNewVisualizationPaneClose = e => setNewVisualizationPaneOpen(false)
  const addNewVisualizationContent = (
    <Collapsible trigger={mkTrigger(newVisualizationPaneOpen, "Add New Visualization")}
      open={newVisualizationPaneOpen}
      onTriggerOpening={onNewVisualizationPaneOpen}
      onTriggerClosing={onNewVisualizationPaneClose}>
        <FlexRow>
          Visualization Type
          <Select onChange={onVisualizationTypeChange} value={newVisualization.type} style={{ width: "100%", margin: 0}}>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </Select>
        </FlexRow>
        &nbsp;
        <FlexRow>
          {contentByVisualizationType}
        </FlexRow>
    </Collapsible>
  )

  return (
    <FlexColumn size={1}>
      <FlexRow style={{ borderBottom: "1px solid red" }}>
        <label htmlFor="requestMethodSelect" hidden={true}>Method</label>
        <Select id="requestMethodSelect" onChange={onMethodChange} value={method} style={{
          border: "none",
          margin: 0
        }}>
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="options">OPTIONS</option>
          <option value="put">PUT</option>
          <option value="patch">PATCH</option>
          <option value="delete">DELETE</option>
        </Select>
        <label htmlFor="requestUrlInput" hidden={true}>URL</label>
        <Input id="requestUrlInput" type="text" placeholder="http://example.com" value={url} onChange={onUrlChange} style={{
          border: "none"
        }}></Input>
        <Button type="button" style={{
          borderRight: "none",
          borderTop: "none",
          borderBottom: "none"
        }} onClick={onRequestSubmitClick}>Submit</Button>
      </FlexRow>
      <FlexRow>
        {requestOptionContent}
      </FlexRow>
      <FlexRow>
        {requestResults}
      </FlexRow>
      <FlexRow>
        {visualizationResults}
      </FlexRow>
      <FlexRow>
        {addNewVisualizationContent}
      </FlexRow>
    </FlexColumn>
  )
}
