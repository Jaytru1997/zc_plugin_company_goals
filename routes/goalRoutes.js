/* eslint-disable no-unused-vars */
const { Router } = require('express');
const {
  getSingleGoal,
  getAllGoals,
  createGoal,
  updateSingleGoalById,
  getArchivedGoals,
  deleteGoalById,
} = require('../controllers/goalController');

const router = Router();

router.route('/').post(createGoal).get(getAllGoals);

// router.route('/').post(createGoals);
router.route('/').get(getAllGoals);

// router.route('/archived').get(getArchivedGoals)

// router.route('/:id').get(getSingleGoal).delete(deleteGoal)

router.route('/:id').get(getSingleGoal);

router.route('/delete').delete(deleteGoalById);

// router.put('/update/:id', updateSingleGoalById);

module.exports = router;
