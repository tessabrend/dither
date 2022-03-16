import  React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Platform, Alert, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CountDown from 'react-native-countdown-component';
import ProgressBar from "react-native-animated-progress";
import Modal from "react-native-modal";
import  { Rating } from 'react-native-elements';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

class Session extends Component {
    state = {
        progress: 0,
        modalVisible: false,
        data: [] as any[],
        index: 0
    }

    increment() {
        this.setState((state) => {
            return {progress: state.progress + this.state.data?.length}
        })
    }

    toggleModal(visible) {
        this.setState({ modalVisible: visible })
    } 
    
    showMoreDetails(index) {
        this.setState({ index: index })
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
        console.log(this.state.data)
        // <Rating
        // rating={card?.rating}
        // max={card?.rating}
        // iconWidth={30}
        // iconHeight={20}
        // editable={false}/>

        return (
            <View style={styles.container}>
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
                            <Text style={styles.modalText}>{this.state.data[this.state.index]?.hours}</Text>
                            <View style={styles.moreDetailsTags}>
                                <View style={styles.moreDetailsTagItem}>
                                    <Text style={styles.modalText}>{this.state.data[this.state.index]?.cuisine}</Text>
                                </View>
                                <View style={styles.moreDetailsTagItem}>
                                    <Text style={styles.modalText}>{this.state.data[this.state.index]?.dining_option}</Text>
                                </View>
                            </View>
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
                                <Image
                                style={styles.restaurantImage}
                                source={{uri: card?.picture}}
                                />
                                <Text style={styles.cardName}>{card?.name}</Text>
                                <Rating
                                    type='custom'
                                    fractions={1}
                                    startingValue={card?.rating}
                                    readonly
                                    imageSize={30}
                                    tintColor="#E8E8E8"
                                    style={{alignSelf: "left"}}
                                />
                                <Text>{card?.location}</Text>
                            </View>
                        )
                    }}
                    onSwiped={() =>  {this.increment()}}
                    onSwipedAll={() => {!this.swiper.horizontalSwipe;}} //this needs to change to disable swiping
                    onSwipedLeft={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped no')}}
                    onSwipedRight={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped like')}}
                    onSwipedTop={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped crave')}}
                    onSwipedBottom={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped hard no')}}
                    onTapCard={(cardIndex) => {this.toggleModal(!this.state.modalVisible); this.showMoreDetails(cardIndex)}}
                    cardIndex={0}
                    backgroundColor={'#ffffff'}
                    stackSize= {3}
                    marginBottom={screen.width / 5}
                    marginTop={screen.width / 5}>
                </Swiper>
                <View style={styles.timer}>
                    <CountDown
                    size={15}
                    until={300} //time in seconds
                    onFinish={() => {!this.swiper.horizontalSwipe; !this.swiper.verticalSwipe;}} //not currently working
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
        marginTop: Platform.OS === 'ios' ? screen.width + 160 : screen.width + 90,
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
      },
      cardName: {
          fontSize: 50,
      },
      moreDetailsTagItem: {
        //backgroundColor: '#B3B3B3',
       // width: 70,
        //height: 40,
        //borderColor: '#000000',
        //borderWidth: 2,
        //alignItems: "center",
        //textAlign: "center",
      },
      moreDetailsTags: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 20,
      },
      restaurantImage: {
          borderColor: '#000000',
          borderWidth: 2,
          width: 320,
          height: 300,
          alignSelf: "center",
          marginBottom: 20,
      },
  });