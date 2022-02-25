import { React, Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';

class CardDeck extends Component {
    render () {
        return (
            <View style={styles.container}>
            <Swiper
                cards={['this', 'is', 'a', 'resturant', 'overview', 'card', 'almost', 'at', 'the', 'end']}
                renderCard={(card) => {
                    return (
                        <View style={styles.card}>
                            <Text style={styles.text}>{card}</Text>
                        </View>
                    )
                }}
                onSwiped={(cardIndex) => {console.log(cardIndex)}}
                onSwipedAll={() => {console.log('onSwipedAll')}}
                cardIndex={0}
                backgroundColor={'#4FD0E9'}
                stackSize= {3}>
            </Swiper>
        </View>
        );
    }
};

export default CardDeck;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff"
    },
    card: {
      flex: 0.8,
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
      backgroundColor: "transparent"
    }
  });