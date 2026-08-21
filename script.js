// ================================================================
// MUSICOZY APPLICATION LOGIC
// Sections follow the app's data flow: data, storage, state, UI,
// playback, events and initialization.
// ================================================================

// ======================== TRACK DATA ========================
// CC0 synthwave tracks from OpenGameArt + placeholder artwork.
// Source pages and artist credits are included with every track below.
const tracks = [
  {
    title: "Synth Wave by Alex",
    artist: "Alex McCulloch",
    cover: "https://picsum.photos/seed/synthwavealex/300/300",
    src: "https://opengameart.org/sites/default/files/80s_song_mastered_0.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/synth-wave-by-alex"
  },
  {
    title: "Nighttime Solitude",
    artist: "celestialghost8",
    cover: "https://picsum.photos/seed/nighttimesolitude/300/300",
    src: "https://opengameart.org/sites/default/files/Nighttime%20Solitude%20%5BCC0%5D.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/nighttime-solitude"
  },
  {
    title: "Synthwave 421k",
    artist: "The Cynic Project",
    cover: "https://picsum.photos/seed/synthwave421k/300/300",
    src: "https://opengameart.org/sites/default/files/007_Synthwave_421k.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/calm-relax-1-synthwave-421k"
  },
  {
    title: "Synthwave 4k",
    artist: "The Cynic Project",
    cover: "https://picsum.photos/seed/synthwave4k/300/300",
    src: "https://opengameart.org/sites/default/files/001_Synthwave_4k_0.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/calm-ambient-1-synthwave-4k"
  },
  {
    title: "Synthwave 15k",
    artist: "The Cynic Project",
    cover: "https://picsum.photos/seed/synthwave15k/300/300",
    src: "https://opengameart.org/sites/default/files/002_Synthwave_15k.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/calm-ambient-2-synthwave-15k"
  },
  {
    title: "Synth Wave",
    artist: "Alex McCulloch",
    cover: "https://picsum.photos/seed/synthwaveretro/300/300",
    src: "https://opengameart.org/sites/default/files/Synth%20Wave_0.mp3",
    license: "CC0",
    sourcePage: "https://opengameart.org/content/synth-wave"
  }
];

// ======================== PLAYLIST DATA ========================
// The playlists currently reuse the verified CC0 tracks in different orders.
const playlists = {
  "liked-songs": {
    name: "Liked Songs",
    cover: "https://picsum.photos/seed/musicozylikedsongs/300/300",
    description: "Every track you have saved in one place.",
    trackIndices: []
  },
  "recently-played": {
    name: "Recently Played",
    cover: "https://picsum.photos/seed/musicozyrecentlyplayed/300/300",
    description: "Your listening history, with the newest songs shown first.",
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

// ======================== LOCAL STORAGE ========================
// --- Liked songs ---
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

// --- Recently played history ---
const RECENTLY_PLAYED_STORAGE_KEY = "musicozy-recently-played-v1";
const RECENTLY_PLAYED_LIMIT = 20;

function readRecentlyPlayed(){
  try {
    const savedTrackIndices = JSON.parse(
      localStorage.getItem(RECENTLY_PLAYED_STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(savedTrackIndices)) return [];

    const validTrackIndices = savedTrackIndices.filter(trackIndex =>
      Number.isInteger(trackIndex) &&
      trackIndex >= 0 &&
      trackIndex < tracks.length
    );

    return [...new Set(validTrackIndices)].slice(0, RECENTLY_PLAYED_LIMIT);
  } catch (error) {
    console.warn("Musicozy could not read recently played songs:", error);
    return [];
  }
}

function saveRecentlyPlayed(){
  try {
    localStorage.setItem(
      RECENTLY_PLAYED_STORAGE_KEY,
      JSON.stringify(state.recentlyPlayed)
    );
  } catch (error) {
    console.warn("Musicozy could not save recently played songs:", error);
  }
}

// --- Custom playlists ---
const CUSTOM_PLAYLISTS_STORAGE_KEY = "musicozy-custom-playlists-v1";

function readCustomPlaylists(){
  try {
    const savedPlaylists = JSON.parse(
      localStorage.getItem(CUSTOM_PLAYLISTS_STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(savedPlaylists)) return [];

    const seenIds = new Set();

    return savedPlaylists.reduce((validPlaylists, playlist) => {
      if (!playlist || typeof playlist !== "object") return validPlaylists;

      const id = typeof playlist.id === "string" ? playlist.id : "";
      const name = typeof playlist.name === "string" ? playlist.name.trim().slice(0, 40) : "";

      if (!/^custom-[a-zA-Z0-9-]+$/.test(id) || !name || seenIds.has(id)) return validPlaylists;
      seenIds.add(id);

      const trackIndices = Array.isArray(playlist.trackIndices)
        ? [...new Set(playlist.trackIndices.filter(trackIndex =>
            Number.isInteger(trackIndex) && trackIndex >= 0 && trackIndex < tracks.length
          ))]
        : [];

      validPlaylists.push({
        id,
        name,
        cover: typeof playlist.cover === "string" && playlist.cover
          ? playlist.cover
          : `https://picsum.photos/seed/${id}/300/300`,
        trackIndices
      });

      return validPlaylists;
    }, []);
  } catch (error) {
    console.warn("Musicozy could not read custom playlists:", error);
    return [];
  }
}

function saveCustomPlaylists(){
  try {
    localStorage.setItem(
      CUSTOM_PLAYLISTS_STORAGE_KEY,
      JSON.stringify(state.customPlaylists)
    );
  } catch (error) {
    console.warn("Musicozy could not save custom playlists:", error);
  }
}

// --- Favorite playlists ---
const FAVORITE_PLAYLISTS_STORAGE_KEY = "musicozy-favorite-playlists-v1";

function readFavoritePlaylists(){
  try {
    const savedPlaylistIds = JSON.parse(
      localStorage.getItem(FAVORITE_PLAYLISTS_STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(savedPlaylistIds)) return new Set();

    return new Set(
      savedPlaylistIds.filter(playlistId =>
        typeof playlistId === "string" &&
        (Boolean(playlists[playlistId]) || /^custom-[a-zA-Z0-9-]+$/.test(playlistId))
      )
    );
  } catch (error) {
    console.warn("Musicozy could not read favorite playlists:", error);
    return new Set();
  }
}

function saveFavoritePlaylists(){
  try {
    localStorage.setItem(
      FAVORITE_PLAYLISTS_STORAGE_KEY,
      JSON.stringify([...state.favoritePlaylists])
    );
  } catch (error) {
    console.warn("Musicozy could not save favorite playlists:", error);
  }
}

// --- Per-playlist sorting ---
const PLAYLIST_SORT_STORAGE_KEY = "musicozy-playlist-sorts-v1";
const PLAYLIST_SORT_OPTIONS = {
  order: "Custom order",
  "title-asc": "Title A–Z",
  "artist-asc": "Artist A–Z",
  "duration-asc": "Shortest duration",
  "duration-desc": "Longest duration"
};

function readPlaylistSorts(){
  try {
    const savedSorts = JSON.parse(
      localStorage.getItem(PLAYLIST_SORT_STORAGE_KEY) || "{}"
    );

    if (!savedSorts || typeof savedSorts !== "object" || Array.isArray(savedSorts)){
      return {};
    }

    return Object.fromEntries(
      Object.entries(savedSorts).filter(([, sortKey]) =>
        Object.prototype.hasOwnProperty.call(PLAYLIST_SORT_OPTIONS, sortKey)
      )
    );
  } catch (error) {
    console.warn("Musicozy could not read playlist sorting:", error);
    return {};
  }
}

function savePlaylistSorts(){
  try {
    localStorage.setItem(
      PLAYLIST_SORT_STORAGE_KEY,
      JSON.stringify(state.playlistSorts)
    );
  } catch (error) {
    console.warn("Musicozy could not save playlist sorting:", error);
  }
}

// --- Playback session ---
const PLAYBACK_SESSION_STORAGE_KEY = "musicozy-playback-session-v1";
const DEFAULT_PLAYLIST_ID = "late-night-drive";
const DEFAULT_VOLUME = 0.75;

function readPlaybackSession(){
  try {
    const savedSession = JSON.parse(
      localStorage.getItem(PLAYBACK_SESSION_STORAGE_KEY) || "null"
    );

    if (!savedSession || typeof savedSession !== "object" || Array.isArray(savedSession)){
      return null;
    }

    return {
      activePlaylistId: typeof savedSession.activePlaylistId === "string"
        ? savedSession.activePlaylistId
        : DEFAULT_PLAYLIST_ID,
      playingPlaylistId: typeof savedSession.playingPlaylistId === "string"
        ? savedSession.playingPlaylistId
        : DEFAULT_PLAYLIST_ID,
      currentIndex: Number.isInteger(savedSession.currentIndex)
        ? savedSession.currentIndex
        : 0,
      currentTime: Number.isFinite(savedSession.currentTime) && savedSession.currentTime >= 0
        ? savedSession.currentTime
        : 0,
      volume: Number.isFinite(savedSession.volume)
        ? Math.min(1, Math.max(0, savedSession.volume))
        : DEFAULT_VOLUME
    };
  } catch (error) {
    console.warn("Musicozy could not read the playback session:", error);
    return null;
  }
}

// ======================== APPLICATION STATE ========================
const state = {
  currentIndex: 0,
  activePlaylistId: DEFAULT_PLAYLIST_ID,
  playingPlaylistId: DEFAULT_PLAYLIST_ID,
  isPlaying: false,
  isLoading: false,
  isRecovering: false,
  shouldAutoplay: false,
  currentSourceFailed: false,
  isSeeking: false,
  liked: readSavedLikedSongs(),
  recentlyPlayed: readRecentlyPlayed(),
  customPlaylists: readCustomPlaylists(),
  favoritePlaylists: readFavoritePlaylists(),
  playlistSorts: readPlaylistSorts()
};

// ======================== DOM REFERENCES ========================
// Core media, search and library elements.
const audio = document.getElementById('audio');
const trackListEl = document.getElementById('track-list');
const searchInput = document.getElementById('search-input') || document.querySelector('.search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
const playlistsEl = document.querySelector('.playlists');
const customPlaylistList = document.getElementById('custom-playlist-list');
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const playlistModal = document.getElementById('playlist-modal');
const playlistForm = document.getElementById('playlist-form');
const playlistNameInput = document.getElementById('playlist-name-input');
const playlistNameError = document.getElementById('playlist-name-error');
const playlistDialogTitle = document.getElementById('playlist-dialog-title');
const playlistDialogCopy = document.getElementById('playlist-dialog-copy');
const playlistSubmitBtn = document.getElementById('playlist-submit-btn');
const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
const destinationTrackName = document.getElementById('destination-track-name');
const playlistDestinationList = document.getElementById('playlist-destination-list');
const playlistToast = document.getElementById('playlist-toast');
const playlistToastMessage = document.getElementById('playlist-toast-message');
const playlistToastChange = document.getElementById('playlist-toast-change');

// Temporary playlist-dialog state.
let destinationTrackIndex = null;
let playlistToastTimer = null;
let editingPlaylistId = null;

// Playlist hero.
const heroArt = document.getElementById('hero-art');
const heroTitle = document.getElementById('hero-title');
const heroMeta = document.getElementById('hero-meta');

// Bottom-player song details.
const barArt = document.getElementById('bar-art');
const barTitle = document.getElementById('bar-title');
const barArtist = document.getElementById('bar-artist');
const likeBtn = document.getElementById('like-btn');

// Playback, playlist-action and sorting controls.
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const heroPlayBtn = document.getElementById('hero-play');
const heroPlayIcon = document.getElementById('hero-play-icon');
const playlistFavoriteBtn = document.getElementById('playlist-favorite-btn');
const playlistMoreBtn = document.getElementById('playlist-more-btn');
const playlistActionsMenu = document.getElementById('playlist-actions-menu');
const renamePlaylistAction = document.getElementById('rename-playlist-action');
const deletePlaylistAction = document.getElementById('delete-playlist-action');
const trackSortBtn = document.getElementById('track-sort-btn');
const trackSortCurrent = document.getElementById('track-sort-current');
const trackSortMenu = document.getElementById('track-sort-menu');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const replay10Btn = document.getElementById('replay-10-btn');
const forward10Btn = document.getElementById('forward-10-btn');

// Progress controls.
const timeCurrent = document.getElementById('time-current');
const timeDuration = document.getElementById('time-duration');
const progressTrack = document.getElementById('progress-track');
const progressFill = document.getElementById('progress-fill');
const progressHandle = document.getElementById('progress-handle');

// Volume controls.
const volumeTrack = document.getElementById('volume-track');
const volumeFill = document.getElementById('volume-fill');
const volumeHandle = document.getElementById('volume-handle');
const volumeButton = document.getElementById('volume-btn');

const playerBar = document.querySelector('.player-bar');

// Now Playing panel and responsive drawers.
const nowPlayingArt = document.getElementById('now-playing-art');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');
const nowPlayingPlaylist = document.getElementById('now-playing-playlist');
const artistCardName = document.getElementById('artist-card-name');
const panelLikeBtn = document.getElementById('panel-like-btn');
const queueList = document.getElementById('queue-list');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const nowPlayingToggleBtn = document.getElementById('now-playing-toggle-btn');
const nowPlayingCloseBtn = document.getElementById('now-playing-close-btn');
const responsiveBackdrop = document.getElementById('responsive-backdrop');

// Status messages and shared tooltip.
const playbackStatus = document.getElementById('playback-status');
const playbackStatusIcon = document.getElementById('playback-status-icon');
const playbackStatusMessage = document.getElementById('playback-status-message');
const playbackStatusClose = document.getElementById('playback-status-close');
const cursorTooltip = document.getElementById('cursor-tooltip');

// Playback timers and transient runtime state.
const failedPlaybackTrackIndices = new Set();
let playbackRecoveryTimer = null;
let playbackLoadTimer = null;
let playbackStatusTimer = null;
let seekingIsAvailable = false;
let pendingResumeTime = null;
let playbackSessionSaveTimer = null;
let playbackSessionIsReady = false;
let volumeBeforeMute = DEFAULT_VOLUME;
let tooltipTarget = null;

// ======================== GENERAL UI HELPERS ========================
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

function setButtonTooltip(button, label){
  if (!button) return;
  button.dataset.tooltip = label;

  if (tooltipTarget === button && cursorTooltip.classList.contains('is-visible')){
    cursorTooltip.textContent = label;
  }
}

// --- Progress and volume UI ---
function updateProgressAccessibility(currentTime = audio.currentTime, duration = audio.duration){
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrent = safeDuration
    ? Math.min(safeDuration, Math.max(0, Number.isFinite(currentTime) ? currentTime : 0))
    : 0;
  const percent = safeDuration ? (safeCurrent / safeDuration) * 100 : 0;

  progressTrack.setAttribute('aria-valuenow', String(Math.round(percent)));
  progressTrack.setAttribute(
    'aria-valuetext',
    `${formatTime(safeCurrent)} of ${formatTime(safeDuration)}`
  );
}

function syncProgressUI(currentTime = audio.currentTime, duration = audio.duration){
  const safeCurrent = Number.isFinite(currentTime) && currentTime > 0 ? currentTime : 0;
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const percent = safeDuration ? (safeCurrent / safeDuration) * 100 : 0;

  timeCurrent.textContent = formatTime(safeCurrent);
  setPercent(progressTrack, progressFill, progressHandle, percent);
  updateProgressAccessibility(safeCurrent, safeDuration);
}

function updateVolumeAccessibility(){
  const percent = Math.round(audio.volume * 100);
  const isMuted = percent === 0;

  volumeTrack.setAttribute('aria-valuenow', String(percent));
  volumeTrack.setAttribute('aria-valuetext', isMuted ? 'Muted' : `${percent} percent`);

  if (!volumeButton) return;
  volumeButton.textContent = isMuted
    ? 'volume_off'
    : percent < 50 ? 'volume_down' : 'volume_up';
  volumeButton.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
  volumeButton.setAttribute('aria-pressed', String(isMuted));
  setButtonTooltip(volumeButton, isMuted ? 'Unmute' : 'Mute');
}

function setVolume(level, { save = true } = {}){
  const safeVolume = Math.min(1, Math.max(0, Number(level) || 0));
  audio.volume = safeVolume;

  if (safeVolume > 0){
    volumeBeforeMute = safeVolume;
  }

  setPercent(volumeTrack, volumeFill, volumeHandle, safeVolume * 100);
  updateVolumeAccessibility();

  if (save){
    schedulePlaybackSessionSave();
  }
}

function toggleMute(){
  if (audio.volume > 0){
    volumeBeforeMute = audio.volume;
    setVolume(0);
  } else {
    setVolume(volumeBeforeMute > 0 ? volumeBeforeMute : DEFAULT_VOLUME);
  }
}

function isTypingTarget(target){
  const tagName = target?.tagName?.toLowerCase();
  return tagName === 'input'
    || tagName === 'textarea'
    || tagName === 'select'
    || Boolean(target?.isContentEditable)
    || Boolean(target?.closest?.('[contenteditable="true"]'));
}

function isNativeSpaceControl(target){
  return Boolean(target?.closest?.(
    'button, a, input, textarea, select, [role="button"], [role="menuitem"], [role="menuitemradio"], [role="slider"]'
  ));
}

// --- Playback status, loading and control states ---
function hidePlaybackStatus(){
  if (!playbackStatus) return;
  clearTimeout(playbackStatusTimer);
  playbackStatusTimer = null;
  playbackStatus.hidden = true;
  playbackStatus.classList.remove('is-terminal');
}

function showPlaybackStatus(message, { terminal = false, duration = 5000 } = {}){
  if (!playbackStatus || !playbackStatusMessage || !playbackStatusIcon) return;

  hidePlaylistToast();
  clearTimeout(playbackStatusTimer);
  playbackStatusMessage.textContent = message;
  playbackStatusIcon.textContent = terminal ? 'error' : 'sync_problem';
  playbackStatus.classList.toggle('is-terminal', terminal);
  playbackStatus.hidden = false;

  if (duration > 0){
    playbackStatusTimer = setTimeout(hidePlaybackStatus, duration);
  }
}

function setSeekingAvailable(isAvailable){
  seekingIsAvailable = Boolean(isAvailable);
  replay10Btn.disabled = !seekingIsAvailable;
  forward10Btn.disabled = !seekingIsAvailable;
  progressTrack.classList.toggle('is-disabled', !seekingIsAvailable);
  progressTrack.setAttribute('aria-disabled', String(!seekingIsAvailable));
  progressTrack.tabIndex = seekingIsAvailable ? 0 : -1;
}

function updatePlayerPlayButton(){
  const playLabel = state.isPlaying ? 'Pause' : 'Play';
  playBtn.classList.toggle('is-loading', state.isLoading);
  playerBar.classList.toggle('is-loading', state.isLoading);
  playIcon.textContent = state.isLoading
    ? 'progress_activity'
    : state.isPlaying ? 'pause' : 'play_arrow';
  playBtn.setAttribute(
    'aria-label',
    state.isLoading ? 'Loading song' : state.isPlaying ? 'Pause' : 'Play'
  );
  setButtonTooltip(playBtn, playLabel);
}

function setPlaybackLoading(isLoading){
  state.isLoading = Boolean(isLoading);
  updatePlayerPlayButton();
  updateHeroPlayIcon();
  updateActiveRow();
}

function clearPlaybackLoadTimer(){
  clearTimeout(playbackLoadTimer);
  playbackLoadTimer = null;
}

function startPlaybackLoadTimer(){
  clearPlaybackLoadTimer();
  if (!state.shouldAutoplay) return;

  playbackLoadTimer = setTimeout(() => {
    playbackLoadTimer = null;
    handlePlaybackFailure();
  }, 12000);
}

// --- Playback-session restoration and saving ---
function restorePlaybackSession(){
  const savedSession = readPlaybackSession();

  if (!savedSession){
    return {
      currentIndex: 0,
      currentTime: 0,
      volume: DEFAULT_VOLUME
    };
  }

  const activePlaylist = getPlaylist(savedSession.activePlaylistId);
  state.activePlaylistId = activePlaylist
    ? savedSession.activePlaylistId
    : DEFAULT_PLAYLIST_ID;

  let playingPlaylist = getPlaylist(savedSession.playingPlaylistId);
  if (!playingPlaylist || playingPlaylist.trackIndices.length === 0){
    state.playingPlaylistId = DEFAULT_PLAYLIST_ID;
    playingPlaylist = getPlaylist(DEFAULT_PLAYLIST_ID);
  } else {
    state.playingPlaylistId = savedSession.playingPlaylistId;
  }

  const savedTrackIsAvailable =
    playingPlaylist.trackIndices.includes(savedSession.currentIndex)
    && Boolean(tracks[savedSession.currentIndex]);
  const currentIndex = savedTrackIsAvailable
    ? savedSession.currentIndex
    : playingPlaylist.trackIndices[0];

  state.currentIndex = currentIndex;

  return {
    currentIndex,
    currentTime: savedTrackIsAvailable ? savedSession.currentTime : 0,
    volume: savedSession.volume
  };
}

function savePlaybackSession(){
  if (!playbackSessionIsReady) return;

  const currentTime = pendingResumeTime !== null
    ? pendingResumeTime
    : Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

  try {
    localStorage.setItem(
      PLAYBACK_SESSION_STORAGE_KEY,
      JSON.stringify({
        activePlaylistId: state.activePlaylistId,
        playingPlaylistId: state.playingPlaylistId,
        currentIndex: state.currentIndex,
        currentTime: Math.max(0, currentTime),
        volume: audio.volume
      })
    );
  } catch (error) {
    console.warn("Musicozy could not save the playback session:", error);
  }
}

function schedulePlaybackSessionSave(){
  if (!playbackSessionIsReady) return;
  clearTimeout(playbackSessionSaveTimer);
  playbackSessionSaveTimer = setTimeout(savePlaybackSession, 800);
}

// ======================== RESPONSIVE DRAWERS ========================
function syncResponsiveBackdrop(){
  if (!responsiveBackdrop) return;

  const hasOpenDrawer = document.body.classList.contains('sidebar-drawer-open')
    || document.body.classList.contains('now-playing-drawer-open');

  responsiveBackdrop.hidden = !hasOpenDrawer;
}

function closeSidebarDrawer(restoreFocus = false){
  const wasOpen = document.body.classList.contains('sidebar-drawer-open');
  document.body.classList.remove('sidebar-drawer-open');
  sidebarToggleBtn?.setAttribute('aria-expanded', 'false');
  sidebarToggleBtn?.setAttribute('aria-label', 'Open library');
  syncResponsiveBackdrop();

  if (restoreFocus && wasOpen) sidebarToggleBtn?.focus();
}

function closeNowPlayingDrawer(restoreFocus = false){
  const wasOpen = document.body.classList.contains('now-playing-drawer-open');
  document.body.classList.remove('now-playing-drawer-open');
  nowPlayingToggleBtn?.setAttribute('aria-expanded', 'false');
  nowPlayingToggleBtn?.setAttribute('aria-label', 'Open Now Playing');
  syncResponsiveBackdrop();

  if (restoreFocus && wasOpen) nowPlayingToggleBtn?.focus();
}

function openSidebarDrawer(){
  closeNowPlayingDrawer();
  closePlaylistActionsMenu();
  closeTrackSortMenu();
  document.body.classList.add('sidebar-drawer-open');
  sidebarToggleBtn?.setAttribute('aria-expanded', 'true');
  sidebarToggleBtn?.setAttribute('aria-label', 'Close library');
  syncResponsiveBackdrop();
  window.setTimeout(() => sidebarCloseBtn?.focus(), 0);
}

function openNowPlayingDrawer(){
  closeSidebarDrawer();
  closePlaylistActionsMenu();
  closeTrackSortMenu();
  document.body.classList.add('now-playing-drawer-open');
  nowPlayingToggleBtn?.setAttribute('aria-expanded', 'true');
  nowPlayingToggleBtn?.setAttribute('aria-label', 'Close Now Playing');
  syncResponsiveBackdrop();
  window.setTimeout(() => nowPlayingCloseBtn?.focus(), 0);
}

function closeResponsiveDrawers(restoreFocus = false){
  const sidebarWasOpen = document.body.classList.contains('sidebar-drawer-open');
  const nowPlayingWasOpen = document.body.classList.contains('now-playing-drawer-open');

  closeSidebarDrawer(false);
  closeNowPlayingDrawer(false);

  if (restoreFocus){
    if (sidebarWasOpen) sidebarToggleBtn?.focus();
    else if (nowPlayingWasOpen) nowPlayingToggleBtn?.focus();
  }
}

function handleResponsiveResize(){
  if (window.innerWidth > 760) closeSidebarDrawer();
  if (window.innerWidth > 1180) closeNowPlayingDrawer();
}

// ======================== PLAYLIST QUERIES AND QUEUE ========================
function getPlaylist(playlistId = state.activePlaylistId){
  const playlist = playlists[playlistId];

  if (playlistId === "liked-songs"){
    return {
      ...playlist,
      trackIndices: [...state.liked]
    };
  }

  if (playlistId === "recently-played"){
    return {
      ...playlist,
      trackIndices: [...state.recentlyPlayed]
    };
  }

  const customPlaylist = state.customPlaylists.find(item => item.id === playlistId);
  if (customPlaylist){
    return {
      name: customPlaylist.name,
      cover: customPlaylist.cover,
      description: "A custom playlist created by you.",
      trackIndices: [...customPlaylist.trackIndices]
    };
  }

  return playlist;
}

function getPlaylistSort(playlistId = state.activePlaylistId){
  return state.playlistSorts[playlistId] || "order";
}

function getSortedPlaylistTrackIndices(playlistId = state.activePlaylistId){
  const playlist = getPlaylist(playlistId);
  const trackEntries = playlist.trackIndices.map((trackIndex, position) => ({
    track: tracks[trackIndex],
    trackIndex,
    position
  }));

  return sortTrackEntries(trackEntries, getPlaylistSort(playlistId))
    .map(entry => entry.trackIndex);
}

function getNextTrackIndex(playlistId = state.playingPlaylistId){
  const indices = getSortedPlaylistTrackIndices(playlistId);
  if (indices.length === 0) return state.currentIndex;
  const currentPosition = indices.indexOf(state.currentIndex);
  if (currentPosition === -1) return indices[0];
  return indices[(currentPosition + 1) % indices.length];
}

function getUpcomingTrackIndices(playlistId = state.playingPlaylistId, limit = 3){
  const indices = getSortedPlaylistTrackIndices(playlistId);
  if (indices.length <= 1) return [];

  const currentPosition = indices.indexOf(state.currentIndex);
  const numberOfUpcomingTracks = Math.min(limit, indices.length - 1);

  if (currentPosition === -1){
    return indices.slice(0, Math.min(limit, indices.length));
  }

  return Array.from({ length: numberOfUpcomingTracks }, (_, offset) =>
    indices[(currentPosition + offset + 1) % indices.length]
  );
}

// ======================== ACTIVE PLAYLIST AND LIKE UI ========================
function updateHeroPlayIcon(){
  const selectedPlaylistHasTracks = getPlaylist().trackIndices.length > 0;
  const selectedPlaylistIsLoading =
    state.isLoading && state.activePlaylistId === state.playingPlaylistId;
  const selectedPlaylistIsPlaying =
    state.isPlaying && state.activePlaylistId === state.playingPlaylistId;

  heroPlayBtn.disabled = !selectedPlaylistHasTracks;
  heroPlayBtn.classList.toggle('is-loading', selectedPlaylistIsLoading);
  heroPlayBtn.setAttribute(
    'aria-label',
    !selectedPlaylistHasTracks
      ? 'Playlist is empty'
      : selectedPlaylistIsLoading
        ? 'Loading song'
        : selectedPlaylistIsPlaying ? 'Pause playlist' : 'Play playlist'
  );
  heroPlayIcon.textContent =
    selectedPlaylistIsLoading
      ? 'progress_activity'
      : selectedPlaylistHasTracks && selectedPlaylistIsPlaying ? 'pause' : 'play_arrow';
}

function updateLikeButtons(){
  const isLiked = state.liked.has(state.currentIndex);
  likeBtn.classList.toggle('is-liked', isLiked);
  panelLikeBtn.classList.toggle('is-liked', isLiked);
}

function updateNowPlayingPanel(){
  const current = tracks[state.currentIndex];
  const playingPlaylist = getPlaylist(state.playingPlaylistId);
  const upcomingTrackIndices = getUpcomingTrackIndices();

  nowPlayingArt.src = current.cover;
  nowPlayingTitle.textContent = current.title;
  nowPlayingArtist.textContent = current.artist;
  nowPlayingPlaylist.textContent = playingPlaylist.name;
  artistCardName.textContent = current.artist;

  if (upcomingTrackIndices.length === 0){
    queueList.innerHTML = `
      <p class="queue-empty-state">No more songs are waiting in this playlist.</p>
    `;
    return;
  }

  queueList.innerHTML = upcomingTrackIndices.map((trackIndex, queuePosition) => {
    const track = tracks[trackIndex];

    return `
      <button
        class="up-next-track"
        type="button"
        data-queue-index="${trackIndex}"
        aria-label="Play ${track.title} next"
      >
        <span class="queue-track-number">${queuePosition + 1}</span>
        <img src="${track.cover}" alt="">
        <span class="queue-track-copy">
          <span class="queue-track-title">${track.title}</span>
          <span class="queue-track-artist">${track.artist}</span>
        </span>
        <span class="material-symbols-rounded queue-play-icon">play_arrow</span>
      </button>
    `;
  }).join("");

  queueList.querySelectorAll('.up-next-track').forEach(queueTrack => {
    queueTrack.addEventListener('click', () => {
      loadTrack(Number(queueTrack.dataset.queueIndex), true);
    });
  });
}

function refreshLikedSongsUI(){
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

function setTrackLiked(trackIndex, shouldBeLiked){
  const isAlreadyLiked = state.liked.has(trackIndex);
  if (isAlreadyLiked === shouldBeLiked) return false;

  if (shouldBeLiked){
    state.liked.add(trackIndex);
  } else {
    state.liked.delete(trackIndex);
  }

  saveLikedSongs();
  refreshLikedSongsUI();
  return true;
}

function toggleTrackLike(trackIndex){
  setTrackLiked(trackIndex, !state.liked.has(trackIndex));
}

function toggleCurrentLike(){
  toggleTrackLike(state.currentIndex);
}

function updatePlaylistFavoriteUI(){
  const isFavorite = state.favoritePlaylists.has(state.activePlaylistId);

  playlistFavoriteBtn.classList.toggle('is-liked', isFavorite);
  playlistFavoriteBtn.setAttribute('aria-pressed', String(isFavorite));
  playlistFavoriteBtn.setAttribute(
    'aria-label',
    isFavorite ? 'Remove playlist from favorites' : 'Save playlist to favorites'
  );

  document.querySelectorAll('.playlist-item[data-playlist-id]').forEach(item => {
    item.classList.toggle(
      'is-favorite',
      state.favoritePlaylists.has(item.dataset.playlistId)
    );
  });
}

function toggleActivePlaylistFavorite(){
  const playlistId = state.activePlaylistId;

  if (state.favoritePlaylists.has(playlistId)){
    state.favoritePlaylists.delete(playlistId);
  } else {
    state.favoritePlaylists.add(playlistId);
  }

  saveFavoritePlaylists();
  updatePlaylistFavoriteUI();
}

function updatePlaylistActions(){
  const isRecentlyPlayed = state.activePlaylistId === "recently-played";
  const isCustomPlaylist = Boolean(getCustomPlaylistRecord(state.activePlaylistId));

  clearHistoryBtn.hidden = !isRecentlyPlayed || state.recentlyPlayed.length === 0;
  playlistMoreBtn.hidden = !isCustomPlaylist;

  if (!isCustomPlaylist){
    closePlaylistActionsMenu();
  }
}

// ======================== RECENTLY PLAYED ========================
function addRecentlyPlayed(trackIndex){
  if (state.recentlyPlayed[0] === trackIndex) return;

  state.recentlyPlayed = [
    trackIndex,
    ...state.recentlyPlayed.filter(savedIndex => savedIndex !== trackIndex)
  ].slice(0, RECENTLY_PLAYED_LIMIT);

  saveRecentlyPlayed();

  if (state.activePlaylistId === "recently-played"){
    updateHeroDetails();
    renderTrackList(searchInput?.value || "");
    updateHeroPlayIcon();
    updatePlaylistActions();
  }

  if (state.playingPlaylistId === "recently-played"){
    updateNowPlayingPanel();
  }
}

function clearRecentlyPlayed(){
  if (state.recentlyPlayed.length === 0) return;

  const shouldClear = window.confirm("Clear your Recently Played history?");
  if (!shouldClear) return;

  state.recentlyPlayed = [];
  saveRecentlyPlayed();
  searchInput.value = "";
  searchClearBtn.hidden = true;
  updateHeroDetails();
  renderTrackList();
  updateHeroPlayIcon();
  updatePlaylistActions();

  if (state.playingPlaylistId === "recently-played"){
    updateNowPlayingPanel();
  }
}

// ======================== CUSTOM PLAYLIST HELPERS ========================
function getCustomPlaylistRecord(playlistId){
  return state.customPlaylists.find(playlist => playlist.id === playlistId);
}

function escapeHtml(value){
  return value.replace(/[&<>"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

function renderCustomPlaylists(){
  customPlaylistList.innerHTML = state.customPlaylists.map(playlist => `
    <a href="#" class="playlist-item custom-playlist-item${playlist.id === state.activePlaylistId ? " active" : ""}${state.favoritePlaylists.has(playlist.id) ? " is-favorite" : ""}" data-playlist-id="${playlist.id}">
      <span class="material-symbols-rounded">queue_music</span>
      <span class="custom-playlist-name">${escapeHtml(playlist.name)}</span>
    </a>
  `).join("");
}

function closePlaylistActionsMenu(){
  playlistActionsMenu.hidden = true;
  playlistMoreBtn.setAttribute('aria-expanded', 'false');
}

// ======================== PLAYLIST SORTING ========================
function getActivePlaylistSort(){
  return getPlaylistSort(state.activePlaylistId);
}

function closeTrackSortMenu(){
  trackSortMenu.hidden = true;
  trackSortBtn.setAttribute('aria-expanded', 'false');
}

function updateTrackSortUI(){
  const activeSort = getActivePlaylistSort();
  trackSortCurrent.textContent = PLAYLIST_SORT_OPTIONS[activeSort];

  trackSortMenu.querySelectorAll('[data-sort-key]').forEach(option => {
    const isSelected = option.dataset.sortKey === activeSort;
    option.classList.toggle('is-selected', isSelected);
    option.setAttribute('aria-checked', String(isSelected));
  });
}

function setPlaylistSort(sortKey){
  if (!Object.prototype.hasOwnProperty.call(PLAYLIST_SORT_OPTIONS, sortKey)) return false;

  if (sortKey === "order"){
    delete state.playlistSorts[state.activePlaylistId];
  } else {
    state.playlistSorts[state.activePlaylistId] = sortKey;
  }

  savePlaylistSorts();
  updateTrackSortUI();
  renderTrackList(searchInput?.value || "");

  if (state.playingPlaylistId === state.activePlaylistId){
    updateNowPlayingPanel();
  }

  return true;
}

function compareTrackText(firstTrack, secondTrack, property){
  const propertyComparison = firstTrack.track[property].localeCompare(
    secondTrack.track[property],
    undefined,
    { sensitivity: "base" }
  );

  if (propertyComparison !== 0) return propertyComparison;
  return firstTrack.position - secondTrack.position;
}

function compareTrackDuration(firstTrack, secondTrack, direction){
  const firstDuration = Number.isFinite(firstTrack.track.duration)
    ? firstTrack.track.duration
    : null;
  const secondDuration = Number.isFinite(secondTrack.track.duration)
    ? secondTrack.track.duration
    : null;

  if (firstDuration === null && secondDuration === null){
    return firstTrack.position - secondTrack.position;
  }
  if (firstDuration === null) return 1;
  if (secondDuration === null) return -1;

  const durationComparison = (firstDuration - secondDuration) * direction;
  return durationComparison || firstTrack.position - secondTrack.position;
}

function sortTrackEntries(trackEntries, sortKey){
  const sortedTracks = [...trackEntries];

  if (sortKey === "title-asc"){
    return sortedTracks.sort((first, second) => compareTrackText(first, second, "title"));
  }

  if (sortKey === "artist-asc"){
    return sortedTracks.sort((first, second) => compareTrackText(first, second, "artist"));
  }

  if (sortKey === "duration-asc"){
    return sortedTracks.sort((first, second) => compareTrackDuration(first, second, 1));
  }

  if (sortKey === "duration-desc"){
    return sortedTracks.sort((first, second) => compareTrackDuration(first, second, -1));
  }

  return sortedTracks;
}

// ======================== CREATE, RENAME AND DELETE PLAYLISTS ========================
function createCustomPlaylistId(){
  const randomPart = Math.random().toString(36).slice(2, 9);
  return `custom-${Date.now()}-${randomPart}`;
}

function openPlaylistModal(playlistId = null){
  const playlist = getCustomPlaylistRecord(playlistId);
  editingPlaylistId = playlist?.id || null;

  playlistDialogTitle.textContent = editingPlaylistId ? "Rename playlist" : "Create a playlist";
  playlistDialogCopy.textContent = editingPlaylistId
    ? "Choose a new name for this playlist. Its songs will stay exactly where they are."
    : "Give your new playlist a name, then use the + beside any song to add it.";
  playlistSubmitBtn.textContent = editingPlaylistId ? "Save" : "Create";
  playlistModal.hidden = false;
  playlistNameInput.value = playlist?.name || "";
  playlistNameError.textContent = "";
  closePlaylistActionsMenu();
  closeTrackSortMenu();
  setTimeout(() => {
    playlistNameInput.focus();
    if (editingPlaylistId) playlistNameInput.select();
  }, 0);
}

function closePlaylistModal(){
  playlistModal.hidden = true;
  editingPlaylistId = null;
  playlistNameInput.value = "";
  playlistNameError.textContent = "";
  createPlaylistBtn.focus();
}

function createCustomPlaylist(playlistName){
  const name = playlistName.trim().slice(0, 40);

  if (!name){
    playlistNameError.textContent = "Enter a playlist name.";
    playlistNameInput.focus();
    return false;
  }

  const nameAlreadyExists = state.customPlaylists.some(
    playlist => playlist.name.toLowerCase() === name.toLowerCase()
  );

  if (nameAlreadyExists){
    playlistNameError.textContent = "You already have a playlist with this name.";
    playlistNameInput.focus();
    return false;
  }

  const id = createCustomPlaylistId();
  const customPlaylist = {
    id,
    name,
    cover: `https://picsum.photos/seed/${id}/300/300`,
    trackIndices: []
  };

  state.customPlaylists.push(customPlaylist);
  saveCustomPlaylists();
  renderCustomPlaylists();
  state.activePlaylistId = id;
  updatePlaylistView();
  return true;
}

function renameCustomPlaylist(playlistId, playlistName){
  const playlist = getCustomPlaylistRecord(playlistId);
  const name = playlistName.trim().slice(0, 40);

  if (!playlist) return false;

  if (!name){
    playlistNameError.textContent = "Enter a playlist name.";
    playlistNameInput.focus();
    return false;
  }

  const nameAlreadyExists = state.customPlaylists.some(
    item => item.id !== playlistId && item.name.toLowerCase() === name.toLowerCase()
  );

  if (nameAlreadyExists){
    playlistNameError.textContent = "You already have a playlist with this name.";
    playlistNameInput.focus();
    return false;
  }

  playlist.name = name;
  saveCustomPlaylists();
  renderCustomPlaylists();

  if (state.activePlaylistId === playlistId){
    updateHeroDetails();
    renderTrackList(searchInput?.value || "");
  }

  if (state.playingPlaylistId === playlistId){
    updateNowPlayingPanel();
  }

  if (!addToPlaylistModal.hidden && Number.isInteger(destinationTrackIndex)){
    renderPlaylistDestinations();
  }

  return true;
}

function deleteCustomPlaylist(playlistId){
  const playlist = getCustomPlaylistRecord(playlistId);
  if (!playlist) return false;

  const shouldDelete = window.confirm(
    `Delete "${playlist.name}"? This will remove the playlist, but not the songs from Musicozy.`
  );
  if (!shouldDelete) return false;

  const activePlaylistWasDeleted = state.activePlaylistId === playlistId;
  const playingPlaylistWasDeleted = state.playingPlaylistId === playlistId;

  state.customPlaylists = state.customPlaylists.filter(item => item.id !== playlistId);
  state.favoritePlaylists.delete(playlistId);
  delete state.playlistSorts[playlistId];
  saveCustomPlaylists();
  saveFavoritePlaylists();
  savePlaylistSorts();
  closePlaylistActionsMenu();
  renderCustomPlaylists();

  if (activePlaylistWasDeleted){
    state.activePlaylistId = "late-night-drive";
    updatePlaylistView();
  }

  if (playingPlaylistWasDeleted){
    state.playingPlaylistId = "late-night-drive";
    updateNowPlayingPanel();
  }

  if (!addToPlaylistModal.hidden && Number.isInteger(destinationTrackIndex)){
    renderPlaylistDestinations();
  }

  return true;
}

// ======================== ADD SONGS TO PLAYLISTS ========================
function hidePlaylistToast(){
  clearTimeout(playlistToastTimer);
  playlistToast.hidden = true;
}

function showAddedToLikedSongsMessage(trackIndex){
  destinationTrackIndex = trackIndex;
  hidePlaybackStatus();
  playlistToastMessage.textContent = "Added to Liked Songs.";
  playlistToast.hidden = false;
  clearTimeout(playlistToastTimer);
  playlistToastTimer = setTimeout(hidePlaylistToast, 5000);
}

function addTrackToLikedSongs(trackIndex){
  setTrackLiked(trackIndex, true);
  showAddedToLikedSongsMessage(trackIndex);
}

function isTrackInDestination(destinationId, trackIndex){
  if (destinationId === "liked-songs") return state.liked.has(trackIndex);
  return getCustomPlaylistRecord(destinationId)?.trackIndices.includes(trackIndex) || false;
}

function renderPlaylistDestinations(){
  if (!Number.isInteger(destinationTrackIndex)) return;

  const destinations = [
    {
      id: "liked-songs",
      name: "Liked Songs",
      type: "Automatic playlist",
      icon: "favorite"
    },
    ...state.customPlaylists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      type: "Custom playlist",
      icon: "queue_music"
    }))
  ];

  playlistDestinationList.innerHTML = destinations.map(destination => {
    const isSelected = isTrackInDestination(destination.id, destinationTrackIndex);

    return `
      <button
        class="playlist-destination-option${isSelected ? ' is-selected' : ''}"
        type="button"
        data-destination-id="${destination.id}"
        aria-pressed="${isSelected}"
      >
        <span class="material-symbols-rounded destination-playlist-icon">${destination.icon}</span>
        <span class="destination-playlist-copy">
          <span class="destination-playlist-name">${escapeHtml(destination.name)}</span>
          <span class="destination-playlist-type">${destination.type}</span>
        </span>
        <span class="material-symbols-rounded destination-check">${isSelected ? 'check_circle' : 'radio_button_unchecked'}</span>
      </button>
    `;
  }).join("");

  if (state.customPlaylists.length === 0){
    playlistDestinationList.insertAdjacentHTML(
      'beforeend',
      '<p class="destination-empty-state">Create a custom playlist to see more destinations here.</p>'
    );
  }
}

function openAddToPlaylistModal(trackIndex){
  if (!Number.isInteger(trackIndex) || !tracks[trackIndex]) return;

  destinationTrackIndex = trackIndex;
  destinationTrackName.textContent = `${tracks[trackIndex].title} — ${tracks[trackIndex].artist}`;
  renderPlaylistDestinations();
  hidePlaylistToast();
  addToPlaylistModal.hidden = false;
}

function closeAddToPlaylistModal(){
  addToPlaylistModal.hidden = true;
  destinationTrackIndex = null;
}

function toggleTrackInCustomPlaylist(playlistId, trackIndex){
  const playlist = getCustomPlaylistRecord(playlistId);
  if (!playlist) return;

  const existingPosition = playlist.trackIndices.indexOf(trackIndex);
  if (existingPosition === -1){
    playlist.trackIndices.push(trackIndex);
  } else {
    playlist.trackIndices.splice(existingPosition, 1);
  }

  saveCustomPlaylists();

  if (state.activePlaylistId === playlistId){
    updateHeroDetails();
    renderTrackList(searchInput?.value || "");
    updateHeroPlayIcon();
  }

  if (state.playingPlaylistId === playlistId){
    updateNowPlayingPanel();
  }
}

function togglePlaylistDestination(destinationId){
  if (!Number.isInteger(destinationTrackIndex)) return;

  if (destinationId === "liked-songs"){
    setTrackLiked(destinationTrackIndex, !state.liked.has(destinationTrackIndex));
  } else {
    toggleTrackInCustomPlaylist(destinationId, destinationTrackIndex);
  }

  renderPlaylistDestinations();
}

// ======================== PLAYLIST VIEW ========================
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

  document.querySelectorAll('.playlist-item[data-playlist-id]').forEach(item => {
    item.classList.toggle('active', item.dataset.playlistId === state.activePlaylistId);
  });

  if (searchInput){
    searchInput.value = "";
    searchClearBtn.hidden = true;
  }

  closeTrackSortMenu();
  updateTrackSortUI();
  renderTrackList();
  updateHeroPlayIcon();
  updatePlaylistFavoriteUI();
  updatePlaylistActions();
}

// ======================== TRACK LIST RENDERING ========================
function renderTrackList(query = ""){
  const normalizedQuery = query.trim().toLowerCase();
  const playlist = getPlaylist();
  const isLikedSongsView = state.activePlaylistId === "liked-songs";
  const isCustomPlaylistView = Boolean(getCustomPlaylistRecord(state.activePlaylistId));
  const isManagedPlaylistView = isLikedSongsView || isCustomPlaylistView;
  const safePlaylistName = escapeHtml(playlist.name);
  let matchingTracks = playlist.trackIndices
    .map((trackIndex, position) => ({
      track: tracks[trackIndex],
      trackIndex,
      position
    }))
    .filter(({ track }) => {
      const searchableText = `${track.title} ${track.artist} ${playlist.name}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

  matchingTracks = sortTrackEntries(matchingTracks, getActivePlaylistSort());

  if (matchingTracks.length === 0){
    let emptyMessage = "No songs found";

    if (!normalizedQuery && state.activePlaylistId === "liked-songs"){
      emptyMessage = "Your Liked Songs playlist is empty. Tap the + beside any song to add it.";
    }

    if (!normalizedQuery && state.activePlaylistId === "recently-played"){
      emptyMessage = "Your Recently Played history is empty. Play any song to add it here.";
    }

    if (!normalizedQuery && getCustomPlaylistRecord(state.activePlaylistId)){
      emptyMessage = "This playlist is empty. Add songs to start building it.";
    }

    trackListEl.innerHTML = `
      <p class="search-empty-state" role="status">${emptyMessage}</p>
    `;
    return;
  }

  trackListEl.innerHTML = matchingTracks.map(({ track: t, trackIndex }, displayPosition) => `
    <div class="track-row" data-index="${trackIndex}">
      <span class="col-index">
        <span class="idx-num">${displayPosition + 1}</span>
        <span class="eq"><span></span><span></span><span></span><span></span></span>
      </span>
      <span class="col-title">
        <img class="t-thumb" src="${t.cover}" alt="">
        <span class="t-text">
          <span class="t-title">${t.title}</span>
          <span class="t-artist">${t.artist}</span>
        </span>
      </span>
      <span class="col-album">${safePlaylistName}</span>
      <span class="col-add">
        <button
          class="track-add-btn${isManagedPlaylistView ? " is-liked-indicator" : ""}"
          data-add-index="${trackIndex}"
          data-playlist-action="${isManagedPlaylistView ? "manage" : "add"}"
          type="button"
          aria-label="${isManagedPlaylistView
            ? `${t.title} is already in ${safePlaylistName}. Manage playlists`
            : `Add ${t.title} to Liked Songs or another playlist`}"
          title="${isManagedPlaylistView ? `Already in ${safePlaylistName} — manage playlists` : "Add to playlist"}"
        >
          <span class="material-symbols-rounded">${isManagedPlaylistView ? "check_circle" : "add"}</span>
        </button>
      </span>
      <span class="col-duration" data-duration-for="${trackIndex}">${Number.isFinite(t.duration) ? formatTime(t.duration) : "--:--"}</span>
    </div>
  `).join("");

  trackListEl.querySelectorAll('.track-add-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      const trackIndex = Number(button.dataset.addIndex);

      if (button.dataset.playlistAction === "manage"){
        openAddToPlaylistModal(trackIndex);
        return;
      }

      addTrackToLikedSongs(trackIndex);
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
    row.classList.toggle('is-loading', isCurrentTrack && state.isLoading);
  });
}

// Load track metadata quietly so the list can display real durations.
function preloadDurations(){
  let settledMetadataCount = 0;

  const finishMetadataProbe = () => {
    settledMetadataCount += 1;
    if (settledMetadataCount !== tracks.length) return;

    if (getActivePlaylistSort().startsWith("duration-")){
      renderTrackList(searchInput?.value || "");
    }

    if (getPlaylistSort(state.playingPlaylistId).startsWith("duration-")){
      updateNowPlayingPanel();
    }
  };

  tracks.forEach((t, i) => {
    const probe = new Audio();
    let probeIsFinished = false;

    const finishProbeOnce = () => {
      if (probeIsFinished) return;
      probeIsFinished = true;
      finishMetadataProbe();
    };

    probe.preload = "metadata";
    probe.src = t.src;
    probe.addEventListener('loadedmetadata', () => {
      t.duration = probe.duration;
      const cell = trackListEl.querySelector(`[data-duration-for="${i}"]`);
      if (cell) cell.textContent = formatTime(t.duration);
      finishProbeOnce();
    });
    probe.addEventListener('error', finishProbeOnce);
  });
}

// ======================== PLAYBACK CONTROL ========================
function requestAudioPlayback(){
  const requestedTrackIndex = state.currentIndex;

  try {
    const playRequest = audio.play();
    playRequest?.catch(error => {
      if (requestedTrackIndex !== state.currentIndex) return;

      if (error?.name === 'NotAllowedError'){
        state.shouldAutoplay = false;
        state.isRecovering = false;
        clearPlaybackLoadTimer();
        setPlaybackLoading(false);
        showPlaybackStatus('Press Play to continue listening.', { duration: 4500 });
      }
    });
  } catch (error) {
    console.warn('Musicozy could not start playback:', error);
  }
}

function getNextRecoveryTrackIndex(){
  const indices = getSortedPlaylistTrackIndices(state.playingPlaylistId);
  if (indices.length === 0) return null;

  const currentPosition = indices.indexOf(state.currentIndex);
  const startingPosition = currentPosition === -1 ? -1 : currentPosition;

  for (let offset = 1; offset <= indices.length; offset += 1){
    const candidate = indices[(startingPosition + offset) % indices.length];
    if (!failedPlaybackTrackIndices.has(candidate)) return candidate;
  }

  return null;
}

function handlePlaybackFailure({ forceRecovery = false } = {}){
  const failedTrack = tracks[state.currentIndex];
  if (!failedTrack) return;
  if (!forceRecovery && failedPlaybackTrackIndices.has(state.currentIndex)) return;

  clearPlaybackLoadTimer();
  clearTimeout(playbackRecoveryTimer);
  playbackRecoveryTimer = null;

  const shouldRecover = forceRecovery || state.shouldAutoplay || state.isPlaying;

  audio.pause();
  state.isPlaying = false;
  state.shouldAutoplay = false;
  state.isRecovering = false;
  playerBar.classList.remove('is-playing');
  setPlaybackLoading(false);
  setSeekingAvailable(false);

  if (!shouldRecover){
    state.currentSourceFailed = true;
    showPlaybackStatus(
      `“${failedTrack.title}” couldn’t be loaded. Press Play to try the next song.`,
      { terminal: true, duration: 7000 }
    );
    return;
  }

  failedPlaybackTrackIndices.add(state.currentIndex);
  state.currentSourceFailed = true;
  const nextTrackIndex = getNextRecoveryTrackIndex();

  if (nextTrackIndex === null){
    state.currentSourceFailed = true;
    showPlaybackStatus(
      'None of the songs in this playlist could be loaded. Please try again later.',
      { terminal: true, duration: 9000 }
    );
    updatePlayerPlayButton();
    updateHeroPlayIcon();
    updateActiveRow();
    return;
  }

  state.isRecovering = true;
  setPlaybackLoading(true);
  showPlaybackStatus(
    `Couldn’t load “${failedTrack.title}”. Trying the next song…`,
    { duration: 6000 }
  );

  playbackRecoveryTimer = setTimeout(() => {
    playbackRecoveryTimer = null;
    state.isRecovering = false;
    loadTrack(nextTrackIndex, true, { isRecovery: true });
  }, 900);
}

function loadTrack(index, autoplay, { isRecovery = false, resumeTime = 0 } = {}){
  if (!Number.isInteger(index) || !tracks[index]) return;

  clearTimeout(playbackRecoveryTimer);
  playbackRecoveryTimer = null;
  clearPlaybackLoadTimer();

  if (!isRecovery){
    failedPlaybackTrackIndices.clear();
    hidePlaybackStatus();
  }

  audio.pause();
  state.currentIndex = index;
  state.isPlaying = false;
  state.isRecovering = false;
  state.shouldAutoplay = Boolean(autoplay);
  state.currentSourceFailed = false;
  pendingResumeTime = Number.isFinite(resumeTime) && resumeTime > 0
    ? resumeTime
    : null;
  const t = tracks[index];

  barArt.src = t.cover;
  barTitle.textContent = t.title;
  barArtist.textContent = t.artist;
  timeDuration.textContent = '--:--';
  syncProgressUI(0, 0);
  setSeekingAvailable(false);
  playerBar.classList.remove('is-playing');
  setPlaybackLoading(true);

  audio.src = t.src;
  audio.load();

  updateLikeButtons();
  updateNowPlayingPanel();
  updateActiveRow();
  schedulePlaybackSessionSave();

  if (autoplay){
    startPlaybackLoadTimer();
    requestAudioPlayback();
  }
}

function togglePlay(){
  if (state.isRecovering){
    clearTimeout(playbackRecoveryTimer);
    playbackRecoveryTimer = null;
    state.isRecovering = false;
    state.shouldAutoplay = false;
    setPlaybackLoading(false);
    hidePlaybackStatus();
    return;
  }

  if (state.currentSourceFailed){
    state.shouldAutoplay = true;
    handlePlaybackFailure({ forceRecovery: true });
    return;
  }

  if (state.isPlaying){
    state.shouldAutoplay = false;
    clearPlaybackLoadTimer();
    audio.pause();
  } else {
    state.shouldAutoplay = true;
    setPlaybackLoading(true);
    startPlaybackLoadTimer();
    requestAudioPlayback();
  }
}

function playActivePlaylist(){
  const trackIndices = getSortedPlaylistTrackIndices();
  if (trackIndices.length === 0) return;
  const selectedPlaylistIsLoaded = state.activePlaylistId === state.playingPlaylistId;

  if (selectedPlaylistIsLoaded && trackIndices.includes(state.currentIndex)){
    togglePlay();
    return;
  }

  state.playingPlaylistId = state.activePlaylistId;
  loadTrack(trackIndices[0], true);
}

function playNext(){
  if (getPlaylist(state.playingPlaylistId).trackIndices.length === 0){
    audio.pause();
    return;
  }
  loadTrack(getNextTrackIndex(), true);
}

function playPrev(){
  // If we're a few seconds into the song, restart it instead of skipping back
  if (audio.currentTime > 3){
    setPlaybackPosition(0);
    return;
  }
  const indices = getSortedPlaylistTrackIndices(state.playingPlaylistId);
  if (indices.length === 0) return;
  const currentPosition = indices.indexOf(state.currentIndex);
  const previousPosition = currentPosition <= 0 ? indices.length - 1 : currentPosition - 1;
  loadTrack(indices[previousPosition], true);
}

function setPlaybackPosition(seconds){
  if (!seekingIsAvailable || !Number.isFinite(audio.duration)) return;

  audio.currentTime = Math.min(audio.duration, Math.max(0, seconds));
  syncProgressUI();
  schedulePlaybackSessionSave();
}

function seekBy(seconds){
  setPlaybackPosition(audio.currentTime + seconds);
}

// ======================== AUDIO EVENTS ========================
audio.addEventListener('play', () => {
  state.isPlaying = true;
  state.shouldAutoplay = true;
  addRecentlyPlayed(state.currentIndex);
  updatePlayerPlayButton();
  updateHeroPlayIcon();
  playerBar.classList.add('is-playing');
  updateActiveRow();
  schedulePlaybackSessionSave();
});

audio.addEventListener('pause', () => {
  state.isPlaying = false;
  updatePlayerPlayButton();
  updateHeroPlayIcon();
  playerBar.classList.remove('is-playing');
  updateActiveRow();
  savePlaybackSession();
});

audio.addEventListener('loadedmetadata', () => {
  timeDuration.textContent = formatTime(audio.duration);
  setSeekingAvailable(Number.isFinite(audio.duration) && audio.duration > 0);

  if (pendingResumeTime !== null && Number.isFinite(audio.duration)){
    const latestResumeTime = Math.max(0, audio.duration - 0.25);
    const restoredTime = Math.min(pendingResumeTime, latestResumeTime);
    audio.currentTime = restoredTime;
    pendingResumeTime = null;
  }

  syncProgressUI();
  schedulePlaybackSessionSave();
});

audio.addEventListener('canplay', () => {
  clearPlaybackLoadTimer();
  state.currentSourceFailed = false;
  setPlaybackLoading(false);
});

audio.addEventListener('playing', () => {
  clearPlaybackLoadTimer();
  state.isPlaying = true;
  state.isRecovering = false;
  state.currentSourceFailed = false;
  failedPlaybackTrackIndices.clear();
  setPlaybackLoading(false);
  hidePlaybackStatus();
  playerBar.classList.add('is-playing');
});

audio.addEventListener('waiting', () => {
  if (!state.shouldAutoplay && !state.isPlaying) return;
  setPlaybackLoading(true);
  startPlaybackLoadTimer();
});

audio.addEventListener('stalled', () => {
  if (!state.shouldAutoplay && !state.isPlaying) return;
  setPlaybackLoading(true);
  startPlaybackLoadTimer();
});

audio.addEventListener('timeupdate', () => {
  if (state.isSeeking) return;
  syncProgressUI();
  schedulePlaybackSessionSave();
});

audio.addEventListener('ended', playNext);
audio.addEventListener('error', () => handlePlaybackFailure());

// ======================== UI EVENT LISTENERS ========================
// Player, seek, volume and status controls.
playBtn.addEventListener('click', togglePlay);
heroPlayBtn.addEventListener('click', playActivePlaylist);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
replay10Btn?.addEventListener('click', () => seekBy(-10));
forward10Btn?.addEventListener('click', () => seekBy(10));
volumeButton?.addEventListener('click', toggleMute);
playbackStatusClose?.addEventListener('click', hidePlaybackStatus);

// Responsive sidebar and Now Playing drawers.
sidebarToggleBtn?.addEventListener('click', () => {
  if (document.body.classList.contains('sidebar-drawer-open')){
    closeSidebarDrawer(true);
  } else {
    openSidebarDrawer();
  }
});
sidebarCloseBtn?.addEventListener('click', () => closeSidebarDrawer(true));

nowPlayingToggleBtn?.addEventListener('click', () => {
  if (document.body.classList.contains('now-playing-drawer-open')){
    closeNowPlayingDrawer(true);
  } else {
    openNowPlayingDrawer();
  }
});
nowPlayingCloseBtn?.addEventListener('click', () => closeNowPlayingDrawer(true));
responsiveBackdrop?.addEventListener('click', () => closeResponsiveDrawers(true));
window.addEventListener('resize', handleResponsiveResize);

// Sidebar playlist navigation.
playlistsEl.addEventListener('click', event => {
  const item = event.target.closest?.('.playlist-item[data-playlist-id]');
  if (!item) return;

  event.preventDefault();
  closePlaylistActionsMenu();
  const playlistId = item.dataset.playlistId;
  if (!getPlaylist(playlistId)) return;

  if (playlistId !== state.activePlaylistId){
    state.activePlaylistId = playlistId;
    updatePlaylistView();
  }

  savePlaybackSession();
  closeSidebarDrawer();
});

playlistFavoriteBtn.addEventListener('click', toggleActivePlaylistFavorite);

// Custom playlist action menu.
playlistMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  event.stopPropagation();
  const shouldOpen = playlistActionsMenu.hidden;
  closeTrackSortMenu();
  closePlaylistActionsMenu();

  if (shouldOpen){
    playlistActionsMenu.hidden = false;
    playlistMoreBtn.setAttribute('aria-expanded', 'true');
  }
});

renamePlaylistAction.addEventListener('click', event => {
  event.stopPropagation();
  const playlistId = state.activePlaylistId;
  closePlaylistActionsMenu();
  if (getCustomPlaylistRecord(playlistId)) openPlaylistModal(playlistId);
});

deletePlaylistAction.addEventListener('click', event => {
  event.stopPropagation();
  const playlistId = state.activePlaylistId;
  closePlaylistActionsMenu();
  if (getCustomPlaylistRecord(playlistId)) deleteCustomPlaylist(playlistId);
});

document.addEventListener('click', event => {
  if (!event.target.closest?.('.playlist-actions-menu-wrap')){
    closePlaylistActionsMenu();
  }
});

// Track sorting menu.
trackSortBtn.addEventListener('click', event => {
  event.preventDefault();
  event.stopPropagation();
  const shouldOpen = trackSortMenu.hidden;
  closePlaylistActionsMenu();
  closeTrackSortMenu();

  if (shouldOpen){
    trackSortMenu.hidden = false;
    trackSortBtn.setAttribute('aria-expanded', 'true');
  }
});

trackSortMenu.addEventListener('click', event => {
  const option = event.target.closest?.('[data-sort-key]');
  if (!option) return;

  event.stopPropagation();
  setPlaylistSort(option.dataset.sortKey);
  closeTrackSortMenu();
});

document.addEventListener('click', event => {
  if (!event.target.closest?.('.track-sort-wrap')){
    closeTrackSortMenu();
  }
});

// Create/rename playlist and destination dialogs.
createPlaylistBtn.addEventListener('click', () => openPlaylistModal());

playlistForm.addEventListener('submit', event => {
  event.preventDefault();
  const wasSaved = editingPlaylistId
    ? renameCustomPlaylist(editingPlaylistId, playlistNameInput.value)
    : createCustomPlaylist(playlistNameInput.value);

  if (wasSaved){
    closePlaylistModal();
  }
});

playlistModal.querySelectorAll('[data-close-playlist-modal]').forEach(control => {
  control.addEventListener('click', closePlaylistModal);
});

addToPlaylistModal.querySelectorAll('[data-close-add-to-playlist]').forEach(control => {
  control.addEventListener('click', closeAddToPlaylistModal);
});

playlistDestinationList.addEventListener('click', event => {
  const option = event.target.closest?.('[data-destination-id]');
  if (!option) return;
  togglePlaylistDestination(option.dataset.destinationId);
});

playlistToastChange.addEventListener('click', () => {
  openAddToPlaylistModal(destinationTrackIndex);
});

// Escape closes the topmost open dialog, drawer or menu.
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  if (!addToPlaylistModal.hidden){
    closeAddToPlaylistModal();
    return;
  }

  if (!playlistModal.hidden){
    closePlaylistModal();
    return;
  }

  if (document.body.classList.contains('sidebar-drawer-open')
    || document.body.classList.contains('now-playing-drawer-open')){
    closeResponsiveDrawers(true);
    return;
  }

  closePlaylistActionsMenu();
  closeTrackSortMenu();
});

// ======================== KEYBOARD SHORTCUTS ========================
document.addEventListener('keydown', event => {
  if (event.defaultPrevented
    || event.ctrlKey
    || event.metaKey
    || event.altKey
    || isTypingTarget(event.target)
    || !playlistModal.hidden
    || !addToPlaylistModal.hidden
    || event.target === progressTrack
    || event.target === volumeTrack){
    return;
  }

  if (event.repeat && ['Space', 'KeyM', 'KeyN', 'KeyP'].includes(event.code)){
    return;
  }

  if (event.code === 'Space'){
    if (isNativeSpaceControl(event.target)) return;
    event.preventDefault();
    togglePlay();
    return;
  }

  if (event.key === 'ArrowLeft'){
    event.preventDefault();
    seekBy(-10);
    return;
  }

  if (event.key === 'ArrowRight'){
    event.preventDefault();
    seekBy(10);
    return;
  }

  if (event.key === 'ArrowUp'){
    event.preventDefault();
    setVolume(audio.volume + 0.05);
    return;
  }

  if (event.key === 'ArrowDown'){
    event.preventDefault();
    setVolume(audio.volume - 0.05);
    return;
  }

  const key = event.key.toLowerCase();
  if (key === 'm'){
    event.preventDefault();
    toggleMute();
  } else if (key === 'n'){
    event.preventDefault();
    playNext();
  } else if (key === 'p'){
    event.preventDefault();
    playPrev();
  }
});

// Search, current-song likes and listening-history controls.
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
clearHistoryBtn.addEventListener('click', clearRecentlyPlayed);

// Keep saved playlists and likes synchronized across open browser tabs.
window.addEventListener('storage', event => {
  if (event.key === LIKED_SONGS_STORAGE_KEY){
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
  }

  if (event.key === RECENTLY_PLAYED_STORAGE_KEY){
    state.recentlyPlayed = readRecentlyPlayed();

    if (state.activePlaylistId === "recently-played"){
      updateHeroDetails();
      renderTrackList(searchInput?.value || "");
      updateHeroPlayIcon();
      updatePlaylistActions();
    }

    if (state.playingPlaylistId === "recently-played"){
      updateNowPlayingPanel();
    }
  }

  if (event.key === FAVORITE_PLAYLISTS_STORAGE_KEY){
    state.favoritePlaylists = readFavoritePlaylists();
    updatePlaylistFavoriteUI();
  }

  if (event.key === PLAYLIST_SORT_STORAGE_KEY){
    state.playlistSorts = readPlaylistSorts();
    updateTrackSortUI();
    renderTrackList(searchInput?.value || "");
    updateNowPlayingPanel();
  }

  if (event.key === CUSTOM_PLAYLISTS_STORAGE_KEY){
    const activePlaylistWasCustom = state.activePlaylistId.startsWith('custom-');
    const playingPlaylistWasCustom = state.playingPlaylistId.startsWith('custom-');

    state.customPlaylists = readCustomPlaylists();
    renderCustomPlaylists();

    if (!addToPlaylistModal.hidden && Number.isInteger(destinationTrackIndex)){
      renderPlaylistDestinations();
    }

    if (activePlaylistWasCustom){
      if (!getCustomPlaylistRecord(state.activePlaylistId)){
        state.activePlaylistId = 'late-night-drive';
      }
      updatePlaylistView();
    }

    if (playingPlaylistWasCustom){
      if (!getCustomPlaylistRecord(state.playingPlaylistId)){
        state.playingPlaylistId = 'late-night-drive';
      }
      updateNowPlayingPanel();
    }
  }
});

// ======================== PROGRESS SEEKING ========================
function seekFromEvent(clientX){
  if (!seekingIsAvailable) return;
  const rect = progressTrack.getBoundingClientRect();
  if (!rect.width) return;
  const pct = ((clientX - rect.left) / rect.width) * 100;
  const clamped = Math.min(100, Math.max(0, pct));
  setPlaybackPosition((clamped / 100) * audio.duration);
}

progressTrack.addEventListener('mousedown', (e) => {
  if (!seekingIsAvailable) return;
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

// Touch dragging for the progress bar.
progressTrack.addEventListener('touchstart', (e) => {
  if (!seekingIsAvailable) return;
  state.isSeeking = true;
  seekFromEvent(e.touches[0].clientX);
}, { passive: true });
progressTrack.addEventListener('touchmove', (e) => {
  if (!seekingIsAvailable) return;
  seekFromEvent(e.touches[0].clientX);
}, { passive: true });
progressTrack.addEventListener('touchend', () => { state.isSeeking = false; });

progressTrack.addEventListener('keydown', event => {
  if (!seekingIsAvailable) return;

  let nextTime = null;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown'){
    nextTime = audio.currentTime - 10;
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp'){
    nextTime = audio.currentTime + 10;
  } else if (event.key === 'Home'){
    nextTime = 0;
  } else if (event.key === 'End'){
    nextTime = audio.duration;
  }

  if (nextTime === null) return;
  event.preventDefault();
  setPlaybackPosition(nextTime);
});

// ======================== VOLUME CONTROL ========================
function setVolumeFromEvent(clientX){
  const rect = volumeTrack.getBoundingClientRect();
  if (!rect.width) return;
  const pct = ((clientX - rect.left) / rect.width) * 100;
  const clamped = Math.min(100, Math.max(0, pct));
  setVolume(clamped / 100);
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

volumeTrack.addEventListener('keydown', event => {
  let nextVolume = null;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown'){
    nextVolume = audio.volume - 0.05;
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp'){
    nextVolume = audio.volume + 0.05;
  } else if (event.key === 'Home'){
    nextVolume = 0;
  } else if (event.key === 'End'){
    nextVolume = 1;
  }

  if (nextVolume === null) return;
  event.preventDefault();
  setVolume(nextVolume);
});

window.addEventListener('pagehide', savePlaybackSession);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) savePlaybackSession();
});

// ======================== CURSOR TOOLTIPS ========================
const TOOLTIP_DELAY = 150; // ms of no movement before it appears
let tooltipTimer = null;

document.addEventListener('pointermove', (e) => {
  const target = e.target.closest('.has-tooltip');

  if (target){
    const isDark = target.dataset.tooltipVariant === 'dark';
    const isTop = target.dataset.tooltipPlacement === 'top';
    tooltipTarget = target;

    if (isTop){
      // Footer controls are anchored above so the tooltip stays on-screen.
      const rect = target.getBoundingClientRect();
      cursorTooltip.style.left = (rect.left + rect.width / 2) + 'px';
      cursorTooltip.style.top = (rect.top - 10) + 'px';
    } else if (isDark){
      // Navbar tooltips remain anchored below their icons.
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

    tooltipTimer = setTimeout(() => {
      cursorTooltip.textContent = target.dataset.tooltip;
      cursorTooltip.classList.toggle('is-dark', isDark);
      cursorTooltip.classList.toggle('is-top', isTop);
      cursorTooltip.classList.add('is-visible');
    }, TOOLTIP_DELAY);
  } else {
    tooltipTarget = null;
    clearTimeout(tooltipTimer);
    cursorTooltip.classList.remove('is-visible');
  }
});

// ======================== APPLICATION STARTUP ========================
const restoredPlaybackSession = restorePlaybackSession();
renderCustomPlaylists();
updatePlaylistView();
preloadDurations();
setVolume(restoredPlaybackSession.volume, { save: false });
loadTrack(
  restoredPlaybackSession.currentIndex,
  // Always restore paused; browsers require a fresh user action before playback.
  false,
  { resumeTime: restoredPlaybackSession.currentTime }
);
playbackSessionIsReady = true;
savePlaybackSession();