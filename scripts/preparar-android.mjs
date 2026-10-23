// Ajusta el proyecto Android generado por Capacitor (se ejecuta dentro de apps/<app>).
// - versionCode = número de compilación de Codemagic (BUILD_NUMBER) para que cada subida a Play sea mayor.
// - versionName = "version" del package.json.
// - local.properties con la ruta del Android SDK.
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const gradle = 'android/app/build.gradle';
if (!fs.existsSync(gradle)) { console.error('No existe ' + gradle + ' (falta "npx cap add android")'); process.exit(1); }

const code = parseInt(process.env.BUILD_NUMBER || '1', 10) + 100;  // +100: margen por si alguna vez se sube una versión manual
let g = fs.readFileSync(gradle, 'utf8');
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + code)
     .replace(/versionName\s+"[^"]*"/, 'versionName "' + pkg.version + '"');
fs.writeFileSync(gradle, g);

const sdk = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME;
if (sdk) fs.writeFileSync('android/local.properties', 'sdk.dir=' + sdk + '\n');

console.log(`Android listo: versionName ${pkg.version} · versionCode ${code} · SDK ${sdk || '(no definido)'}`);
