import * as Location from 'expo-location';

export default async function getPosition() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Some Features of the app may not work without location enabled.');
      return {};
    }
    let location = await Location.getCurrentPositionAsync({});
    return String(location["coords"]["latitude"]) + ',' + String(location["coords"]["longitude"]);
}

export async function apiRequestRetry(url: string, options: object, numTries: number) {
  const errs = [];
  for(var i = 0; i < numTries; i++) {
    try {
      console.log(`trying GET ${url} (${i+1}/ ${numTries})`);
      let fetched = await (await fetch(url, options)).json();
      console.log(fetched);
      return fetched;
    } catch(err) {
      console.log(err.message);
      errs.push(err.message);
    }
  }
  alert("A network error occured. Try again later");
}
