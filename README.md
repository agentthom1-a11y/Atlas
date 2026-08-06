# TokoNote macOS — Tokofile

TokoNote adalah white-label macOS AI meeting & note assistant berbasis proyek open-source `cue`, dengan branding Tokofile dan UI Bahasa Indonesia.

## Target customer

Customer tidak perlu install Node.js, npm, Git, atau menjalankan Terminal. Paket hasil GitHub Actions berisi installer `.dmg` dan `.zip` siap distribusi untuk:

- Apple Silicon (`arm64`) — M1/M2/M3/M4 dan generasi berikutnya
- Intel Mac (`x64`)

Alur customer:

1. Double-click `TokoNote-1.0.0-macOS-<arch>.dmg`
2. Drag **TokoNote** ke **Applications**
3. Double-click **TokoNote**
4. Izinkan Mikrofon dan Perekaman Layar/Audio saat macOS meminta izin
5. Masukkan API key di **Pengaturan**
6. Gunakan TokoNote

Tampilan aplikasi menggunakan HTML/CSS/JS seperti web app, tetapi dikemas sebagai aplikasi macOS Electron agar akses mikrofon, audio sistem, shortcut, dan screen capture tetap berfungsi.

## Build

Buka **Actions → Build TokoNote macOS → Run workflow**. Setelah selesai, download artifact **TokoNote-macOS-READY**.

Artifact berisi installer Apple Silicon + Intel, panduan install customer, lisensi GPL, notice open-source, dan source distribution yang diwajibkan GPL.

## Agar benar-benar sekali klik tanpa Gatekeeper

Untuk distribusi komersial ke customer macOS, gunakan Apple Developer ID + notarization. Workflow sudah mendukungnya melalui repository secrets berikut:

- `MAC_SIGN=1`
- `CSC_LINK` — sertifikat Developer ID Application `.p12` dalam format yang didukung electron-builder
- `CSC_KEY_PASSWORD`
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `APPLE_TEAM_ID`

Tanpa signing/notarization, workflow tetap membuat build untuk testing, tetapi macOS dapat menampilkan blokir/peringatan keamanan pada file yang didownload dari internet.

## White-label safety

Patch branding **tidak** melakukan replace global identifier `cue`. API internal seperti `window.cue` tetap dipertahankan supaya preload/renderer Electron tidak rusak. Yang diubah hanya customer-visible labels, nama aplikasi, permission text, data filename, installer metadata, dan teks Bahasa Indonesia.

## Lisensi

TokoNote memodifikasi proyek `Blueturboguy07/cue` yang berlisensi `GPL-3.0-or-later`. Karena itu lisensi dan source code hasil modifikasi tetap disertakan pada paket distribusi.
