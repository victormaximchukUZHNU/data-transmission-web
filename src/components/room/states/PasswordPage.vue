<template>
  <div class="container h-100">
    <b-row>
      <b-col>
        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
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
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        password: '',
        disableLoginButton: true
      }
    },
    computed: {
      roomId() {
        return this.$route.params.id;
      }
    },
    methods: {
      ...mapActions('room', ['validatePassword']),

      handlePasswordEnter: function () {
        if (!this.password) {
          return this.disableLoginButton = true;
        }

        this.disableLoginButton = false;
      },

      async handleLogin() {
        await this.validatePassword({ shortId: this.roomId, password: this.password });
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
