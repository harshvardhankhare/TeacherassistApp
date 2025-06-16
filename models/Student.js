const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  content: String
});

const feeRecordSchema = new mongoose.Schema({
  year: Number,
  month: String,
  datePaid: Date
});

const studentSchema = new mongoose.Schema({
  name: String,
  teacherId: mongoose.Schema.Types.ObjectId,
  attendance: [Date], // Array of attendance dates
  fees: [feeRecordSchema] ,
  notes: [noteSchema]
  
});

module.exports = mongoose.model('Student', studentSchema);
