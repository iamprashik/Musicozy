// MUSICOZY LIKES STEP 3 — LIKED SONGS PLAYLIST
// MUSICOZY LIKES STEP 2 — SAVED AFTER REFRESH
// MUSICOZY LIKES STEP 1 — HEART BUTTONS
// MUSICOZY PLAYLIST SWITCHING V1 — NEW FILE
// MUSICOZY 10-SECOND SEEK CONTROLS — REVISION 1
// ============ Track data ============
// CC0 synthwave tracks from OpenGameArt + placeholder artwork.
// Source pages and artist credits are included with every track below.
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

// ============ Playlist data ============
// The playlists currently reuse the verified CC0 tracks in different orders.
const playlists = {
  "liked-songs": {
    name: "Liked Songs",
    cover: "https://picsum.photos/seed/musicozylikedsongs/300/300",
    description: "Every track you have saved in one place.",
    trackIndices: []
  },
  "late-night-drive": {
    name: "Late Night Drive",
    cover: "https://picsum.photos/seed/amberdrive/300/300",
    description: "Dreamy synthwave and slow-burn electronic grooves for the road after everyone else is asleep.",
    trackIndices: [0, 1, 2, 3, 4, 5]
  },
  "sunday-coffee": {
    name: "Sunday Coffee",
    cover: "https://picsum.photos/seed/sundaycoffee/300/300",
    description: "Warm, unhurried electronic tracks for a quiet start and a slow cup of coffee.",
    trackIndices: [1, 3, 5, 0]
  },
  "deep-focus": {
    name: "Deep Focus",
    cover: "https://picsum.photos/seed/deepfocus/300/300",
    description: "Steady ambient synths selected to keep distractions low while you work or study.",
    trackIndices: [2, 3, 4, 1]
  },
  "rainy-window": {
    name: "Rainy Window",
    cover: "https://picsum.photos/seed/rainywindow/300/300",
    description: "Soft, reflective electronic music for grey skies, rainfall and late afternoons indoors.",
    trackIndices: [1, 4, 3, 5]
  }
};

// ============ Saved liked songs ============
const LIKED_SONGS_STORAGE_KEY = "musicozy-liked-songs-v1";

function readSavedLikedSongs(){
  try {
    const savedTrackIndices = JSON.parse(
      localStorage.getItem(LIKED_SONGS_STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(savedTrackIndices)) return new Set();

    return new Set(
      savedTrackIndices.filter(trackIndex =>
        Number.isInteger(trackIndex) &&
        trackIndex >= 0 &&
        trackIndex < tracks.length
      )
    );
  } catch (error) {
    console.warn("Musicozy could not read liked songs:", error);
    return new Set();
  }
}

function saveLikedSongs(){
  try {
    localStorage.setItem(
      LIKED_SONGS_STORAGE_KEY,
      JSON.stringify([...state.liked])
    );
  } catch (error) {
    console.warn("Musicozy could not save liked songs:", error);
  }
}

// ============ State ============
const state = {
  currentIndex: 0,
  activePlaylistId: "late-night-drive",
  playingPlaylistId: "late-night-drive",
  isPlaying: false,
  isSeeking: false,
  liked: readSavedLikedSongs()
};

// ============ DOM refs ============
const audio = document.getElementById('audio');
const trackListEl = document.getElementById('track-list');
const searchInput = document.getElementById('search-input') || document.querySelector('.search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
const playlistItems = document.querySelectorAll('.playlist-item[data-playlist-id]');

const heroArt = document.getElementById('hero-art');
const heroTitle = document.getElementById('hero-title');
const heroMeta = document.getElementById('hero-meta');

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
const nowPlayingPlaylist = document.getElementById('now-playing-playlist');
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

function getPlaylist(playlistId = state.activePlaylistId){
  const playlist = playlists[playlistId];

  if (playlistId === "liked-songs"){
    return {
      ...playlist,
      trackIndices: [...state.liked]
    };
  }

  return playlist;
}

function getNextTrackIndex(playlistId = state.playingPlaylistId){
  const indices = getPlaylist(playlistId).trackIndices;
  if (indices.length === 0) return state.currentIndex;
  const currentPosition = indices.indexOf(state.currentIndex);
  if (currentPosition === -1) return indices[0];
  return indices[(currentPosition + 1) % indices.length];
}

function updateHeroPlayIcon(){
  const selectedPlaylistHasTracks = getPlaylist().trackIndices.length > 0;
  const selectedPlaylistIsPlaying =
    state.isPlaying && state.activePlaylistId === state.playingPlaylistId;

  heroPlayBtn.disabled = !selectedPlaylistHasTracks;
  heroPlayBtn.setAttribute(
    'aria-label',
    selectedPlaylistHasTracks ? 'Play playlist' : 'Playlist is empty'
  );
  heroPlayIcon.textContent =
    selectedPlaylistHasTracks && selectedPlaylistIsPlaying ? "pause" : "play_arrow";
}

function updateLikeButtons(){
  const isLiked = state.liked.has(state.currentIndex);
  likeBtn.classList.toggle('is-liked', isLiked);
  panelLikeBtn.classList.toggle('is-liked', isLiked);

  trackListEl.querySelectorAll('.track-like-btn').forEach(button => {
    const trackIndex = Number(button.dataset.likeIndex);
    const trackIsLiked = state.liked.has(trackIndex);
    button.classList.toggle('is-liked', trackIsLiked);
    button.setAttribute('aria-pressed', String(trackIsLiked));
    button.setAttribute(
      'aria-label',
      `${trackIsLiked ? 'Remove' : 'Add'} ${tracks[trackIndex].title} ${trackIsLiked ? 'from' : 'to'} Liked Songs`
    );
  });
}

function updateNowPlayingPanel(){
  const current = tracks[state.currentIndex];
  const next = tracks[getNextTrackIndex()];
  const playingPlaylist = getPlaylist(state.playingPlaylistId);

  nowPlayingArt.src = current.cover;
  nowPlayingTitle.textContent = current.title;
  nowPlayingArtist.textContent = current.artist;
  nowPlayingPlaylist.textContent = playingPlaylist.name;
  artistCardName.textContent = current.artist;

  upNextArt.src = next.cover;
  upNextTitle.textContent = next.title;
  upNextArtist.textContent = next.artist;
}

function toggleTrackLike(trackIndex){
  if (state.liked.has(trackIndex)){
    state.liked.delete(trackIndex);
  } else {
    state.liked.add(trackIndex);
  }
  saveLikedSongs();
  updateLikeButtons();

  if (state.activePlaylistId === "liked-songs"){
    updateHeroDetails();
    renderTrackList(searchInput?.value || "");
    updateHeroPlayIcon();
  }

  if (state.playingPlaylistId === "liked-songs"){
    updateNowPlayingPanel();
  }
}

function toggleCurrentLike(){
  toggleTrackLike(state.currentIndex);
}

function updateHeroDetails(){
  const playlist = getPlaylist();
  const trackCount = playlist.trackIndices.length;
  const trackLabel = trackCount === 1 ? "track" : "tracks";

  heroArt.src = playlist.cover;
  heroArt.alt = `${playlist.name} artwork`;
  heroTitle.textContent = playlist.name;
  heroMeta.textContent = `Prashik · ${trackCount} CC0 ${trackLabel} · ${playlist.description}`;
}

function updatePlaylistView(){
  updateHeroDetails();

  playlistItems.forEach(item => {
    item.classList.toggle('active', item.dataset.playlistId === state.activePlaylistId);
  });

  if (searchInput){
    searchInput.value = "";
    searchClearBtn.hidden = true;
  }

  renderTrackList();
  updateHeroPlayIcon();
}

// ============ Rendering and filtering the track list ============
function renderTrackList(query = ""){
  const normalizedQuery = query.trim().toLowerCase();
  const playlist = getPlaylist();
  const matchingTracks = playlist.trackIndices
    .map((trackIndex, position) => ({
      track: tracks[trackIndex],
      trackIndex,
      position
    }))
    .filter(({ track }) => {
      const searchableText = `${track.title} ${track.artist} ${playlist.name}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

  if (matchingTracks.length === 0){
    const emptyMessage =
      state.activePlaylistId === "liked-songs" && !normalizedQuery
        ? "Your Liked Songs playlist is empty. Tap a heart beside any song to add it."
        : "No songs found";

    trackListEl.innerHTML = `
      <p class="search-empty-state" role="status">${emptyMessage}</p>
    `;
    return;
  }

  trackListEl.innerHTML = matchingTracks.map(({ track: t, trackIndex, position }) => `
    <div class="track-row" data-index="${trackIndex}">
      <span class="col-index">
        <span class="idx-num">${position + 1}</span>
        <span class="eq"><span></span><span></span><span></span><span></span></span>
      </span>
      <span class="col-title">
        <img class="t-thumb" src="${t.cover}" alt="">
        <span class="t-text">
          <span class="t-title">${t.title}</span>
          <span class="t-artist">${t.artist}</span>
        </span>
      </span>
      <span class="col-album">${playlist.name}</span>
      <span class="col-like">
        <button
          class="track-like-btn${state.liked.has(trackIndex) ? ' is-liked' : ''}"
          data-like-index="${trackIndex}"
          type="button"
          aria-label="${state.liked.has(trackIndex) ? 'Remove' : 'Add'} ${t.title} ${state.liked.has(trackIndex) ? 'from' : 'to'} Liked Songs"
          aria-pressed="${state.liked.has(trackIndex)}"
          title="Like song"
        >
          <span class="material-symbols-rounded">favorite</span>
        </button>
      </span>
      <span class="col-duration" data-duration-for="${trackIndex}">${Number.isFinite(t.duration) ? formatTime(t.duration) : "--:--"}</span>
    </div>
  `).join("");

  trackListEl.querySelectorAll('.track-like-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      toggleTrackLike(Number(button.dataset.likeIndex));
    });
  });

  trackListEl.querySelectorAll('.track-row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = Number(row.dataset.index);
      const selectedPlaylistIsPlaying = state.activePlaylistId === state.playingPlaylistId;
      if (idx === state.currentIndex && selectedPlaylistIsPlaying){
        togglePlay();
      } else {
        state.playingPlaylistId = state.activePlaylistId;
        loadTrack(idx, true);
      }
    });
  });

  updateActiveRow();
  updateLikeButtons();
}

function updateActiveRow(){
  trackListEl.querySelectorAll('.track-row').forEach(row => {
    const idx = Number(row.dataset.index);
    const isCurrentTrack =
      state.activePlaylistId === state.playingPlaylistId && idx === state.currentIndex;
    row.classList.toggle('is-active', isCurrentTrack);
    row.classList.toggle('is-paused', isCurrentTrack && !state.isPlaying);
  });
}

// Quietly load each track's metadata so the list can show real durations
function preloadDurations(){
  tracks.forEach((t, i) => {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = t.src;
    probe.addEventListener('loadedmetadata', () => {
      t.duration = probe.duration;
      const cell = trackListEl.querySelector(`[data-duration-for="${i}"]`);
      if (cell) cell.textContent = formatTime(t.duration);
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

function playActivePlaylist(){
  const playlist = getPlaylist();
  if (playlist.trackIndices.length === 0) return;
  const selectedPlaylistIsLoaded = state.activePlaylistId === state.playingPlaylistId;

  if (selectedPlaylistIsLoaded && playlist.trackIndices.includes(state.currentIndex)){
    togglePlay();
    return;
  }

  state.playingPlaylistId = state.activePlaylistId;
  loadTrack(playlist.trackIndices[0], true);
}

function playNext(){
  loadTrack(getNextTrackIndex(), true);
}

function playPrev(){
  // If we're a few seconds into the song, restart it instead of skipping back
  if (audio.currentTime > 3){
    audio.currentTime = 0;
    return;
  }
  const indices = getPlaylist(state.playingPlaylistId).trackIndices;
  const currentPosition = indices.indexOf(state.currentIndex);
  const previousPosition = currentPosition <= 0 ? indices.length - 1 : currentPosition - 1;
  loadTrack(indices[previousPosition], true);
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
  updateHeroPlayIcon();
  playerBar.classList.add('is-playing');
  updateActiveRow();
});

audio.addEventListener('pause', () => {
  state.isPlaying = false;
  playIcon.textContent = "play_arrow";
  updateHeroPlayIcon();
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
heroPlayBtn.addEventListener('click', playActivePlaylist);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
replay10Btn?.addEventListener('click', () => seekBy(-10));
forward10Btn?.addEventListener('click', () => seekBy(10));

playlistItems.forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    const playlistId = item.dataset.playlistId;
    if (!playlists[playlistId] || playlistId === state.activePlaylistId) return;

    state.activePlaylistId = playlistId;
    updatePlaylistView();
  });
});
searchInput?.addEventListener('input', () => {
  const hasText = searchInput.value.length > 0;
  searchClearBtn?.toggleAttribute('hidden', !hasText);
  renderTrackList(searchInput.value);
});

searchClearBtn?.addEventListener('click', () => {
  searchInput.value = "";
  searchClearBtn.hidden = true;
  renderTrackList();
  searchInput.focus();
});

likeBtn.addEventListener('click', toggleCurrentLike);
panelLikeBtn.addEventListener('click', toggleCurrentLike);

window.addEventListener('storage', event => {
  if (event.key !== LIKED_SONGS_STORAGE_KEY) return;
  state.liked = readSavedLikedSongs();
  updateLikeButtons();

  if (state.activePlaylistId === "liked-songs"){
    updateHeroDetails();
    renderTrackList(searchInput?.value || "");
    updateHeroPlayIcon();
  }

  if (state.playingPlaylistId === "liked-songs"){
    updateNowPlayingPanel();
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
updatePlaylistView();
preloadDurations();
loadTrack(0, false);
audio.volume = 0.75;
setPercent(volumeTrack, volumeFill, volumeHandle, 75);