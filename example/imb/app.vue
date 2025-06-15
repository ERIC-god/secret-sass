<template>
  <div>
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
      <h1>Hello World!</h1>
  </div>
</template>

<script setup>
import { createApiClient } from '@next-sass/api';
import { onMounted } from '#imports';

const apiClient=createApiClient({apiKey:"03669fd1-4a14-44ce-8a22-b0530faaf08d"})
onMounted(async ()=>{

  const tokenResp=await fetch("http://localhost:3456/api/test")

  // const res=await tokenResp.json()

  const res=await tokenResp.text()
  


  apiClient.fileOpen.createPresignedUrl.mutate({
    filename: "avatar.png",
    contentType: "image/png",
    size: 29576,
    appId: "4b627b33-17b2-413f-a4d3-1ee1b5997fb0"
  })
})

</script>
