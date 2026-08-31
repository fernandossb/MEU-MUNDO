package br.com.reinoinfinito;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Casca nativa do jogo. O jogo inteiro é um arquivo em assets/www/index.html e
 * roda dentro deste WebView, sem rede nenhuma. A internet é usada só para
 * procurar versão nova no GitHub — sem sinal, o app abre e funciona igual.
 */
public class MainActivity extends Activity {

    // O jogo NÃO pode ser servido de file:// — nessa origem o Android descarta
    // o localStorage, e cada abertura começava um mundo novo. O AssetLoader
    // entrega os mesmos arquivos por uma origem https estável, e aí o save
    // sobrevive ao fechar o app.
    private static final String ORIGEM = "https://appassets.androidplatform.net";
    private static final String URL_DO_JOGO = ORIGEM + "/assets/www/index.html";
    private static final String API_ULTIMA_VERSAO =
            "https://api.github.com/repos/fernandossb/MEU-MUNDO/releases/latest";

    private WebView tela;
    private final ExecutorService segundoPlano = Executors.newSingleThreadExecutor();

    @Override
    protected void onCreate(Bundle estadoSalvo) {
        super.onCreate(estadoSalvo);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        tela = new WebView(this);
        WebSettings cfg = tela.getSettings();
        cfg.setJavaScriptEnabled(true);
        // Sem isto o localStorage não funciona e o jogo perde o save.
        cfg.setDomStorageEnabled(true);
        cfg.setDatabaseEnabled(true);
        cfg.setAllowFileAccess(true);
        cfg.setCacheMode(WebSettings.LOAD_NO_CACHE);
        cfg.setSupportZoom(false);
        cfg.setBuiltInZoomControls(false);
        cfg.setMediaPlaybackRequiresUserGesture(false);

        final WebViewAssetLoader carregador = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        tela.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest pedido) {
                return carregador.shouldInterceptRequest(pedido.getUrl());
            }
        });
        tela.setBackgroundColor(0xFF0D1410);
        tela.setOverScrollMode(View.OVER_SCROLL_NEVER);
        tela.loadUrl(URL_DO_JOGO);
        setContentView(tela);

        telaCheia();
        segundoPlano.execute(this::procurarAtualizacao);
    }

    private void telaCheia() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    @Override
    public void onWindowFocusChanged(boolean temFoco) {
        super.onWindowFocusChanged(temFoco);
        if (temFoco) telaCheia();
    }

    @Override
    public void onBackPressed() {
        // Não mata o jogo: manda para segundo plano, que é onde a vila continua
        // valendo (o save já foi gravado no visibilitychange).
        moveTaskToBack(true);
    }

    /* ------------------------------------------------------- atualização --- */

    private void procurarAtualizacao() {
        HttpURLConnection conexao = null;
        try {
            conexao = (HttpURLConnection) new URL(API_ULTIMA_VERSAO).openConnection();
            conexao.setConnectTimeout(12000);
            conexao.setReadTimeout(18000);
            conexao.setRequestProperty("Accept", "application/vnd.github+json");
            conexao.setRequestProperty("User-Agent", "MeuMundo-Android");
            int codigo = conexao.getResponseCode();
            if (codigo < 200 || codigo >= 300) return;

            JSONObject release = new JSONObject(lerTexto(conexao));
            int versaoNova = numeroDaTag(release.optString("tag_name", ""));
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
            if (versaoNova <= info.versionCode) return;

            String endereco = "", arquivo = "MeuMundo.apk";
            JSONArray anexos = release.optJSONArray("assets");
            if (anexos != null) {
                for (int i = 0; i < anexos.length(); i++) {
                    JSONObject anexo = anexos.optJSONObject(i);
                    if (anexo == null) continue;
                    String nome = anexo.optString("name", "");
                    if (nome.toLowerCase(Locale.US).endsWith(".apk")) {
                        endereco = anexo.optString("browser_download_url", "");
                        arquivo = nome;
                        break;
                    }
                }
            }
            if (endereco.isEmpty()) return;

            final String enderecoFinal = endereco, arquivoFinal = arquivo;
            final String notas = release.optString("body", "");
            final String titulo = "Versão " + release.optString("name", "nova") + " disponível";
            runOnUiThread(() -> perguntarSeAtualiza(titulo, notas, enderecoFinal, arquivoFinal));

        } catch (Exception e) {
            // Sem rede ou GitHub fora do ar: o jogo não depende disso.
        } finally {
            if (conexao != null) conexao.disconnect();
        }
    }

    /** "build-12" -> 12 */
    private int numeroDaTag(String tag) {
        try {
            return Integer.parseInt(tag.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return -1;
        }
    }

    private String lerTexto(HttpURLConnection conexao) throws Exception {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader leitor = new BufferedReader(
                new InputStreamReader(conexao.getInputStream(), "UTF-8"))) {
            String linha;
            while ((linha = leitor.readLine()) != null) sb.append(linha);
        }
        return sb.toString();
    }

    private void perguntarSeAtualiza(String titulo, String notas, String endereco, String arquivo) {
        if (isFinishing()) return;
        String texto = notas.isEmpty() ? "Uma versão nova do jogo está pronta."
                : (notas.length() > 700 ? notas.substring(0, 700) + "…" : notas);
        new AlertDialog.Builder(this)
                .setTitle(titulo)
                .setMessage(texto + "\n\nSua vila continua salva — a atualização não apaga o save.")
                .setPositiveButton("Atualizar", (d, w) -> segundoPlano.execute(() -> baixarEInstalar(endereco, arquivo)))
                .setNegativeButton("Agora não", null)
                .show();
    }

    private void baixarEInstalar(String endereco, String nomeDoArquivo) {
        runOnUiThread(() -> Toast.makeText(this, "Baixando a atualização…", Toast.LENGTH_SHORT).show());
        HttpURLConnection conexao = null;
        try {
            File pasta = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
            if (pasta == null) return;                       // cartão indisponível
            if (!pasta.exists() && !pasta.mkdirs()) return;
            File destino = new File(pasta, nomeDoArquivo);

            conexao = (HttpURLConnection) new URL(endereco).openConnection();
            conexao.setInstanceFollowRedirects(true);
            conexao.setConnectTimeout(15000);
            conexao.setReadTimeout(60000);
            conexao.setRequestProperty("User-Agent", "MeuMundo-Android");
            try (InputStream entrada = conexao.getInputStream();
                 FileOutputStream saida = new FileOutputStream(destino)) {
                byte[] buffer = new byte[65536];
                int lidos;
                while ((lidos = entrada.read(buffer)) != -1) saida.write(buffer, 0, lidos);
            }
            runOnUiThread(() -> abrirInstalador(destino));

        } catch (Exception e) {
            runOnUiThread(() -> Toast.makeText(this,
                    "Não deu para baixar a atualização.", Toast.LENGTH_LONG).show());
        } finally {
            if (conexao != null) conexao.disconnect();
        }
    }

    private void abrirInstalador(File apk) {
        // Do Android 8 em diante, o app precisa de permissão para instalar.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                && !getPackageManager().canRequestPackageInstalls()) {
            Toast.makeText(this, "Permita instalar apps desta origem e toque de novo em Atualizar.",
                    Toast.LENGTH_LONG).show();
            startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + getPackageName())));
            return;
        }
        Uri uri = FileProvider.getUriForFile(this, getPackageName() + ".arquivos", apk);
        Intent instalar = new Intent(Intent.ACTION_VIEW);
        instalar.setDataAndType(uri, "application/vnd.android.package-archive");
        instalar.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(instalar);
    }

    @Override
    protected void onDestroy() {
        segundoPlano.shutdownNow();
        if (tela != null) tela.destroy();
        super.onDestroy();
    }
}
