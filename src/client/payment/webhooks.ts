import { error, AUCTION_STATUS } from '../../utils'
import savePayments from './savePayments'
import { Auction, PaymentStatus } from '../../models'
import { updateMarketPlace } from '../market-place'
import { scheduler } from '../scheduler'
import { changeAuctionFlow } from '../auction'


const ObjectID = require('mongoose').Types.ObjectId

const webhooks = async (data: any) => {
  let event

  try {
    event = data
    console.log(event.type)

  } catch (e) {
    console.log(e)
    throw error(500, 'Webhook Error')
  }
}
export default webhooks
