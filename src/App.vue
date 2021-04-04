<template>
  <div id="app" class="bg">
    <notifications group="app" position="top center"/>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  body {
    font-family: 'Montserrat', sans-serif !important;
  }

 .bg {
   background-color: #f8f8f8;
 }
</style>
