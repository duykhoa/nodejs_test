import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var CheckAvailable = require('./check_available.js');
const Availabilities = new Mongo.Collection('availabilities');

Meteor.startup(() => {
  function timeToInt(time_string) {
    matched = /(\d+):(\d+)(\w+)/.exec(time_string);
    time_num = 0;

    if (matched) {
      hours = matched[1];

      if (hours == '12') {
        hours = '0'
      }

      time_num = parseInt(hours) * 3600 + parseInt(matched[2]);

      if (matched[3] == 'pm' || matched[3] == 'PM') {
        time_num = time_num +  12 * 3600;
      }
    }

    return time_num;
  }

  Router.route('/check_available', {where: 'server'})
    .post(function() {
      var checkAvailable = new CheckAvailable();
      requestObj = this.request.body;

      var userId = requestObj.userId;
      var start_date = requestObj.start_date;
      var end_date = requestObj.end_date;
      var start_time = requestObj.start_time;
      var end_time = requestObj.end_time;
      var days = requestObj.days.split(",");

      var availableArgs = {
        start_time: start_time,
        end_time: end_time,
        start_date: start_date,
        end_date: end_date,
        days: days
      }

      availabilitiesJson = Availabilities.find({user_id: userId.toString()}).fetch();

      responseJson = checkAvailable.checkAvailable(availabilitiesJson, availableArgs);

      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify({"status": 200, response: responseJson}));
    })

  Router.route('/seed', {where: 'server'})
    .get(function() {
      Users = new Mongo.Collection('users');

      var availabilitiesJson = require('../db/user_availabilities.json');
      var usersJson = require('../db/users.json');

      availabilitiesJson.forEach(function(element) {
        //element.start_time = timeToInt(element.start_time);
        //element.end_time = timeToInt(element.end_time);

        //if (element.end_time < element.start_time) {
          //element.end_time = element.end_time + 12 * 3600;
        //}

        //if (element.event_type == "Timeoff") {
          //element.start_date = new Date(Date.parse(element.start_date));
          //element.end_date = new Date(Date.parse(element.end_date));
        //}

        Availabilities.insert(element);
      })

      usersJson.forEach(function(element) {
        Users.insert(element);
      })

      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify({"status": 200, response: "OK"}));
    })
});
