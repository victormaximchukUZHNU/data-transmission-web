<template>
  <div class="container h-100">
    <b-row>
      <b-col>
        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
          <div class="info-section">
            <PulseLoader :color="'#26495c'"/>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import PulseLoader from 'vue-spinner/src/PulseLoader'

  export default {
    components: {
      PulseLoader
    }
  }
</script>

<style scoped>
  .info-section {
    max-width: 600px;
  }
</style>
