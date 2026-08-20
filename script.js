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

// ============ Saved listening history ============
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

// ============ Saved custom playlists ============
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

// ============ Saved favorite playlists ============
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

// ============ Saved playlist sorting ============
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

// ============ State ============
const state = {
  currentIndex: 0,
  activePlaylistId: "late-night-drive",
  playingPlaylistId: "late-night-drive",
  isPlaying: false,
  isSeeking: false,
  liked: readSavedLikedSongs(),
  recentlyPlayed: readRecentlyPlayed(),
  customPlaylists: readCustomPlaylists(),
  favoritePlaylists: readFavoritePlaylists(),
  playlistSorts: readPlaylistSorts()
};

// ============ DOM refs ============
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
let destinationTrackIndex = null;
let playlistToastTimer = null;
let editingPlaylistId = null;

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
const queueList = document.getElementById('queue-list');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const nowPlayingToggleBtn = document.getElementById('now-playing-toggle-btn');
const nowPlayingCloseBtn = document.getElementById('now-playing-close-btn');
const responsiveBackdrop = document.getElementById('responsive-backdrop');

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

// MUSICOZY STEP 11 — RESPONSIVE DRAWERS
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

function hidePlaylistToast(){
  clearTimeout(playlistToastTimer);
  playlistToast.hidden = true;
}

function showAddedToLikedSongsMessage(trackIndex){
  destinationTrackIndex = trackIndex;
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

// MUSICOZY STEP 6C — LIKED SONGS GREEN TICK
// ============ Rendering and filtering the track list ============
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
  });
}

// Quietly load each track's metadata so the list can show real durations
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
    audio.currentTime = 0;
    return;
  }
  const indices = getSortedPlaylistTrackIndices(state.playingPlaylistId);
  if (indices.length === 0) return;
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
  addRecentlyPlayed(state.currentIndex);
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

  closeSidebarDrawer();
});

playlistFavoriteBtn.addEventListener('click', toggleActivePlaylistFavorite);

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
renderCustomPlaylists();
updatePlaylistView();
preloadDurations();
loadTrack(0, false);
audio.volume = 0.75;
setPercent(volumeTrack, volumeFill, volumeHandle, 75);