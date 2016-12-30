# Usage

1. Clone the application
- `meteor`
- `curl localhost:3000/seed` to create seed data
- `curl -XPOST --data="userId=1&start_date=2017-01-01&end_date=2017-01-02&start_time='9:00PM'&end_time='10:00PM'&days=Monday,Tuesday" localhost:3000check_available`

# Notes

```
db.getCollection('availabilities').aggregate([{
  $match: {
    "user_id": '1',
    $and: [
      {
        $or: [{"day_of_week": { $in: ["Monday", "Tuesday"] } }, {"event_type": "Timeoff"} ],
      },
      {
        $or: [
          {
            "event_type": 'Timeoff',
            $or: [
              { "start_date": { $gte: new Date("2016-12-26") }, "start_date": { $lte: new Date("2016-12-31") } },
              { "start_date": { $lte: new Date("2016-12-26") }, "end_date": { $gte: new Date("2016-12-31") } }
            ]
          },
          {
            "event_type": "Available",
            $or: [
              { "start_time": { $gt: 50430 }, "end_time": { $lt: 50440 } }
            ]
          },
          {
            "event_type": "Break",
            $and: [
              { "end_time": { $gt: 50430 }, "start_time": { $lt: 50440 } }
            ]
          },
          {
            "event_type": "Unavailable",
            $and: [
              { "start_time": { $lt: 50430 }, "end_time": { $gt: 50440 } }
            ]
          },
        ]
      }
    ]
  }
}
])
```

I tried to use MongoDB query for the first `basic` challenge, and it works with this code above.
With this code, we don't need to transfer data from DB server to application server.

To make it easier in Mongo, I converted the time (e.x "9:00 PM", "12:30 AM" to integer) when run seed file.

# TODO

- Add `mocha` test
- Implement mongo query for `pro` challenge
- Fix javascript style
- Document
- Apply some libraries of js to use (moments.js)
