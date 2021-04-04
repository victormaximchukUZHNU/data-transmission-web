import roomAPI from '../../api/room';
import Vue from 'vue'

const initialState = () => {
  return {
    generatedLink: '',
    shortId: '',
    roomNotFound: false,
    loading: false,
    isValidPassword: false,
    currentJoinStep: 'join_form'
  };
};

const getters = {
  generatedLink: (state) => state.generatedLink,
  shortId: (state) => state.shortId,
  roomNotFound: (state) => state.roomNotFound,
  loading: (state) => state.loading,
  currentJoinStep: (state) => state.currentJoinStep,
  isValidPassword: (state) => state.isValidPassword
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
  },

  RESET_ROOM_STATE(state) {
    const initial = initialState();

    Object.keys(initial).forEach((key) => {
      state[key] = initial[key];
    });
  },

  SET_VALID_PASSWORD_STATE(state, value) {
    state.isValidPassword = value;
  },

  SET_CURRENT_JOIN_STEP(state, value) {
    state.currentJoinStep = value;
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
      .finally(() => commit('SET_LOADING', false));
  },

  async createRoom({ commit }, params) {
    const { data: { shortId } } = await roomAPI.create(params);

    commit('GENERATE_LINK', shortId);
  },

  async validatePassword({ commit }, params) {
    commit('SET_LOADING', true);

    roomAPI.validatePassword(params)
      .then(() => {
        commit('SET_VALID_PASSWORD_STATE', true);
        commit('SET_CURRENT_JOIN_STEP', 'live_stream');
      })
      .catch(err => {
        if (err.response.status === 401) {
          Vue.notify({
            group: 'app',
            text: 'Пароль від кімнати не правильний!',
            type: 'error'
          });
        }
        console.log(err);
      })
      .finally(() => commit('SET_LOADING', false))
  },

  resetRoom({ commit }) {
    commit('RESET_ROOM_STATE');
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions
};
