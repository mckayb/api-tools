import React, { useState } from "react"
import Input from "../assets/Input"
import Button from "../assets/Button"
import Select from "../assets/Select"
import useAxios from "axios-hooks"
import moment from "moment"
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from "react-vis"
import { Highlight } from "react-fast-highlight"

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
    headers: headers.reduce((prev, curr) => ({ ...prev, [curr.name]: curr.value }), {})
  }

  const [{ data, loading, error, headers: reponseHeaders }, fetchUrl] = useAxios(requestConfig, { manual: true })
  const onSubmit = e => {
    if (url) fetchUrl()
  }

  // TODO: Allow them to specify keys, either by a string, or a JSON path

  const results = (() => {
    if (loading) {
      return <p>Loading</p>
    } else if (error) {
      return <p>Error</p>
    } else if (data !== undefined) {
      return (
        <div>
          <Highlight languages={['json']}>
            {JSON.stringify(data, null, 2) ?? '[]'}
          </Highlight>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  })()

  return (
    <div>
      <div>
        <label>
          Method
          <Select onChange={onMethodChange} value={method}>
            <option value="get">GET</option>
            <option value="post">POST</option>
            <option value="options">OPTIONS</option>
            <option value="put">PUT</option>
            <option value="patch">PATCH</option>
            <option value="delete">DELETE</option>
          </Select>
        </label>
        <label>
          URL
          <Input type="text" placeholder="API URL" value={url} onChange={onUrlChange}></Input>
        </label>
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

      <Button type="text" onClick={onSubmit}>Make Request</Button>

      <div>
        Response:
      </div>
      <div>
        {results}
      </div>

      <div>
        Visualization:
      </div>
      {/*
      <div>
        <XYPlot height={600} width={600} xType="ordinal">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={a => moment(a).format('MMM DD')}/>
          <YAxis/>
          <LineSeries data={visualizationData} />
        </XYPlot>
      </div>
      */}

      <div>
        The end
      </div>
    </div>
  );
}