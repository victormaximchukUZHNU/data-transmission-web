<template>
  <div class="container h-100">
    <b-row>
      <b-col>
        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
          <video
            id="local-video"
            autoplay width="400"
            height="300"
            v-show="isCameraEnabled"
            style="margin-bottom: 30px"
          />
          <img
            style="margin-bottom: 30px"
            src='../../../assets/images/no_camera.png'
            width="400"
            height="300"
            v-show="!isCameraEnabled"
          >
          <div class="device-actions">
            <img
              src="../../../assets/icons/camera_enabled.svg"
              v-show="isCameraEnabled"
              @click="handleCamera"
              height="30"
              width="30"
            >
            <img
              src="../../../assets/icons/camera_disabled.svg"
              v-show="!isCameraEnabled"
              @click="handleCamera"
              height="30"
              width="30"
            >
            <img
              src="../../../assets/icons/microphone_enabled.svg"
              v-show="isMicrophoneEnabled"
              @click="handleMicrophone"
              height="30"
              width="30"
            >
            <img
              src="../../../assets/icons/microphone_disabled.svg"
              v-show="!isMicrophoneEnabled"
              @click="handleMicrophone"
              height="30"
              width="30"
            >
          </div>
          <div class="form-section">
              <div class="password-text d-flex justify-content-center align-items-center h-25">
                Введіть пароль
              </div>
              <div class="d-flex justify-content-center align-items-center h-25">
                <b-input
                  id="password-input"
                  placeholder="..."
                  @keyup="handlePasswordEnter"
                  type="password"
                  class="password-input"
                  v-model="password"
                />
              </div>
              <div class="d-flex justify-content-center align-items-center h-50">
                <b-button
                  class="login-button ml-3"
                  @click="handleLogin"
                  :disabled="disableLoginButton"
                >
                  УВІЙТИ
                </b-button>
              </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        password: '',
        disableLoginButton: true
      }
    },
    computed: {
      ...mapGetters('stream', ['isMicrophoneEnabled', 'isCameraEnabled']),

      roomId() {
        return this.$route.params.id;
      }
    },
    async created() {
      await this.getUserMedia();
    },
    methods: {
      ...mapActions('room', ['validatePassword']),
      ...mapActions('stream', ['setLocalStream', 'setIsCameraEnabled', 'setIsMicrophoneEnabled']),

      handlePasswordEnter: function () {
        if (!this.password) {
          return this.disableLoginButton = true;
        }

        this.disableLoginButton = false;
      },

      async handleLogin() {
        await this.validatePassword({ shortId: this.roomId, password: this.password });
      },

      async getUserMedia() {
        try {
          const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });

          this.setLocalStream(localStream);
          this.setIsCameraEnabled(true);
          this.setIsMicrophoneEnabled(true);

          const localVideo = document.getElementById("local-video");

          localVideo.muted = true;
          localVideo.srcObject = localStream;
        } catch (error) {
          this.handleGetUserMediaError(error);
        }
      },

      handleGetUserMediaError(error) {
        switch(error.name) {
          case "NotFoundError":
            this.$notify({
              group: 'app',
              text: 'Ваш мікрофон або камеру не було знайдено!',
              type: 'warn'
            });

            break;
          case "SecurityError":
          case "PermissionDeniedError":
            break;
          case "NotAllowedError":
            this.$notify({
              group: 'app',
              text: 'Щоб приєднатись потрібно надати доступ до камери та мікрофону!',
              type: 'warn'
            });

            break;
          default:
            this.$notify({
              group: 'app',
              text: 'Сталася помилка при пошуку камери або мікрофону!',
              type: 'warn'
            });

            break;
        }

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },

      handleCamera() {
        this.setIsCameraEnabled(!this.isCameraEnabled);
      },

      handleMicrophone() {
        this.setIsMicrophoneEnabled(!this.isMicrophoneEnabled);
      }
    }
  }
</script>

<style scoped>
  .form-section {
    width: 400px;
    height: 200px;
    padding-top: 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
  }

  .password-text {
    text-align: left;
    width: 300px;
    font-size: 20px;
  }

  .password-input {
    width: 300px;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    background-color: transparent !important;
    border-radius: 0;
  }

  .password-input:focus {
    border-color: black;
    box-shadow: none;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    background-color: transparent !important;
  }

  .login-button {
    background-color: #26495c;
    border-color: #26495c;
    font-size: 15px;
    border-radius: 30px;
  }

  .login-button:hover {
    background-color: #26495c;
    border-color: #26495c;
  }

  .login-button:active {
    background-color: #26495c !important;
    border-color: #26495c !important;
  }
</style>
