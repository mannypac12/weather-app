const yargs = require('yargs');
const axios = require('axios');
const g_api = require('./config').go_map_api
const w_pi = require('./config').weather_api

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address', 
            describe: 'Address to fetch weather for', 
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var encodedAddress = encodeURIComponent(argv.a);
var geocodeUrl =  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${g_api}`;

axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to finde that address')
    } 

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/${w_pi}/${lat},${lng}`;

    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)
}).catch((e) => {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers')
    } else {
        console.log(e.message)
    } 
});