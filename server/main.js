import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var CheckAvailable = require('./check_available.js');

Meteor.startup(() => {
  Router.route('/check-available', {where: 'server'})
    .post(function() {
      var checkAvailable = new CheckAvailable();

      userId = this.params.userId;
      availableArgs = this.params.availableArgs;

      responseJson = {};
      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify({"status": 200, response: responseJson}));
    })

  Router.route('/seed', {where: 'server'})
    .get(function() {
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

      Availabilities = new Mongo.Collection('availabilities');
      Users = new Mongo.Collection('users');

      var availabilitiesJson = require('../db/user_availabilities.json');
      var usersJson = require('../db/users.json');

      availabilitiesJson.forEach(function(element) {
        element.start_time = timeToInt(element.start_time);
        element.end_time = timeToInt(element.end_time);
        if (element.event_type == "Timeoff") {
          element.start_date = new Date(Date.parse(element.start_date));
          element.end_date = new Date(Date.parse(element.end_date));
        }

        Availabilities.insert(element);
      })

      usersJson.forEach(function(element) {
        Users.insert(element);
      })

      this.response.setHeader('Content-Type','application/json');
      this.response.end(JSON.stringify({"status": 200, response: "OK"}));
    })
});
