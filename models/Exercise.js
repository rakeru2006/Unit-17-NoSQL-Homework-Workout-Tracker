const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const excerciseSchema = new Schema({
  

  type: {
    type: String,
    validate: [({ length }) => length <= 50, "50 characters max"]
    
  },

  name: {
    type: String,
    validate: [({ length }) => length <= 50, "50 characters max"]
  },

  duration: {
    type: Number, 
    
    min: 0, 
    max: 59,
    
  },

  weight: {
    type: Number, 
    
  },

  reps: {
    type: Number, 
    
  },

  sets: {
    type: Number, 
    
  },
  
});

const Exercise = mongoose.model("Exercise", excerciseSchema);

module.exports = Exercise;
