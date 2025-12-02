// models/habit.js
const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Please enter habit title"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    // ✅ New field to track which days a habit was completed
    completedDates: [
      {
        type: Date,
        default: [],
      },
    ],

    // ✅ Optional: Store the date habit was created or assigned
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ✅ Optional helper method (for later use in streak tracking)
habitSchema.methods.addCompletion = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!this.completedDates.some((d) => new Date(d).getTime() === today.getTime())) {
    this.completedDates.push(today);
  }
};

module.exports = mongoose.model("Habit", habitSchema);
