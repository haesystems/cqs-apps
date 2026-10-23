// Ajusta el proyecto Android generado por Capacitor (se ejecuta dentro de apps/<app>).
// - versionCode = número de compilación de Codemagic (BUILD_NUMBER) para que cada subida a Play sea mayor.
// - versionName = "version" del package.json.
// - Fondo de las barras del sistema (hora/batería arriba, navegación abajo) con el color de la app
//   en lugar del blanco por defecto ("cqs.colorBarras" del package.json).
// - local.properties con la ruta del Android SDK.
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const gradle = 'android/app/build.gradle';
if (!fs.existsSync(gradle)) { console.error('No existe ' + gradle + ' (falta "npx cap add android")'); process.exit(1); }

// 1) Versión
const code = parseInt(process.env.BUILD_NUMBER || '1', 10) + 100;  // +100: margen por si alguna vez se sube una versión manual
let g = fs.readFileSync(gradle, 'utf8');
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + code)
     .replace(/versionName\s+"[^"]*"/, 'versionName "' + pkg.version + '"');
fs.writeFileSync(gradle, g);

// 2) Color de las barras del sistema
const color = (pkg.cqs && pkg.cqs.colorBarras) || '#000000';
const res = 'android/app/src/main/res/values';
fs.writeFileSync(res + '/cqs_colores.xml',
  '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="cqs_fondo">' + color + '</color>\n</resources>\n');
const stylesPath = res + '/styles.xml';
let st = fs.readFileSync(stylesPath, 'utf8');
if (!st.includes('cqs_fondo')) {
  const items = [
    '        <item name="android:windowBackground">@color/cqs_fondo</item>',
    '        <item name="android:statusBarColor">@color/cqs_fondo</item>',
    '        <item name="android:navigationBarColor">@color/cqs_fondo</item>',
    '        <item name="android:windowLightStatusBar">false</item>'
  ].join('\n');
  const antes = st;
  st = st.replace(/(<style name="AppTheme\.NoActionBar"[^>]*>)/, '$1\n' + items);
  if (st === antes) { console.error('No encontré el estilo AppTheme.NoActionBar en styles.xml'); process.exit(1); }
  fs.writeFileSync(stylesPath, st);
}

// 3) SDK
const sdk = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME;
if (sdk) fs.writeFileSync('android/local.properties', 'sdk.dir=' + sdk + '\n');

console.log(`Android listo: versionName ${pkg.version} · versionCode ${code} · barras ${color} · SDK ${sdk || '(no definido)'}`);
