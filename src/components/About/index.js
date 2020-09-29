import React, { useState } from "react"
import Collapsible from "react-collapsible"
import { Highlight } from "react-fast-highlight"
import useAxios from "axios-hooks"
import { mkTrigger } from "../../assets/js/Collapsible"
import KeyValueInputList, { emptyList, reduceList } from "../../assets/js/KeyValueInputList"
import FlexColumn from "../../assets/js/FlexColumn"
import FlexRow from "../../assets/js/FlexRow"
import Select from "../../assets/js/Select"
import Input from "../../assets/js/Input"
import Button from "../../assets/js/Button"

// You can think of these components as "pages"
// in your app.

export default function About() {
  const [model, setModel] = useState({
    method: "get",
    url: "",
    headers: emptyList,
    queryParams: emptyList,

    headerPaneOpen: false,
    queryParamPaneOpen: false,
    responsePaneOpen: false
  });

  const [{ data, loading, error }, fetchUrl] = useAxios({
    method: model.method,
    url: model.url,
    headers: reduceList(model.headers),
    params: reduceList(model.queryParams)
  }, { manual: true })

  const actions = {
    setRequestHeaders: headers => setModel({ ...model, headers }),
    setQueryParams: queryParams => setModel({ ...model, queryParams }),
    onMethodChange: e => setModel({ ...model, method: e.target.value }),
    onUrlChange: e => setModel({ ...model, url: e.target.value }),
    onSubmitClick: e => model.url && fetchUrl(),
    onHeaderPaneOpen: e => setModel({ ...model, headerPaneOpen: true }),
    onHeaderPaneClose: e => setModel({ ...model, headerPaneOpen: false }),
    onQueryParamPaneOpen: e => setModel({ ...model, queryParamPaneOpen: true }),
    onQueryParamPaneClose: e => setModel({ ...model, queryParamPaneOpen: false }),
    onResponsePaneOpen: e => setModel({ ...model, responsePaneOpen: true }),
    onResponsePaneClose: e => setModel({ ...model, responsePaneOpen: false })
  }

  return (
    <FlexColumn size={1}>
      <FlexRow>
        <Select onChange={actions.onMethodChange} value={model.method} style={{ borderLeft: "none", borderRight: "none", borderRadius: 0, margin: 0 }}>
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="options">OPTIONS</option>
          <option value="put">PUT</option>
          <option value="patch">PATCH</option>
          <option value="delete">DELETE</option>
        </Select>
        <Input type="text" placeholder="http://example.com" value={model.url} onChange={actions.onUrlChange} style={{ borderLeft: "none", borderRight: "none", borderRadius: 0 }}></Input>
        <Button type="text" onClick={actions.onSubmitClick}>Submit</Button>
      </FlexRow>
      <FlexRow>
        <Collapsible open={model.headerPaneOpen}
          trigger={mkTrigger(model.headerPaneOpen, "Request Headers")}
          onTriggerClosing={actions.onHeaderPaneClose}
          onTriggerOpening={actions.onHeaderPaneOpen}>
            <KeyValueInputList name="Request Headers" data={model.headers} setData={actions.setRequestHeaders}>
            </KeyValueInputList>
        </Collapsible>
      </FlexRow>
      <FlexRow>
        <Collapsible open={model.queryParamPaneOpen}
          trigger={mkTrigger(model.queryParamPaneOpen, "Query Parameters")}
          onTriggerClosing={actions.onQueryParamPaneClose}
          onTriggerOpening={actions.onQueryParamPaneOpen}>
            <KeyValueInputList name="Query Parameters" data={model.queryParams} setData={actions.setQueryParams}>
            </KeyValueInputList>
        </Collapsible>
      </FlexRow>
      <FlexRow>
        <Collapsible open={model.responsePaneOpen}
          trigger={mkTrigger(model.responsePaneOpen, "Response")}
          onTriggerClosing={actions.onResponsePaneClose}
          onTriggerOpening={actions.onResponsePaneOpen}>
            {loading && <div>Loading...</div>}
            {error && !loading && <div>Error...</div>}
            {data && !loading && !error && (
              <Highlight languages={['json']} style={{
                width: "100%",
                margin: "1em"
              }}>
                {JSON.stringify(data, null, 2) ?? '[]'}
              </Highlight>
            )}
            {!data && !loading && !error && <div className="text--muted">Make a request...</div>}
        </Collapsible>
      </FlexRow>
    </FlexColumn>
  );
}
