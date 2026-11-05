import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = {title:"Dobavnica PRO | Marko Stevanović",description:"Brezplačna digitalna dobavnica za MARKO STEVANOVIĆ s.p. Urejanje, shranjevanje in tiskanje dobavnic s telefona.",robots:{index:false,follow:false},manifest:"/apk/marko/manifest.webmanifest",appleWebApp:{capable:true,title:"Dobavnica PRO",statusBarStyle:"default"}};
export default function Layout({children}:{children:ReactNode}){return children;}
