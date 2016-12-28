function CheckAvailable() {
};

CheckAvailable.prototype.checkAvailable = function(availability_json, args = {}) {
  timeToInt = function(time_string) {
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

  days = args.days

  start_time = timeToInt(args.start_time)
  end_time = timeToInt(args.end_time)

  if (end_time < start_time) {
    end_time = end_time + 24 * 3600
  }

  start_date = new Date(args.start_date)
  end_date = new Date(args.end_date)

  function filter_term(availability) {
    availability_start_date = new Date(availability.start_date)
    availability_end_date = new Date(availability.end_date)

    availability_start_time = timeToInt(availability.start_time)
    availability_end_time = timeToInt(availability.end_time)

    if (availability_end_time < availability_start_time) {
      availability_end_time = availability_end_time + 24 * 3600;
    }

    dateTerm = (days.indexOf(availability.day_of_week) != -1);
    availableTerm = (
      (
        availability.event_type == "Timeoff" &&
        (
          (availability_start_date >= start_date && end_date >= availability_start_date)  ||
          (start_date >= availability_start_date && start_date <= availability_end_date)
        )
      ) ||
      (
        availability.event_type == "Available" &&
        !(
          availability_start_time <= start_time &&
            availability_end_time >= end_time
        )
      ) ||
      (
        availability.event_type == "Break" &&
          !(availability_end_time <= start_time ||
            end_time <= availability_start_time)
      ) ||
      (
        availability.event_type == "Unavailable" &&
          !(end_time <= availability_start_time ||
            availability_end_time <= start_time)
      )
    );

    result = dateTerm && availableTerm;

    return result
  }

  result = availability_json.filter(filter_term)

  return result.length == 0;
}

module.exports = CheckAvailable;
