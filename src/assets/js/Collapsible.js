import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import FlexRow from "./FlexRow"

export const mkTrigger = (open, name) => (
  <FlexRow>
    {name}
    <span style={{ marginLeft: "auto" }}><FontAwesomeIcon icon={open ? faAngleUp : faAngleDown}></FontAwesomeIcon></span>
  </FlexRow>
)