import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';

// Muffins!
import appleCinnamon from './assets/appleCinnamon.jpg';
import banana from './assets/banana.jpg';
import blueberry from './assets/blueberry.jpg';
import chocolateChip from './assets/chocolateChip.jpg';
import strawberry from './assets/strawberry.jpg';

const muffins = [
  {
    name: 'Apple Cinnamon',
    source: appleCinnamon,
  },
  {
    name: 'Banana',
    source: banana,
  },
  {
    name: 'Blueberry',
    source: blueberry,
  },
  {
    name: 'Chocolate Chip',
    source: chocolateChip,
  },
  {
    name: 'Strawberry',
    source: strawberry,
  },
];

const {height, width} = Dimensions.get('window');

const App = () => {
  //Arrays to store the muffins we like
  let [likedMuffins, addLikedMuffin] = useState([]);
  let [dislikedMuffins, addDislikedMuffin] = useState([]);

  //State for checking the index of the current muffin
  const [currentMuffin, setCurrentMuffin] = useState(0);
  //State for checking if all the muffins are done
  const [done, setDone] = useState(false);

  // Initializing position and panResponder to work with animations
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      return true;
    },
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({x: gestureState.dx, y: gestureState.dy});
    },
    onPanResponderRelease: (evt, gestureState) => {
      //Muffin is in the like area
      if (
        position.x._value < -50 &&
        position.y._value > height / 2 - 150 &&
        position.y._value < height / 2
      ) {
        Animated.spring(position, {
          toValue: {x: -width - 10, y: position.y._value},
          friction: 10,
        }).start(() => {
          addLikedMuffin([...likedMuffins, muffins[currentMuffin].name]);
          if (currentMuffin == muffins.length - 1) setDone(true);
          else setCurrentMuffin(currentMuffin + 1);
          position.setValue({x: 0, y: 0});
        });
      }
      // Muffin is in the dislike area
      else if (
        position.x._value > 50 &&
        position.y._value > height / 2 - 150 &&
        position.y._value < height / 2
      ) {
        Animated.spring(position, {
          toValue: {x: width + 10, y: position.y._value},
          friction: 10,
        }).start(() => {
          addDislikedMuffin([...dislikedMuffins, muffins[currentMuffin].name]);
          if (currentMuffin == muffins.length - 1) setDone(true);
          else setCurrentMuffin(currentMuffin + 1);
          position.setValue({x: 0, y: 0});
        });
      }
      //Muffin is neither in the like nor the dislike area
      else {
        Animated.spring(position, {
          toValue: {x: 0, y: 0},
          friction: 10,
        }).start();
      }
    },
  });

  //If the current muffin's index is less than index in map(), do not show that muffin.
  //If it is greater than that, show the muffin, but do not attach panHandlers to it.
  //If it is equal to it, attach panHandlers to it to enable movement.
  const Muffins = () =>
    muffins
      .map((muffin, index) => {
        if (index === currentMuffin)
          return (
            <Animated.View
              key={index}
              {...panResponder.panHandlers}
              style={[
                {transform: position.getTranslateTransform()},
                styles.muffinContainer,
              ]}>
              <Image source={muffin.source} style={styles.image} />
              <Text style={styles.text}>{muffin.name}</Text>
            </Animated.View>
          );
        else if (index > currentMuffin)
          return (
            <Animated.View key={index} style={styles.muffinContainer}>
              <Image source={muffin.source} style={styles.image} />
            </Animated.View>
          );
      })
      .reverse();

  const LikedMuffins = () => {
    return likedMuffins.map((likedMuffin, index) => (
      <Text key={index}>{likedMuffin}</Text>
    ));
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{alignItems: 'center'}}>
        {/* If all muffins are done, display the liked muffins, else display the remaining muffins */}
        {!done ? (
          <Muffins />
        ) : (
          <>
            <Text>You like these muffins : </Text>
            <LikedMuffins />
          </>
        )}

        {/* Like and Dislike container */}
        <View style={styles.selectorContainer}>
          <View style={[styles.selector, {backgroundColor: 'green'}]}>
            <Text style={styles.text}>LIKE</Text>
          </View>
          <View style={[styles.selector, {backgroundColor: 'red'}]}>
            <Text style={styles.text}>DISLIKE</Text>
          </View>
        </View>
      </View>
    </>
  );
};

//Styles
const styles = StyleSheet.create({
  muffinContainer: {
    height: 150,
    width: 150,
    margin: 20,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: height / 2 - 50,
  },
  selector: {
    height: 150,
    width: 150,
    borderWidth: 1,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 150,
    width: 150,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default App;
