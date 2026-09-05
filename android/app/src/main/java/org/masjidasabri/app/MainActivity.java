package org.masjidasabri.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // WebView Android SECARA BAWAAN tidak melakukan apa pun saat
        // menemukan respons unduhan berkas (header Content-Disposition:
        // attachment — dipakai bukti bayar & laporan PDF/CSV, lihat
        // src/app/api/bukti-bayar dan src/app/api/laporan-detail) —
        // beda dari browser biasa (Chrome, dst.) yang punya download
        // manager sendiri. Sudah dicoba dua pendekatan lewat JavaScript
        // (plugin @capacitor/browser — malah bikin hang; window.open
        // dengan target "_system" — tidak melakukan apa-apa juga di
        // Samsung One UI/Android 14+), jadi diselesaikan di level native
        // di sini: DownloadListener resmi milik Android WebView,
        // melempar permintaan unduhan ke aplikasi eksternal (Chrome,
        // Google PDF Viewer, dst.) lewat Intent.ACTION_VIEW.
        getBridge().getWebView().setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (Exception e) {
                // Tidak ada aplikasi yang bisa menangani URL ini — diamkan,
                // jangan sampai aplikasi crash gara-gara ini.
            }
        });
    }
}
