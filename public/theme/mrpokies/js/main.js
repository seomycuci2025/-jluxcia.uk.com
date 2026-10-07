/* =============================================
   Mr Pokies - main.js
   Handles: side-nav (click + swipe), sticky
            header, footer accordion, TOC builder
   ============================================= */

(function () {
  'use strict';

  /* ---- SIDE NAV ---- */
  var menuToggle  = document.getElementById('menuToggle');
  var sideNav     = document.getElementById('sideNav');
  var sideNavClose= document.getElementById('sideNavClose');
  var overlay     = document.getElementById('overlay');

  function openNav() {
    if (sideNav)  sideNav.classList.add('open');
    if (overlay)  overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (sideNav)  sideNav.classList.remove('open');
    if (overlay)  overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle)  menuToggle.addEventListener('click', openNav);
  if (sideNavClose) sideNavClose.addEventListener('click', closeNav);
  if (overlay)      overlay.addEventListener('click', closeNav);

  /* Auto-close on desktop resize */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeNav();
  });

  /* Swipe-from-left-edge to open */
  var touchStartX = 0;
  var touchStartY = 0;
  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (touchStartX < 30 && dx > 60 && dy < 60) openNav();
    if (dx < -60 && dy < 60 && sideNav && sideNav.classList.contains('open')) closeNav();
  }, { passive: true });

  /* ---- STICKY HEADER ---- */
  var header = document.querySelector('.header');
  if (header) {
    var headerH = header.offsetHeight;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        document.body.classList.add('header-fixed');
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.zIndex = '1000';
        document.body.style.paddingTop = headerH + 'px';
      } else {
        document.body.classList.remove('header-fixed');
        header.style.position = '';
        header.style.top = '';
        header.style.left = '';
        header.style.right = '';
        document.body.style.paddingTop = '';
      }
    }, { passive: true });
  }

  /* ---- FOOTER ACCORDION ---- */
  var cardHeaders = document.querySelectorAll('.card-header');
  if (cardHeaders.length) {
    cardHeaders.forEach(function (hdr) {
      hdr.addEventListener('click', function () {
        var content = this.nextElementSibling;
        var isActive = this.classList.contains('active');

        /* close all */
        cardHeaders.forEach(function (h) {
          h.classList.remove('active');
          if (h.nextElementSibling) h.nextElementSibling.style.maxHeight = null;
        });

        /* open clicked one if it was closed */
        if (!isActive && content) {
          this.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---- AUTO TOC (article pages) ---- */
  var articleContent = document.getElementById('articleContent');
  var tocList        = document.getElementById('tocList');
  var tocBox         = document.getElementById('tocBox');

  if (articleContent && tocList) {
    var headings = articleContent.querySelectorAll('h2, h3');

    if (headings.length < 2) {
      if (tocBox) tocBox.style.display = 'none';
    } else {
      headings.forEach(function (h, i) {
        var id = 'toc-' + i;
        h.id = id;
        var li = document.createElement('li');
        if (h.tagName === 'H3') li.className = 'toc-h3';
        var a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = h.textContent;
        li.appendChild(a);
        tocList.appendChild(li);
      });
    }
  }

})();
