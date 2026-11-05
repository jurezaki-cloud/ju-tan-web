import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
 return {name:"Dobavnica PRO – Marko Stevanović",short_name:"Dobavnica PRO",description:"Digitalna dobavnica za MARKO STEVANOVIĆ s.p.",start_url:"/apk/marko",scope:"/apk/marko",display:"standalone",background_color:"#f8fafc",theme_color:"#07182d",lang:"sl",icons:[{src:"/apk/marko/icon",sizes:"192x192",type:"image/png",purpose:"any"},{src:"/apk/marko/icon",sizes:"512x512",type:"image/png",purpose:"maskable"}]};}
