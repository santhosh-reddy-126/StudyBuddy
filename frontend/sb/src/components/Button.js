import React from 'react'
import "../css/Button.css"
export default function Button(props) {
  return (
        <button type='submit' id="btn" onClick={props.oc}>
            {props.name}
        </button>
  )
}
