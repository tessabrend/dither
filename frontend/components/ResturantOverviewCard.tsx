import { React, Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';

class CardDeck extends Component {
    data = ['this', 'is', 'a', 'resturant', 'overview', 'card', 'almost', 'at', 'the', 'end'];

    render () {
        return (
            <View style={styles.container}>
            <Swiper
                ref={swiper => {
                    this.swiper = swiper;
                  }}
                cards={this.data}
                renderCard={(card) => {
                    return (
                        <View style={styles.card}>
                            <Text style={styles.text}>{card}</Text>
                        </View>
                    )
                }}
                onSwiped={(cardIndex) => {console.log(cardIndex)}}
                onSwipedAll={() => {console.log('onSwipedAll')}}
                onSwipedLeft={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped no')}}
                onSwipedRight={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped like')}}
                onSwipedTop={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped crave')}}
                onSwipedBottom={(cardIndex) => {console.log('card at index ' + cardIndex +' swiped hard no')}}
                onTapCard={(cardIndex) => {console.log('card at index ' + cardIndex +' tapped, display more info')}}
                cardIndex={0}
                backgroundColor={'#ffffff'}
                stackSize= {3}
                marginBottom={100}
                marginTop={30}>
            </Swiper>
            <View style={styles.buttonRow}>
                <Button title="No" onPress={() => this.swiper.swipeLeft()}>
                    No
                </Button>
                <Button title="Hard No" onPress={() => this.swiper.swipeBottom()}>
                    Hard No
                </Button>
                <Button title="Crave" onPress={() => this.swiper.swipeTop()}>
                    Crave
                </Button>
                <Button title="Like" onPress={() => this.swiper.swipeRight()}>
                    Like
                </Button>
            </View>
        </View>
        );
    }
};

export default CardDeck;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    card: {
      flex: 0.7,
      borderRadius: 5,
      padding: 10,
      borderWidth: 2,
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
        marginTop: 690,
    },
  });