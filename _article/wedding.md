---
title: "Our wedding"
layout: "article"
date: 2024-04-04T010:00:00-05:00
draft: false
description: "I got married and over-engineered everything."
cta_heading: "Interested in seeing what I build next?"
slug: "wedding"
thumbnail: wedding-thumbnail.jpg
credits:
  description: Thanks to everyone who helped make this campaign what it is.
  groups:
    - title: "Collaborators"
      items:
        - title: "Shannon Murphy"
          description: "Content Design Lead"
          cta: "Connect on linkedin"
          url: "https://www.linkedin.com/in/shannon-elizabeth-murphy-sem/?ref=connellmccarthy.com"
        - title: "Nicolas Tual"
          description: "Design Lead"
          cta: "Follow on Instagram"
          url: "https://www.instagram.com/nicolastual.studio/?ref=connellmccarthy.com"
        - title: "José Silva"
          description: "Senior Designer"
          cta: "Connect on linkedin"
          url: "https://www.linkedin.com/in/jose-silva-61875778/?ref=connellmccarthy.com"
        - title: "Caroline Gonzales"
          description: "Senior Designer"
          cta: "Connect on linkedin"
          url: "https://www.linkedin.com/in/cargon?ref=connellmccarthy.com"
        - title: "Tasha Dennis"
          description: "Senior Content Designer"
          cta: "Connect on linkedin"
          url: "https://linkedin.com/in/natasha-dennis-0903a74?ref=connellmccarthy.com"
        - title: "Melody Cheung"
          description: "Project Marketing Manager"
          cta: "Connect on linkedin"
          url: "https://www.linkedin.com/in/melody-cheung/?ref=connellmccarthy.com"
    - title: "Agencies"
      items:
        - title: "Productions l'Éloi"
          description: "Photo & Video"
          cta: "Visit Productions l'Éloi"
          url: "https://leloi.ca/fr/?ref=connellmccarthy.com"
        - title: "Jesper Lindborg"
          description: "3D Rendering"
          cta: "Visit Jesper Lindborg"
          url: "https://lindborg.tv/?ref=connellmccarthy.com"
---

{% assign image_path = site.image_path | append: page.slug %}

On a misty Saturday afternoon, my wife and I said our vows in front of 120 of our closest friends and family. I could write a full sappy love story about Danielle and me, [like this video](https://www.youtube.com/watch?v=MLGeia4YIoM&ab_channel=ConnellMcCarthy?ref=connellmccarthy.com){: target="blank"}. Instead, I want to focus on the things that we built for the wedding and how I opted to create as much as we could by ourselves, probably more than necessary.

It started early on. We got engaged in March of 2022, and within the weeks that followed we had almost everything booked and planned. We managed to get one of the last Saturdays of 2023 at the [Ottawa Art Gallery](https://oaggao.ca/?ref=connellmccarthy.com){: target="blank"}, which was a rude awakening for me as I was blissfully unaware of the chaos of the wedding industry.

## Branding
The first thing to figure out was the general aesthetic and branding for the wedding. It’s unnecessary, but this is my area of expertise so I wanted to go all out. I started with a graphic device to act as a ‘Logo’ for the event, as well as defined the typography, colour palette, and more so that all the materials felt consistent and cohesive.

Since our wedding was in the fall, we opted to keep the palette in line with a warm autumn tonal range. Leading with cream as the main colour, some warm terracotta paired alongside a desaturated olive green was a nice way to keep it minimal but also add a touch of colour.

I know four font families are a bit much for a brand like this, but there were different needs for digital materials vs. small-scale print materials like the save-the-date, RSVP invitation, and menu.

{% include slideshow.html path=image_path slug='branding' format='jpg' count=5 %}

## Stationary
With our venue, website domain, and vendors booked for the day, we needed to send something out to our guests to let them know that they’d be invited and to keep their calendars open. We started assembling the save-the-date mailer in late Summer 2022 to mail them out for the 1-year mark in October.

We went to a paper shop and picked out a very nice cardstock with a subtle texture and a nice off-white colour. I kept the design simple, and I wanted to minimize the amount of paper waste, so I designed 4 to fit perfectly on a standard letter-sized paper. I wanted to make them feel a bit more custom, so I picked up a custom embosser, a rounded corner cutter, and a custom stamp for the mixed media effect for our names. I liked the structured type of our names and then the organic look that the hand-stamped ‘McCarthy’ gave when stamped overtop.

{% include slideshow.html path=image_path slug='std' format='jpg' count=4 %}

After the save the date I moved on to planning what the RSVP mailout would look like. I knew I wanted to do something a bit more custom like a half-moon cut on the top of the RSVP and an information card inserted in between pieces. There were a few paper options from the [Cardstock Warehouse](https://www.cardstock-warehouse.com/?ref=connellmccarthy.com){: target="blank"} that fell within our palette so I mocked them all out to see which felt better. We ended up picking Rust with white ink.

{% include slideshow.html path=image_path slug='rsvp-planning' format='jpg' count=2 %}

Manufacturing the RSVP itself was a pretty big learning process. I bought a Cricut Maker 3 for making custom cuts like the half-moon top, but also it added more customization like the scoring line for the front flap, debossing the logo on the top, a box around the QR code, and even a gold foil edge piece. It took a lot of prototyping, but I finally ended up producing almost 80 invites on a premium cotton 111lb cardstock.

{% include slideshow.html path=image_path slug='invites' format='jpg' count=4 %}

One of the things that I got excited about was the labels for the envelopes. Instead of having a very large Illustrator document with all the labels for 80 envelopes, I built a script that pulled the information from a CSV and generated the labels that were printable on standard letter-sized label paper. I used a few CSS parameters to optimize the layout for printing, and a simple for loop so rendering the labels was super easy.

```javascript
var list = []
fs.createReadStream('_data/invites.csv')
  .pipe(csvParser())
  .on('data', function(data){
    try {
      let item = {
        name: data.MAIL_NAME,
        address: data.ADDRESS
      }
      list.push(item)
    }
    catch(err) {
      throw(err)
    }
  })
  .on('end',function(){
    res.render('labels', {
      content: content,
      labels: list
    })
  })
```
*Javascript function for all the invite data*{:class="code-caption"}

```css
@media print {
    @page {
        size: A4;
        size: portrait;
        margin: 0.5cm;
    }
    li {
      page-break-inside: avoid;
    }
}
```
*CSS for print format and sizing*{:class="code-caption"}

```liquid
{% raw %}
{% for item in labels %}
    <li>
      <div class="from">
        <p class="name">{{ content.wedding.names }}</p>
        <p class="address">{{ content.wedding.address | replace: '\n', '<br>' }}</p>
      </div>
      <div class="icon">
        {% include 'partials/icons/logo.liquid' %}
      </div>
      <div class="to">
        <p class="name">{{ item.name }}</p>
        <p class="address">{{ item.address | replace: '\n', '<br>'  }}</p>
      </div>
      <img class="image" src="/assets/florals/lilac.png">
    </li>
{% endfor %}
{% endraw %}
```
*Liquid loop for each invite item*{:class="code-caption"}

{% include slideshow.html path=image_path slug='labels' format='jpg' count=3 %}

## Website

For the website I looked into using pre-existing services like The Knot or Say.ido, but I wasn’t happy with the amount of customization or templates that they offered. Obviously, the next rational decision would be to build it all out from scratch. Fair warning, it’s about to get a little nerdy so if you came for the pretty pictures, I’d skip forward a bit.

When I started planning the tech stack I wanted to keep it lightweight and quick to get up and running. My go-to stack leading up to this was a Node.js Express app using liquid.js as the frontend framework so that was an easy decision. With this website, I was pulling live data from a database which meant I needed a dedicated server instead of my usual service of Netlify. I dove into the world of AWS and concluded that the Elastic Beanstalk environment was the best for my site. I didn’t realize just how complicated AWS services can be, but I’m so glad I stuck it out and kept figuring it out.

The first iteration of the page was a simple informational lander for people to navigate to when the save-the-date got mailed out. I started with a very low-fidelity wireframe to get an idea of content structure and hierarchy. With that figured out, I worked on adding in the branding elements I had already finished earlier. I kept it very minimal and clean, which allowed me to dedicate more to some moments of delight; like the ‘McCarthy’ being written on page load, some interactive photo moments in our story, and a cool Instagram story inspired storybook of some photos of Dani and I.

{% include video-slideshow.html path=image_path slug='website-features' format='mp4' count=3 %}

After a few months of focusing on other things for the wedding, the proper RSVP invites needed to go out. Again, I was thinking about using a pre-existing service but unfortunately, all the ones I looked at didn’t have an API that I could tap into for a cohesive experience. I was back to the drawing board on how to make our RSVP system from scratch. I had a rough idea of how I wanted the experience to be, but Dani and I spent a good amount of time journey-mapping the experience for our users.

![User journey mapping for RSVP flow.]({{ image_path }}/journey-mapping.jpg)

Building out an online RSVP system meant that I could add features of being able to check in on your reservation and modify your reservation up until a cutoff date. Every wedding I’ve been to somehow in between RSVP’ing and the actual day of, I forget what meals I’ve chosen. I wanted to solve that with this system. A benefit to building our system is that it allowed us to serve follow-up information like accommodation discounts and registry information, at specific points in the user journey.

I set up a simple database to keep a record of the submissions and utilized unique identifiers for each RSVP group so multiple submissions could be paired together (i.e. spouses, family members, etc) and that RSVP group would be accessible by a unique link. The link was emailed out upon submission of the form using the Sendgrid API and dynamic templates, and the reservation was saved to their browser so anytime they came to the site they didn’t need to re-enter their email to get their reservation information. It also allowed for displaying dynamic content on the homepage like the announcement banner and buttons that told them to either submit or modify their RSVP.

{% include slideshow.html path=image_path slug='rsvp-flow' format='jpg' count=4 %}

It was a great exercise for doing more backend development and designing a user experience from all touchpoints. I tried to make everything as efficient as possible and tried to automate as much as I could.

## Signage

Getting out of the digital realm, we knew there were going to be a few pieces of signage we’d build out ourselves. One of those pieces was an important full-size welcome sign that was branded to match the invites and the rest of the materials. Dani planned out this build herself after I put together the scale mockup. We figured out how we could cut the pieces out of a singular 8’x4’ sheet of MDF, and got to work. Within a day the pieces were cut and sanded down in the shape we needed, and we painted the first couple of coats. After the paint had dried completely Dani’s dad and I made a few collapsable feet on the backs so we could transport it easily. I brought them back to our house and used the Cricut to cut out the vinyl lettering to place on the front. I wanted a similar mixed media effect as the RSVP so I cut a stencil for the logo on the top and the ‘McCarthy’, and hand-painted them. They turned out so much better than I thought.

{% include slideshow.html path=image_path slug='welcome-sign' format='jpg' count=8 %}

There were also a few other small signs that I made out of MDF and vinyl lettering, along with some printed signage for the tables and areas around the wedding venue.

{% include slideshow.html path=image_path slug='signage' format='jpg' count=4 %}

## Candles

When we were looking for party favours we went through so many options that I either thought were too expensive or weren’t reflective of who we are. I came across a cement candle somewhere online and immediately thought that was a great opportunity to hand-make the favours, and put a little bit of ourselves in the gift.

This was a huge undertaking, and if I have any advice for people looking to do the same for yours - don’t.

Each candle holder needed to cure for upwards of 12 hours in the mould, and we needed to make roughly 150 of them. It was a lot of trial and error, learning about the differences between cement and concrete, and how the temperature in our garage can affect the setting of the cement. We paused during winter and planned to kick off the production line in the spring of 2023. We ended up picking up 8 moulds, refined our cement process, and kicked it into high gear.

For the scent, we went with a tobacco leaf and pine, which the tobacco was a nod to Dani’s Pépère and the pine to represent our love for the great outdoors. With the help of our friends, we had a candle-making party where we melted and poured wax, stuck labels on the candles, and cut the wicks. We made roughly 125 candles.

{% include slideshow.html path=image_path slug='candles' format='jpg' count=4 %}

## Jukebox

By now I’m sure you’ve caught on that the theme of the wedding was ‘DIY’. Instead of going with a DJ, we opted to play our playlist through Spotify, but I still wanted an opportunity for guests to request songs. Thinking about how that could work, I realized I could dive into the Spotify API and see if there was an opportunity to build something custom. I found the [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node?ref=connellmccarthy.com){:target="_blank"} library which plugged in nicely to the existing website built in Node.js, so I started designing an iPad app experience that worked as a sort of Jukebox.

{% include slideshow.html path=image_path slug='jukebox-figma' format='jpg' count=3 %}

The benefit of using the same framework for the jukebox as the wedding website is that I could surface the opportunity for guests to start building a playlist of songs before the wedding day. I branded a ‘Get ahead of the jukebox line’ feature and surfaced the module on the homepage, as well as the RSVP details page, and linked to it in emails.

{% include video-slideshow.html path=image_path slug='jukebox-module' format='mp4' count=1 %}

I wanted to keep it super simple, with a top result big and bold and other matches in a smaller list view. The bottom bar would display the current playing song and the songs in the queue. Essentially the idea is that you select a playlist as the source of music to play if there are no requests and if you request a song that exists on the playlist it will ensure that that song doesn’t play a second time.

The scaffold for the app structure was fairly simple. There’s an authorization route for credentials handling, an onboarding route for playlist selection, a player route to handle the current playing song and the queue display, and a search route for results and queue handling. I added a little database to keep a record of all the requested songs so we could go back and look through all the songs that were played during the night.

It was a fun little activation at the wedding, and I don’t think there was a moment where the dance floor was empty, or the jukebox table didn’t have a little crowd around it. Beyond that, it was such a fun exercise for me to dive into another app build. I even had a bit of fun with the app icons.

![Development and Production app icons of the Jukebox app.]({{ image_path }}/jukebox-icons.jpg)

Here’s the fully functional app experience.

## Recap

This was one of the biggest moments of my life, so, of course, I had to use my skills to go above and beyond. I got feedback from so many people about the invitations, the RSVP experience, and the overall night. In the end, some things didn’t go according to plan, but we didn’t even notice until the next day. Being surrounded by the ones we love, and those who support us was all we could ask for.
