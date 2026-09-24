import { issueSignedToken, presignUrl } from "@vercel/blob";

// The currently connected private store in ju-tan-web, verified in Vercel Storage.
export const OFFICE_BLOB_STORE_ID = "store_4ECzLVubTgDoVLqy";
export const OFFICE_BLOB_PATHNAME = "JU-TAN-Office-Setup-2026-09-24.exe";

export async function signOfficeInstallerDownload(
  signer: Pick<typeof import("@vercel/blob"), "issueSignedToken" | "presignUrl"> = {
    issueSignedToken,
    presignUrl,
  },
): Promise<string> {
  const expires = Date.now() + 5 * 60 * 1000;
  const signedToken = await signer.issueSignedToken({
    storeId: OFFICE_BLOB_STORE_ID,
    pathname: OFFICE_BLOB_PATHNAME,
    operations: ["get"],
    validUntil: expires,
  });
  const { presignedUrl } = await signer.presignUrl(signedToken, {
    pathname: OFFICE_BLOB_PATHNAME,
    operation: "get",
    access: "private",
    validUntil: expires,
  });
  return presignedUrl;
}
