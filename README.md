![](https://connellmccarthy.com/assets/img/social-share.jpg)

# Personal Portfolio

This is my personal portfolio and Shopify store built entirely in [Jekyll](https://jekyllrb.com/), and deployed via [Github Pages](https://pages.github.com/).

---

## Setup

Add a local environment file by running `touch .env` and fill the contents with the app credentials from your Shopify store.

```yaml
SHOPIFY_URL=[store-url].myshopify.com
SHOPIFY_API_KEY=[store-api-key]
SHOPIFY_API_PASSWORD=[store-password]
```

Run `npm install` to install all the node dependencies, and then `bundle install` to install all the Jekyll gems.

---

## Maintenance

#### Updating products

The command `node products.js` or `npm run products` will import your products from Shopify and format them for Jekyll.

#### Updating content

Articles are under `_articles`, create new markdown files for each post. Images are stored under `assets/articles/[article-slug]/`. Content for the homepage and sidebar are located in the content file under `_data/content.yml`.

---

## Running it locally

Run the command `npm run serve` or `bundle exec jekyll serve` and navigate to [localhost:4000](localhost:4000) to see in it action.

---

## Deployment

Add all your changes `git add .`, commit them `commit -m "commit message"`, and push `git push` them for it to deploy to github pages.
