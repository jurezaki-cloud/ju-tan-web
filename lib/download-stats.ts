import "server-only";
import { licensingPool } from "@/lib/licensing/db";

const shared=globalThis as typeof globalThis & {__juTanDownloadStatsSchema?:Promise<void>};

export function ensureDownloadStatsSchema(){
 shared.__juTanDownloadStatsSchema ??= licensingPool().query(`CREATE TABLE IF NOT EXISTS office_download_daily (
   day DATE PRIMARY KEY,
   downloads BIGINT NOT NULL DEFAULT 0 CHECK (downloads >= 0)
 )`).then(()=>undefined);
 return shared.__juTanDownloadStatsSchema;
}

export async function recordOfficeDownload(){
 await ensureDownloadStatsSchema();
 await licensingPool().query(`INSERT INTO office_download_daily(day,downloads)
 VALUES ((NOW() AT TIME ZONE 'Europe/Ljubljana')::date,1)
 ON CONFLICT(day) DO UPDATE SET downloads=office_download_daily.downloads+1`);
}

export async function getOfficeDownloadStats(){
 await ensureDownloadStatsSchema();
 const r=await licensingPool().query<{today:string;last_30_days:string;total:string}>(`SELECT
 COALESCE(SUM(downloads) FILTER(WHERE day=(NOW() AT TIME ZONE 'Europe/Ljubljana')::date),0)::text today,
 COALESCE(SUM(downloads) FILTER(WHERE day>=(NOW() AT TIME ZONE 'Europe/Ljubljana')::date-29),0)::text last_30_days,
 COALESCE(SUM(downloads),0)::text total FROM office_download_daily`);
 const x=r.rows[0]; return {today:Number(x?.today??0),last_30_days:Number(x?.last_30_days??0),total:Number(x?.total??0)};
}
