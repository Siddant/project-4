import React from 'react'
import axios from 'axios'
import { Container, Segment, Grid, Form, Input, Divider, Button, TextArea, Icon } from 'semantic-ui-react'
// import Flash from '../../lib/Flash'

import LoadingPage from '../common/LoadingPage'
import Auth from '../../lib/Auth'
import Settings from '../../lib/Settings'


class UsersMessage extends React.Component{

  constructor(){
    super()
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    axios.get(`/api/users/${this.props.match.params.id}`)
      .then( res =>{
        this.setState({ usersDetail: res.data})
      })
  }

  // taking the value and name of input to set in state, before making post request to register
  handleChange({ target: { name, value }}) {
    const postData = {...this.state.postData, [name]: value }
    this.setState({ postData })
  }


  // submitting the data to back end register route
  handleSubmit(e){
    e.preventDefault()
    if(!this.state.postData ) return <LoadingPage />
    const headers = {'Authorization': `Bearer ${Auth.getToken()}`}
    const body = this.state.postData
    axios.post(`/api/users/${this.props.match.params.id}/inbox`,  body, {headers: headers}
    )
      .then(
        this.props.history.push(`/users/${this.props.match.params.id}`)
      )
  }

  render(){
    const nightMode = Settings.isNightMode()
    if(!this.state.usersDetail ) return <LoadingPage />
    return(
      <Container>
        <Segment inverted={nightMode}>
          <Grid columns={1} stackable textAlign='center'>
            <Grid.Column width={8}>
              <Divider hidden />
              <Icon name='mail' size='huge' />
              <Form inverted={nightMode} onSubmit={this.handleSubmit} >
                <Form.Field required>
                  <label>Send message to:</label>
                  <Input
                    icon='user'
                    iconPosition='left'
                    onChange={this.handleChange}
                    placeholder='Username'
                    required
                    readOnly
                    name='username'
                    value={this.state.usersDetail.username}

                  />
                </Form.Field>

                <Form.Field required>
                  <label>Enter Your Message</label>
                  <TextArea
                    icon='envelope'
                    onChange={this.handleChange}
                    placeholder='Message'
                    type='text'
                    name='content'
                    style={{ minHeight: 200 }}
                  />
                </Form.Field>
                <Button fluid content="Submit" primary icon='send' />

              </Form>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>

    )
  }
}


export default UsersMessage
