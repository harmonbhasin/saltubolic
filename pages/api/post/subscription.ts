import { NextApiRequest, NextApiResponse } from 'next'
// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// https://github.com/alexfromsofia/ecommerce/blob/main/components/Cart.tsx
// use-shopping-cart
// Used this to implement shopping cart
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { priceId } = req.body

  if (req.method === 'POST') {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      mode: 'subscription',
      //success_url: 'http://localhost:3001/order/success?session_id={CHECKOUT_SESSION_ID}',
      //cancel_url: 'http://localhost:3001/pricing',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/pricing`,
      automatic_tax: { enabled: true },
    })
    res.json(session.url)
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
