const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { generateMonthCalendar } = require('../utils/calendar-utils');

function checkAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// GET all students
router.get('/', checkAuth, async (req, res) => {
  const students = await Student.find({ teacherId: req.session.userId });
  res.render('students', { students });
});

// GET single student detail
router.get('/:id', checkAuth, async (req, res) => {
  const student = await Student.findById(req.params.id);
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth();
  const calendarGrid = generateMonthCalendar(year, month);

  res.render('student-details', { student, year, month, calendarGrid });
});

// Add new student
router.post('/add', checkAuth, async (req, res) => {
  const newStudent = new Student({ name: req.body.name, teacherId: req.session.userId });
  await newStudent.save();
  res.redirect('/students');
});

// Mark attendance for today
router.post('/:id/attendance', checkAuth, async (req, res) => {
  const student = await Student.findById(req.params.id);
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);
  if (!student.attendance.some(d => d.toISOString().slice(0, 10) === isoToday)) {
    student.attendance.push(today);
    await student.save();
  }
  res.redirect(`/students/${student._id}`);
});

// Toggle fee payment for a month/year
router.post('/:id/fee/:year/:month', checkAuth, async (req, res) => {
  const student = await Student.findById(req.params.id);
  const year = parseInt(req.params.year);
  const month = req.params.month;
  const existingIndex = student.fees.findIndex(f => f.year === year && f.month === month);

  if (existingIndex >= 0) {
    student.fees.splice(existingIndex, 1); // Remove existing payment
  } else {
    student.fees.push({ year, month, datePaid: new Date() });
  }

  await student.save();
  res.redirect(`/students/${student._id}?year=${year}&month=${req.params.month}`);
});

router.post('/:id/notes', checkAuth, async (req, res) => {
  const student = await Student.findById(req.params.id);
  student.notes.push({ content: req.body.content });
  await student.save();
  res.redirect(`/students/${student._id}`);
});
// Delete a specific note
router.post('/:studentId/notes/:noteId/delete', checkAuth, async (req, res) => {
  const { studentId, noteId } = req.params;

  await Student.findByIdAndUpdate(studentId, {
    $pull: { notes: { _id: noteId } }
  });

  res.redirect(`/students/${studentId}`);
});


module.exports = router;
