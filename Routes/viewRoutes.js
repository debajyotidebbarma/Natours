const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedin,
  viewController.getOverview
);

router.get('/tour/:slug', authController.isLoggedin, viewController.getTour);

router.get('/login', authController.isLoggedin, viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get('/my-tours', authController.protect, viewController.getMyTours);

router.get('/signUp', viewController.getSignUpForm);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUser
);

module.exports = router;
