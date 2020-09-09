import React, { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import FlexRow from "./FlexRow"

export const mkTrigger = name => {
  return (
    <FlexRow>
      {name}
      <span style={{ marginLeft: "auto" }}><FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon></span>
    </FlexRow>
  )
}