<template>
  <div id="app">
    <Songaudio/>
    <router-view/>
  </div>
</template>

<script>
import Songaudio from './components/Songaudio.vue';
export default {
  name: 'App',
  components:{
    Songaudio
  }
}
</script>

<style>

</style>
