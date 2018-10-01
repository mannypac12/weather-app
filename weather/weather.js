const request = require('request');
const w_pi = require('../config').weather_api


var getWeather = (lat, lng, callback) => {

    request({
        url: `https://api.darksky.net/forecast/${w_pi}/${lat},${lng}`,
        json: true
        }, (error, response, body) => {
            if (error) {
                callback('Unable to connect Darkskyne servers.');
            } else if (response.statusCode === 400 ) {
                callback('Unable to fetch weather')
            } else if (!error && response.statusCode === 200) {
                callback(undefined, {
                    temperature: body.currently.temperature,
                    apparentTemperature: body.currently.apparentTemperature
                });
            }
        });
}

module.exports.getWeather = getWeather