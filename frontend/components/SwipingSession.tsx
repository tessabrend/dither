import  React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Platform, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CountDown from 'react-native-countdown-component';
import ProgressBar from "react-native-animated-progress";
import Modal from "react-native-modal";
import Star from 'react-native-star-view';
import { useNavigation } from '@react-navigation/native';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

class Session extends Component {
    state = {
        progress: 0,
        modalVisible: false,
        data: [] as any[],
        hours: [] as any[],
        index: 0,
        navigator: null,
        restaurantParams: {}
    }

    constructor(props) {
        super(props);
        this.navigation = props.navigator;
        this.state.restaurantParams = this.navigation.getState()["routes"][2]["params"];
    }

    increment = () => {
        this.setState((state) => {
            return {progress: state.progress + (100 / this.state.data?.length)}
        })
    }

    toggleModal = (visible) => {
        this.setState({ modalVisible: visible })
    } 
    
    showMoreDetails = (index) => {
        this.setState({ index: index })
    }

    splitHours = (string) => {
        let days = string?.split(';')
        this.setState({ hours: days })
    }

    toggleSwiping = (swiping) => {
        //this.setState({ canSwipe: !swiping })
        swiping = false
    }

    getRestaurants = async () => {
        //const url = 'http://131.104.49.71:80/restaurant/query?' + new URLSearchParams(this.state.restaurantParams);
        //const 
        try {
            const response = await fetch('http://131.104.49.71:80/restaurant/query?' + new URLSearchParams(this.state.restaurantParams), {
                headers: {
                    'Accept': 'application/json'
                }
            })
            const json = await response.json()
            this.setState({ data: json })
        } catch(error) {
            console.error(error)
        }  
    }

    getPriceBucket = (price_bucket) => {
        switch (price_bucket) {
            case "1":
                return (
                    <View style={styles.bucketRow}>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    </View>
                );
            case "2":
                return (
                    <View style={styles.bucketRow}>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    </View>
                );
            case "3":
                return (
                    <View style={styles.bucketRow}>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    </View>
                );
            case "4":
                return (
                    <View style={styles.bucketRow}>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    <FontAwesomeIcon icon="dollar-sign" size={15}/>
                    </View>
                );
            default:
                break;
        }
        return null;
     }

    componentDidMount = () => {
        this.getRestaurants()
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={styles.centeredView}>
                     <Modal
                     coverScreen={true}
                     isVisible={this.state.modalVisible}
                     onSwipeComplete={() => this.toggleModal(!this.state.modalVisible)}
                     swipeDirection="down"
                     // show more details modal
                     >
                     <View style={styles.centeredView}>
                         <View style={styles.modalView}>
                             <Text style={styles.modalText}>Hours of Operation:</Text>
                            { this.state.hours?.map((item, key)=>(
                            <Text key={key}> { item } </Text>)
                            )}
                            <Text style={styles.moreDetailsTagItem}>{this.state.data[this.state.index]?.cuisine}</Text>
                            <Text style={styles.moreDetailsTagItem}>{this.state.data[this.state.index]?.dining_option}</Text>
                         </View>
                     </View>
                    </Modal>
                </View>
                <Swiper
                // card deck component
                    ref={swiper => {
                        this.swiper = swiper;
                    }}
                    cards={this.state.data}
                    key={this.state.data?.length}
                    renderCard={(card) => {
                        return (
                            <View style={styles.card}>
                                {/*<Image
                                style={styles.restaurantImage}
                                source={{uri: card?.picture}}
                                />*/}
                                <Text style={styles.cardName}>{card?.name}</Text>
                                <Star score={card?.rating ? card?.rating : 0} style={styles.starStyle} />
                                <Text>{card?.location}</Text>
                            </View>
                        )
                    }}
                    onSwiped={() =>  {this.increment()}}
                    onSwipedAll={() => {
                        this.toggleSwiping(this.swiper.horizontalSwipe); 
                        this.toggleSwiping(this.swiper.verticalSwipe);
                        this.navigation.navigate('Compromise');
                    }} //this needs to change to disable swiping
                    onSwipedLeft={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped no')}}
                    onSwipedRight={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped like')}}
                    onSwipedTop={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped crave')}}
                    onSwipedBottom={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped hard no')}}
                    onTapCard={(cardIndex) => {this.toggleModal(!this.state.modalVisible); this.showMoreDetails(cardIndex); this.splitHours(this.state.data[this.state.index]?.hours)}}
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
                    onFinish={() => {alert("Session Over")}} //neither currently working
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
        marginTop: Platform.OS === 'ios' ? screen.width + 160 : screen.width,
        paddingRight: 30,
        paddingLeft: 30,
        marginVertical: "3%"
    },
    progressBar: {
        justifyContent: "center",
        //alignItems: "center",
        bottom: screen.height/8,
        marginTop: 20,
        marginRight: 20,
        marginLeft: 20,
    },
    timer: {
        justifyContent: "center",
        alignItems: "flex-end",
        marginTop: 10,
        marginRight: 20,
        bottom: screen.height/8
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
        backgroundColor: '#B3B3B3',
       width: 70,
        height: 40,
        borderColor: '#000000',
        borderWidth: 2,
        alignItems: "center",
        textAlign: "center",
        marginBottom: 30
      },
      moreDetailsTags: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 20,
      },
      restaurantImage: {
          borderColor: '#000000',
          borderWidth: 2,
          width: 320,
          height: Platform.OS === 'ios' ? screen.height - 650 : screen.height - 600,
          alignSelf: "center",
          marginBottom: Platform.OS === 'ios' ? 20 : 10,
      },
      bucketRow: {
        flexDirection: "row",
        padding: 5,
      },
      starStyle: {
        width: 100,
        height: 20,
      },
  });
