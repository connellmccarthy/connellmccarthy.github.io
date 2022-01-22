const swup = new Swup({
  linkSelector:
    'a[href^="https://shop.connellmccarthy.com"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
  plugins: [new SwupSlideTheme(), new SwupScriptsPlugin({
    optin: true,
    head: false,
    body: true
  })]
});
init();

swup.on('contentReplaced', init);

function init() {
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
    button.addEventListener('click', () => {
      if (button_icon.classList.contains('fa-pause')) {
        document.getElementById('showreel').pause();
        button_icon.classList.replace('fa-pause', 'fa-play');
        button_text.innerText = 'Play video';
      } else {
        document.getElementById('showreel').play();
        button_icon.classList.replace('fa-play', 'fa-pause');
        button_text.innerText = 'Pause video';
      }
    });
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
      if (window.scrollY > 350 && !article_info.classList.contains('active')) {
        article_info.classList.toggle('active');
      } else if (window.scrollY < 350 && article_info.classList.contains('active')) {
        article_info.classList.toggle('active');
      }
    });
  }
  if (document.getElementById('mobile-announcements')) {
    document.getElementById('mobile-announcements').addEventListener('click', () => {
      document.querySelector('.announcement__container').classList.toggle('active');
      document.querySelector('button#mobile-announcements').classList.toggle('active');
    });
  }
  if (document.querySelector('form.newsletter_form')) {
    document.querySelector('form.newsletter_form').addEventListener('submit', (event) => {
      event.preventDefault();
      subscribe();
      document.querySelector('.newsletter__submit').classList.add('loading');
      document.querySelector('.newsletter__submit').setAttribute('disabled', true);
      document.querySelector('.newsletter__email').setAttribute('disabled', true);
    });
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

  let nav = document.querySelector('.mobile-controller');
  let desktop_nav = document.querySelector('.nav__container');
  if (document.querySelector('.product-header')) {
    if (document.querySelector('.product-header').classList.contains('dark')) {
      nav.classList.add('dark');
      desktop_nav.classList.add('dark');
    } else {
      if (nav.classList.contains('dark')) {
        nav.classList.remove('dark');
        desktop_nav.classList.remove('dark');
      }
    }
  } else {
    if (nav.classList.contains('dark')) {
      nav.classList.remove('dark');
      desktop_nav.classList.remove('dark');
    }
  }

  document.querySelectorAll('a').forEach((el) => {
    el.addEventListener('click', () => {
      switchPage(el.getAttribute('href'));
    });
  });
}
function switchPage(url) {
  if (document.querySelector('nav').classList.contains('active')) {
    document.querySelector('nav').classList.toggle('active');
    document.querySelector('.fade.menu-trigger').classList.toggle('active');
  }
  if (url.includes('/articles')) {
    document.querySelectorAll('.nav__link').forEach((el) => {
      if (el.classList.contains('active')) {
        el.classList.toggle('active');
      }
    });
    document.getElementById('nav-articles').classList.add('active');
  } else if (url == '/') {
    document.querySelectorAll('.nav__link').forEach((el) => {
      if (el.classList.contains('active')) {
        el.classList.toggle('active');
      }
    });
    document.getElementById('nav-work').classList.add('active');
  } else if (url.includes('/shop')) {
    document.querySelectorAll('.nav__link').forEach((el) => {
      if (el.classList.contains('active')) {
        el.classList.toggle('active');
      }
    });
    document.getElementById('nav-shop').classList.add('active');
  }
}

document.querySelectorAll('.sidebar-trigger').forEach((el) => {
  el.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.fade.sidebar-trigger').classList.toggle('active');
  });
});

document.querySelectorAll('.menu-trigger').forEach((el) => {
  el.addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('active');
    document.querySelector('.fade.menu-trigger').classList.toggle('active');
  });
});

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
    document.body.append(iframe);
  } else {
      console.log('Error: No values passed to function.');
  }
}
