<template>
  <div class="container h-100">
    <b-row>
      <b-col>
        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
          <div class="info-section">
            <h3>Давайте розпочнемо!</h3>
            <b-button size="lg" class="start-button w-100 my-3" @click="handleClick">
              ПОЧАТИ
            </b-button>
            <small>
              Вам буде згенеровано унікальне посилання, яким Ви можете поділитись, щоб почати відео зв'зок.
            </small>
          </div>
        </div>
      </b-col>
    </b-row>
    <LinkGenerator />
  </div>
</template>

<script>
import LinkGenerator from './modals/LinkGenerator';

export default {
  components: {
    LinkGenerator
  },

  methods: {
    handleClick() {
      this.$modal.show('link-generator');
    }
  }
}
</script>

<style scoped>
  .info-section {
    max-width: 400px;
  }

  .start-button {
    box-shadow: 0 0 4px black;
    background-color: #26495c;
    border-color: #26495c;
    font-size: 25px;
    height: 70px;
    font-weight: 600;
    border-radius: 30px;
  }

  .start-button:hover {
    background-color: #26495c;
    border-color: #26495c;
  }

  .start-button:active {
    background-color: #26495c !important;
    border-color: #26495c !important;
  }
</style>
