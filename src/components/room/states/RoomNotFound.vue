<template>
  <div class="container h-100">
    <b-row>
      <b-col>
        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
          <div class="info-section">
            <h3 class="mb-3">Вибачте, але такої кімнати не існує...</h3>
            <small> <a href='' class="home-url"> Повернутись на головну сторінку </a> </small>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homeURL: window.location.host
    }
  }
}
</script>

<style scoped>
  .info-section {
    max-width: 600px;
  }

  .home-url {
    color: #26495c;
  }
</style>
