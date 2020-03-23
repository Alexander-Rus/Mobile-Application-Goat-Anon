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
  ScrollView,
  Image,
} from 'react-native';
import Constants from 'expo-constants';
import Header from './header';
import Card from './Post';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import Modal from "react-native-modal";


//This is the 'Main Activity  View' and therfore has a lot of activity going on in it.

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
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
}


//Declare the class
export class View_1_1 extends Component {
  _isMounted = false;

  constructor(props) {
    super(props)

    this.state = {
      message: '',
      messages: [],
      postsReverseTop: [],
      postsLikedTop: [],
      postsDislikedTop: [],
      postsTotalTop: [],
      posts: [],
      post: '',
      isModalVisible: false,
      isModalVisible2: false,
      showContent: 0,
    }

    this.writeUserData = this.writeUserData.bind(this)
    this.postView = this.postView.bind(this)
    this.calculateFieldsLikes = this.calculateFieldsLikes.bind(this)
    this.calculateFieldsDislikes = this.calculateFieldsDislikes.bind(this)

    
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleModal2 = () => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2 });
  };


  calculateFieldsLikes(ar) {
    console.log("Can i do this?")
    var reversed = ar
    console.log("This is the arr:", ar)
    var dict = {};
    for (var i in ar) {
      console.log(ar[i].likes)
      dict[i] = ar[i].likes
    }

    var sortable = [];
    for (var v in dict) {
        sortable.push([v, dict[v]]);
    }

    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    console.log("this is the dic: ", sortable[0][0])

    reversed = []
    for (var k in sortable) {
      reversed.push(ar[sortable[k][0]])
    }
    console.log(reversed)
    return reversed
  }

  //In order to format the thread properly, we need to change the state to be ordered correctly.
  calculateFieldsDislikes(ar) {
    var reversed = ar
    var dict = {};
    for (var i in ar) {
      dict[i] = ar[i].dislikes
    }
    var sortable = [];
    for (var v in dict) {
        sortable.push([v, dict[v]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    reversed = []
    for (var k in sortable) {
      reversed.push(ar[sortable[k][0]])
    }
    return reversed
  }

  calculateFieldsTotal(ar) {
    var reversed = ar
    var dict = {};
    for (var i in ar) {
      dict[i] = ar[i].dislikes + ar[i].likes
    }
    var sortable = [];
    for (var v in dict) {
        sortable.push([v, dict[v]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    reversed = []
    for (var k in sortable) {
      reversed.push(ar[sortable[k][0]])
    }
    return reversed
  }

  //Retreive the posts from the database and update should the database change.
  componentDidMount() {
    this._isMounted = true;

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
            posts: initPosts,
            postsReverseTop: initPosts.reverse(),
            postsLikedTop: this.calculateFieldsLikes(initPosts),
            postsDislikedTop: this.calculateFieldsDislikes(initPosts),
            postsTotalTop: this.calculateFieldsTotal(initPosts),  
          })
        }
      });

      firebase
      .database()
      .ref()
      .child("posts")
      .on("child_changed", snapshot => {
        const data = snapshot.val();
        var newState = {}
        if (data) {
          for (var i in this.state.posts) {
            if(data.title === this.state.posts[i].title) {
              newState = this.state
              newState.posts[i] = data
            }
          }
          console.log("This is the new state", newState.posts)
          this.setState({posts: newState.posts})
        }
      })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }



  writeUserData(postID, time, title, likes, dislikes) {
    var newLikes = likes + 1
    firebase.database().ref('posts/' + time).set({
      time: time,
      title: title,
      likes: newLikes,
      dislikes : dislikes,
    });
  }

    handleClick = () => {
        console.log('I want to go pack a page');
    }

    nextS = () => {
        this.props.nextStep();
    }

    previousS = () => {
        this.props.prevStep();
    }

    postView = (time) => {
      this.props.postV(time);
    }

    buttonRecent = () => {
      this.setState({showContent: 0})
      this.toggleModal()
    }

    buttonLikes = () => {
      this.setState({showContent: 2})
      this.toggleModal()
    }

    buttonDislikes = () => {
      this.setState({showContent: 3})
      this.toggleModal()
    }

    buttonTotal = () => {
      this.setState({showContent: 1})
      this.toggleModal()
    }

    render() {
      const {showContent} = this.state

      let image;
      if (showContent == 0 ){
        image = <FlatList data={this.state.postsReverseTop}
        renderItem={
          ({item}) =>
          <TouchableOpacity onPress={() => this.postView(item.time)}>
          <View style={styles.card}>
            <Text style={styles.listItemTime}>
              {item.time}
            </Text>
            <Text style={styles.listItem}>
              {item.title}
            </Text>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart" size={30} color="#ff5757"/>
              <Text style={styles.listItemLikes}>
              {item.likes}
            </Text>
            </View>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart-dislike" size={30} color="#ff5757"/>
              <Text style={styles.listItemDislikes}>
              {item.dislikes}
            </Text>
            </View>
          </View>
          </TouchableOpacity> 
          }
        />
      } else if( showContent == 1 ) {
        image = <FlatList data={this.state.postsTotalTop}
        renderItem={
          ({item}) =>
          <TouchableOpacity onPress={() => this.postView(item.time)}>
          <View style={styles.card}>
            <Text style={styles.listItemTime}>
              {item.time}
            </Text>
            <Text style={styles.listItem}>
              {item.title}
            </Text>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart" size={30} color="#ff5757"/>
              <Text style={styles.listItemLikes}>
              {item.likes}
            </Text>
            </View>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart-dislike" size={30} color="#ff5757"/>
              <Text style={styles.listItemDislikes}>
              {item.dislikes}
            </Text>
            </View>
          </View>
          </TouchableOpacity> 
          }
        />
      } else if( showContent == 2 ) {
        image = <FlatList data={this.state.postsLikedTop}
        renderItem={
          ({item}) =>
          <TouchableOpacity onPress={() => this.postView(item.time)}>
          <View style={styles.card}>
            <Text style={styles.listItemTime}>
              {item.time}
            </Text>
            <Text style={styles.listItem}>
              {item.title}
            </Text>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart" size={30} color="#ff5757"/>
              <Text style={styles.listItemLikes}>
              {item.likes}
            </Text>
            </View>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart-dislike" size={30} color="#ff5757"/>
              <Text style={styles.listItemDislikes}>
              {item.dislikes}
            </Text>
            </View>
          </View>
          </TouchableOpacity> 
          }
        />
      } else if( showContent == 3 ) {
        image = <FlatList data={this.state.postsDislikedTop}
        renderItem={
          ({item}) =>
          <TouchableOpacity onPress={() => this.postView(item.time)}>
          <View style={styles.card}>
            <Text style={styles.listItemTime}>
              {item.time}
            </Text>
            <Text style={styles.listItem}>
              {item.title}
            </Text>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart" size={30} color="#ff5757"/>
              <Text style={styles.listItemLikes}>
              {item.likes}
            </Text>
            </View>
            <View style={styles.msgBox}>
              <Ionicons name="ios-heart-dislike" size={30} color="#ff5757"/>
              <Text style={styles.listItemDislikes}>
              {item.dislikes}
            </Text>
            </View>
          </View>
          </TouchableOpacity> 
          }
        />
      }


        return (
            <SafeAreaView style={styles.container}>
            <Header
                title="Main Activity"
            />
            <TouchableOpacity onPress={this.toggleModal2} style={styles.iconClick}>
              <Ionicons name="ios-information-circle-outline" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.toggleModal}>
              <Ionicons name="ios-menu" size={42} color="#ff5757" style={styles.iconMenu}/>
            </TouchableOpacity>
            {image}
            <TouchableOpacity onPress={this.nextS}>
              <Text style={styles.newPost}>
                  Create New Post
                  </Text>
                    <Ionicons name="ios-add-circle" size={72} color="#ff5757" style={styles.icon} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
              <Modal isVisible={this.state.isModalVisible}>
                <View style={{ flex: 1 }}>
                  <View style={styles.cardModol}>
                    <Text style={styles.listItem}>
                      Sort Main Thread By: {'\n'}
                    </Text>
                    <TouchableOpacity onPress={this.buttonTotal}>
                      <Text style={styles.listItem}>
                        Most Interaction 
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.separator}/>
                    <TouchableOpacity onPress={this.buttonLikes}>
                      <Text style={styles.listItem}>
                        Highest Number of Likes 
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.separator}/>
                    <TouchableOpacity onPress={this.buttonDislikes}>
                      <Text style={styles.listItem}>
                        Highest Number of Dislikes 
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.separator}/>
                    <TouchableOpacity onPress={this.buttonRecent}>
                      <Text style={styles.listItem}>
                        Most Recent (default)
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Button title="Never Mind" onPress={this.toggleModal} />
                </View>
              </Modal>

              <Modal isVisible={this.state.isModalVisible2}>
                <View style={{ flex: 1 }}>
                  <ScrollView style={styles.cardModol}>
                  <Text style={styles.listItem}>
                      Welcome to Goats-Anon Mobile!
                  </Text>
                  <Text style={styles.body}>
                  This is an anonymous social media discussion mobile application that allows anyone to create, like, dislike, and reply to posts. 
                  </Text>
                  <Text style={styles.subHeading}>
                      How it Works
                  </Text>
                  <Text style={styles.body}>
                  The application is separated into a few Basic areas. The 'Main Activity' page is where the 
                  majority of the action takes place. users can view all of the anonymous posts that other users
                   have created. This thread is updated in real time, so the moment a new post is created, it is
                    added to the thread. 
                  </Text>
                  <Image style={styles.Img} source={require('../Images/IMG_1.png')} />
                  <Text style={styles.body}>
                  The order in which posts are displayed can be altered depending on user preferences. By clicking
                   on the red navigation menu in the top right, you will be asked what kind of sorting scheme you
                    would like to use when viewing the posts. By default the scheme puts the most recent posts at
                     the top, however you can change this by selecting 'Most Interaction', 'Highest Number of
                      Likes', or 'Highest Number of Dislikes'. When you click on one of these options the 'Main
                       Activity' view is immediately updated. 
                  </Text>
                  <Image style={styles.Img} source={require('../Images/IMG_4.png')} />
                  <Text style={styles.body}>
                  To create a new post, one must simply click on the "Create New Post" icon at the bottom of the
                   view. This will bring the user to the Create new Post view. You may then enter a post, with a
                    maximum of 200 characters and hit "Add to timeline". This will then add the new post to the
                     'Main Activity' thread, with zero likes, dislikes , and comments.  
                  </Text>
                  <Image style={styles.Img} source={require('../Images/IMG_3.png')} />
                  <Text style={styles.body}>
                  If you click on one of the posts you will be brought to the 'Post' view.
                   This view shows the post in all of its glory. From this view you click
                    "Like this post" or "Dislike this post" to automatically update the number
                     of likes or dislikes a post has. Additionally, in each post there is a reply
                      section. By entering a reply, and clicking 'Send', a new reply is added to
                       the list of existing replies. 
                  </Text>
                  <Image style={styles.Img} source={require('../Images/IMG_2.png')} />
                  <Text style={styles.subHeading}>
                    Who We Are
                  </Text>
                  <Text style={styles.body}>
                  This application was made as the final project for CS 4518 taught by Professor Tian Guo.
                   This project was completed by Fabian Gaziano, Leo Gonsalves, and Alexander Rus. All three
                    of us are Seniors at Worcester Polytechnic Institute, and we all have a passion for mobile
                     software development. 
                  </Text>
                  <Image style={styles.Img2} source={require('../Images/WPI_logo.png')} />
                  </ScrollView>
                  <Button title="Got It!" onPress={this.toggleModal2} />
                </View>
              </Modal>
            </View>
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
      bottom: 10,
      left: 140,
  },
  txtInput: {
    flex: 1
  },
  msgBox: {
    flexDirection: 'row',
    padding: 2,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  listItemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5
  },
  listItem: {
    fontSize: 25,
    padding: 10,
    marginHorizontal: 18,
    marginVertical: 10,
  },
  subHeading: {
    fontSize: 20,
    padding: 6,
    marginHorizontal: 18,
    marginVertical: 10,
  },
  body: {
    fontSize: 15,
    padding: 5,
    marginHorizontal: 18,
    marginVertical: 10,
  },
  listItemTime: {
    fontSize: 7,
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
  cardModol: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    marginTop: 50,
  },
  newPost: {
    color: '#ff5757',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  iconMenu: {
    textAlign: 'right',
    top: 5,
    right: 5,
  },
  iconClick: {
    position: 'absolute',
    top: 9,
    left: 14,
  },
  Img: {
    left: 40,
    width: 250,
    height: 500,
  },
  Img2: {
    marginLeft: 40,
    width: 250,
    height: 250,
  }
});

export default View_1_1;
