<div align="center">

# 🐍 Py Console

### Python in your pocket. Runs on your device.

**Mobile-first · Offline PWA · Interactive console · No backend**

[Български](#български) · [English](#english) · [Author](https://teodor.chupetlov.eu)

![License: MIT](https://img.shields.io/badge/License-MIT-087b61)
![Python: Pyodide](https://img.shields.io/badge/Python-Pyodide-3776ab)
![Editor: CodeMirror 6](https://img.shields.io/badge/Editor-CodeMirror_6-334155)

</div>

---

## Български

### Python навсякъде

**Py Console** е леко уеб приложение за писане и изпълнение на Python директно в браузъра — на iPhone, Android или компютър. Създадено е за кратки упражнения, експерименти и учене, без инсталиране на Python и без настройване на сървър.

Кодът се изпълнява на твоето устройство чрез **Pyodide и WebAssembly**, в отделен Web Worker. Няма backend, регистрация, абонамент или платен Python API. Редакторът и конзолата започват празни: ти избираш какво да напишеш.

### Функции във V1

| Функция | Какво получаваш |
| --- | --- |
| **Python редактор** | CodeMirror 6, syntax highlighting, номера на редовете и автоматична индентация |
| **Run / Stop** | Локално изпълнение и прекратяване на програмата, включително безкраен цикъл |
| **Output / Console** | Резултати от `print()` и Python грешки в отделен панел |
| **Интерактивен `input()`** | Празно поле за отговор, след което същото изпълнение продължава |
| **Програмна лента** | Активни бутони за често използвани символи, с хоризонтално превъртане |
| **Auto-save** | Текущият код се пази в localStorage на устройството, без Save бутон |
| **New / Export .py** | Нова сесия и изтегляне на кода като `session.py` |
| **Dark / Light mode** | Тъмен и контрастен светъл режим със запомняне на избора |
| **Offline PWA** | Работа без интернет след успешно кеширане на production версията |
| **Адаптивен интерфейс** | Подредба за телефон, таблет и desktop |

### Програмната лента

```text
TAB  ←  →  ()  []  {}  :  "  '  =  _  #
```

**TAB** вмъква четири интервала. Стрелките местят курсора по една позиция. Скобите и кавичките оставят курсора между двойката; ако има маркиран текст, го обграждат. Бутоните работят с текущата селекция на редактора и улесняват писането от телефон.

### Първи стъпки

1. Напиши Python код и натисни **Run**.
2. Прочети резултата в **Output / Console**.
3. При `input()` въведи отговора и натисни **Enter**.
4. Използвай **Stop**, за да прекратиш изпълнението.
5. Запази важния код с **Export .py**. **New** изчиства кода след потвърждение.

Всеки Run използва нов Python globals речник. Импортирани модули могат да останат в runtime до Stop или New.

### Инсталиране и offline режим

- **iPhone:** отвори HTTPS адреса в Safari → Share → Add to Home Screen.
- **Android:** браузърно меню → Install app / Add to Home Screen.
- **Desktop:** използвай Install app, когато браузърът го предлага.

Първото онлайн зареждане кешира приложението и локалните файлове на Python runtime. Изчакай Run да стане активен, преди да прекъснеш връзката. След успешно кеширане можеш да презареждаш и изпълняваш стандартен Python код offline. Development режимът не кешира целия проект.

Браузърът може да освободи локалното хранилище. Използвай Export за дългосрочно запазване; недостатъчното свободно място може да попречи на offline подготовката.

### Локално стартиране

Необходим е **Node.js 22 LTS или по-нов**:

```powershell
cd 'E:\Projects\Py Console'
npm ci
npm run dev
```

Отвори localhost адреса, показан от Vite. Service worker изисква **HTTPS или localhost** — HTTP адрес в локалната мрежа не поддържа PWA/input bridge на телефон.

```powershell
npm test
npm run build
npm run preview
```

Unit тестовете проверяват програмната лента. Build проверява TypeScript, генерира `dist` и подготвя offline кеша. За браузърния тест: `npx playwright test` на Windows с Microsoft Edge и готов production build. Той проверява `input()`, `print()`, auto-save, Stop и offline изпълнение.

### Публикуване с GitHub Pages

В **Settings → Pages → Build and deployment → Source** избери **GitHub Actions**. Workflow файлът `.github/workflows/pages.yml` инсталира зависимостите, изпълнява тестовете, прави build и публикува `dist` при push към `main` или ръчно стартиране.

Адресът се показва в Settings → Pages след успешен deployment. Относителните URL адреси поддържат repository подпапка. За публично repository GitHub Pages е достъпен в безплатния план, в рамките на лимитите на GitHub. Не са необходими собствен домейн, платен сървър или API ключове.

### Данни и ограничения

Приложението не изпраща кода или отговорите на `input()` към Python сървър и няма вградени analytics. Кодът и темата се запазват локално. Хостингът получава обичайните заявки за статичните файлове.

V1 поддържа стандартната библиотека, включена в Pyodide, без автоматична инсталация на допълнителни пакети. Не предоставя терминални приложения или сървърна файлова система. Output пази последните 200 000 символа. Входът има timeout до пет минути; браузърът може да прекъсне изчакването по-рано, особено във фонов режим. Реален iPhone/Safari остава за допълнителна проверка.

---

## English

### Python wherever you are

**Py Console** is a lightweight web app for writing and running Python directly in your browser, on iPhone, Android or desktop. It is built for short exercises, experiments and learning, without installing Python or setting up a server.

Python runs **on your device** through **Pyodide and WebAssembly**, inside a dedicated Web Worker. There is no backend, registration, subscription or paid execution API. The editor and console start empty, ready for your own code.

### V1 features

| Feature | What it does |
| --- | --- |
| **Python editor** | CodeMirror 6 with syntax highlighting, line numbers and automatic indentation |
| **Run / Stop** | Execute locally and terminate a running program, including an infinite loop |
| **Output / Console** | Display `print()` output and Python errors |
| **Interactive `input()`** | Enter a response and resume the same execution |
| **Coding toolbar** | Insert common symbols with working, horizontally scrollable buttons |
| **Automatic saving** | Keep current code in this device's localStorage without a Save button |
| **New / Export .py** | Start a fresh session or download your code as `session.py` |
| **Dark / Light mode** | Switch between dark and high-contrast light themes; remember your choice |
| **Offline PWA** | Work offline once the production app is successfully cached |
| **Responsive layout** | A layout for phones, tablets and desktop screens |

### Mobile coding toolbar

```text
TAB  ←  →  ()  []  {}  :  "  '  =  _  #
```

**TAB** inserts four spaces. Arrows move the cursor one editor position at a time. Brackets and quotes leave the cursor inside the pair or wrap selected text. Buttons operate on the editor's current selection, making Python syntax easier to enter on a phone.

### Getting started

1. Write Python and select **Run**.
2. Read the result in **Output / Console**.
3. When your program calls `input()`, enter a response and select **Enter**.
4. Select **Stop** to terminate execution.
5. Use **Export .py** for important code. **New** clears existing code after confirmation.

Each run uses a fresh Python globals dictionary. Imported modules may remain in the runtime until Stop or New.

### Install and use offline

- **iPhone:** open the HTTPS site in Safari → Share → Add to Home Screen.
- **Android:** browser menu → Install app / Add to Home Screen.
- **Desktop:** use the browser's Install app action where supported.

During the first online visit, the service worker caches the app and bundled Python runtime. Keep the connection until Run becomes available. Once caching succeeds, you can reload and execute standard Python offline. Development mode does not precache the whole project.

Browser storage may be evicted, and caching can fail if storage is full. Export important code for long-term safekeeping.

### Local development

Install **Node.js 22 LTS or newer**, then run:

```powershell
cd 'E:\Projects\Py Console'
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Service workers require **HTTPS or localhost**. An HTTP LAN address on a phone does not support this app's PWA/input bridge.

```powershell
npm test
npm run build
npm run preview
```

Unit tests cover toolbar insertion. Build typechecks TypeScript, generates `dist` and prepares the offline cache. On Windows with Microsoft Edge and a ready production build, `npx playwright test` checks interactive input, printing, autosave, Stop and offline execution.

### GitHub Pages deployment

In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. The included workflow installs dependencies, runs unit tests, builds the app and deploys `dist` on pushes to `main` or manual dispatch.

After successful deployment, Settings → Pages shows the public site URL. Relative asset URLs support repository subpaths. Public repositories can use GitHub Pages on the free plan, subject to GitHub's limits. No paid server, custom domain or API keys are needed.

### Privacy and practical limits

The app does not upload your code or input to a Python server and includes no analytics. Code and theme preferences are stored locally. The hosting provider receives normal static-file requests.

V1 supports the standard library bundled with Pyodide and does not automatically install third-party packages. It is not a full desktop IDE, terminal or server filesystem. Output retains the last 200,000 characters. Input can wait up to five minutes, but browser background/service worker limits may interrupt it sooner. Real-device iPhone/Safari validation remains pending.

---

## Architecture / Архитектура

```text
CodeMirror 6 ── code ──► Web Worker ──► Pyodide / WebAssembly
      │                      │
      ▼                      ▼
 localStorage          Output + input()
                             │
                       Service worker
                             │
                        Offline cache
```

Interactive input uses a synchronous request from the worker, answered asynchronously by the service worker. It does not require SharedArrayBuffer or custom isolation headers.

**Stack:** TypeScript · Vite · CodeMirror 6 · Pyodide 0.28.3 · Web Workers · Service Worker · localStorage.

## Contributing / Принос

Bug reports and focused improvements are welcome through GitHub Issues and pull requests. Include browser/device details and a minimal example for execution bugs. Run `npm test` and `npm run build` before submitting changes. Preserve the mobile interface and backend-free design.

## License & author / Лиценз и автор

Project source: **[MIT License](LICENSE)**. Dependencies retain their own licenses.

Created by **Teodor Chupetlov** · [teodor.chupetlov.eu](https://teodor.chupetlov.eu)

