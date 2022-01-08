const swup = new Swup({
  plugins: [new SwupSlideTheme()]
});
init();
swup.on('contentReplaced', init);
swup.on('contentReplaced', function () {
  window.scrollTo(0, 0);
});
function init() {
  const like_button = document.getElementById('like_button');
  const article_info = document.querySelector('.article-info');
  const back_button = document.querySelector('button#back');

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
  if (document.getElementById('count')) {
    const count_element = document.getElementById('count');
    const slug = window.location.href.split('/')[4];
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", `https://data.connellmccarthy.com/.netlify/functions/api/article?ref=${slug}`, true);
    xhttp.send();
    xhttp.onload = function() {
      count_element.innerText = JSON.parse(xhttp.response).count;
    }
  }
  if (like_button) {
    like_button.addEventListener('click', () => {
      if (!like_button.classList.contains('liked')) {
        const slug = window.location.href.split('/')[4];
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", `https://data.connellmccarthy.com/.netlify/functions/api/article?ref=${slug}`, true);
        xhttp.send();
        xhttp.onload = function() {
          like_button.classList.toggle('animate');
          document.getElementById('like_button_icon').classList.replace('far', 'fas');
          like_button.classList.add('liked');
          const count_element = document.getElementById('count');
          let count = parseInt(count_element.innerText) + 1;
          count_element.innerText = count;
        }
      }
    });
  }
  if (article_info) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350 && !article_info.classList.contains('active')) {
        // article_info.style.display = 'block';
        article_info.classList.toggle('active');
        // setTimeout(() => {
        // },1);
      } else if (window.scrollY < 350 && article_info.classList.contains('active')) {
        article_info.classList.toggle('active');
        // setTimeout(() => {
        //   article_info.style.display = 'none';
        // }, 400);
      }
    });
  }
  document.querySelectorAll('a').forEach((el) => {
    el.addEventListener('click', () => {
      switchPage(el.getAttribute('href'));
    });
  });
}
function switchPage(url) {
  if (url.includes('/articles')) {
    if (document.getElementById('nav-work').classList.contains('active')) {
      document.getElementById('nav-articles').classList.add('active');
      document.getElementById('nav-work').classList.remove('active');
    }
  } else if (url == '/') {
    if (document.getElementById('nav-articles').classList.contains('active')) {
      document.getElementById('nav-work').classList.add('active');
      document.getElementById('nav-articles').classList.remove('active');
    }
  }
}