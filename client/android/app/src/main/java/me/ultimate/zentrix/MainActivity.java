package me.ultimate.zentrix;

import android.os.Bundle;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        supportRequestWindowFeature(Window.FEATURE_NO_TITLE);

        this.registerPlugin(GoogleAuth.class);

        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();

        setUserAgent();
    }

    private void setUserAgent() {
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();

        settings.setUserAgentString(settings.getUserAgentString().replace("; wv", "; " + getString(R.string.app_name)));
    }
}
