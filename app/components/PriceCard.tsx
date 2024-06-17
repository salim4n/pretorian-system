

import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { loadStripe } from '@stripe/stripe-js'
import { useEffect } from "react"

interface PriceCardProps {
    title: string
    price: number
    features: string[]
    description: string
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

if(!stripePublicKey) {
    throw new Error('Stripe public key is missing')
}

const stripePromise = loadStripe(
 stripePublicKey
)

export default function PriceCard({title, price, features,description}: PriceCardProps){

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

    return(
<Card className="flex flex-col justify-between h-full transition transform hover:scale-105 hover:shadow-lg">
        <CardTitle className="text-2xl font-bold text-center m-2">
          {title}
        </CardTitle>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
        <div className="text-lg font-semibold text-center">
            <Label>
               {title === "Entreprise" ? (
                     "Contactez-nous pour un devis personnalisé"
                ) : (
                     `${price}€/mois`
               )}
            </Label>
        </div>
        <CardContent className="flex flex-col items-center space-y-2 m-4">
            <ul className="space-y-1">
                {features.map((feature, index) => (
                    <li key={index}>
                    <div className="flex items-center space-x-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5 text-green-700"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>{feature}</span>
                    </div>
                    </li>
                ))}
            </ul>
       
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
        </CardContent>
      </Card>
    )

}