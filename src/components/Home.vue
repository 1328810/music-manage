<template>
    <div>
        <TheHeader/>
        <TheAside/>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue'
import TheAside from '../components/TheAside.vue'
import bus from "../assets/js/bus"
export default {
    components:{
        TheHeader,
        TheAside
    },
    data(){
        return {
            collapse:false
        }
    },
    created(){
        bus.$on('collapse',msg =>{
            this.collapse = msg
        })
    }
}
</script>

<style>

</style>