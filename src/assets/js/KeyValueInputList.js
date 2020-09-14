import React, { useState, useEffect } from "react"
import Input from "./Input"
import FlexRow from "./FlexRow"
import useDynamicRefs from 'use-dynamic-refs';

export const emptyList = [{ name: "", value: "" }]
export const reduceList = data => data.reduce((prev, curr) => curr.name && curr.value ? ({ ...prev, [curr.name]: curr.value }) : prev, {})

const KeyValueInputs = ({ name, pair, onChange, onKeyDown, setRef }) => {
  return (
    <>
      <Input
        type="text"
        ref={setRef(name + "_0")}
        value={pair.name}
        onChange={(e) => onChange({ name: e.target.value, value: pair.value })}
        onKeyDown={onKeyDown(0)}
        placeholder="Name">
      </Input>
      &nbsp;
      <Input
        type="text"
        ref={setRef(name + "_1")}
        value={pair.value}
        onChange={(e) => onChange({ name: pair.name, value: e.target.value })}
        placeholder="Value"
        onKeyDown={onKeyDown(1)}>
      </Input>
    </>
  )
}

export const KeyValueInputList = ({ name, data, setData }) => {
  const [focusCoordinates, setFocusCoordinates] = useState([0, 0])
  const [getRef, setRef] = useDynamicRefs()

  const onChange = i => item => {
    const newData = [...data]
    newData[i] = item
    setData(newData)
  }
  const onKeyDown = a => b => e => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.key === 'Tab' && e.preventDefault()

      const isEmpty = e.target.value === "";
      const newFocusCoordinates = b === 1
        ? [isEmpty ? a : a + 1, isEmpty ? b : 0]
        : [a, isEmpty ? b : b + 1];

      b === 1 && !isEmpty && setData(data.concat([{ name: "", value: "" }]))
      setFocusCoordinates(newFocusCoordinates)
    } else if (e.key === 'Backspace' && e.target.value === "" && (a > 0 || b > 0)) {
      const newFocusCoordinates = b === 1
        ? [a, 0]
        : [a === 0 ? 0 : a - 1, b + 1];

      b === 0 && a !== 0 && setData(data.filter((_, index) => a !== index))
      setFocusCoordinates(newFocusCoordinates)
    }
  }

  useEffect(() => {
    const ref = getRef(name + "_" + focusCoordinates[0] + "_" + focusCoordinates[1])
    ref && ref.current && ref.current.focus()
  }, [focusCoordinates, getRef, name])

  return (
    <>
      {data.map((d, i) => (
        <FlexRow key={i} size={1}>
          <KeyValueInputs
            name={name + "_" + i}
            pair={d}
            onChange={onChange(i)}
            onKeyDown={onKeyDown(i)}
            setRef={setRef}>
          </KeyValueInputs>
        </FlexRow>
      ))}
    </>
  )
}
export default KeyValueInputList