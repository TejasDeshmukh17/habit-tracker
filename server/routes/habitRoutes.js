// routes/habitRoutes.js
const express = require("express");
const Habit = require("../models/habit"); // check file name: habit.js
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * ✅ Add a habit for logged-in user
 * POST /api/habits
 * Body: { title, description }
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const habit = await Habit.create({
      userId: req.user.id, // comes from auth middleware
      title,
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ Get all habits of logged-in user
 * GET /api/habits
 */
router.get("/", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, habits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

// ✅ Toggle Habit Completion
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ success: false, message: "Habit not found" });

    habit.completed = !habit.completed;

    const today = new Date().setHours(0, 0, 0, 0);
    if (habit.completed) {
      // Add today's date if not already marked
      if (!habit.completedDates.some((d) => new Date(d).getTime() === today)) {
        habit.completedDates.push(today);
      }
    } else {
      // Remove today's date if undone
      habit.completedDates = habit.completedDates.filter(
        (d) => new Date(d).getTime() !== today
      );
    }

    await habit.save();
    res.json({ success: true, message: "Habit updated", habit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Delete Habit
router.delete("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ success: false, message: "Habit not found" });

    res.json({ success: true, message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

