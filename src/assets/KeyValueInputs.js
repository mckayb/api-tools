import React from "react"
import Input from "./Input"

const KeyValueInputs = ({ name, pair, index, onChange, onKeyDown, setRef }) => (
  <>
    <label htmlFor={name + "_" + index} hidden={true}>Name</label>
    <Input id={name + "_" + index}
      type="text"
      ref={setRef(name + "_" + index + "_0")}
      value={pair.name}
      onChange={(e) => onChange({ name: e.target.value, value: pair.value })}
      onKeyDown={onKeyDown(0)}
      placeholder="Name">
    </Input>
    &nbsp;
    <label htmlFor={name + "_" + index} hidden={true}>Value</label>
    <Input id={name + "_" + index}
      type="text"
      ref={setRef(name + "_" + index + "_1")}
      value={pair.value}
      onChange={(e) => onChange({ name: pair.name, value: e.target.value })}
      placeholder="Value"
      onKeyDown={onKeyDown(1)}>
    </Input>
  </>
)

export default KeyValueInputs