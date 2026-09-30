const navToggle = document.querySelector('.nav_toggle');
const navMenu = document.querySelector('.nav_menu');

const aboutMenu = document.querySelector('.nav_list_menu');
const aboutTrigger = document.querySelector('.mega-menu-trigger');

const profileMenu = document.querySelector('.profile_menu');
const profileButton = document.querySelector('.profile_button');

const carousel = document.querySelector('.carousel');
const carouselSlides = [...document.querySelectorAll('.carousel-slide')];
const carouselDots = [...document.querySelectorAll('.carousel_dot')];
let activeSlideIndex = 0;
let carouselTimer;
const mobileNavigationBreakpoint = 1120;

window.lucide?.createIcons();

if (
  (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) &&
  sessionStorage.getItem('cci.demo.signed-in') === 'true'
) {
  window.location.replace('home.html');
}

const loginForm = document.querySelector('.login-form');
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');
const loginFeedback = document.querySelector('#login-feedback');
const loginOptionsButton = document.querySelector('.login-options-button');
const loginOptionsDetails = document.querySelector('#login-options-details');

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!loginEmail?.value.trim() || !loginEmail.checkValidity()) {
    loginEmail?.reportValidity();
    return;
  }

  if (!loginPassword?.value) {
    loginPassword?.reportValidity();
    return;
  }

  const credentialsMatch =
    loginEmail.value.trim().toLowerCase() === 'example@outlook.com' &&
    loginPassword.value === 'Password123';

  if (loginFeedback) {
    loginFeedback.textContent = credentialsMatch
      ? 'Sign-in successful. Opening your home page…'
      : 'The email or password is incorrect.';
    loginFeedback.classList.toggle('is-error', !credentialsMatch);
    loginFeedback.hidden = false;
  }

  if (credentialsMatch) {
    sessionStorage.setItem('cci.demo.signed-in', 'true');
    window.location.assign('home.html');
  }
});

document.querySelectorAll('a[href="logout.html"]').forEach((logoutLink) => {
  logoutLink.href = 'index.html';
  logoutLink.addEventListener('click', () => {
    sessionStorage.removeItem('cci.demo.signed-in');
  });
});

loginOptionsButton?.addEventListener('click', () => {
  if (!loginOptionsDetails) {
    return;
  }

  const isExpanded = loginOptionsButton.getAttribute('aria-expanded') !== 'true';
  loginOptionsButton.setAttribute('aria-expanded', String(isExpanded));
  loginOptionsDetails.hidden = !isExpanded;
});

const locationsGrid = document.querySelector('.locations-grid');
const locationsToggle = document.querySelector('.locations-toggle');

if (locationsGrid && locationsToggle) {

  const locationCards = [...locationsGrid.children];
  const displayOrder = [6, 7, 2, 3, 4, 5, 0, 1];

  displayOrder.forEach((index) => {
    locationsGrid.append(locationCards[index]);
  });

  locationsToggle.addEventListener('click', () => {

    const isExpanded = locationsGrid.classList.toggle('is-expanded');

    locationsToggle.setAttribute('aria-expanded', String(isExpanded));
    locationsToggle.innerHTML = isExpanded
      ? '<span>View less</span><i data-lucide="chevron-up" aria-hidden="true"></i>'
      : '<span>View more</span><i data-lucide="chevron-down" aria-hidden="true"></i>';

    window.lucide?.createIcons();

  });

}


// =========================================================
// HOME CAROUSEL
// =========================================================

function startCarouselTimer() {

  window.clearInterval(carouselTimer);

  const activeVideo = carouselSlides[activeSlideIndex]?.querySelector('video');

  if (
    document.hidden ||
    (activeVideo && !activeVideo.paused && !activeVideo.ended)
  ) {
    return;
  }

  carouselTimer = window.setInterval(() => {

    const currentVideo = carouselSlides[activeSlideIndex]?.querySelector('video');

    if (currentVideo && !currentVideo.paused && !currentVideo.ended) {
      window.clearInterval(carouselTimer);
      return;
    }

    showCarouselSlide(activeSlideIndex + 1);

  }, 7000);

}


function showCarouselSlide(index) {

  if (!carouselSlides.length) {
    return;
  }

  activeSlideIndex = (index + carouselSlides.length) % carouselSlides.length;

  carouselSlides.forEach((slide, slideIndex) => {

    const isActive = slideIndex === activeSlideIndex;

    if (!isActive) {
      const video = slide.querySelector('video');
      video?.pause();
      slide.classList.remove('is-playing');
    }

    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));

  });

  carousel.classList.toggle(
    'video-active',
    carouselSlides[activeSlideIndex].classList.contains('video-slide')
  );

  if (!carouselSlides[activeSlideIndex].classList.contains('video-slide')) {
    carousel.classList.remove('theater-mode');
    carousel.closest('.home-dashboard')?.classList.remove('theater-mode');

    const theaterButton = carousel.querySelector('.video-theater');
    theaterButton?.setAttribute('aria-pressed', 'false');
    theaterButton?.setAttribute('title', 'Theater mode');
  }

  carouselDots.forEach((dot, dotIndex) => {

    const isActive = dotIndex === activeSlideIndex;

    dot.classList.toggle('is-active', isActive);

    if (isActive) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }

  });

  startCarouselTimer();

}


if (carousel) {

  carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showCarouselSlide(index));
  });

  carouselSlides.forEach((slide) => {

    const video = slide.querySelector('video');
    const toggleButton = slide.querySelector('.video-toggle');
    const seekBar = slide.querySelector('.play-bar');
    const timeDisplay = slide.querySelector('.video-time');
    const muteButton = slide.querySelector('.video-mute');
    const volumeRange = slide.querySelector('.volume-range');
    const fullscreenButton = slide.querySelector('.video-fullscreen');
    const autoplayButton = slide.querySelector('.video-autoplay');
    const captionsButton = slide.querySelector('.video-captions');
    const settingsButton = slide.querySelector('.video-settings-toggle');
    const settingsMenu = slide.querySelector('.video-settings-menu');
    const speedSelect = slide.querySelector('.video-speed');
    const qualitySelect = slide.querySelector('.video-quality');
    const pipButton = slide.querySelector('.video-pip');
    const theaterButton = slide.querySelector('.video-theater');
    const player = slide.querySelector('.player-wrapper');
    let autoplayEnabled = false;

    function formatTime(seconds) {

      if (!Number.isFinite(seconds)) {
        return '0:00';
      }

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;

    }


    function setControlIcon(button, icon, label) {

      if (!button) {
        return;
      }

      button.setAttribute('aria-label', label);
      button.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
      window.lucide?.createIcons();

    }


    function updateTimeDisplay() {

      if (!video) {
        return;
      }

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const progress = duration ? (video.currentTime / duration) * 100 : 0;

      if (seekBar) {
        seekBar.value = String(progress);
        seekBar.style.setProperty('--played', `${progress}%`);
      }

      if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
      }

    }


    function updateVolumeControl() {

      if (!video || !volumeRange) {
        return;
      }

      const isMuted = video.muted || video.volume === 0;

      volumeRange.value = isMuted ? '0' : String(video.volume);
      setControlIcon(
        muteButton,
        isMuted ? 'volume-x' : 'volume-2',
        isMuted ? 'Unmute video' : 'Mute video'
      );

    }


    function updatePlaybackControls() {

      if (!video) {
        return;
      }

      const isPlaying = !video.paused && !video.ended;

      slide.classList.toggle('is-playing', isPlaying);
      setControlIcon(
        toggleButton,
        isPlaying ? 'pause' : 'play',
        isPlaying ? 'Pause video' : 'Play video'
      );
      updateTimeDisplay();

    }


    function updateCaptionsControl() {

      if (!video || !captionsButton) {
        return;
      }

      const tracks = [...video.textTracks].filter((track) =>
        track.kind === 'captions' || track.kind === 'subtitles'
      );

      captionsButton.disabled = tracks.length === 0;
      captionsButton.title = tracks.length
        ? 'Toggle captions'
        : 'No captions available for this video';

      if (tracks.length === 0) {
        captionsButton.setAttribute('aria-label', 'Captions unavailable');
        captionsButton.setAttribute('aria-pressed', 'false');
        return;
      }

      const captionsEnabled = tracks.some((track) => track.mode === 'showing');

      captionsButton.setAttribute(
        'aria-label',
        captionsEnabled ? 'Turn captions off' : 'Turn captions on'
      );
      captionsButton.setAttribute('aria-pressed', String(captionsEnabled));

    }


    function updateQualityOptions() {

      if (!video || !qualitySelect) {
        return;
      }

      const sources = [...video.querySelectorAll('source[data-quality]')];

      qualitySelect.replaceChildren();

      const autoOption = document.createElement('option');
      autoOption.value = 'auto';
      autoOption.textContent = sources.length
        ? 'Auto'
        : 'Auto · source quality';
      qualitySelect.append(autoOption);

      sources.forEach((source) => {
        const option = document.createElement('option');
        option.value = source.dataset.quality;
        option.textContent = `${source.dataset.quality}p`;
        qualitySelect.append(option);
      });

      qualitySelect.disabled = sources.length === 0;
      qualitySelect.title = sources.length
        ? 'Choose video quality'
        : 'Quality options require alternate video sources';

    }


    function setAutoplay(enabled) {

      autoplayEnabled = enabled;

      autoplayButton?.setAttribute('aria-pressed', String(enabled));
      autoplayButton?.setAttribute(
        'aria-label',
        enabled ? 'Autoplay on' : 'Autoplay off'
      );
      autoplayButton?.setAttribute('title', enabled ? 'Autoplay on' : 'Autoplay off');
      autoplayButton?.classList.toggle('is-selected', enabled);

    }

    toggleButton?.addEventListener('click', () => {

      if (!video) {
        return;
      }

      if (video.paused) {
        const playback = video.play();
        playback?.catch(() => {});
      } else {
        video.pause();
      }

    });

    seekBar?.addEventListener('input', () => {

      if (video && Number.isFinite(video.duration)) {
        video.currentTime = (Number(seekBar.value) / 100) * video.duration;
      }

    });

    muteButton?.addEventListener('click', () => {

      if (video) {
        const shouldUnmute = video.muted || video.volume === 0;

        video.muted = !shouldUnmute;

        if (shouldUnmute && video.volume === 0) {
          video.volume = 1;
        }

        updateVolumeControl();
      }

    });

    volumeRange?.addEventListener('input', () => {

      if (video) {
        video.volume = Number(volumeRange.value);
        video.muted = video.volume === 0;
        updateVolumeControl();
      }

    });

    autoplayButton?.addEventListener('click', () => {
      setAutoplay(!autoplayEnabled);
    });

    captionsButton?.addEventListener('click', () => {

      if (!video) {
        return;
      }

      const tracks = [...video.textTracks].filter((track) =>
        track.kind === 'captions' || track.kind === 'subtitles'
      );
      const shouldShow = !tracks.some((track) => track.mode === 'showing');

      tracks.forEach((track) => {
        track.mode = shouldShow ? 'showing' : 'hidden';
      });

      updateCaptionsControl();

    });

    settingsButton?.addEventListener('click', () => {

      if (!settingsMenu) {
        return;
      }

      const isOpening = settingsMenu.hidden;
      settingsMenu.hidden = !isOpening;
      settingsButton.setAttribute('aria-expanded', String(isOpening));

    });

    speedSelect?.addEventListener('change', () => {

      if (video) {
        video.playbackRate = Number(speedSelect.value);
      }

    });

    qualitySelect?.addEventListener('change', () => {

      if (!video || qualitySelect.value === 'auto') {
        return;
      }

      const selectedSource = video.querySelector(
        `source[data-quality="${CSS.escape(qualitySelect.value)}"]`
      );

      if (!selectedSource) {
        return;
      }

      const wasPlaying = !video.paused;
      const currentTime = video.currentTime;

      video.src = selectedSource.src;
      video.load();
      video.addEventListener('loadedmetadata', () => {

        video.currentTime = Math.min(currentTime, video.duration || currentTime);

        if (wasPlaying) {
          video.play().catch(() => {});
        }

      }, { once: true });

    });

    pipButton?.addEventListener('click', () => {

      if (!video || !document.pictureInPictureEnabled || !video.requestPictureInPicture) {
        return;
      }

      const pipAction = document.pictureInPictureElement
        ? document.exitPictureInPicture()
        : video.requestPictureInPicture();

      pipAction?.catch(() => {});

    });

    if (!document.pictureInPictureEnabled || !video?.requestPictureInPicture) {
      if (pipButton) {
        pipButton.disabled = true;
        pipButton.title = 'Picture in picture is not supported';
      }
    }

    theaterButton?.addEventListener('click', () => {

      const isTheaterMode = carousel.classList.toggle('theater-mode');
      carousel.closest('.home-dashboard')?.classList.toggle('theater-mode', isTheaterMode);

      theaterButton.setAttribute('aria-pressed', String(isTheaterMode));
      theaterButton.title = isTheaterMode ? 'Exit theater mode' : 'Theater mode';

    });

    fullscreenButton?.addEventListener('click', () => {

      if (!player) {
        return;
      }

      const fullscreenAction = document.fullscreenElement
        ? document.exitFullscreen()
        : player.requestFullscreen?.();

      fullscreenAction?.catch(() => {});

    });

    video?.addEventListener('play', () => {
      updatePlaybackControls();
      window.clearInterval(carouselTimer);
    });

    video?.addEventListener('pause', () => {
      updatePlaybackControls();

      if (slide.classList.contains('is-active')) {
        startCarouselTimer();
      }
    });

    video?.addEventListener('ended', () => {
      updatePlaybackControls();

      if (slide.classList.contains('is-active')) {
        if (autoplayEnabled) {
          showCarouselSlide(activeSlideIndex + 1);
        } else {
          startCarouselTimer();
        }
      }
    });

    video?.addEventListener('loadedmetadata', updateTimeDisplay);
    video?.addEventListener('durationchange', updateTimeDisplay);
    video?.addEventListener('timeupdate', updateTimeDisplay);
    video?.addEventListener('volumechange', updateVolumeControl);
    video?.textTracks?.addEventListener('addtrack', updateCaptionsControl);
    video?.textTracks?.addEventListener('change', updateCaptionsControl);
    video?.addEventListener('enterpictureinpicture', () => {
      pipButton?.setAttribute('aria-label', 'Exit picture in picture');
    });
    video?.addEventListener('leavepictureinpicture', () => {
      pipButton?.setAttribute('aria-label', 'Picture in picture');
    });

    document.addEventListener('click', (event) => {

      if (
        settingsMenu &&
        !event.target.closest('.video-settings')
      ) {
        settingsMenu.hidden = true;
        settingsButton?.setAttribute('aria-expanded', 'false');
      }

    });

    document.addEventListener('fullscreenchange', () => {

      const isFullscreen = document.fullscreenElement === player;

      setControlIcon(
        fullscreenButton,
        isFullscreen ? 'minimize' : 'maximize',
        isFullscreen ? 'Exit full screen' : 'Enter full screen'
      );

    });

    updateTimeDisplay();
    updateVolumeControl();
    updatePlaybackControls();
    updateCaptionsControl();
    updateQualityOptions();
    setAutoplay(false);

  });

  document.addEventListener('visibilitychange', startCarouselTimer);
  startCarouselTimer();

}


// =========================================================
// MOBILE NAVIGATION
// =========================================================

if (navToggle) {

  navToggle.addEventListener('click', () => {

    const isOpen =
      navMenu.classList.toggle('active');

    navToggle.setAttribute(
      'aria-expanded',
      isOpen
    );

    navToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark" data-lucide="x" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars-staggered" data-lucide="menu" aria-hidden="true"></i>';

    window.lucide?.createIcons();

  });

}


// =========================================================
// MOBILE ABOUT MENU
// =========================================================

if (aboutTrigger) {

  aboutTrigger.addEventListener('click', (event) => {

    /*
      Desktop uses hover.

      JavaScript only controls the
      menu on mobile.
    */

    if (window.innerWidth > mobileNavigationBreakpoint) {
      return;
    }

    event.preventDefault();

    const isOpen =
      aboutMenu.classList.toggle('active');

    aboutTrigger.setAttribute(
      'aria-expanded',
      isOpen
    );

  });

}


// =========================================================
// PROFILE DROPDOWN
// =========================================================

if (profileButton) {

  profileButton.addEventListener('click', (event) => {

    event.stopPropagation();

    const isOpen =
      profileMenu.classList.toggle('active');

    profileButton.setAttribute(
      'aria-expanded',
      isOpen
    );

  });

}


// =========================================================
// CLICK OUTSIDE
// =========================================================

document.addEventListener('click', (event) => {

  /*
    Close profile
  */

  if (
    profileMenu &&
    !event.target.closest('.profile_menu')
  ) {

    profileMenu.classList.remove('active');

    profileButton?.setAttribute(
      'aria-expanded',
      'false'
    );

  }


  /*
    Close mobile navigation
  */

  if (
    navMenu &&
    !event.target.closest('.navigation')
  ) {

    navMenu.classList.remove('active');

    navToggle?.setAttribute(
      'aria-expanded',
      'false'
    );

    if (navToggle) {

      navToggle.innerHTML =
        '<i class="fa-solid fa-bars-staggered" data-lucide="menu" aria-hidden="true"></i>';

      window.lucide?.createIcons();

    }

  }

});


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener('keydown', (event) => {

  if (event.key !== 'Escape') {
    return;
  }


  document.querySelectorAll('.video-settings-menu:not([hidden])').forEach((menu) => {
    menu.hidden = true;
    menu.closest('.video-settings')
      ?.querySelector('.video-settings-toggle')
      ?.setAttribute('aria-expanded', 'false');
  });


  /*
    Close profile
  */

  profileMenu?.classList.remove('active');

  profileButton?.setAttribute(
    'aria-expanded',
    'false'
  );


  /*
    Close mobile menu
  */

  navMenu?.classList.remove('active');

  navToggle?.setAttribute(
    'aria-expanded',
    'false'
  );


  /*
    Close mobile About menu
  */

  aboutMenu?.classList.remove('active');

  aboutTrigger?.setAttribute(
    'aria-expanded',
    'false'
  );


  if (navToggle) {

    navToggle.innerHTML =
      '<i class="fa-solid fa-bars-staggered" data-lucide="menu" aria-hidden="true"></i>';

    window.lucide?.createIcons();

  }

});


// =========================================================
// RESET MOBILE STATE WHEN GOING DESKTOP
// =========================================================

window.addEventListener('resize', () => {

  if (window.innerWidth > mobileNavigationBreakpoint) {

    navMenu?.classList.remove('active');

    aboutMenu?.classList.remove('active');

    navToggle?.setAttribute(
      'aria-expanded',
      'false'
    );

    aboutTrigger?.setAttribute(
      'aria-expanded',
      'false'
    );

    if (navToggle) {

      navToggle.innerHTML =
        '<i class="fa-solid fa-bars-staggered" data-lucide="menu" aria-hidden="true"></i>';

      window.lucide?.createIcons();

    }

  }

});


// =========================================================
// CHAT PAGE
// =========================================================

const chatPage = document.querySelector('.chat-page');

if (chatPage) {

  const contactList = chatPage.querySelector('.chat-contact-list');
  const contacts = [...chatPage.querySelectorAll('.chat-contact')];
  const searchInput = chatPage.querySelector('#chat-user-search');
  const conversationName = chatPage.querySelector('#conversation-name');
  const conversationStatus = chatPage.querySelector('#conversation-status');
  const conversationAvatar = chatPage.querySelector('#conversation-avatar');
  const messageHistory = chatPage.querySelector('#message-history');
  const messageComposer = chatPage.querySelector('#message-composer');
  const messageInput = chatPage.querySelector('#message-input');
  const messagesByContact = {
    simosenkosi: [
      { direction: 'received', text: 'Morning! Have you had a chance to look at the campaign brief?', time: '10:34' },
      { direction: 'sent', text: 'Yes, I’ve reviewed it. The direction looks strong.', time: '10:37' },
      { direction: 'received', text: 'Great. I’m updating the final section and will send it through in a few minutes.', time: '10:42' }
    ],
    onwabe: [
      { direction: 'sent', text: 'Can you share the event photos when you have a moment?', time: '09:02' },
      { direction: 'received', text: 'Voice note · 0:18', time: '09:18' }
    ],
    bandile: [
      { direction: 'received', text: 'The revised schedule is ready for review.', time: 'Yesterday' },
      { direction: 'sent', text: 'Thanks, this is exactly what we needed.', time: 'Yesterday' }
    ],
    nosihle: [
      { direction: 'received', text: 'Sent you a document', time: 'Sep 24' }
    ]
  };

  let activeContact = contacts.find((contact) => contact.classList.contains('is-selected')) || contacts[0];
  let activeFilter = 'all';

  function renderMessage(message) {

    const row = document.createElement('div');
    row.className = `message-row ${message.direction}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const text = document.createElement('p');
    text.textContent = message.text;

    const time = document.createElement('time');
    time.textContent = message.time;

    if (message.direction === 'sent') {
      const receipt = document.createElement('i');
      receipt.setAttribute('data-lucide', 'check-check');
      receipt.setAttribute('aria-label', 'Sent');
      time.append(receipt);
    }

    bubble.append(text, time);
    row.append(bubble);
    messageHistory.append(row);

  }


  function renderConversation(contact) {

    activeContact = contact;
    const contactId = contact.dataset.contact;
    const name = contact.dataset.name;
    const status = contact.dataset.status;
    const contactAvatar = contact.querySelector('.chat-avatar');

    contacts.forEach((item) => item.classList.toggle('is-selected', item === contact));

    conversationName.textContent = name;
    conversationAvatar.className = `${contactAvatar.className} conversation-avatar`;
    conversationAvatar.replaceChildren(
      ...[...contactAvatar.childNodes].map((node) => node.cloneNode(true))
    );
    conversationAvatar.setAttribute('aria-label', name);
    conversationStatus.className = 'presence';

    if (status === 'online') {
      conversationStatus.textContent = 'Online';
      conversationStatus.classList.add('is-online');
    } else if (status === 'typing') {
      conversationStatus.textContent = 'Typing…';
      conversationStatus.classList.add('is-typing');
    } else {
      conversationStatus.textContent = 'Offline';
    }

    contact.dataset.unread = '0';
    contact.querySelector('.unread-pill')?.remove();
    messageHistory.replaceChildren();

    const dateDivider = document.createElement('div');
    dateDivider.className = 'chat-date-divider';
    const dateLabel = document.createElement('span');
    dateLabel.textContent = 'Recent messages';
    dateDivider.append(dateLabel);
    messageHistory.append(dateDivider);

    (messagesByContact[contactId] || []).forEach(renderMessage);
    window.lucide?.createIcons();
    messageHistory.scrollTop = messageHistory.scrollHeight;

  }


  function filterContacts() {

    const query = searchInput.value.trim().toLowerCase();

    contacts.forEach((contact) => {

      const matchesText = `${contact.dataset.name} ${contact.querySelector('.chat-contact-preview')?.textContent || ''}`
        .toLowerCase()
        .includes(query);
      const matchesFilter = activeFilter === 'all' || Number(contact.dataset.unread) > 0;

      contact.hidden = !matchesText || !matchesFilter;

    });

  }


  contacts.forEach((contact) => {
    contact.addEventListener('click', () => {
      renderConversation(contact);
      chatPage.classList.add('show-conversation');
    });
  });

  searchInput?.addEventListener('input', filterContacts);

  chatPage.querySelectorAll('.chat-filter').forEach((filterButton) => {
    filterButton.addEventListener('click', () => {
      activeFilter = filterButton.dataset.chatFilter;
      chatPage.querySelectorAll('.chat-filter').forEach((button) => {
        button.classList.toggle('is-active', button === filterButton);
      });
      filterContacts();
    });
  });

  chatPage.querySelector('.conversation-back')?.addEventListener('click', () => {
    chatPage.classList.remove('show-conversation');
  });

  chatPage.querySelector('#chat-home-reveal')?.addEventListener('click', (event) => {
    const homeLink = chatPage.querySelector('.chat-home-action');
    homeLink.hidden = false;
    event.currentTarget.hidden = true;
    homeLink.focus();
  });

  chatPage.querySelector('.conversation-actions .bare-icon-button')?.addEventListener('click', () => {
    chatPage.classList.remove('show-conversation');
    searchInput.focus();
  });

  messageComposer?.addEventListener('submit', (event) => {

    event.preventDefault();

    const text = messageInput.value.trim();

    if (!text || !activeContact) {
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const contactId = activeContact.dataset.contact;
    const sentMessage = { direction: 'sent', text, time };

    messagesByContact[contactId] ||= [];
    messagesByContact[contactId].push(sentMessage);
    renderMessage(sentMessage);
    window.lucide?.createIcons();
    messageHistory.scrollTop = messageHistory.scrollHeight;

    activeContact.querySelector('.chat-contact-preview').textContent = `You: ${text}`;
    activeContact.querySelector('.chat-contact-top time').textContent = time;
    contactList.prepend(activeContact);
    messageInput.value = '';
    messageInput.style.height = '';

  });

  messageInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      messageComposer.requestSubmit();
    }
  });

  messageInput?.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 110)}px`;
  });

  if (activeContact) {
    renderConversation(activeContact);
  }

}


// =========================================================
// GALLERY PAGE
// =========================================================

const galleryPage = document.querySelector('.gallery-page');

if (galleryPage) {

  const albums = {
    champions: {
      title: 'Dinner of Champions',
      images: [
        ['photo-1511795409834-ef04bbd61622', 'Awards dinner and stage'],
        ['photo-1511578314322-379afb476865', 'Guests gathering at the event'],
        ['photo-1492684223066-81342ee5ff30', 'Celebration lights'],
        ['photo-1519167758481-83f550bb49b3', 'Dinner table'],
        ['photo-1517457373958-b7bdd4587205', 'Team celebration'],
        ['photo-1505373877841-8d25f7d46678', 'Event audience']
      ]
    },
    heritage: {
      title: 'Heritage Day Cook-Off',
      images: [
        ['photo-1511578314322-379afb476865', 'Heritage celebration'],
        ['photo-1556911220-bff31c812dba', 'Preparing a shared meal'],
        ['photo-1555939594-58d7cb561ad1', 'Food prepared by the team'],
        ['photo-1528605248644-14dd04022da1', 'Colleagues sharing a meal'],
        ['photo-1505394033641-40c6ad1178d7', 'Team cooking together'],
        ['photo-1527529482837-4698179dc6ce', 'Heritage Day gathering']
      ]
    },
    people: {
      title: 'People of CCI',
      images: [
        ['photo-1521737711867-e3b97375f902', 'CCI colleagues working together'],
        ['photo-1522071820081-009f0129c71c', 'Team discussion'],
        ['photo-1556761175-b413da4baf72', 'Colleagues collaborating'],
        ['photo-1521737604893-d14cc237f11d', 'People sharing ideas'],
        ['photo-1531482615713-2afd69097998', 'Team meeting'],
        ['photo-1517245386807-bb43f82c33c4', 'Colleagues at work']
      ]
    },
    community: {
      title: 'Community Impact',
      images: [
        ['photo-1531206715517-5c0ba140b2b8', 'Community volunteers together'],
        ['photo-1469571486292-0ba58a3f068b', 'Community programme'],
        ['photo-1509099836639-18ba1795216d', 'Community support'],
        ['photo-1559027615-cd4628902d4a', 'Volunteers making a difference'],
        ['photo-1542810634-71277d95dcbb', 'Community outreach'],
        ['photo-1532629345422-7515f3d16bb6', 'People working together']
      ]
    }
  };

  const albumCards = [...galleryPage.querySelectorAll('.album-card')];
  const monthList = galleryPage.querySelector('.gallery-months');
  const albumView = galleryPage.querySelector('.gallery-album-view');
  const photoGrid = galleryPage.querySelector('.gallery-photo-grid');
  const albumTitle = galleryPage.querySelector('#album-view-title');
  const lightbox = galleryPage.querySelector('.gallery-lightbox');
  const lightboxImage = galleryPage.querySelector('#lightbox-image');
  const lightboxCaption = galleryPage.querySelector('#lightbox-caption');
  const lightboxCount = galleryPage.querySelector('#lightbox-count');
  let activeAlbum = null;
  let activePhotoIndex = 0;

  function photoUrl(photo, width = 1200) {
    return `https://images.unsplash.com/${photo[0]}?auto=format&fit=crop&w=${width}&q=85`;
  }


  function showPhoto(index) {

    if (!activeAlbum) {
      return;
    }

    const photos = activeAlbum.images;
    activePhotoIndex = (index + photos.length) % photos.length;
    const photo = photos[activePhotoIndex];

    lightboxImage.src = photoUrl(photo, 1800);
    lightboxImage.alt = photo[1];
    lightboxCaption.textContent = photo[1];
    lightboxCount.textContent = `${activePhotoIndex + 1} / ${photos.length}`;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    galleryPage.querySelector('.lightbox-close').focus();

  }


  function openAlbum(albumId) {

    activeAlbum = albums[albumId];

    if (!activeAlbum) {
      return;
    }

    albumTitle.textContent = activeAlbum.title;
    photoGrid.replaceChildren();

    activeAlbum.images.forEach((photo, index) => {

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-photo-button';
      button.setAttribute('aria-label', `Open photo: ${photo[1]}`);

      const image = document.createElement('img');
      image.src = photoUrl(photo, 700);
      image.alt = photo[1];
      image.loading = 'lazy';

      button.append(image);
      button.addEventListener('click', () => showPhoto(index));
      photoGrid.append(button);

    });

    monthList.hidden = true;
    albumView.hidden = false;
    albumView.scrollIntoView({ block: 'start', behavior: 'smooth' });

  }


  function closeLightbox() {

    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');

  }

  albumCards.forEach((card) => {
    card.addEventListener('click', () => openAlbum(card.dataset.album));
  });

  albumView.querySelector('.album-back')?.addEventListener('click', () => {
    closeLightbox();
    albumView.hidden = true;
    monthList.hidden = false;
  });

  galleryPage.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  galleryPage.querySelector('.lightbox-previous')?.addEventListener('click', () => showPhoto(activePhotoIndex - 1));
  galleryPage.querySelector('.lightbox-next')?.addEventListener('click', () => showPhoto(activePhotoIndex + 1));

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox?.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showPhoto(activePhotoIndex - 1);
    } else if (event.key === 'ArrowRight') {
      showPhoto(activePhotoIndex + 1);
    }
  });

}


// =========================================================
// EVENTS PAGE
// =========================================================

const eventsPage = document.querySelector('.events-page');

if (eventsPage) {

  const postList = eventsPage.querySelector('.events-post-list');
  const posts = [...eventsPage.querySelectorAll('.event-post')];
  const requestedPostId = new URLSearchParams(window.location.search).get('post');
  const requestedPost = posts.find((post) => post.dataset.postId === requestedPostId);

  if (requestedPost) {
    eventsPage.classList.add('has-event-detail');

    posts.forEach((post) => {
      if (post !== requestedPost) {
        post.hidden = true;
      }
    });

    const backLink = document.createElement('a');
    backLink.className = 'event-detail-back';
    backLink.href = 'events.html';
    backLink.innerHTML = '<i data-lucide="arrow-left" aria-hidden="true"></i><span>All events</span>';
    postList.before(backLink);

    const comments = requestedPost.querySelector('.post-comments');
    comments.hidden = false;
    requestedPost.querySelector('.comment-toggle')?.setAttribute('aria-expanded', 'true');
  } else {
    posts.forEach((post) => {
      const author = post.querySelector('.post-author strong')?.textContent || 'community member';
      post.tabIndex = 0;
      post.setAttribute('aria-label', `Open post by ${author}`);
    });
  }

  function refreshIcons() {
    window.lucide?.createIcons();
  }

  if (requestedPost) {
    refreshIcons();
  }


  eventsPage.addEventListener('click', (event) => {
    const post = event.target.closest('.event-post');

    if (!requestedPost && post && !event.target.closest('button, a, input, form')) {
      window.location.href = `events.html?post=${encodeURIComponent(post.dataset.postId)}`;
    }
  });

  eventsPage.addEventListener('keydown', (event) => {
    const post = event.target.closest('.event-post');

    if (!requestedPost && post && event.target === post && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      window.location.href = `events.html?post=${encodeURIComponent(post.dataset.postId)}`;
    }
  });


  eventsPage.addEventListener('click', (event) => {

    const likeButton = event.target.closest('.like-button');

    if (likeButton) {

      const liked = likeButton.getAttribute('aria-pressed') === 'true';
      const count = likeButton.querySelector('.like-count');

      likeButton.setAttribute('aria-pressed', String(!liked));
      likeButton.classList.toggle('is-liked', !liked);
      count.textContent = String(Math.max(0, Number(count.textContent) + (liked ? -1 : 1)));
      return;

    }

    const commentToggle = event.target.closest('.comment-toggle');

    if (commentToggle) {

      const post = commentToggle.closest('.event-post');
      const comments = post.querySelector('.post-comments');
      const isOpening = comments.hidden;

      comments.hidden = !isOpening;
      commentToggle.setAttribute('aria-expanded', String(isOpening));

      if (isOpening) {
        comments.querySelector('input')?.focus();
      }

      return;

    }

    const commentLike = event.target.closest('.comment-like');

    if (commentLike) {

      const liked = commentLike.getAttribute('aria-pressed') === 'true';
      const count = commentLike.querySelector('span');

      commentLike.setAttribute('aria-pressed', String(!liked));
      commentLike.classList.toggle('is-liked', !liked);
      count.textContent = String(Math.max(0, Number(count.textContent) + (liked ? -1 : 1)));

    }

  });

  eventsPage.querySelectorAll('.comment-form').forEach((form) => {

    form.addEventListener('submit', (event) => {

      event.preventDefault();

      const input = form.querySelector('input');
      const text = input.value.trim();

      if (!text) {
        return;
      }

      const now = new Date();
      const comment = document.createElement('article');
      comment.className = 'event-comment';

      const avatar = document.createElement('img');
      avatar.src = 'thumbnail.png';
      avatar.alt = '';

      const content = document.createElement('div');
      const author = document.createElement('div');
      author.className = 'comment-author';

      const name = document.createElement('strong');
      name.textContent = 'Onwabe Zibeke';

      const handle = document.createElement('span');
      handle.textContent = '@onwabezibeke';

      const time = document.createElement('time');
      time.dateTime = now.toISOString();
      time.textContent = 'Just now';
      author.append(name, handle, time);

      const paragraph = document.createElement('p');
      paragraph.textContent = text;

      const like = document.createElement('button');
      like.type = 'button';
      like.className = 'comment-like';
      like.setAttribute('aria-pressed', 'false');
      like.innerHTML = '<i data-lucide="heart" aria-hidden="true"></i><span>0</span>';

      content.append(author, paragraph, like);
      comment.append(avatar, content);
      form.closest('.post-comments').querySelector('.comment-list').append(comment);

      const count = form.closest('.event-post').querySelector('.comment-count');
      count.textContent = String(Number(count.textContent) + 1);
      input.value = '';
      refreshIcons();

    });

  });

}