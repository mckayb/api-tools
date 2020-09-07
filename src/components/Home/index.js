import React, { useState, useEffect } from "react"
import Input from "../../assets/Input"
import Button from "../../assets/Button"
import Select from "../../assets/Select"
import useAxios from "axios-hooks"
// import moment from "moment"
// import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from "react-vis"
import { Highlight } from "react-fast-highlight"
import FlexColumn from "../../assets/FlexColumn"
import FlexRow from "../../assets/FlexRow"
import useDynamicRefs from 'use-dynamic-refs';
import KeyValueInputs from "../../assets/KeyValueInputs"


export default function Home() {
  const [method, setMethod] = useState("get")
  const onMethodChange = e => setMethod(e.target.value)

  const [url, setUrl] = useState("")
  const onUrlChange = e => setUrl(e.target.value)

  const [inputOptions, setInputOptions] = useState([{
    label: "Headers",
    visible: true
  }, {
    label: "Input",
    visible: false
  }])
  const onInputOptionClick = i => e => {
    const newInputOptions = inputOptions.map(opt => ({...opt, visible: false}))
    newInputOptions[i] = {...newInputOptions[i], visible: true}
    setInputOptions(newInputOptions)
  }
  const [getRef, setRef] = useDynamicRefs()

  const [focusCoordinates, setFocusCoordinates] = useState([0, 0])
  const [headers, setHeaders] = useState([{
    name: "",
    value: ""
  }])
  const onHeaderChange = i => header => {
    const newHeaders = [...headers]
    newHeaders[i] = header
    setHeaders(newHeaders)
  }
  const onHeaderInputKeyDown = a => b => e => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.key === 'Tab' && e.preventDefault()

      const isEmpty = e.target.value === "";
      const newFocusCoordinates = b === 1
        ? [isEmpty ? a : a + 1, isEmpty ? b : 0]
        : [a, isEmpty ? b : b + 1];

      b === 1 && !isEmpty && setHeaders(headers.concat([{ name: "", value: "" }]))
      setFocusCoordinates(newFocusCoordinates)
    } else if (e.key === 'Backspace' && e.target.value === "" && (a > 0 || b > 0)) {
      const newFocusCoordinates = b === 1
        ? [a, 0]
        : [a === 0 ? 0 : a - 1, b + 1];

      b === 0 && a !== 0 && setHeaders(headers.filter((_, index) => a !== index))
      setFocusCoordinates(newFocusCoordinates)
    }
  }

  const [queryParamFocusCoordinates, setQueryParamFocusCoordinates] = useState([0, 0])
  const [queryParams, setQueryParams] = useState([{
    name: "",
    value: ""
  }])
  const onQueryParamChange = i => qp => {
    const newQueryParams = [...queryParams]
    newQueryParams[i] = qp
    setQueryParams(newQueryParams)
  }
  const onQueryParamInputKeyDown = a => b => e => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.key === 'Tab' && e.preventDefault()

      const isEmpty = e.target.value === "";
      const newFocusCoordinates = b === 1
        ? [isEmpty ? a : a + 1, isEmpty ? b : 0]
        : [a, isEmpty ? b : b + 1];

      b === 1 && !isEmpty && setQueryParams(queryParams.concat([{ name: "", value: "" }]))
      setQueryParamFocusCoordinates(newFocusCoordinates)
    } else if (e.key === 'Backspace' && e.target.value === "" && (a > 0 || b > 0)) {
      const newFocusCoordinates = b === 1
        ? [a, 0]
        : [a === 0 ? 0 : a - 1, b + 1];

      b === 0 && a !== 0 && setQueryParams(queryParams.filter((_, index) => a !== index))
      setQueryParamFocusCoordinates(newFocusCoordinates)
    }
  }

  useEffect(() => {
    const ref = getRef("header_" + focusCoordinates[0] + "_" + focusCoordinates[1])
    ref && ref.current && ref.current.focus()
  }, [focusCoordinates, getRef])

  useEffect(() => {
    const ref = getRef("query_param_" + queryParamFocusCoordinates[0] + "_" + queryParamFocusCoordinates[1])
    ref && ref.current && ref.current.focus()
  }, [queryParamFocusCoordinates, getRef])

  const requestConfig = {
    url,
    method,
    headers: headers.reduce((prev, curr) => curr.name && curr.value ? ({ ...prev, [curr.name]: curr.value }) : prev, {})
  }

  const [{ data, loading, error, headers: responseHeaders }, fetchUrl] = useAxios(requestConfig, { manual: true })
  const onRequestSubmitClick = e => url && fetchUrl()

  // TODO: Allow them to specify keys, either by a string, or a JSON path
  /* const [visualizations, setVisualizations] = useState([])
  const [toggleAddVisualization, setToggleAddVisualization] = useState(false)
  const onToggleAddVisClick = e => setToggleAddVisualization(!toggleAddVisualization) */

  const visibleOption = inputOptions.find(opt => opt.visible)
  const inputOptionContent = (() => {
    if (visibleOption.label === "Headers") {
      return (
        <FlexColumn size={1} style={{ padding: "1em" }}>
          <div>
            Headers:
          </div>
          {headers.map((header, i) => (
            <FlexRow key={i} size={1}>
              <KeyValueInputs name="header"
                index={i}
                pair={header}
                onChange={onHeaderChange(i)}
                onKeyDown={onHeaderInputKeyDown(i)}
                setRef={setRef}>
              </KeyValueInputs>
            </FlexRow>
          ))}
        </FlexColumn>
      )
    } else if (visibleOption.label === "Input") {
      return (
        <FlexColumn size={1} style={{ padding: "1em" }}>
          <div>
            Query Parameters:
          </div>
          {queryParams.map((qp, i) => (
            <FlexRow key={i} size={1}>
              <KeyValueInputs name="query_param"
                index={i}
                pair={qp}
                onChange={onQueryParamChange(i)}
                onKeyDown={onQueryParamInputKeyDown(i)}
                setRef={setRef}>
              </KeyValueInputs>
            </FlexRow>
          ))}
        </FlexColumn>
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
      <FlexRow style={{
        borderBottom: "2px solid palevioletred"
      }}>
        {inputOptions.map((option, i) => (
          <Button key={i} type="button" style={{
            borderLeft: i === 0 ? "none" : "1px solid palevioletred",
            borderTop: "none",
            borderBottom: "none",
            borderRight: i === inputOptions.length - 1 ? "1px solid palevioletred" : "none"
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
        <XYPlot height={600} width={600} xType="ordinal">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={a => moment(a).format('MMM DD')}/>
          <YAxis/>
          <LineSeries data={visualizationData} />
        </XYPlot>
      </div>
    */