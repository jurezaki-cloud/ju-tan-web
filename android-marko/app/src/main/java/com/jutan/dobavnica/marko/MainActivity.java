package com.jutan.dobavnica.marko;
import android.app.Activity;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.graphics.Bitmap;
import android.view.View;
import android.widget.Toast;
public class MainActivity extends Activity {
 private WebView web;
 private static final String HOME="https://www.ju-tan.com/apk/marko";
 private class Printer {
  @JavascriptInterface public void print(){runOnUiThread(()->{
   PrintManager manager=(PrintManager)getSystemService(Context.PRINT_SERVICE);
   if(manager!=null)manager.print("Dobavnica Marko",web.createPrintDocumentAdapter("Dobavnica Marko"),new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).setColorMode(PrintAttributes.COLOR_MODE_COLOR).build());
  });}
 }
 @Override public void onCreate(Bundle b){
  super.onCreate(b);web=new WebView(this);setContentView(web);
  WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);
  s.setAllowFileAccess(false);s.setAllowContentAccess(false);
  s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  web.addJavascriptInterface(new Printer(),"MarkoAndroid");
  web.setWebChromeClient(new WebChromeClient());
  web.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
    Uri u=request.getUrl();
    if("https".equals(u.getScheme())&&("www.ju-tan.com".equals(u.getHost())||"ju-tan.com".equals(u.getHost())))return false;
    if("http".equals(u.getScheme())||"https".equals(u.getScheme()))startActivity(new Intent(Intent.ACTION_VIEW,u));
    return true;
   }
   @Override public void onPageFinished(WebView view,String url){
    if(url.startsWith(HOME))view.evaluateJavascript("window.__markoAndroid=true;",null);
   }
  });
  web.loadUrl(HOME);
 }
 @Override public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
 @Override protected void onDestroy(){web.removeJavascriptInterface("MarkoAndroid");web.destroy();super.onDestroy();}
}
