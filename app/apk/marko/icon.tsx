import {ImageResponse} from "next/og";
export const size={width:512,height:512};
export const contentType="image/png";
export default function Icon(){return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#07182d",color:"white",fontSize:90,fontWeight:800,flexDirection:"column",borderRadius:100}}><div style={{color:"#4ade80",fontSize:46}}>MARKO</div><div>DP</div><div style={{fontSize:28,letterSpacing:6}}>DOBAVNICA</div></div>,size);}
