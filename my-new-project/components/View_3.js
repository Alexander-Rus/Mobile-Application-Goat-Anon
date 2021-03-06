import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Constants from 'expo-constants';
import Header from './header';
import Card from './Post';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase'



//We need to connect to firebase using the proper credientials. 
//If you are viewing this in the github repo, the keys are going to be hidden,
//You can set up your own keys and database through firebase
var firebaseConfig = {
  apiKey: "########################",
  authDomain: "########################",
  databaseURL: "########################",
  projectId: "########################",
  storageBucket: "########################",
  messagingSenderId: "########################",
  appId: "########################",
  measurementId: "########################"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
}


//Declare the class
export class View_1_1 extends Component {

  constructor(props) {
    super(props)

    this.state = {
      message: '',
      messages: [],
      posts: [],
      post: '',
      reply:'',
    }

    this.writeUserData = this.writeUserData.bind(this)
    this.writeUserData_Reply = this.writeUserData_Reply.bind(this)
  }

  componentDidMount() {

      firebase
      .database()
      .ref()
      .child("posts")
      .once("value", snapshot => {
        const dat = snapshot.val()
        if (snapshot.val()) {
          const initPosts = [];
          Object
            .keys(dat)
            .forEach(post => initPosts.push(dat[post]));
          this.setState({
            posts: initPosts
          })
        }
      });
      

  }


  writeUserData(postID, time, title, likes, dislikes, replies) {
    alert('Like Added!')
    var newLikes = likes + 1
    firebase.database().ref('posts/' + time).set({
      time: time,
      title: title,
      likes: newLikes,
      dislikes : dislikes,
      replies: replies,
    });
    this.timeLineView()
  }

  writeUserDataDis(postID, time, title, likes, dislikes, replies) {
    alert('Dislike Added!')
    var newDis = dislikes + 1
    firebase.database().ref('posts/' + time).set({
      time: time,
      title: title,
      likes: likes,
      dislikes : newDis,
      replies: replies,
    });
    this.timeLineView()
  }

  writeUserData_Reply(postID, reply, time, title, likes, dislikes, old_Replies) {
    alert('New Reply Added!')
    
    var replyArray = []
    if (old_Replies != null) {
      replyArray = old_Replies;
    }

    if (replyArray[0] ==="No Replies Yet!") {
      replyArray[0] = reply
    } else {
      replyArray.unshift(reply)
    }

    firebase.database().ref('posts/' + time).set({
      time: time,
      title: title,
      likes: likes,
      dislikes : dislikes,
      replies: replyArray,
    });
    this.timeLineView()
  }


    nextS = () => {
        this.props.nextStep();
    }

    previousS = () => {
        this.props.prevStep();
    }

    timeLineView = () => {
      this.props.timeLine();
    }



    render() {

      const { postWeView } = this.props
      console.log("this is the state now: ", this.state.posts)
      var targetPost = {}
      for (var i in this.state.posts) {
        if( this.state.posts[i].time === postWeView) {
          console.log("^^^",this.state.posts[i].time)
          console.log("$$$$", postWeView)
          console.log("This is i:", i)
          targetPost = this.state.posts[i]
          console.log("This is the target post", targetPost)
        } else {
          console.log("We didnn;t find it")
        }
      }

        return (
            
            <SafeAreaView style={styles.container}>
            <Header
                title="Post"
            />

            <View>
                <Text style={styles.listItemTime}>
                  {targetPost.time}
                </Text>
                <Text style={styles.listItem}>
                  {targetPost.title}
                </Text>
                <TouchableOpacity style={styles.msgBox} onPress={() => this.writeUserData("1234", targetPost.time, targetPost.title, targetPost.likes, targetPost.dislikes, targetPost.replies)}>
                  <Ionicons name="ios-heart" size={40} color="#ff5757"/>
                  <Text style={styles.listItemLikes}>
                    Like this post: {targetPost.likes}
                  </Text>  
                </TouchableOpacity>

                  <TouchableOpacity style={styles.msgBox} onPress={() => this.writeUserDataDis("1234", targetPost.time, targetPost.title, targetPost.likes, targetPost.dislikes, targetPost.replies)}>
                    <Ionicons name="ios-heart-dislike" size={40} color="#ff5757"/>
                    <Text style={styles.listItemDislikes}>
                    Dislike this post: {targetPost.dislikes}
                    </Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.separator} />
            <View style={styles.msgBox}>
              <TextInput placeholder="Enter Your Reply"
              value={this.state.reply}
              onChangeText={(text) => this.setState({reply: text})}
                style={styles.txtInput}
              />
              <Button title="Send" onPress={() => this.writeUserData_Reply("1234", this.state.reply, targetPost.time, targetPost.title, targetPost.likes, targetPost.dislikes, targetPost.replies)}/>
            </View> 

            <FlatList data={targetPost.replies}
            renderItem={
              ({item}) => 
              <View style={styles.card}>
                <Text style={styles.listItemReply}>
                  {item}
                </Text>

              </View>
              }
            />
            <Button title="Back" onPress={this.timeLineView}/>
            </SafeAreaView>
          );

    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  back_icon: {
      marginTop: 10,
  },
  sub1: {
    color: '#ff5757',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  midBar: {
    height: 50,
    backgroundColor: '#ff5757',
    width: 400,
    marginLeft: -20,
  },
  text1: {
    marginTop: 10,
    marginLeft: 20,
    color: '#fff',
    fontSize: 23,
    textAlign: 'left',
    fontFamily: 'Futura',
    fontWeight: 'bold',
  },
  icon: {
      position: 'absolute',
      left: 210,
      top: 375,
  },
  txtInput: {
    flex: 1
  },
  msgBox: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#fff',
  },
  listItemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5
  },
  listItem: {
    fontSize: 30,
    padding: 10,
    marginHorizontal: 18,
    marginVertical: 10,
  },
  listItemReply: {
    fontSize: 15,
    padding: 5,
    marginHorizontal: 18,
    marginVertical: 10,
  },
  listItemTime: {
    fontSize: 10,
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  listItemLikes: {
    fontSize: 15,
    padding: 3,
    marginHorizontal: 5,
    marginVertical: 5,
    color: '#ff5757',
  },
  listItemDislikes: {
    fontSize: 15,
    padding: 3,
    marginHorizontal: 5,
    marginVertical: 5,
    color: '#ff5757',
  },   
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6

  },
  newPost: {
    color: '#ff5757',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default View_1_1;
