const fs = require('fs');

function replaceIn(file, pairs) {
  if (!fs.existsSync(file)) return;
  let s = fs.readFileSync(file, 'utf8');
  for (const [from, to] of pairs) s = s.split(from).join(to);
  fs.writeFileSync(file, s);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.name = 'tokonote';
pkg.version = process.env.TOKONOTE_VERSION || '1.0.0';
pkg.description = 'TokoNote by Tokofile - Asisten rapat, transkripsi, dan catatan AI untuk macOS';
pkg.author = 'Tokofile';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

// Important: do NOT globally replace the identifier `cue` in JS. preload.js exposes
// window.cue and renderer.js depends on it. We only change customer-visible strings.
replaceIn('renderer/index.html', [
  ['<html lang="en">', '<html lang="id">'],
  ['<title>cue</title>', '<title>TokoNote - Tokofile</title>'],
  ['title="cue"', 'title="TokoNote"'],
  ['Drag to move window', 'Tarik untuk memindahkan jendela'],
  ['>Drag<', '>Geser<'],
  ['>Hide<', '>Sembunyikan<'],
  ['Start / stop listening', 'Mulai / berhenti mendengarkan'],
  ['What should I say?', 'Apa yang sebaiknya saya sampaikan?'],
  ['>Assist<', '>Bantu<'],
  ['>Follow-up<', '>Pertanyaan Lanjutan<'],
  ['>Recap<', '>Ringkasan<'],
  ['>Transcript<', '>Transkrip<'],
  ['>Clear<', '>Bersihkan<'],
  ['Ask about your screen or conversation, or ', 'Tanyakan tentang layar atau percakapan, atau '],
  ['>Smart<', '>Cerdas<'],
  ['title="Settings"', 'title="Pengaturan"'],
  ['title="Send"', 'title="Kirim"'],
  ['>Settings<', '>Pengaturan<'],
  ['>Done<', '>Selesai<'],
  ['🔑 Keys', '🔑 Kunci API'],
  ['📄 Profile', '📄 Profil'],
  ['🎯 Interview Prep', '🎯 Persiapan'],
  ['💬 Q&amp;A', '💬 Tanya Jawab'],
  ['>Provider<', '>Penyedia AI<'],
  ['API keys <span class="s-hint">stored locally · never sent to any server</span>', 'Kunci API <span class="s-hint">disimpan lokal di Mac Anda</span>'],
  ['>Models <', '>Model <'],
  ['>Assistant access <', '>Akses asisten <'],
  ['Your resume', 'Profil / resume Anda'],
  ['Target job description', 'Konteks atau tujuan penggunaan'],
  ['Your STAR stories', 'Catatan penting Anda'],
  ['Why this company', 'Konteks tambahan'],
  ['Why leaving current role', 'Catatan lanjutan'],
  ['Work style &amp; values', 'Preferensi &amp; gaya kerja'],
  ['Salary target', 'Target / informasi penting'],
  ['Questions to ask the interviewer', 'Pertanyaan yang ingin disiapkan'],
  ['>Skip<', '>Lewati<'],
  ['>Back<', '>Kembali<'],
  ['>Next<', '>Lanjut<'],
  ['Don’t allow', 'Jangan izinkan'],
  ['>Allow<', '>Izinkan<']
]);

replaceIn('renderer/renderer.js', [
  ['Nothing heard yet — start listening to begin.', 'Belum ada audio terdeteksi — mulai mendengarkan untuk memulai.'],
  ['Transcript cleared', 'Transkrip dibersihkan'],
  ['Microphone capture could not be started. Check your mic permissions and try again.', 'Mikrofon tidak dapat dimulai. Periksa izin Mikrofon di Pengaturan Sistem macOS lalu coba lagi.'],
  ['Meeting audio capture is not available on this device build.', 'Perekaman audio sistem tidak tersedia pada perangkat/build ini.'],
  ['No system-audio loopback track was detected.', 'Audio sistem tidak terdeteksi. Periksa izin perekaman layar/audio lalu coba lagi.']
]);

replaceIn('main.js', [
  ["win.setTitle('Microsoft Edge Update')", "win.setTitle('TokoNote - Tokofile')"],
  ["app.setName('MicrosoftEdgeUpdate')", "app.setName('TokoNote')"],
  ['Screen capture needs permission — grant screen/audio access to cue in your system settings.', 'Tangkapan layar memerlukan izin. Buka Pengaturan Sistem macOS > Privasi & Keamanan lalu izinkan TokoNote untuk Perekaman Layar dan Mikrofon.'],
  ['No transcription key set. Add an OpenAI (Whisper), Deepgram, or Gemini key in Settings to enable listening. Screen/LeetCode features work without it.', 'Belum ada kunci transkripsi. Tambahkan kunci OpenAI, Deepgram, atau Gemini di Pengaturan untuk mengaktifkan transkripsi.'],
  ['Add your ', 'Tambahkan kunci API '],
  [' API key in Settings (gear icon) to start. Model: ', ' di Pengaturan untuk mulai menggunakan TokoNote. Model: ']
]);

replaceIn('src/store.js', [['cue-data.json', 'tokonote-data.json']]);

fs.writeFileSync('electron-builder.cjs', `const hasCert = process.env.MAC_SIGN === '1';
const canNotarize = hasCert && !!process.env.APPLE_ID && !!process.env.APPLE_APP_SPECIFIC_PASSWORD && !!process.env.APPLE_TEAM_ID;
module.exports = {
  appId: 'id.tokofile.tokonote',
  productName: 'TokoNote',
  artifactName: 'TokoNote-\${version}-macOS-\${arch}.\${ext}',
  asar: false,
  publish: null,
  files: ['main.js','preload.js','src/**/*','renderer/**/*','vendor/**/*','LICENSE','TOKONOTE-LICENSE-NOTICE.md'],
  directories: { buildResources: 'build-resources' },
  mac: {
    target: ['dmg','zip'],
    category: 'public.app-category.productivity',
    identity: hasCert ? undefined : null,
    hardenedRuntime: hasCert,
    gatekeeperAssess: false,
    entitlements: 'build-resources/entitlements.mac.plist',
    entitlementsInherit: 'build-resources/entitlements.mac.plist',
    notarize: canNotarize,
    extendInfo: {
      LSUIElement: false,
      NSMicrophoneUsageDescription: 'TokoNote menggunakan mikrofon untuk mentranskripsikan percakapan yang Anda izinkan.',
      NSCameraUsageDescription: 'TokoNote tidak menggunakan kamera.',
      NSAudioCaptureUsageDescription: 'TokoNote menggunakan audio sistem untuk mentranskripsikan rapat yang Anda izinkan.',
      NSScreenCaptureUsageDescription: 'TokoNote menggunakan tangkapan layar saat Anda meminta bantuan berdasarkan layar.'
    }
  },
  dmg: { title: 'TokoNote - Tokofile', sign: false }
};
`);

fs.writeFileSync('TOKONOTE-LICENSE-NOTICE.md', `# TokoNote Open Source Notice\n\nTokoNote by Tokofile merupakan versi modifikasi dari proyek cue (https://github.com/Blueturboguy07/cue) dan didistribusikan sesuai GNU GPL-3.0-or-later. Source code dan lisensi disertakan pada paket rilis.\n`);

console.log('TokoNote white-label patch applied safely.');
