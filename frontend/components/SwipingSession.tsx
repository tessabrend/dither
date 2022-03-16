import  React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Platform, Alert, FlatList } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CountDown from 'react-native-countdown-component';
import ProgressBar from "react-native-animated-progress";
import Modal from "react-native-modal";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

class Session extends Component {
    state = {
        progress: 0,
        modalVisible: false,
        data: [] as any[],
    }
    
    data1 = ['this', 'is', 'a', 'resturant', 'overview', 'card', 'almost', 'at', 'the', 'end'];

    increment() {
        this.setState((state) => {
            return {progress: state.progress + this.data1.length}
        }), () => 
        console.log(this.state.progress)
    }

    toggleModal(visible) {
        this.setState({ modalVisible: visible })
    }    

    async getRestaurants() {
        try {
            const response = await fetch('http://131.104.49.71:80/restaurant/query?' + new URLSearchParams({
            "cuisine": "Pub",
            "rating": "3.0",
            "price-high": "80",
            "price-low": "20",
            "start-index": "0",
            "end-index": "50",
            }))
            const json = await response.json()
            this.setState({ data: json.restaurants })
        } catch(error) {
            console.error(error)
        }  
    }

    componentDidMount() {
        this.getRestaurants()
      }

    render () {
        console.log(this.state.data[0]?.name)

        return (
            <View style={styles.container}>
                <View style={styles.timer}>
                    <CountDown
                    size={15}
                    until={300} //time in seconds
                    onFinish={() => Alert.alert('Finished')} //this needs to change to disable swiping
                    digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#000000'}}
                    digitTxtStyle={{color: '#000000'}}
                    timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                    separatorStyle={{color: '#000000'}}
                    timeToShow={['H', 'M', 'S']}
                    timeLabels={{m: null, s: null}}
                    showSeparator
                    />
                </View>
                <View style={styles.progressBar}>
                    <ProgressBar progress={this.state.progress} height={10} backgroundColor="#1167b1" />
                </View>
                <View style={styles.centeredView}>
                     <Modal
                     coverScreen={true}
                     isVisible={this.state.modalVisible}
                     //presentationStyle="overFullScreen"
                     onSwipeComplete={() => this.toggleModal(!this.state.modalVisible)}
                     swipeDirection="down"
                     >
                     <View style={styles.centeredView}>
                         <View style={styles.modalView}>
                         <Text style={styles.modalText}>Hello World!</Text>
                         </View>
                     </View>
                    </Modal>
                </View>
                <Swiper
                    ref={swiper => {
                        this.swiper = swiper;
                    }}
                    cards={this.state.data}
                    renderCard={(card) => {
                        return (
                            <View style={styles.card}>
                                <FlatList
                                    data={card}
                                    keyExtractor={({ id }, index) => id}
                                    renderItem={({ item }) => (
                                    <Text>{item?.name}, {item?.rating}</Text>
                                    )}
                                />
                            </View>
                        )
                    }}
                    onSwiped={() =>  {this.increment()}}
                    onSwipedAll={() => {console.log('onSwipedAll')}} //this needs to change to disable swiping
                    onSwipedLeft={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped no')}}
                    onSwipedRight={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped like')}}
                    onSwipedTop={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped crave')}}
                    onSwipedBottom={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped hard no')}}
                    onTapCard={() => {this.toggleModal(!this.state.modalVisible)}}
                    cardIndex={0}
                    backgroundColor={'#ffffff'}
                    stackSize= {3}
                    marginBottom={screen.width / 5}
                    marginTop={screen.width / 5}>
                </Swiper>
                <View style={styles.buttonRow}>
                    <Pressable onPress={() => this.swiper.swipeLeft()}>
                        <FontAwesomeIcon icon="circle-xmark" size={50}/>
                    </Pressable>
                    <Pressable onPress={() => this.swiper.swipeBottom()}>
                        <FontAwesomeIcon icon="face-frown" size={50}/>
                    </Pressable>
                    <Pressable onPress={() => this.swiper.swipeTop()}>
                        <FontAwesomeIcon icon="face-grin-stars" size={50}/>
                    </Pressable>
                    <Pressable onPress={() => this.swiper.swipeRight()}>
                        <FontAwesomeIcon icon="heart" size={50}/>
                    </Pressable>
                </View>
        </View>
        );
    }
};

export default Session;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    card: {
      flex: 0.8,
      borderRadius: 5,
      padding: 10,
      borderWidth: 3,
      borderColor: "#000000",
      justifyContent: "center",
      backgroundColor: "#E8E8E8",
    },
    text: {
      textAlign: "center",
      fontSize: 50,
      backgroundColor: "transparent",
    },
    buttonRow: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: Platform.OS === 'ios' ? screen.width + 180 : screen.width + 90,
        paddingRight: 30,
        paddingLeft: 30,
    },
    progressBar: {
        justifyContent: "center",
        //alignItems: "center",
         marginTop: 20,
        marginRight: 20,
        marginLeft: 20,
    },
    timer: {
        justifyContent: "center",
        alignItems: "flex-end",
        marginTop: 10,
        marginRight: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 50,
        width: screen.width - 50,
        height: screen.height / 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
  });