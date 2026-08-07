// ============ Track data ============
// Royalty-free demo tracks (SoundHelix) + placeholder art.
// Swap `src` and `cover` with your own files to make this a real player.
const tracks = [
  {
    title: "Coastal Static",
    artist: "Marlow Bay",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/coastalstatic/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Amber Streetlights",
    artist: "Fenn & Vale",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/amberstreet/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Low Beam",
    artist: "Marlow Bay",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/lowbeam/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Empty Highway, Full Tank",
    artist: "Ostro",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/emptyhighway/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Rearview",
    artist: "Fenn & Vale",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/rearview/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Last Exit Before Dawn",
    artist: "Ostro",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/lastexit/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

// ============ State ============
const state = {
  currentIndex: 0,
  isPlaying: false,
  isShuffled: false,
  isRepeating: false,
  isSeeking: false,
  liked: new Set()
};

// ============ DOM refs ============
const audio = document.getElementById('audio');
const trackListEl = document.getElementById('track-list');

const barArt = document.getElementById('bar-art');
const barTitle = document.getElementById('bar-title');
const barArtist = document.getElementById('bar-artist');
const likeBtn = document.getElementById('like-btn');

const playBtn = document.getElementById('play-btn');
const heroPlayBtn = document.getElementById('hero-play');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');

const timeCurrent = document.getElementById('time-current');
const timeDuration = document.getElementById('time-duration');
const progressTrack = document.getElementById('progress-track');
const progressFill = document.getElementById('progress-fill');
const progressHandle = document.getElementById('progress-handle');

const volumeTrack = document.getElementById('volume-track');
const volumeFill = document.getElementById('volume-fill');
const volumeHandle = document.getElementById('volume-handle');

const playerBar = document.querySelector('.player-bar');

// ============ Helpers ============
function formatTime(seconds){
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function setPercent(el, fillEl, handleEl, percent){
  const pct = Math.min(100, Math.max(0, percent));
  fillEl.style.width = pct + "%";
  handleEl.style.left = pct + "%";
}

// ============ Rendering track list ============
function renderTrackList(){
  trackListEl.innerHTML = tracks.map((t, i) => `
    <div class="track-row" data-index="${i}">
      <span class="col-index">
        <span class="idx-num">${i + 1}</span>
        <span class="eq"><span></span><span></span><span></span><span></span></span>
      </span>
      <span class="col-title">
        <img class="t-thumb" src="${t.cover}" alt="">
        <span class="t-text">
          <span class="t-title">${t.title}</span>
          <span class="t-artist">${t.artist}</span>
        </span>
      </span>
      <span class="col-album">${t.album}</span>
      <span class="col-duration" data-duration-for="${i}">--:--</span>
    </div>
  `).join("");

  trackListEl.querySelectorAll('.track-row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = Number(row.dataset.index);
      if (idx === state.currentIndex){
        togglePlay();
      } else {
        loadTrack(idx, true);
      }
    });
  });

  updateActiveRow();
  preloadDurations();
}

function updateActiveRow(){
  trackListEl.querySelectorAll('.track-row').forEach(row => {
    const idx = Number(row.dataset.index);
    row.classList.toggle('is-active', idx === state.currentIndex);
    row.classList.toggle('is-paused', idx === state.currentIndex && !state.isPlaying);
  });
}

// Quietly load each track's metadata so the list can show real durations
function preloadDurations(){
  tracks.forEach((t, i) => {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = t.src;
    probe.addEventListener('loadedmetadata', () => {
      const cell = trackListEl.querySelector(`[data-duration-for="${i}"]`);
      if (cell) cell.textContent = formatTime(probe.duration);
    });
  });
}

// ============ Playback control ============
function loadTrack(index, autoplay){
  state.currentIndex = index;
  const t = tracks[index];
  audio.src = t.src;

  barArt.src = t.cover;
  barTitle.textContent = t.title;
  barArtist.textContent = t.artist;
  likeBtn.classList.toggle('is-liked', state.liked.has(index));
  likeBtn.textContent = state.liked.has(index) ? "♥" : "♡";

  updateActiveRow();

  if (autoplay){
    audio.play().catch(() => {});
  }
}

function togglePlay(){
  if (state.isPlaying){
    audio.pause();
  } else {
    audio.play().catch(() => {});
  }
}

function playNext(fromEnded){
  if (state.isRepeating && fromEnded){
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return;
  }
  let next;
  if (state.isShuffled){
    do { next = Math.floor(Math.random() * tracks.length); }
    while (next === state.currentIndex && tracks.length > 1);
  } else {
    next = (state.currentIndex + 1) % tracks.length;
  }
  loadTrack(next, true);
}

function playPrev(){
  // If we're a few seconds into the song, restart it instead of skipping back
  if (audio.currentTime > 3){
    audio.currentTime = 0;
    return;
  }
  const prev = (state.currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prev, true);
}

// ============ Audio events ============
audio.addEventListener('play', () => {
  state.isPlaying = true;
  playBtn.textContent = "⏸";
  heroPlayBtn.textContent = "⏸";
  playerBar.classList.add('is-playing');
  updateActiveRow();
});

audio.addEventListener('pause', () => {
  state.isPlaying = false;
  playBtn.textContent = "▶";
  heroPlayBtn.textContent = "▶";
  playerBar.classList.remove('is-playing');
  updateActiveRow();
});

audio.addEventListener('loadedmetadata', () => {
  timeDuration.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (state.isSeeking) return;
  timeCurrent.textContent = formatTime(audio.currentTime);
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  setPercent(progressTrack, progressFill, progressHandle, pct);
});

audio.addEventListener('ended', () => playNext(true));

// ============ Button wiring ============
playBtn.addEventListener('click', togglePlay);
heroPlayBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', () => playNext(false));
prevBtn.addEventListener('click', playPrev);

shuffleBtn.addEventListener('click', () => {
  state.isShuffled = !state.isShuffled;
  shuffleBtn.classList.toggle('is-active', state.isShuffled);
});

repeatBtn.addEventListener('click', () => {
  state.isRepeating = !state.isRepeating;
  repeatBtn.classList.toggle('is-active', state.isRepeating);
});

likeBtn.addEventListener('click', () => {
  const idx = state.currentIndex;
  if (state.liked.has(idx)){
    state.liked.delete(idx);
    likeBtn.classList.remove('is-liked');
    likeBtn.textContent = "♡";
  } else {
    state.liked.add(idx);
    likeBtn.classList.add('is-liked');
    likeBtn.textContent = "♥";
  }
});

// ============ Drag-to-seek (progress bar) ============
function seekFromEvent(clientX){
  const rect = progressTrack.getBoundingClientRect();
  const pct = ((clientX - rect.left) / rect.width) * 100;
  const clamped = Math.min(100, Math.max(0, pct));
  setPercent(progressTrack, progressFill, progressHandle, clamped);
  if (audio.duration){
    audio.currentTime = (clamped / 100) * audio.duration;
    timeCurrent.textContent = formatTime(audio.currentTime);
  }
}

progressTrack.addEventListener('mousedown', (e) => {
  state.isSeeking = true;
  seekFromEvent(e.clientX);
  const onMove = (ev) => seekFromEvent(ev.clientX);
  const onUp = () => {
    state.isSeeking = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
});

// touch support
progressTrack.addEventListener('touchstart', (e) => {
  state.isSeeking = true;
  seekFromEvent(e.touches[0].clientX);
}, { passive: true });
progressTrack.addEventListener('touchmove', (e) => {
  seekFromEvent(e.touches[0].clientX);
}, { passive: true });
progressTrack.addEventListener('touchend', () => { state.isSeeking = false; });

// ============ Volume ============
function setVolumeFromEvent(clientX){
  const rect = volumeTrack.getBoundingClientRect();
  const pct = ((clientX - rect.left) / rect.width) * 100;
  const clamped = Math.min(100, Math.max(0, pct));
  setPercent(volumeTrack, volumeFill, volumeHandle, clamped);
  audio.volume = clamped / 100;
}

volumeTrack.addEventListener('mousedown', (e) => {
  setVolumeFromEvent(e.clientX);
  const onMove = (ev) => setVolumeFromEvent(ev.clientX);
  const onUp = () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
});

// ============ Init ============
renderTrackList();
loadTrack(0, false);
audio.volume = 0.75;
setPercent(volumeTrack, volumeFill, volumeHandle, 75);