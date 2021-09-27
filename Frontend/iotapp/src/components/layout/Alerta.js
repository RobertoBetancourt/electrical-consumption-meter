import React from 'react'
import './alerta.css'

const Alerta = ({ alerta }) => {
  if (!alerta) {
    return null
  }

  return (
    <div className={`alerta ${alerta.categoria}`}>{alerta.msg}</div>
  )
}

export default Alerta
