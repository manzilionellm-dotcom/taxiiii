package se.mz.korkortgo;

import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

/**
 * Play Store shell for KörkortGO by MZ.
 *
 * Anti-screenshot is native {@link WindowManager.LayoutParams#FLAG_SECURE} on this
 * window (screenshots, screen capture, Recents thumbnail, lock-screen preview,
 * multi-window). Do not rely on web blur / focus-hide for this.
 */
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    applySecureFlag();
    super.onCreate(savedInstanceState);
    applySecureFlag();
  }

  @Override
  public void onStart() {
    super.onStart();
    applySecureFlag();
  }

  @Override
  public void onResume() {
    super.onResume();
    applySecureFlag();
  }

  @Override
  public void onAttachedToWindow() {
    super.onAttachedToWindow();
    applySecureFlag();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    applySecureFlag();
  }

  private void applySecureFlag() {
    if (getWindow() == null) {
      return;
    }
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      setRecentsScreenshotEnabled(false);
    }
  }
}
