import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

import fetch from 'node-fetch'
import Shopify from 'shopify-api-node'

console.log('Connecting to Shopify')
const directory = './_products'
const shopify = new Shopify({
  shopName: process.env.SHOPIFY_URL,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_PASSWORD
})

//remove all existing items from directory
console.log('Cleaning all old products')
const files = fs.readdirSync(directory)
for (const file of files) {
    const filePath = path.join(directory, file)
    fs.unlinkSync(filePath)
}
console.log('Cleaning done')

const products = await shopify.product.list({
  limit: 250,
  published_status: 'published',
  status: 'active'
})

products.forEach(product => {
  console.log(`Creating product ${ product.title }`)
  const layout = {
    layout: 'product',
    product_id: product.id
  }
  
  const contents = `---
${YAML.stringify(Object.assign(layout, product))}
---`
  
  fs.writeFileSync(`${directory}/${product.handle}.md`, contents);
})


console.log('✅ Success')