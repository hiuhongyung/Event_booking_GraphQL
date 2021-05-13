const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectID, ref: "Event" },
    user: { type: Schema.Types.ObjectID, ref: "User" },
  },
  {
    //Options for the schema
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
