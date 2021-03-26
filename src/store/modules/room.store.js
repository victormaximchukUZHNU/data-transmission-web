import roomAPI from '../../api/room';

const initialState = () => {
  return {
    generatedLink: '',
    shortId: '',
    roomNotFound: false,
    loading: false
  };
};

const getters = {
  generatedLink: (state) => state.generatedLink,
  shortId: (state) => state.shortId,
  roomNotFound: (state) => state.roomNotFound,
  loading: (state) => state.loading
};

const mutations = {
  SET_ROOM_DATA(state, data) {
    state.shortId = data.shortId;
  },

  GENERATE_LINK(state, shortId) {
    state.generatedLink = `${window.location.host}/#/${shortId}`;
  },

  ROOM_NOT_FOUND(state, value) {
    state.roomNotFound = value;
  },

  SET_LOADING(state, value) {
    state.loading = value;
  }
};

const actions = {
  getRoom({ commit }, shortId) {
    commit('SET_LOADING', true);

    roomAPI.show(shortId)
      .then(response => {
        commit('SET_ROOM_DATA', response.data);
        commit('GENERATE_LINK', shortId);
      })
      .catch(err => {
        console.error(err);
        commit('ROOM_NOT_FOUND', true);
      })
      .finally(() => {
        commit('SET_LOADING', false);
      });
  },

  async createRoom({ commit }) {
    const { data: { shortId } } = await roomAPI.create();

    commit('GENERATE_LINK', shortId);
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions
};
