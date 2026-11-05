package com.jutan.dobavnica.marko;
import android.app.Activity;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
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
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient.FileChooserParams;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.graphics.Bitmap;
import android.view.View;
import android.widget.Toast;
public class MainActivity extends Activity {
 private WebView web;
 private ValueCallback<Uri[]> fileCallback;
 private static final int PICK_BACKUP=105;
 private static final int SAVE_BACKUP=106;
 private String pendingBackup;
 private static final String HOME="https://www.ju-tan.com/apk/marko";
 private class Printer {
  @JavascriptInterface public void saveBackup(String json){runOnUiThread(()->{
   if(json==null||json.length()>2000000)return;
   pendingBackup=json;
   Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
   intent.addCategory(Intent.CATEGORY_OPENABLE);
   intent.setType("application/json");
   intent.putExtra(Intent.EXTRA_TITLE,"marko-dobavnice-varnostna-kopija.json");
   startActivityForResult(intent,SAVE_BACKUP);
  });}
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
  web.setWebChromeClient(new WebChromeClient(){
   @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
    if(fileCallback!=null)fileCallback.onReceiveValue(null);
    fileCallback=callback;
    try{
     Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT);
     intent.addCategory(Intent.CATEGORY_OPENABLE);
     intent.setType("application/json");
     intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
     startActivityForResult(intent,PICK_BACKUP);
     return true;
    }catch(Exception ex){fileCallback=null;return false;}
   }
  });
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
 @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){
  super.onActivityResult(requestCode,resultCode,data);
  if(requestCode==SAVE_BACKUP){
   if(resultCode==RESULT_OK&&data!=null&&data.getData()!=null&&pendingBackup!=null){
    try(OutputStream out=getContentResolver().openOutputStream(data.getData())){
     if(out==null)throw new Exception("Ni mogoče odpreti datoteke");
     out.write(pendingBackup.getBytes(StandardCharsets.UTF_8));
     Toast.makeText(this,"Varnostna kopija shranjena",Toast.LENGTH_LONG).show();
    }catch(Exception ex){Toast.makeText(this,"Shranjevanje ni uspelo",Toast.LENGTH_LONG).show();}
   }
   pendingBackup=null;
  }
  if(requestCode==PICK_BACKUP&&fileCallback!=null){
   Uri[] result=(resultCode==RESULT_OK&&data!=null&&data.getData()!=null)?new Uri[]{data.getData()}:null;
   fileCallback.onReceiveValue(result);fileCallback=null;
  }
 }
 @Override public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
 @Override protected void onDestroy(){web.removeJavascriptInterface("MarkoAndroid");web.destroy();super.onDestroy();}
}
