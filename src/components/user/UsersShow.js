import React from 'react'
import axios from 'axios'
import { Segment, Container,Divider } from 'semantic-ui-react'

import UsersDetail from './UsersDetail'
import LoadingPage from '../common/LoadingPage'
import Auth from '../../lib/Auth'
import Settings from '../../lib/Settings'


class UsersShow extends React.Component{

  constructor(){
    super()
    this.state = {}
    this.handleFollowEvent = this.handleFollowEvent.bind(this)
    this.handleUnfollowEvent = this.handleUnfollowEvent.bind(this)
    this.handleUsersMessagingEvent = this.handleUsersMessagingEvent.bind(this)

  }

  componentDidMount(){
    axios.get(`/api/users/${this.props.match.params.id}`)
      .then( res =>{
        this.setState({ usersDetail: res.data})
      })
  }

  handleFollowEvent(){
    const headers = {'Authorization': `Bearer ${Auth.getToken()}`}
    const body = ''
    if(Auth.isAuthenticated()){
      axios.post(`/api/users/${this.props.match.params.id}/follow`,body, {headers: headers})
        .then( res =>{
          this.setState({ usersDetail: res.data})
        })
    }
  }

  handleUnfollowEvent(){
    const headers = {'Authorization': `Bearer ${Auth.getToken()}`}
    const body = ''
    if(Auth.isAuthenticated()){
      axios.post(`/api/users/${this.props.match.params.id}/unfollow`,body, {headers: headers})
        .then( res =>{
          this.setState({ usersDetail: res.data})
        })
    }
  }

  handleUsersMessagingEvent(){
    if(Auth.isAuthenticated()){
      this.props.history.push(`/users/${this.props.match.params.id}/message`)
    }
  }


  render(){
    if(!this.state.usersDetail ) return <LoadingPage />
    return(
      <Container>
        <Divider  hidden />
        <Segment inverted={Settings.isNightMode()}>
          <UsersDetail
            usersDetail={this.state.usersDetail}
            handleFollowEvent={this.handleFollowEvent}
            handleUnfollowEvent={this.handleUnfollowEvent}
            handleUsersMessagingEvent={this.handleUsersMessagingEvent}
          />
        </Segment>
      </Container>

    )
  }
}


export default UsersShow
