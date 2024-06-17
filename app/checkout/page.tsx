import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '../components/ui/button'


const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

if(!stripePublicKey) {
    throw new Error('Stripe public key is missing')
}

const stripePromise = loadStripe(
 stripePublicKey
)

export default function PreviewPage() {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.')
    }
  }, []);

  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <Button type="submit" role="link">
          Checkout
        </Button>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form>
  );
}