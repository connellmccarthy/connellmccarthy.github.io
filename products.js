import 'dotenv/config'
import fs from 'fs'
import YAML from 'yaml'

import fetch from 'node-fetch'
import Shopify from 'shopify-api-node'

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_URL,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_PASSWORD
})

const products = await shopify.product.list({
  limit: 250,
  published_status: 'published',
  status: 'active'
})

products.forEach(product => {
  const layout = {
    layout: 'product',
    product_id: product.id
  }
  
  const contents = `---
${YAML.stringify(Object.assign(layout, product))}
---`
  
  fs.writeFileSync(`./_products/${product.handle}.md`, contents);
})


console.log('✅ Success')