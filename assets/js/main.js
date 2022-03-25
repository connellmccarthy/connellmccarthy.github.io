const swup = new Swup({
  containers: ["#swup","#swup-shop-nav", "#swup-article-info"],
  plugins: [new SwupGaPlugin(), new SwupScriptsPlugin({
    optin: true,
    head: false,
    body: true
  })]
});
init();

swup.on('contentReplaced', init);

var collapsing = false;

function init() {
  window.ga('set', 'title', document.title);
  window.ga('set', 'page', window.location.pathname + window.location.search);
  window.ga('send', 'pageview');

  window.scrollTo(0,0);

  const like_button = document.querySelector('.like_button');
  const article_info = document.querySelector('.article-info');
  const back_button = document.querySelector('button#back');

  var audio_playing;
  
  if (confetti.isRunning()) {
    confetti.stop()
  }

  if (document.querySelector('button#video-controller')) {
    const button = document.querySelector('button#video-controller');
    const button_text = document.querySelector('span#button-text');
    const button_icon = document.querySelector('i#button-icon');
    const video = document.getElementById('showreel');
    button.addEventListener('click', () => {
      if (video.getAttribute('state') == 'playing') {
        video.pause();
        video.setAttribute('state', 'paused');
        button_icon.classList.replace('fa-pause', 'fa-play');
        button_text.innerText = 'Play video';
      } else if (video.getAttribute('state') == 'replay') {
        video.play();
        video.setAttribute('state', 'playing');
        button_icon.classList.replace('fa-redo', 'fa-pause');
        button_text.innerText = 'Pause video';
      } else {
        video.play();
        video.setAttribute('state', 'playing');
        button_icon.classList.replace('fa-play', 'fa-pause');
        button_text.innerText = 'Pause video';
      }
    });
    if (video) {
      video.addEventListener('ended', () => {
        video.setAttribute('state', 'replay');
        button_icon.classList.remove('fa-pause', 'fa-play');
        button_icon.classList.add('fa-redo');
        button_text.innerText = 'Replay video';
      });
    }
  }
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
  if (like_button) {
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
      if (el.getAttribute('target') == null && el.getAttribute('data-no-swup') == null) {
        switchPage(el);
        if (audio_playing) {
          audio_playing.pause();
        }
      }
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
}

function switchPage(url) {
  removeActiveMenuItem();
  if (url.getAttribute('href').includes('/article')) {
    document.getElementById('nav-article').classList.add('active');
  } else if (url.getAttribute('href') == '/') {
    document.getElementById('nav-info').classList.add('active');
  } else if (url.getAttribute('href').includes('/prints')) {
    document.getElementById('nav-prints').classList.add('active');
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
