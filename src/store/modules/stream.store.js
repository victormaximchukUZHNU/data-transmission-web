const initialState = () => {
  return {
    localStream: null,
    remoteStream: null,
    pc: null,
    isCameraEnabled: false,
    isMicrophoneEnabled: false
  };
};

const getters = {
  localStream: (state) => state.localStream,
  remoteStream: (state) => state.remoteStream,
  pc: (state) => state.pc,
  isCameraEnabled: (state) => state.isCameraEnabled,
  isMicrophoneEnabled: (state) => state.isMicrophoneEnabled
};

const mutations = {
  SET_LOCAL_STREAM(state, data) {
    state.localStream = data;
  },
  SET_REMOTE_STREAM(state, data) {
    state.remoteStream = data;
  },
  SET_PC(state, data) {
    state.pc = data;
  },
  SET_CAMERA_ENABLED(state, data) {
    state.isCameraEnabled = data;
  },
  SET_MICROPHONE_ENABLED(state, data) {
    state.isMicrophoneEnabled = data;
  },
};

const actions = {
  setLocalStream({ commit }, data) {
    commit('SET_LOCAL_STREAM', data);
  },
  setRemoteStream({ commit }, data) {
    commit('SET_REMOTE_STREAM', data);
  },
  setPc({ commit }, data) {
    commit('SET_PC', data);
  },
  setIsCameraEnabled({ commit }, data) {
    commit('SET_CAMERA_ENABLED', data);
  },
  setIsMicrophoneEnabled({ commit }, data) {
    commit('SET_MICROPHONE_ENABLED', data);
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions
};
