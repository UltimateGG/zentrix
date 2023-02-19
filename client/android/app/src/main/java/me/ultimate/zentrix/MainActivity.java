package me.ultimate.zentrix;

import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();

        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();

        settings.setUserAgentString(settings.getUserAgentString().replace("; wv", "; " + getString(R.string.app_name)));
    }
}
