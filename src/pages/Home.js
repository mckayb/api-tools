import React, { useState } from "react"
import Input from "../assets/Input"
import Button from "../assets/Button"
import useAxios from "axios-hooks"
import moment from "moment"
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from "react-vis"

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

  const [{ data, loading, error }, fetchUrl] = useAxios({
    url,
    headers: headers.reduce((prev, curr) => ({...prev, [curr.name]: curr.value }), {})
  }, { manual: true })
  const onSubmit = e => {
    if (url) fetchUrl()
  }

  // Replace this with just data when you're ready
  const testData = [{
    date: "2019-10-06",
    sales: 100
  }, {
    date: "2019-10-13",
    sales: 150
  }]
  const results = (() => {
    if (loading) {
      return <p>Loading</p>
    } else if (error) {
      return <p>Error</p>
    } else {
      return <div>{JSON.stringify(testData)}</div>
    }
  })()

  const visualizationData = testData.map(a => ({ x: new Date(a.date), y: a.sales }))

  return (
    <div>
      <div>
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

      <Button type="text" onClick={onSubmit}>Submit</Button>

      <div>
        Response:
      </div>
      <div>
        {results}
      </div>

      <div>
        Visualization:
      </div>
      <div>
        <XYPlot height={600} width={600} xType="ordinal">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={a => moment(a).format('MMM DD')}/>
          <YAxis/>
          <LineSeries data={visualizationData} />
        </XYPlot>
      </div>

      <div>
        The end
      </div>
    </div>
  );
}