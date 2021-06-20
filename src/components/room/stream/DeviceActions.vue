<template>
  <b-row style="height: 15% !important;">
    <b-col>
      <div class="device-actions">
        <img
          src="../../../assets/icons/camera_enabled.svg"
          v-show="isCameraEnabled"
          @click="handleCamera"
          style="margin-right: 20px"
        >
        <img
          src="../../../assets/icons/camera_disabled.svg"
          v-show="!isCameraEnabled"
          @click="handleCamera"
          style="margin-right: 20px"
        >
        <img
          src="../../../assets/icons/end_call.svg"
          style="margin-right: 20px"
          @click="leaveCall"
        >
        <img
          src="../../../assets/icons/microphone_enabled.svg"
          v-show="isMicrophoneEnabled"
          @click="handleMicrophone"
        >
        <img
          src="../../../assets/icons/microphone_disabled.svg"
          v-show="!isMicrophoneEnabled"
          @click="handleMicrophone"
        >
      </div>
    </b-col>
  </b-row>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters('stream', ['localStream', 'isCameraEnabled', 'isMicrophoneEnabled']),
      ...mapGetters('room', ['shortId']),
    },
    methods: {
      ...mapActions('stream', ['setIsCameraEnabled', 'setIsMicrophoneEnabled']),

      onOffCamera() {
        this.localStream.getVideoTracks().forEach(track => {
          track.enabled = this.isCameraEnabled;
        });
      },

      handleCamera() {
        this.setIsCameraEnabled(!this.isCameraEnabled);
        this.onOffCamera();

        this.$socket.emit('cameraAction', {
          enabled: this.isCameraEnabled,
          roomId: this.shortId,
          senderId: localStorage.uniqId
        });
      },

      onOffMicrophone() {
        this.localStream.getAudioTracks().forEach(track => {
          track.enabled = this.isMicrophoneEnabled;
        });
      },

      handleMicrophone() {
        this.setIsMicrophoneEnabled(!this.isMicrophoneEnabled);
        this.onOffMicrophone();

        this.$socket.emit('microphoneAction', {
          enabled: this.isMicrophoneEnabled,
          roomId: this.shortId,
          senderId: localStorage.uniqId
        });
      },

      leaveCall() {
        this.$socket.emit('participantDisconnected', {
          roomId: this.roomId,
          senderId: this.uniqId
        });

        window.location.href = window.location.origin;
      }
    }
  }
</script>

<style lang="css" scoped>
  .device-actions {
    height: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .device-actions img {
    cursor: pointer;
    width: 60px !important;
    height: 60px !important;
  }
</style>
