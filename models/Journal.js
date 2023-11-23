const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  entries: {
    type: Array,
    required: true,
  },
  entryDate: {
    type: String,
    require: true,
  },
  fatigueEntry: {
    type: String,
    require: true,
  },
  mood: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  privateMode: {
    type: Boolean,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reactions: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  visualTotals: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Journal", JournalSchema);

// {
//   entries: [
//     {
//       time: '23:40',
//       'entry-type': 'Food',
//       food: 'oatmeal',
//       protein: '10'
//     },
//     { time: '22:40', 'entry-type': 'Sleep', sleep: '12' },
//     { time: '09:41', 'entry-type': 'Sleep', sleep: '2' },
//     {
//       time: '12:47',
//       'entry-type': 'Food',
//       food: 'steak',
//       protein: '26'
//     }
//   ],
//   entryDate: '11/08/2023',
//   fatigueEntry: '4',
//   mood: 'Excited',
//   treatment: 'Radiation',
//   image: 'https://img.freepik.com/free-photo/tired-young-attractive-man-sleeps-work-place-has-much-work-being-fatigue-exhausted_273609-8457.jpg',
//   description: 'test it test',
//   privateMode: true,
//   creatorId: 655d41c02214031634b4eb0c,
//   user: {
//     'warrior-name': 'Erik Solis',
//     'warrior-status': 'Caregiver',
//     'caregiver-patient-name': 'Marina Villagran',
//     'caregiver-patient-status': 'Currently In Treatment',
//     'relationship-type': 'Parent',
//     'cancer-type': 'Breast',
//     'lang-type': 'English'
//   },
//   visualTotals: { totalHydration: null, totalHoursSlept: 14, totalProtein: 36 }
// }