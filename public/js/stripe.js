/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51Ir3uGSHdBg3oT4Xu03TJblAzMmU8WIKkAcvsYnApJ0PKFnqSi1DnYrlfhCnD1SGY62FQTfDhLLI8G9QFifOizfI00lvNo2RI7'
);

export const bookTour = async (tourId) => {
  try {
    //1)) Get checkout session from the server/API

    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    //2)) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
