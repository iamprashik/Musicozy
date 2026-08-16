const tracks = [
  {
    title: "Synth Wave by Alex",
    artist: "Alex McCulloch",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/synthwavealex/300/300",
    src: "https://opengameart.org/sites/default/files/80s_song_mastered_0.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/synth-wave-by-alex"
  },
  {
    title: "Nighttime Solitude",
    artist: "celestialghost8",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/nighttimesolitude/300/300",
    src: "https://opengameart.org/sites/default/files/Nighttime%20Solitude%20%5BCC0%5D.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/nighttime-solitude"
  },
  {
    title: "Synthwave 421k",
    artist: "The Cynic Project",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/synthwave421k/300/300",
    src: "https://opengameart.org/sites/default/files/007_Synthwave_421k.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/calm-relax-1-synthwave-421k"
  },
  {
    title: "Synthwave 4k",
    artist: "The Cynic Project",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/synthwave4k/300/300",
    src: "https://opengameart.org/sites/default/files/001_Synthwave_4k_0.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/calm-ambient-1-synthwave-4k"
  },
  {
    title: "Synthwave 15k",
    artist: "The Cynic Project",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/synthwave15k/300/300",
    src: "https://opengameart.org/sites/default/files/002_Synthwave_15k.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/calm-ambient-2-synthwave-15k"
  },
  {
    title: "Synth Wave",
    artist: "Alex McCulloch",
    album: "Late Night Drive",
    cover: "https://picsum.photos/seed/synthwaveretro/300/300",
    src: "https://opengameart.org/sites/default/files/Synth%20Wave_0.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/synth-wave"
  }
];

// ============ State ============
const state = {
  currentIndex: 0,
  isPlaying: false,
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
const playIcon = document.getElementById('play-icon');
const heroPlayBtn = document.getElementById('hero-play');
const heroPlayIcon = document.getElementById('hero-play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const replay10Btn = document.getElementById('replay-10-btn');
const forward10Btn = document.getElementById('forward-10-btn');

const timeCurrent = document.getElementById('time-current');
const timeDuration = document.getElementById('time-duration');
const progressTrack = document.getElementById('progress-track');
const progressFill = document.getElementById('progress-fill');
const progressHandle = document.getElementById('progress-handle');

const volumeTrack = document.getElementById('volume-track');
const volumeFill = document.getElementById('volume-fill');
const volumeHandle = document.getElementById('volume-handle');

const playerBar = document.querySelector('.player-bar');

const nowPlayingArt = document.getElementById('now-playing-art');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');
const artistCardName = document.getElementById('artist-card-name');
const panelLikeBtn = document.getElementById('panel-like-btn');
const upNextArt = document.getElementById('up-next-art');
const upNextTitle = document.getElementById('up-next-title');
const upNextArtist = document.getElementById('up-next-artist');

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

function updateLikeButtons(){
  const isLiked = state.liked.has(state.currentIndex);
  likeBtn.classList.toggle('is-liked', isLiked);
  panelLikeBtn.classList.toggle('is-liked', isLiked);
}

function updateNowPlayingPanel(){
  const current = tracks[state.currentIndex];
  const next = tracks[(state.currentIndex + 1) % tracks.length];

  nowPlayingArt.src = current.cover;
  nowPlayingTitle.textContent = current.title;
  nowPlayingArtist.textContent = current.artist;
  artistCardName.textContent = current.artist;

  upNextArt.src = next.cover;
  upNextTitle.textContent = next.title;
  upNextArtist.textContent = next.artist;
}

function toggleCurrentLike(){
  const idx = state.currentIndex;
  if (state.liked.has(idx)){
    state.liked.delete(idx);
  } else {
    state.liked.add(idx);
  }
  updateLikeButtons();
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
  updateLikeButtons();
  updateNowPlayingPanel();

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

function playNext(){
  const next = (state.currentIndex + 1) % tracks.length;
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

function seekBy(seconds){
  if (!Number.isFinite(audio.duration)) return;

  audio.currentTime = Math.min(
    audio.duration,
    Math.max(0, audio.currentTime + seconds)
  );
}

// ============ Audio events ============
audio.addEventListener('play', () => {
  state.isPlaying = true;
  playIcon.textContent = "pause";
  heroPlayIcon.textContent = "pause";
  playerBar.classList.add('is-playing');
  updateActiveRow();
});

audio.addEventListener('pause', () => {
  state.isPlaying = false;
  playIcon.textContent = "play_arrow";
  heroPlayIcon.textContent = "play_arrow";
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

audio.addEventListener('ended', playNext);

// ============ Button wiring ============
playBtn.addEventListener('click', togglePlay);
heroPlayBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
replay10Btn.addEventListener('click', () => seekBy(-10));
forward10Btn.addEventListener('click', () => seekBy(10));

likeBtn.addEventListener('click', toggleCurrentLike);
panelLikeBtn.addEventListener('click', toggleCurrentLike);

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

// ============ Cursor-following tooltips ============
const cursorTooltip = document.getElementById('cursor-tooltip');
const TOOLTIP_DELAY = 150; // ms of no movement before it appears
let tooltipTimer = null;

document.addEventListener('pointermove', (e) => {
  const target = e.target.closest('.has-tooltip');

  if (target){
    const isDark = target.dataset.tooltipVariant === 'dark';

    if (isDark){
      // anchored below the icon — position doesn't track the cursor
      const rect = target.getBoundingClientRect();
      cursorTooltip.style.left = (rect.left + rect.width / 2) + 'px';
      cursorTooltip.style.top = (rect.bottom + 10) + 'px';
    } else {
      // follows the cursor
      cursorTooltip.style.left = (e.clientX + 14) + 'px';
      cursorTooltip.style.top = (e.clientY + 14) + 'px';
    }

    // any movement hides it immediately and restarts the delay
    cursorTooltip.classList.remove('is-visible');
    clearTimeout(tooltipTimer);

    const label = target.dataset.tooltip;

    tooltipTimer = setTimeout(() => {
      cursorTooltip.textContent = label;
      cursorTooltip.classList.toggle('is-dark', isDark);
      cursorTooltip.classList.add('is-visible');
    }, TOOLTIP_DELAY);
  } else {
    clearTimeout(tooltipTimer);
    cursorTooltip.classList.remove('is-visible');
  }
});

// ============ Init ============
renderTrackList();
loadTrack(0, false);
audio.volume = 0.75;
setPercent(volumeTrack, volumeFill, volumeHandle, 75);