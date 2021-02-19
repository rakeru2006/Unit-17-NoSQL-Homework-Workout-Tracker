const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  name: { type: String, trim: true, required: "Enter a name for workout"},
  value: { type: Number, required: "Enter an Quantity" },
  date: { type: Date, default: Date.now },
  type: { type: String, default: "cardio" },
  duration: { type: Number, min: 30, index: true },
  weight: { type: Number, min: 300, index: true },
  reps: { type: Number, min: 10, index: true },
  sets: { type: Number, min: 4, index: true }
});

const workout = mongoose.model("workout", workoutSchema);

module.exports = workout;
