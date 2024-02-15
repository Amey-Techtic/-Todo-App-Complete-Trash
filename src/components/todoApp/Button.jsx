import React from 'react'
import './Button.css'
const Button = ({id, onClickAction, children}) => {
  return (
    <div>
        <button id={id} onClick={onClickAction}>{children}</button>
    </div>
  )
}

export default Button;
