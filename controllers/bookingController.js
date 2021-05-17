const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  stripe._api.auth = `Bearer ${process.env.STRIPE_SECRET_KEY}`;
  // 1)) GET THE CURRENTLY BOOKED TOUR
  const tour = await Tour.findById(req.params.tourID);

  //2)) CREATE CHECKOUT SESSION
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: [],
        amount: tour.price * 100,
        currency: 'inr',
        quantity: 1,
      },
    ],
  });

  //3)) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = async (req, res, next) => {
  //This is only temporary,because it's unsecure
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) {
    return next();
  }
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
};


exports.createBooking=factory.createOne(Booking);
exports.getBooking=factory.getOne(Booking);
exports.getAllBookings=factory.getAll(Booking);
exports.updateBooking=factory.updateOne(Booking);
exports.deleteBooking=factory.deleteOne(Booking)