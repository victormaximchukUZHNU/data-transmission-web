<template>
  <modal
    name="link-generator"
    width="400px"
    height="275px"
    @before-close="handleModalClose"
  >
    <b-row class="h-100">
      <b-col>
        <div class="h-100 pt-3">
          <div class="d-flex justify-content-between align-items-center mx-3" style="height: 30%">
            <b-input
              id="password-input"
              placeholder="Пароль..."
              @keyup="handlePasswordEnter"
              type="password"
              class="generator-input"
              v-model="password" />
          </div>
          <div class="d-flex justify-content-between align-items-center mx-3" style="height: 30%">
            <b-input
              id="generator-input"
              class="generator-input"
              v-model="generatedLink"
              placeholder="Посилання..."
              readonly
            />
          </div>
          <div class="d-flex justify-content-center align-items-center mx-3" style="height: 40%">
            <b-button
              @click="copyToClipboard"
              :disabled="disableCopyButton"
              :class="{
              'copied-button': copied,
              'copy-button': !copied
            }">
              {{ copyText() }}
            </b-button>
            <b-button
              class="create-button ml-3"
              @click="generateRoom"
              :disabled="disableCreateButton"
            >
              СТВОРИТИ
            </b-button>
          </div>
        </div>
      </b-col>
    </b-row>
  </modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

  export default {
    data() {
      return {
        copied: false,
        copyText: () => {
          return this.copied ? 'СКОПІЙОВАНО' : 'КОПІЮВАТИ';
        },
        password: '',
        disableCopyButton: true,
        disableCreateButton: true
      }
    },

    computed: {
      ...mapGetters('room', ['generatedLink'])
    },

    methods: {
      ...mapActions('room', ['createRoom', 'resetRoom']),

      copyToClipboard() {
        const body = document.getElementsByTagName('body')[0];
        const linkInput = document.createElement('input');

        body.append(linkInput);

        linkInput.value = this.generatedLink;
        linkInput.select();

        document.execCommand("copy");

        linkInput.remove();

        this.copied = true;
      },

      handlePasswordEnter() {
        if (this.password) {
          return this.disableCreateButton = false;
        }

        this.disableCreateButton = true;
      },

      async generateRoom() {
        await this.createRoom({ password: this.password });

        this.disableCopyButton = false;
      },

      handleModalClose() {
        this.disableCopyButton = true;
        this.disableCreateButton = true;
        this.copied = false;
        this.password = '';
        this.resetRoom();
      }
    }
  }
</script>

<style scoped>
  .generator-input {
    border-top-color: white;
    border-left-color: white;
    border-right-color: white;
    background-color: white !important;
    border-radius: 0;
  }

  .generator-input:focus {
    border-color: black;
    box-shadow: none;
    border-top-color: white;
    border-left-color: white;
    border-right-color: white;
  }

  .copy-button {
    background-color: #26495c;
    border-color: #26495c;
    font-size: 15px;
    border-radius: 30px;
  }

  .copy-button:hover {
    background-color: #26495c;
    border-color: #26495c;
  }

  .copy-button:active {
    background-color: #26495c !important;
    border-color: #26495c !important;
  }

  .copied-button {
    background-color: #90ee38;
    border-color: #90ee38;
    font-size: 15px;
    border-radius: 30px;
  }

  .copied-button:hover {
    background-color: #90ee38;
    border-color: #90ee38;
  }

  .copied-button:active {
    background-color: #90ee38 !important;
    border-color: #90ee38 !important;
  }

  .create-button {
    background-color: #26495c;
    border-color: #26495c;
    font-size: 15px;
    border-radius: 30px;
  }

  .create-button:hover {
    background-color: #26495c;
    border-color: #26495c;
  }

  .create-button:active {
    background-color: #26495c !important;
    border-color: #26495c !important;
  }
</style>

