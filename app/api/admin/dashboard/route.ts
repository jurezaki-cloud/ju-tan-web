import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ensureLicensingSchema, licensingPool } from "@/lib/licensing/db";
import { verifyOfficeDownloadSessionToken } from "@/lib/office-download";
import { getSiteVisitAnalytics, getSiteVisitStats } from "@/lib/site-visits";
export const runtime = "nodejs";
async function authorized(){const secret=process.env.JU_TAN_DOWNLOAD_SESSION_SECRET;const token=(await cookies()).get("jt_license_admin")?.value;return Boolean(secret&&verifyOfficeDownloadSessionToken(token,secret));}
export async function GET(){
 if(!(await authorized())) return NextResponse.json({ok:false,error:"Potrebna je prijava."},{status:401});
 try{
  await ensureLicensingSchema();
  const [l,d,v,b,analytics]=await Promise.all([
   licensingPool().query("SELECT COUNT(*) FILTER (WHERE archived_at IS NULL)::int licenses, COUNT(*) FILTER (WHERE archived_at IS NULL AND status='active')::int active_licenses, COUNT(*) FILTER (WHERE archived_at IS NOT NULL)::int archived FROM office_licenses"),
   licensingPool().query("SELECT COUNT(*) FILTER (WHERE a.deactivated_at IS NULL)::int devices, COUNT(*) FILTER (WHERE a.deactivated_at IS NULL AND a.last_seen_at>=NOW()-INTERVAL '15 minutes')::int online, COUNT(*) FILTER (WHERE a.activated_at>=NOW()-INTERVAL '24 hours')::int new_devices FROM office_activations a JOIN office_licenses l ON l.id=a.license_id WHERE l.archived_at IS NULL"),
   getSiteVisitStats(),
   licensingPool().query("SELECT created_at FROM office_license_backups ORDER BY created_at DESC LIMIT 1"),
   getSiteVisitAnalytics(90)
  ]);
  const alerts=await licensingPool().query("SELECT COUNT(*)::int count FROM office_licenses l WHERE l.archived_at IS NULL AND ((l.valid_until IS NOT NULL AND l.valid_until<=NOW()+INTERVAL '30 days') OR (SELECT COUNT(*) FROM office_activations a WHERE a.license_id=l.id AND a.deactivated_at IS NULL)>=l.max_devices)");
  return NextResponse.json({ok:true,stats:{...l.rows[0],...d.rows[0],alerts:Number(alerts.rows[0]?.count??0),visits:v,analytics,last_backup_at:b.rows[0]?.created_at??null}});
 }catch(e){console.error("admin dashboard failed",e);return NextResponse.json({ok:false,error:"Nadzorne plošče ni bilo mogoče naložiti."},{status:500});}
}