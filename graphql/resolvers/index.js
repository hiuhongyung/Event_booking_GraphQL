const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("../../models/booking");

const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((error) => {
      throw error;
    });
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return { ...event, _id: event.id, creator: user.bind(this, event.creator) };
  } catch (err) {
    throw err;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  bookings: async (req) => {
      if(!req.isAuth){
          throw new Error("Unanthenticated user cannot do the booking");
      }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: (args,req) => {
      if(!req.isAuth){
          throw new Error("Unauthenticated");
      }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "6099399a68cc86779f5a87a6",
    });
    let createdEvent;
    return event
      .save()
      .then((result) => {
        //add the user
        createdEvent = {
          ...result._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator),
        };

        return User.findById("6099399a68cc86779f5a87a6");
      })
      .then((user) => {
        if (!user) {
          throw new Error("user not found");
        }
        user.createdEvents.push(event); //can pass the whole event and mongoose will retrieve the id
        return user.save(); // also save the "createdEvent"
      })
      .then((result) => {
        return createdEvent;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();
      return { ...user._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({email,password}) => {
    const user = await User.findOne({ email: email});
    if(!user){
        throw new Error ("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual){
        throw new Error("Invalid Credentials");
    }
    const token = jwt.sign({userId: user.id, email: user.email}, 'hiuhongyung', {expiresIn: '1h'});
    return {userId: user.id, token: token , tokenExpiration: 1};
  },

  bookEvent: async (args, req) => {
      if(!req.isAuth){
          throw new Error("Unauthenticated user cannot do the booking");
      }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "5c0fbd06c816781c518e4f3e",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user.bind(this, booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
