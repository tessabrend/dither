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
      console.log(`trying ${options.method ? options.method : 'GET'} ${url} (${i+1}/ ${numTries})`);
      console.log(`with options: ${JSON.stringify(options,2)}`)
      let fetched = await (await fetch(url, options)).json();
      return fetched;
    } catch(err) {
      console.log(err.message);
      errs.push(err.message);
    }
  }
  alert("A network error occured. Try again later");
}
