<template>
    <div>

    </div>
</template>

<script>
import { fetchList } from '@/api/user'
export default {
    data(){
        return{
            list:null,
        }
    },
    methods:{
        getList(){
            fetchList().then(response=>{
                console.log(response);
            })
        }
    }
}
</script>

<style scoped>

</style>