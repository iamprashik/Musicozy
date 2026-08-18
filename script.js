// MUSICOZY STEP 6B — ADD SONGS TO PLAYLISTS
// MUSICOZY STEP 6A — CREATE CUSTOM PLAYLIST
// MUSICOZY STEP 5 — RECENTLY PLAYED
// MUSICOZY STEP 4 — FUNCTIONAL QUEUE
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

// ============ State ============
const state = {
  currentIndex: 0,
  activePlaylistId: "late-night-drive",
  playingPlaylistId: "late-night-drive",
  isPlaying: false,
  isSeeking: false,
  liked: readSavedLikedSongs(),
  recentlyPlayed: readRecentlyPlayed(),
  customPlaylists: readCustomPlaylists()
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
const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
const destinationTrackName = document.getElementById('destination-track-name');
const playlistDestinationList = document.getElementById('playlist-destination-list');
const playlistToast = document.getElementById('playlist-toast');
const playlistToastMessage = document.getElementById('playlist-toast-message');
const playlistToastChange = document.getElementById('playlist-toast-change');
let destinationTrackIndex = null;
let playlistToastTimer = null;

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

function getNextTrackIndex(playlistId = state.playingPlaylistId){
  const indices = getPlaylist(playlistId).trackIndices;
  if (indices.length === 0) return state.currentIndex;
  const currentPosition = indices.indexOf(state.currentIndex);
  if (currentPosition === -1) return indices[0];
  return indices[(currentPosition + 1) % indices.length];
}

function getUpcomingTrackIndices(playlistId = state.playingPlaylistId, limit = 3){
  const indices = getPlaylist(playlistId).trackIndices;
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

function updatePlaylistActions(){
  const isRecentlyPlayed = state.activePlaylistId === "recently-played";
  clearHistoryBtn.hidden = !isRecentlyPlayed || state.recentlyPlayed.length === 0;
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
    <a href="#" class="playlist-item custom-playlist-item" data-playlist-id="${playlist.id}">
      <span class="material-symbols-rounded">queue_music</span>
      <span class="custom-playlist-name">${escapeHtml(playlist.name)}</span>
    </a>
  `).join("");
}

function createCustomPlaylistId(){
  const randomPart = Math.random().toString(36).slice(2, 9);
  return `custom-${Date.now()}-${randomPart}`;
}

function openPlaylistModal(){
  playlistModal.hidden = false;
  playlistNameInput.value = "";
  playlistNameError.textContent = "";
  setTimeout(() => playlistNameInput.focus(), 0);
}

function closePlaylistModal(){
  playlistModal.hidden = true;
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

  renderTrackList();
  updateHeroPlayIcon();
  updatePlaylistActions();
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
      <span class="col-add">
        <button
          class="track-add-btn"
          data-add-index="${trackIndex}"
          type="button"
          aria-label="Add ${t.title} to Liked Songs or another playlist"
          title="Add to playlist"
        >
          <span class="material-symbols-rounded">add</span>
        </button>
      </span>
      <span class="col-duration" data-duration-for="${trackIndex}">${Number.isFinite(t.duration) ? formatTime(t.duration) : "--:--"}</span>
    </div>
  `).join("");

  trackListEl.querySelectorAll('.track-add-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      addTrackToLikedSongs(Number(button.dataset.addIndex));
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
  const indices = getPlaylist(state.playingPlaylistId).trackIndices;
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

playlistsEl.addEventListener('click', event => {
  const item = event.target.closest?.('.playlist-item[data-playlist-id]');
  if (!item) return;

  event.preventDefault();
  const playlistId = item.dataset.playlistId;
  if (!getPlaylist(playlistId) || playlistId === state.activePlaylistId) return;

  state.activePlaylistId = playlistId;
  updatePlaylistView();
});

createPlaylistBtn.addEventListener('click', openPlaylistModal);

playlistForm.addEventListener('submit', event => {
  event.preventDefault();
  if (createCustomPlaylist(playlistNameInput.value)){
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
  }
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