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

### Updating products

The command `node products.js` or `npm run products` will import your products from Shopify and format them for Jekyll.

### Updating content

Articles are under `_articles`, create new markdown files for each post. Images are stored under `assets/articles/[article-slug]/`. Content for the homepage and sidebar are located in the content file under `_data/content.yml`.

#### Gallery Article Component

To add a gallery of media, use the gallery component. There are two methods.

1. If all the media is the same filetype (JPG, MP4, etc.), name them sequentially and call the component via the following include:

    ```liquid
    {% include gallery.html path='IMAGE_PATH' slug='UNIQUE-SLUG' format='FILETYPE' count=NUM_OF_MEDIA %}
    ```
  
    It will output all the files starting from 1 to `NUM_OF_MEDIA` (ie. `/{IMAGE_PATH}/{UNIQUE-SLUG}-{INDEX}.{FILETYPE}`)

2. If you want a variety of media, images and videos, and don't have them all named in sequential order, you can make the array and pass it in:

    ```liquid
    {% capture MEDIA %}
    IMAGE.jpg,
    IMAGE-18.jpg,
    VIDEO.mp4,
    IMAGE-2.jpg
    {% endcapture %}
    {% include gallery.html path=IMAGE_PATH slug='UNIQUE-SLUG' media=MEDIA %}
    ```

---

## Running it locally

Run the command `npm run serve` or `bundle exec jekyll serve` and navigate to [localhost:4000](localhost:4000) to see in it action.

---

## Deployment

First lint all your code by running `npm run lint`. Your VSCode settings should match the settings in the `.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "arrowParens": "always",
  "bracketSpacing": true,
  "printWidth": 120
}
```

Add all your changes `git add .`, commit them `commit -m "commit message"`, and push `git push` them for it to deploy to github pages.
