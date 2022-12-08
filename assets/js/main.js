const swup = new Swup({
  containers: ["#swup"],
  plugins: [new SwupGtagPlugin({
    gaMeasurementId: "G-GVY559Y564"
  }), new SwupScriptsPlugin({
    optin: true,
    head: false,
    body: true
  })]
});
init();
swup.on('contentReplaced', init);

var audio_playing;

function init() {
  document.removeEventListener('scroll', appreciationHandler);
  if (environment == 'production') {
    window.gtag("config", "G-GVY559Y564", {
      page_title: document.title,
      page_path: window.location.pathname + window.location.search
    });
  }
  window.scrollTo(0,0);
  AOS.init();

  const like_button = document.querySelector('.like_button');
  const like_info = document.querySelector('.like_info');
  const article_info = document.querySelector('.article-info');
  const back_button = document.querySelector('button#back');

  
  if (confetti.isRunning()) {
    confetti.stop()
  }

  //Hero details handler
  if (document.getElementById('details-trigger')) {
    let trigger = document.getElementById('details-trigger');
    let details = document.getElementById('details');
  
    trigger.addEventListener('mouseenter', () => {
      toggleDetails();
    });
    trigger.addEventListener('mouseleave', () => {
      toggleDetails();
    });
  
    function toggleDetails() {
      details.classList.toggle('active');
    }
  }

  //Index featured images
  if (document.getElementById('index-features')) {
    let features = document.getElementById('index-features');
    let image1 = document.getElementById('image-1');
    let image2 = document.getElementById('image-2');
    let image3 = document.getElementById('image-3');
    let image4 = document.getElementById('image-4');
    let image5 = document.getElementById('image-5');
    let scrolloffset = 100;

    window.addEventListener('scroll', (e) => {
      image1.style.transform = `translateY(${((features.offsetTop / window.scrollY) * 130) - scrolloffset}%)`;
      image2.style.transform = `translateY(${((features.offsetTop / window.scrollY) * 110) - scrolloffset}%)`;
      image3.style.transform = `translateY(${((features.offsetTop / window.scrollY) * 160) - scrolloffset}%)`;
      image4.style.transform = `translateY(${((features.offsetTop / window.scrollY) * 120) - scrolloffset}%)`;
      image5.style.transform = `translateY(${((features.offsetTop / window.scrollY) * 140) - scrolloffset}%)`;
    });
  }

  if (document.querySelector('button.video-controller')) {
    document.querySelectorAll('button.video-controller').forEach(x => {
      const button = x;
      const button_text = document.querySelector(`#${x.getAttribute('id')} span#button-text`);
      const button_icon = document.querySelector(`#${x.getAttribute('id')} i#button-icon`);
      const video = document.querySelector(`video#${x.getAttribute('id')}`);
      button.addEventListener('click', () => {
        if (video.getAttribute('state') == 'playing') {
          video.pause();
          video.setAttribute('state', 'paused');
          button_icon.classList.replace('fa-pause', 'fa-play');
          button_text.innerText = 'Play video';
        } else {
          video.play();
          video.setAttribute('state', 'playing');
          button_icon.classList.replace('fa-play', 'fa-pause');
          button_text.innerText = 'Pause video';
        }
      });
    });
  }

  //Appreciation handler
  if (document.querySelector('.count')) {
    const slug = window.location.href.split('/')[4];
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", `https://data.connellmccarthy.com/.netlify/functions/api/article?ref=${slug}`, true);
    xhttp.setRequestHeader('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCIsImh0dHBzOi8vY29ubmVsbG1jY2FydGh5LmNvbSJdLCJpYXQiOjE2NDE3NDQ2Njd9.7Dv0xI60IIANn0PxyCf_4UR-1usidXMPYiKa3eyLHuk`);
    xhttp.send();
    xhttp.onload = function() {
      document.querySelectorAll('.count').forEach((count_element) => {
        count_element.innerText = JSON.parse(xhttp.response).count;
        count_element.parentElement.classList.remove('processing');
      });
    }
  }
  if (like_button || like_info) {
    document.addEventListener('scroll', appreciationHandler);
    const slug = window.location.href.split('/')[4];
    if (window.localStorage.getItem(slug)) {
      document.querySelectorAll('.like_button_icon').forEach((el) => {
        el.classList.replace('far', 'fas');
      });
      document.querySelectorAll('.like_button').forEach((el) => {
        el.classList.add('liked');
      });
    }
    document.querySelectorAll('.like_button').forEach((el) => {
      el.addEventListener('click', () => {
        if (!el.classList.contains('liked')) {
          let xhttp = new XMLHttpRequest();
          xhttp.open("POST", `https://data.connellmccarthy.com/.netlify/functions/api/article?ref=${slug}`, true);
          xhttp.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCIsImh0dHBzOi8vY29ubmVsbG1jY2FydGh5LmNvbSJdLCJpYXQiOjE2NDE3NDQ2Njd9.7Dv0xI60IIANn0PxyCf_4UR-1usidXMPYiKa3eyLHuk');
          xhttp.send();
          xhttp.onload = () => {
            el.classList.toggle('animate');
            document.querySelectorAll('.like_button_icon').forEach((icon) => {
              icon.classList.replace('far', 'fas');
            });
            document.querySelectorAll('.like_button').forEach((like_button_all) => {
              like_button_all.classList.add('liked');
            });
            window.localStorage.setItem(slug, true);
            document.querySelectorAll('.count').forEach((count_element) => {
              let count = parseInt(count_element.innerText) + 1;
              count_element.innerText = count;
            });
          }
        } else {
          //Remove like
          let xhttp = new XMLHttpRequest();
          xhttp.open("DELETE", `https://data.connellmccarthy.com/.netlify/functions/api/article?ref=${slug}`, true);
          xhttp.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCIsImh0dHBzOi8vY29ubmVsbG1jY2FydGh5LmNvbSJdLCJpYXQiOjE2NDE3NDQ2Njd9.7Dv0xI60IIANn0PxyCf_4UR-1usidXMPYiKa3eyLHuk');
          xhttp.send();
          xhttp.onload = () => {
            el.classList.toggle('animate');
            document.querySelectorAll('.like_button_icon').forEach((icon) => {
              icon.classList.replace('fas', 'far');
            });
            document.querySelectorAll('.like_button').forEach((like_button_all) => {
              like_button_all.classList.remove('liked');
            });
            window.localStorage.removeItem(slug);
            document.querySelectorAll('.count').forEach((count_element) => {
              let count = parseInt(count_element.innerText) - 1;
              count_element.innerText = count;
            });
          }
        }
      });
    })
  }
  if (article_info) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 250 && !article_info.classList.contains('active')) {
        article_info.classList.toggle('active');
      } else if (window.scrollY < 250 && article_info.classList.contains('active')) {
        article_info.classList.toggle('active');
      }
    });
  }
  //Slideshow module
  if (document.querySelector('.slideshow')) {
    document.querySelectorAll('.slideshow').forEach((x) => {
      const id = x.getAttribute('id');
      const count = x.getAttribute('data-count');
      const container = document.querySelector(`.slideshow__container#slideshow_${id}`);

      if (container.clientHeight == 0) {
        container.querySelector(`img`).onload = () => {
          initSlides(); 
        }
      } else {
        initSlides();
      }

      function initSlides() {
        const increment = container.clientWidth;
        document.querySelector(`#ss_hitmarkers_${id}`).style.height = `${container.clientHeight}px`;
        container.scrollLeft = 0;
        var active_image_index = get_active_image;
        var active_image = document.querySelector(`.slideshow#${id} button.thumbnail.active`).getAttribute('data-id');
  
        function get_active_image() {
          return (container.scrollLeft / increment) + 1;
        }
        container.addEventListener('scroll', (e) => {
          var atSnappingPoint = e.target.scrollLeft % e.target.offsetWidth === 0;
          var timeOut = atSnappingPoint ? 0 : 150;
          clearTimeout(e.target.scrollTimeout);
          e.target.scrollTimeout = setTimeout(() => {
            if (!timeOut) {
              document.querySelector(`.slideshow#${id} button.thumbnail#thumb_${active_image}`).classList.toggle('active');
              document.querySelector(`.slideshow#${id} button.thumbnail#thumb_${id}_${get_active_image()}`).classList.toggle('active');
              active_image = `${id}_${get_active_image()}`;
            }
          }, timeOut);
        });
        document.querySelectorAll(`.slideshow#${id} button.ss_nav`).forEach((nav) => {
          nav.addEventListener('click', () => {
            let image_index = get_active_image();
            if (nav.getAttribute('data-direction') == 'prev') {
              //Previous image
              if ((get_active_image() - 1) <= 0) {
                image_index = count;
              } else {
                image_index --;
              }
            } else {
              // Next image
              if ((get_active_image() + 1) > count) {
                image_index = 1;
              } else {
                image_index ++;
              }
            }
            const image = container.querySelector(`img#image_${id}_${image_index}`);
            image.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
          });
        });
  
        document.querySelectorAll(`.slideshow#${id} button.thumbnail`).forEach((btn) => {
          btn.addEventListener('click', () => {
            document.querySelector(`.slideshow#${id} button.thumbnail#thumb_${active_image}`).classList.toggle('active');
            btn.classList.toggle('active');
            const image = container.querySelector(`img#image_${btn.getAttribute('data-id')}`);
            image.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
            active_image = btn.getAttribute('data-id');
          });
        });
      }
    });
  }

  //Newsletter form
  if (document.querySelector('form.newsletter_form')) {
    if (window.localStorage.getItem('newsletter')) {
      document.querySelector('#newsletter__body').innerText = `You're already receiving email notifications to ${window.localStorage.getItem('newsletter')}`;
      document.querySelector('form.newsletter_form').remove();
    } else {
      document.querySelector('form.newsletter_form').addEventListener('submit', (event) => {
        event.preventDefault();
        subscribe();
        document.querySelector('.newsletter__submit').classList.add('loading');
        document.querySelector('.newsletter__submit').setAttribute('disabled', true);
        document.querySelector('.newsletter__email').setAttribute('disabled', true);
      });
    }
  }

  if (document.querySelector('.audio_wavesurfer')) {
    document.querySelectorAll('.audio_wavesurfer').forEach((el) => {
      let id = el.getAttribute('data-id');
      let newAudio = WaveSurfer.create({
        container: `#waveform-${id}`,
        id: id,
        barWidth: 3,
        barHeight: 1,
        barRadius: 3,
        barGap: 3,
        normalize: true,
        waveColor: '#DADADA',
        progressColor: '#5200FF',
        cursorWidth: 0,
        responsive: true,
        fillParent: true
      });
      newAudio.load(el.getAttribute('data-src'));
      const icon = document.getElementById(`icon-${id}`);
      el.addEventListener('click', () => {
        if (icon.classList.contains('fa-play')) {
          if (audio_playing) {
            audio_playing.pause();
            document.getElementById(`icon-${audio_playing.params.id}`).classList.replace('fa-pause', 'fa-play');
            audio_playing = newAudio;
          } else {
            audio_playing = newAudio;
          }
          newAudio.play();
          icon.classList.replace('fa-play', 'fa-pause');
        } else {
          newAudio.pause();
          icon.classList.replace('fa-pause', 'fa-play');
          audio_playing = null;
        }
      });
    });
  }

  if (document.querySelector('#buying_options')) {
    document.querySelector('#buying_options').addEventListener('click', () => {
      window.scrollTo({
        top: document.querySelector('.product_page').offsetTop,
        behavior: 'smooth'
      });
    });
  }

  if (document.querySelector('.notif')) {
    if (window.localStorage.getItem('cart')) {
      document.querySelector('.notif').classList.add('active');
    }
  }

  if (document.querySelector('.video_trigger')){
    //Set video outside main
    const video_modal = document.querySelector('.video_modal');
    document.querySelector('body').appendChild(video_modal);

    document.querySelectorAll('.video_trigger').forEach((el) => {
      el.addEventListener('click', () => {
        if (video_modal.classList.contains('active')) {
          video_modal.classList.remove('active');
          setTimeout(() => {
            video_modal.style.display = 'none';
          }, 400);
        } else {
          video_modal.style.display = 'flex';
          setTimeout(() => {
            video_modal.classList.add('active');
          }, 20);
        }
      });
    });
  }

  document.querySelectorAll('a').forEach((el) => {
    el.addEventListener('click', () => {
      linkHandler(el);
    });
  });

  //Remove article image wrapper
  if (document.querySelector('.article-content')) {
    document.querySelectorAll('.article-content p img').forEach(function(el) {
      const parent = el.parentElement;
      document.querySelector('.article-content').insertBefore(el, parent);
      if (parent.childElementCount == 0) {
        parent.remove();
      }
    });
  }

  //Product image loading handler
  if (document.querySelector('.product_image')) {
    document.querySelectorAll('.product_image img').forEach((el) => {
      el.addEventListener('load', () => {
        let id = el.getAttribute('data-product-id');
        document.querySelector(`.product_image#product_image_container-${id}`).classList.remove('loading');
      });
    });
  }

  //Product quickview
  if (document.querySelector('.product-modal') && document.querySelector('.product-modal-trigger')) {
    document.querySelectorAll('.product-modal-trigger').forEach(el => {
      el.addEventListener('click', () => {
        let id = el.getAttribute('data-product-id');
        if (document.getElementById(`product-modal-${id}`).classList.contains('active')) {
          document.getElementById(`product-modal-${id}`).classList.toggle('active');
          document.getElementById(`product-fade-${id}`).classList.toggle('active');
          setTimeout(() => {
            document.getElementById(`product-modal-${id}`).style.display = 'none';
          }, 400);
        } else {
          document.getElementById(`product-modal-${id}`).style.display = 'block';
          setTimeout(() => {
            document.getElementById(`product-modal-${id}`).classList.toggle('active');
            document.getElementById(`product-fade-${id}`).classList.toggle('active');
          }, 1);
        }
      });
    });
  }

  //Tree count
  if (document.getElementById('treecount')) {
    let pledgeTrees = new XMLHttpRequest();
    let key = '<h1 class="h3 widget-title">$';
    pledgeTrees.open( "GET", 'https://www.pledge.to/widgets/impact/em34jezzqn0exO3LPY92Ng', true);
    pledgeTrees.send();
    pledgeTrees.onload = () => {
      let pos1 = pledgeTrees.response.indexOf(key) + key.length;
      let pos2 = pledgeTrees.response.indexOf(`</h1>`);
      let result = pledgeTrees.response.substring(pos1, pos2);
      document.getElementById('treecount').innerText = result;
      document.getElementById('treecount').classList.remove('loading');
    }
  }
}

function appreciationHandler() {
  if (window.scrollY > (document.body.clientHeight / 4) && !document.querySelector('.like_button').classList.contains('liked')) {
    document.querySelector('.appreciation_info').classList.add('active');
  } else {
    document.querySelector('.appreciation_info').classList.remove('active');
  }
}

function linkHandler(el) {
  if (el.getAttribute('target') == null && el.getAttribute('data-no-swup') == null) {
    switchPage(el);
    if (audio_playing) {
      audio_playing.pause();
    }
  }
}

function switchPage(url) {
  removeActiveMenuItem();
  if (document.querySelectorAll(`.nav__item[href="${ url.getAttribute('href') }"]`)) {
    document.querySelectorAll(`.nav__item[href="${ url.getAttribute('href') }"]`).forEach((x) => {
      x.classList.add('active');
    });
  }
}

function removeActiveMenuItem() {
  document.querySelectorAll('.nav__item').forEach((el) => {
    if (el.classList.contains('active')) {
      el.classList.toggle('active');
    }
  });
}

function subscribe() {
  var email = encodeURIComponent(document.forms['newsletter_form']['email'].value);
  var ref = encodeURIComponent(document.forms['newsletter_form']['ref'].value);
  var entry_email = 'entry.1684792530';
  var entry_ref = 'entry.1800592224';
  var base_url = 'https://docs.google.com/forms/d/e/1FAIpQLSdmipvslotruk2_Mg8S9R_Ux6IJklJgRKW1yUEd0225CjLWdg/formResponse?';
  var submitURL = (base_url + entry_email + '=' + email + '&' + entry_ref + '=' + ref + '&submit=Submit');

  if (email && ref) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', submitURL);
    iframe.setAttribute('hidden', 'true');
    iframe.addEventListener('load', () => {
      document.querySelector('.newsletter__icon').classList.add('success');
      document.querySelector('i#newsletter__icon').classList.replace('fa-paper-plane', 'fa-check');
      document.querySelector('#newsletter__heading').innerText = 'Thanks for subscribing!';
      document.querySelector('#newsletter__body').innerText = 'You\'ll now receive email notifications whenever a new article is published.';
      document.querySelector('form.newsletter_form').remove();
      confetti.start();
    });
    window.localStorage.setItem('newsletter', decodeURIComponent(email));
    document.body.append(iframe);
  } else {
      console.log('Error: No values passed to function.');
  }
}
