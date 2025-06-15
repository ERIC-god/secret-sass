import {createApiClient} from "@next-sass/api"
import jwt from 'jsonwebtoken'



const apiKey = "03669fd1-4a14-44ce-8a22-b0530faaf08d";
const apiClient=createApiClient({apiKey})



export default defineEventHandler(async (event) => {
  
   const token=jwt.sign({
    filename: "avatar.png",
    contentType: "image/png",
    size: 29576,
    appId: "4b627b33-17b2-413f-a4d3-1ee1b5997fb0"
   },apiKey)

   return token
    

    // 'api/open端点/fileOpen(路由key).xxxxAPI'
  const url = "http://localhost:3000/api/open/fileOpen.createPresignedUrl?batch=1";
  const payload = {
    "0": {
      filename: "avatar.png",
      contentType: "image/png",
      size: 29576,
      appId: "4b627b33-17b2-413f-a4d3-1ee1b5997fb0",
    },
  };

  // const response=await apiClient.fileOpen.createPresignedUrl.mutate({
  //   filename: "avatar.png",
  //   contentType: "image/png",
  //   size: 29576,
  //   appId: "4b627b33-17b2-413f-a4d3-1ee1b5997fb0"
  // })

  //   return fetch(url, {
  //   method: "post",
  //   body: JSON.stringify(payload),
  //   headers: {
  //     "content-type": "application/json",
  //     "api-key": apiKey,
  //   },
  // })

  return response


  



});
