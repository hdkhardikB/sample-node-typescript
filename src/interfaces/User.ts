export interface IUser {
  id?: number
  uid?: string
  name: string
  email: string
  token?: string
  company?: boolean
  country: string
  address: string
  post_code: string
  phone_number: string
  vat_number?: string
  kvk_number?: string
  password?: string
  is_admin?: boolean
  stripe_customer_id?: string
  stripe_buyer_id?: string
}
