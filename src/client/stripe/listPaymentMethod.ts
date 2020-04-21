import { error } from '../../utils'
import * as _ from 'lodash'
import Stripe from 'stripe'
let stripe: Stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: null
})
const listPaymentMethods = async (user: any) => {
    try {

        const result = await stripe.paymentMethods.list(
            { customer: '', type: 'card' },
        )
        return result
    } catch (e) {
        console.log(e)
        throw error(500, 'Error while fetching payment methods')
    }
}

export default listPaymentMethods
