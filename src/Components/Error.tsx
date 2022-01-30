import React from 'react'

export default class Error extends React.Component {
  render() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{color: 'white'}}>Sorry, something went wrong!</h1>
      </div>
    )
  }
}

