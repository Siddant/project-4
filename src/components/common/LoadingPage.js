import React from 'react'



class LoadingPage extends React.Component {


  constructor() {
    super()

    this.state = {
      loading: true
    }

  }

  render() {

    return (
      <div id='books' /> 

    )
  }
}

export default LoadingPage
