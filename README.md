# General Assembly Project 4: READ-ME
A group project of 3 members [Joshua King](https://github.com/joshuaking06), [Siddant Gurung](https://github.com/Siddant), [Alessandro Lepri](https://github.com/alessandrolepri)
## Goal
To create a full-stack app using Python and PostgreSQL on the server-side and React on the client-side.
A live version of this site can be found on Heroku ----> https://read-meee.herokuapp.com/
## Timeframe
7 Days
## Technologies Used
* React
* JavaScript (ES6)
* PostgreSQL
* Flask
* Python version 3.7
* Mocha & Chai
* Axios
* SCSS/CSS
* Babel
* Semantic UI
* HTML5
* Git/Github
* Heroku
* Enzyme
* Sinon
* SQLAlchemy
* Insomnia
* Heroku
* flask-sqlalchemy
* marshmallow-sqlalchemy
* praw
* flask-bcrypt
* psycopg2-binary
* pyjwt
* flask-marshmallow
* Webpack
* JWT
* jsdom
* dotenv
* moment
* bcrypt

### APIs:
* Reddit
* Web Speech API

# Project Summary
Read-me is a content creation site for authors and readers to share, read, and discover new short stories. Read-me allows authors and readers to connect; it also allows them to communicate. The application is mobile responsive so users can use it with their phone. It was created using the MVC design pattern.
Any users can check all the stories on reddit and also stories published by other users and start reading.
The user reading has than been implemented by converting from text to voice the stories and also set up the night mode that will change the colour of the screen for a less bright screen
If any READ-ME users would like to contact other users by sending messages and leave comment or publish short stories the register form is necessary and by log-in they can start their journey into the app and became a potential writer, join the readers community and, add the stories to the reading list for the future.

# Process
The development of the project started with brainstorming some features to be included in the application. Our focus then shifted toward designing the database by creating an Entity Relationship Diagram. The image below show the relationship between tables on the application database:

![screenshot](https://user-images.githubusercontent.com/5802969/55109848-a730f780-50ce-11e9-9099-a657a163abbc.png)

* A one-to-many relationship between Story and Comment
* A one-to-many relationship between User and Comment
* A one-to-many relationship between User and Story
* A one-to-many relationship between User and Reading List
* A one-to-many relationship between User and Message
* A many-to-many relationship between User and Story
* A many-to-many relationship between Reading List and Story
* A many-to-many relationship between User

### Mobile Focused
From the outset, we decided we wanted to make the app heavily focused towards mobile. Since this is an app we envisioned people using while on the commute to work, sitting in bed, or just anywhere on the go. Semantic UI's very good documentation made it even more achievable to do this with a large app on just a seven day timeframe. Because of this mobile focused development, we felt a sidebar would fit very well for this app.

![screenshot](https://user-images.githubusercontent.com/5802969/55107157-806fc280-50c8-11e9-99a1-6032f40c860b.png)

To manage the project Trello was used frequently, also we had daily stand-ups to track our progress. Features were implemented by creating a separate git branches on our local computer before merging into the main development branch. Any merge conflicts or blockers were discussed as a group to solve the issues as fast as possible. The routes for the front-end and the back-end were discussed as a group, so any confusion could be avoided during the development phase. Each of the application features were prioritised using the MoSCoW method.

## Back End Functionality

### Following and Followers
We wanted to have readers to follow their favourite author, therefore we decided to implement a social media aspect of allowing users to follow other users. We decided that having a friends request system would be time consuming, therefore we decided to have a simple follow and following system. This feature was implemented  by using a /follow endpoint, when users made  the request using this endpoint SQLAlchemy would query the database to find the specified user and append the current user to the user followers list. Finally, the user would then be saved again in the database and updated with the updated data.
We also implement a feature which allow users to unfollow any users they are following, the concept was similar to the following feature. When the user made a request to the /unfollow endpoint, the current user would be removed from the user followers list.
follow:

```
@api.route('/users/<int:user_id>/follow', methods=['POST'])
@secure_route
def follow_users(user_id):
    user = User.query.get(user_id)
    follower = g.current_user
    follower.following.append(user)
    user.save()
    return user_schema.jsonify(user), 201
```
unfollow:
```
@api.route('/users/<int:user_id>/unfollow', methods=['POST'])
@secure_route
def unfollow_users(user_id):
    user = User.query.get(user_id)
    unfollow = g.current_user
    unfollow.following.remove(user)
    user.save()
    return user_schema.jsonify(User.query.get(user_id)), 201
```

### Messaging Users
We wanted the readers and authors to connect and be able to communicate with each, therefore we decided to have messaging system implemented on our application. This was done using /inbox endpoint with the users id. When users made the request the message (which was send on the body of the request), the receive id (the id that is being send with the end point ```<int:user_id> ```) and the current user id (this was received using the g method) was stored to the message table.

```
@api.route('/users/<int:user_id>/inbox', methods=['POST'])
@secure_route
def send_message(user_id):
    message, errors = message_schema.load(request.get_json())
    message.sender = g.current_user
    message.receiver = User.query.get(user_id)
    if errors:
        return jsonify(errors), 422
    message.save()
    return message_schema.jsonify(message), 200
```

### Reddit API
We used the Reddit API to pull in additional short stories from the short stories subreddit. This was done using "praw", a wrapper for for the Reddit API using python. We also allow users to save a story from reddit to their reading list, which will also save the short story to our database, allowing users to make comments on it as well. In the future, we'd like to prevent the same reddit story from being added to the database multiple times.
```

@api.route('/reddit/<string:post_id>', methods=['GET'])
def reddit_story_show(post_id):
    submission = reddit.submission(id=post_id)
    post = {}
    post["title"] = submission.title
    post["score"] = submission.score
    post["id"] = submission.id
    post["genre"] = submission.link_flair_text
    post["url"] = submission.url
    post["created"] = submission.created
    post["content"] = submission.selftext
    return jsonify(post)
```

### Reading List
In the event that a user finds a story they like, but do not have the time or possibility of starting or finishing the story, users can choose to save the selected story to their reading list. This was done using a /save endpoint along with the selected storyid. When users made the request to this endpoint, SQLAlchemy would query the database to find the specified story and then append it to the current user's reading list. Finally, the user would then be saved again in the database and updated with the updated reading list.

```
@api.route('/save/<int:story_id>', methods=['POST'])
@secure_route
def save_story(story_id):
    story = Story.query.get(story_id)
    user = g.current_user
    user.read_list.append(story)
    user.save()
    return user_schema.jsonify(user), 201
```

## Front-End Functionality
The implementation of the front-end of the application was started by wire-framing. The design of the application was heavily focused towards mobile responsive, then moved onto the layout design for a desktop version. The wire-framing process was carried out by drawing the design on a classroom board. The images of the application wire-framing can be seen below:

![screenshot](https://user-images.githubusercontent.com/5802969/55106937-03dce400-50c8-11e9-9239-9dbb6a3ebec2.jpg)

React was used to created the front-end side of the application, we also decided to used a component framework called Semantic UI to speed the building process. To implement the features we each picked a feature we were comfortable developing and started to implement it individually at our own pace.
We started to implement these features base on their priority level. The MVP of the application was achieved at an early stage of the project, the focus then shifted towards implementing as much of extra features as possible.

We carried out test on the front-end side of the application using  Mocha, Chai, and Enzyme to test a functional and classical React component. We set-up the JSDOM to create a virtual browser which will run on the terminal. We tested UsersShow for classical component and UsersDetail for functional component. The test we conducted on these components were to see if they would render data properly on HTML format.
For the functional component dummy data were created and passed as props. Using the Enzyme shallow method it was then render and test were conducted. To see if the component rendered the HMTL properly. We also conducted similar type of test for the classical component, as the classical component get the data using the axios request. We had to use sinon to fake the axios request. As the classical component contains a lot of functional component, we had to Enzyme mount method which will allow us to go bit deeper with rendering process. This allowed us to check that the data stored in the state was accurate and was rendered properly on the HTML.
### Night Mode
We thought night mode would be a very useful feature for those who love reading without the eye strain of a bright screen. This feature was achieved by creating a Settings class with static methods which saved the night mode setting in local storage, which would still be useful for if the user left the site and returned later. It was debated having night be stored in the database for each account, however we wanted any user(logged in or otherwise) to have access to night mode.
### Flip Effects
This was achieved using a package call 'react-flip-page'. While it certainly was an essential and very useful part of creating the overall look and feel of the site, it was definitely a big challenge to work with and to style correctly.
### Text to voice
We included this feature which allow users to listen to the story they have selected, similar to an audio book. This feature was implemented using Speech synthesis (aka text-to-speech, or tts), which is provided by the Web Speech API. We wanted this function to be available on different component, therefore we decided to have it as a static method which will receive a text and using the in build method to playing it out of a device's speaker or audio output connection.
```
static appSpeak(text){
  synth.cancel()
  msg.text = text
  synth.speak(msg)
}
```


### Contribution
In this project I contribute towards the development features such as messaging system, Text to Speech and Following other users. I was responsible for doing the front-end test using Enzyme.

# Challenge
Testing proves to be a bit of challenge as the component I was testing required the use of localStorage, as we were using a virtual DOM. There was no localStorage for the component to therefore the testing threw an error. To solve this issue we had to create a virtual localStorage using the code below:
```
window.localStorage = (function() {
  const store = {}

  return {
    getItem(key) {
      return store[key]
    },
    setItem(key, value) {
      store[key] = value
    },
    removeItem(key) {
      delete store[key]
    }
  }
})
```

Implementing the follow and following feature was hard, as it required the model to reference it self. I had to start researching and had to read documentation for SQLAlchemy, which I found extremely confusing. I was able to overcome this issue by following the guidance of this tutorial https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-viii-followers-contacts-and-friends-legacy. Another issue I had to deal was, python has a function called id. Therefore when I was trying to reference the table id, python was referencing the id to the python id function.

# Win
The implement of the follow and following feature was a personal win for me, this was the hardest and most confusing feature to work on. I am pleased to be able to implement this feature as it gives a realistic feel to the app. The main takeaway form this project was being able to develop an application using a new language which we learned in a timeframe of 2 weeks.  

# Future features
If we would have had more time our idea was to implement these features to the application App:
* language translator to let the user choose the reading prefer reading language.
* reset users password using an email service by send a randomly generated code to the users email address, which they can use to rest their password.
* allow users to comment using gifs.
* bookmark the stories, so they can continue to read the story form where they left time.
* deleting stories from their reading list
* rate story using a 1 to 5 star rating system.
