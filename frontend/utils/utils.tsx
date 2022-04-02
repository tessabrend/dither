import * as Location from 'expo-location';

export default async function getPosition() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Some Features of the app may not work without location enabled.');
      return {};
    }
    let location = await Location.getCurrentPositionAsync({});
    return location;
} 
