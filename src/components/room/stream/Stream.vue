<template>
  <div id="video-section" class="video-section">
    <div v-show="!isParticipantConnected || !participantCameraEnabled">
      <img
        src="../../../../src/assets/images/no_camera.png"
        width="400"
        height="300"
        style="margin-bottom: 40px"
      >
    </div>
    <video id="remote-video" autoplay v-show="isParticipantConnected && participantCameraEnabled" class="remote-video"/>
    <img
      class="microphone-icon"
      src="../../../assets/icons/microphone_disabled.svg"
      v-show="isParticipantConnected && !participantMicrophoneEnabled"
    >

    <div v-show="!isCameraEnabled">
      <img src="../../../../src/assets/images/no_camera.png" width="400" height="300">
    </div>
    <video id="local-video" autoplay class="local-video" v-show="isCameraEnabled"/>
  </div>
</template>

<script>
import { servers } from "./helpers/servers";
import isSendFromRemote from "./helpers/isSendFromRemote";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isParticipantConnected: false,
      participantCameraEnabled: false,
      participantMicrophoneEnabled: false,
      participantConnectedData: {},
      offerOptions: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      }
    };
  },

  props: {
    options: {
      type: Object,
      default: () => {},
    },
  },

  watch: {
    isParticipantConnected(connected) {
      if (connected) {
        this.participantCameraEnabled = this.participantConnectedData.isParticipantCameraEnabled;
        this.participantMicrophoneEnabled = this.participantConnectedData.isParticipantMicrophoneEnabled;
      }
    }
  },

  sockets: {
    async participantConnected(params) {
      if (!this.isLiveStream(params.senderId, this.options.uniqId)) {
        return;
      }

      this.participantConnectedData = params;

      this.createPeerConnection();
      this.addTracks();

      await this.createOffer();
    },

    participantDisconnected(params) {
      if (!this.isLiveStream(params.senderId, this.options.uniqId)) {
        return;
      }

      this.hangUpCall();
    },

    async videoChatOffer(data) {
      if (!this.isLiveStream(data.senderId, this.options.uniqId)) {
        return;
      }

      this.participantConnectedData = data;

      await this.createAnswer(data);
    },

    async videoChatAnswer(data) {
      if (!this.isLiveStream(data.senderId, this.options.uniqId)) {
        return;
      }

      const desc = new RTCSessionDescription(data.sdp);

      await this.pc.setRemoteDescription(desc);
    },

    async newICECandidate(data) {
      if (!this.isLiveStream(data.senderId, this.options.uniqId)) {
        return;
      }

      const candidate = new RTCIceCandidate(data.candidate);

      await this.pc.addIceCandidate(candidate);
    },

    cameraAction(data) {
      if (!this.isLiveStream(data.senderId, this.options.uniqId)) {
        return;
      }

      this.participantCameraEnabled = data.enabled;
    },

    microphoneAction(data) {
      if (!this.isLiveStream(data.senderId, this.options.uniqId)) {
        return;
      }

      this.participantMicrophoneEnabled = data.enabled;
    }
  },

  computed: {
    ...mapGetters("room", ["currentJoinStep"]),
    ...mapGetters("stream", ["localStream", "remoteStream", "pc", "isCameraEnabled", "isMicrophoneEnabled"]),
  },

  mounted() {
    const localVideo = document.getElementById("local-video");

    localVideo.muted = true;
    localVideo.srcObject = this.localStream;

    this.onOffCamera();
    this.onOffMicrophone();
  },

  methods: {
    ...mapActions("stream", ["setLocalStream", "setRemoteStream", "setPc", "setIsCameraEnabled"]),

    isLiveStream(senderId, currentUserId) {
      return this.currentJoinStep === "live_stream" && isSendFromRemote(senderId, currentUserId);
    },

    createPeerConnection() {
      const pc = new RTCPeerConnection({ ...servers });

      pc.onicecandidate = this.handleICECandidateEvent;
      pc.ontrack = this.handleTrackEvent;
      pc.onremovetrack = this.handleRemoveTrackEvent;

      this.setPc(pc);
    },

    addTracks() {
      this.localStream
        .getTracks()
        .forEach((track) => this.pc.addTrack(track, this.localStream));
    },

    async createOffer() {
      const offer = await this.pc.createOffer(this.offerOptions);

      await this.pc.setLocalDescription(offer);

      this.$socket.emit("videoChatOffer", {
        senderId: this.options.uniqId,
        roomId: this.options.roomId,
        sdp: this.pc.localDescription,
        isParticipantCameraEnabled: this.isCameraEnabled,
        isParticipantMicrophoneEnabled: this.isMicrophoneEnabled
      });
    },

    async createAnswer(data) {
      await this.createPeerConnection();

      const desc = new RTCSessionDescription(data.sdp);

      await this.pc.setRemoteDescription(desc);

      await this.addTracks();

      const answer = await this.pc.createAnswer();

      await this.pc.setLocalDescription(answer);

      this.$socket.emit("videoChatAnswer", {
        senderId: this.options.uniqId,
        roomId: this.options.roomId,
        sdp: this.pc.localDescription
      });

      this.isParticipantConnected = true;
    },

    hangUpCall() {
      const { pc } = this;
      const remoteVideo = document.getElementById("remote-video");

      if (pc) {
        pc.ontrack = null;
        pc.onremovetrack = null;
        pc.onremovestream = null;
        pc.onicecandidate = null;
        pc.oniceconnectionstatechange = null;
        pc.onsignalingstatechange = null;
        pc.onicegatheringstatechange = null;
        pc.onnegotiationneeded = null;

        if (remoteVideo.srcObject) {
          remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        }

        pc.close();
        this.setPc(null);
      }

      remoteVideo.removeAttribute("src");
      remoteVideo.removeAttribute("srcObject");

      this.isParticipantConnected = false;
    },

    handleRemoveTrackEvent() {
      const remoteVideo = document.getElementById("remote-video").srcObject;
      const trackList = remoteVideo.getTracks();

      if (!trackList.length) {
        this.hangUpCall();
      }
    },

    handleTrackEvent(event) {
      const remoteStream = event.streams[0];
      const remoteVideo = document.getElementById("remote-video");

      this.setRemoteStream(remoteStream);

      remoteVideo.srcObject = this.remoteStream;

      this.isParticipantConnected = true;
    },

    handleICECandidateEvent(event) {
      if (event.candidate) {
        this.$socket.emit("newICECandidate", {
          roomId: this.options.roomId,
          senderId: this.options.uniqId,
          candidate: event.candidate,
        });
      }
    },

    onOffCamera() {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = this.isCameraEnabled;
      });
    },

    onOffMicrophone() {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = this.isMicrophoneEnabled;
      });
    }
  },
};
</script>

<style lang="css" scoped>
  .video-section {
    background-color: #181A18;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .microphone-icon {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 340px;
    left: 440px;
  }

  .remote-video {
    width: 400px;
    height: 300px;
    margin-bottom: 40px;
  }

  .local-video {
    width: 400px;
    height: 300px;
  }
</style>
