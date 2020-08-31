import React, { useState } from "react"
import Input from "../assets/Input"
import Button from "../assets/Button"
import Select from "../assets/Select"
import useAxios from "axios-hooks"
import moment from "moment"
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from "react-vis"
import { Highlight } from "react-fast-highlight"
import FlexContainer from "../assets/FlexContainer"
import FlexColumn from "../assets/FlexColumn"
import FlexRow from "../assets/FlexRow"

const Header = ({ header, onChange}) => (
  <>
    <label>
      Name
      <Input type="text" value={header.name} onChange={(e) => onChange({ name: e.target.value, value: header.value })}></Input>
    </label>
    <label>
      Value
      <Input type="text" value={header.value} onChange={(e) => onChange({ name: header.name, value: e.target.value })}></Input>
    </label>
  </>
)

export default function Home() {
  const [method, setMethod] = useState("get")
  const onMethodChange = e => setMethod(e.target.value)

  const [url, setUrl] = useState("")
  const onUrlChange = e => setUrl(e.target.value)

  const [inputOptions, setInputOptions] = useState([{
    "label": "Headers",
    "visible": true
  }, {
    "label": "Input",
    "visible": false
  }])
  const onInputOptionClick = i => e => {
    const newInputOptions = [...inputOptions].map(opt => ({...opt, visible: false}))
    newInputOptions[i] = {...newInputOptions[i], visible: true}
    setInputOptions(newInputOptions)
  }
  const [headers, setHeaders] = useState([{
    name: "",
    value: ""
  }])
  const onHeaderChange = i => header => {
    const newHeaders = [...headers]
    newHeaders[i] = header
    setHeaders(newHeaders)
  }
  const onHeaderDelete = i => e => setHeaders(headers.filter((_, index) => i !== index))
  const onHeaderAdd = e => setHeaders(headers.concat([{ name: "", value: "" }]))

  const requestConfig = {
    url,
    method,
    headers: headers.reduce((prev, curr) => curr.name && curr.value ? ({ ...prev, [curr.name]: curr.value }) : prev, {})
  }

  const [{ data, loading, error, headers: reponseHeaders }, fetchUrl] = useAxios(requestConfig, { manual: true })
  console.log(data, error)
  const onRequestSubmitClick = e => url && fetchUrl()

  // TODO: Allow them to specify keys, either by a string, or a JSON path
  /* const [visualizations, setVisualizations] = useState([])
  const [toggleAddVisualization, setToggleAddVisualization] = useState(false)
  const onToggleAddVisClick = e => setToggleAddVisualization(!toggleAddVisualization) */

  const visibleOption = inputOptions.find(opt => opt.visible)
  const inputOptionContent = (() => {
    if (visibleOption.label === "Headers") {
      return (
        <div>Headers</div>
      )
    } else if (visibleOption.label === "Input") {
      return (
        <div>Input</div>
      )
    }
  })()

  const results = (() => {
    if (loading) {
      return <p>Loading</p>
    } else if (error) {
      return <p>Error</p>
    } else if (data !== undefined) {
      return (
        <Highlight languages={['json']} style={{
          "width": "100%",
          "margin-top": 0
        }}>
          {JSON.stringify(data, null, 2) ?? '[]'}
        </Highlight>
      )
    } else {
      return (
        <div></div>
      )
    }
  })()

  return (
    <FlexColumn size={1}>
      <FlexRow style={{ "border-bottom": "1px solid red" }}>
        <label for="requestMethodSelect" hidden="true">Method</label>
        <Select id="requestMethodSelect" onChange={onMethodChange} value={method} style={{
          "border": "none",
          "margin": 0
        }}>
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="options">OPTIONS</option>
          <option value="put">PUT</option>
          <option value="patch">PATCH</option>
          <option value="delete">DELETE</option>
        </Select>
        <label for="requestUrlInput" hidden="true">URL</label>
        <Input id="requestUrlInput" type="text" placeholder="http://example.com" value={url} onChange={onUrlChange} style={{
          "border": "none"
        }}></Input>
        <Button type="button" style={{
          "border-right": "none",
          "border-top": "none",
          "border-bottom": "none"
        }} onClick={onRequestSubmitClick}>Submit</Button>
      </FlexRow>
      <FlexRow style={{
        "border-bottom": "2px solid palevioletred"
      }}>
        {inputOptions.map((option, i) => (
          <Button key={i} type="button" style={{
            "border-left": i === 0 ? "none" : "1px solid palevioletred",
            "border-top": "none",
            "border-bottom": "none",
            "border-right": i === inputOptions.length - 1 ? "1px solid palevioletred" : "none"
          }} onClick={onInputOptionClick(i)}>{option.label}</Button>
        ))}
      </FlexRow>
      <FlexRow>
        {inputOptionContent}
      </FlexRow>
      <FlexRow size={1}>
          {results}
      </FlexRow>
    </FlexColumn>
  )
}
    /*
      <div>
      </div>

      <div>
        Headers:
        <Button type="text" onClick={onHeaderAdd}>Add Header</Button>
        {headers.map((header, i) => (
          <div key={i}>
            <Header header={header} onChange={onHeaderChange(i)}></Header>
            <Button type="text" onClick={onHeaderDelete(i)}>Delete</Button>
          </div>
        ))}
      </div>

      <Button type="text" onClick={onMakeRequestClick}>Make Request</Button>

      <div>
        Response:
      </div>
      <div>
        {results}
      </div>

      {results && (
        <div>
          <Button type="text" onClick={onToggleAddVisClick}>Add Visualization</Button>
          {visualizations.map(a => (
            <div>Foo</div>
          ))}
        </div>
      )}

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