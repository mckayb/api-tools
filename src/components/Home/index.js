import React, { useState } from "react"
import Collapsible from "react-collapsible"
import Input from "../../assets/Input"
import Button from "../../assets/Button"
import Select from "../../assets/Select"
import useAxios from "axios-hooks"
// import moment from "moment"
// import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from "react-vis"
import { Highlight } from "react-fast-highlight"
import FlexColumn from "../../assets/FlexColumn"
import FlexRow from "../../assets/FlexRow"
import KeyValueInputList, { emptyList, reduceList } from "../../assets/KeyValueInputList"


export default function Home() {
  const [method, setMethod] = useState("get")
  const onMethodChange = e => setMethod(e.target.value)

  const [url, setUrl] = useState("")
  const onUrlChange = e => setUrl(e.target.value)

  const [headers, setHeaders] = useState(emptyList);
  const [queryParams, setQueryParams] = useState(emptyList)

  const requestConfig = {
    url,
    method,
    params: reduceList(queryParams),
    headers: reduceList(headers)
  }

  const [{ data, loading, error, headers: responseHeaders }, fetchUrl] = useAxios(requestConfig, { manual: true })
  const onRequestSubmitClick = e => url && fetchUrl()

  // TODO: Allow them to specify keys, either by a string, or a JSON path
  /* const [visualizations, setVisualizations] = useState([])
  const [toggleAddVisualization, setToggleAddVisualization] = useState(false)
  const onToggleAddVisClick = e => setToggleAddVisualization(!toggleAddVisualization) */

  const requestOptionContent = (
    <>
      <FlexColumn size={1} style={{ padding: "1em" }}>
        <Collapsible trigger="Headers" open={true}>
          <KeyValueInputList name="headers" data={headers} setData={setHeaders}>
          </KeyValueInputList>
        </Collapsible>
        <Collapsible trigger="Query Parameters" open={true}>
          <KeyValueInputList name="query_params" data={queryParams} setData={setQueryParams}>
          </KeyValueInputList>
        </Collapsible>
      </FlexColumn>
    </>
  )

  const requestResults = (() => {
    if (loading) {
      return <p>Loading</p>
    } else if (error) {
      return <p>Error</p>
    } else if (data !== undefined) {
      return (
        <Collapsible className="highlighted" openedClassName="highlighted" trigger="Response" open={true}>
          <Highlight languages={['json']} style={{
            width: "100%",
            margin: "1em"
          }}>
            {JSON.stringify(data, null, 2) ?? '[]'}
          </Highlight>
        </Collapsible>
      )
    } else {
      return (
        <div></div>
      )
    }
  })()

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
        Visualizations go here
      </FlexRow>
    </FlexColumn>
  )
}
/*
      <div>
        <XYPlot height={600} width={600} xType="ordinal">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={a => moment(a).format('MMM DD')}/>
          <YAxis/>
          <LineSeries data={visualizationData} />
        </XYPlot>
      </div>
    */