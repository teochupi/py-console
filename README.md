<div align="center">

# 🐍 Py Console

### Python in your pocket. Runs on your device.

**Mobile-first · Offline PWA · Interactive console · No backend**

[🚀 Open app / Отвори приложението](https://teochupi.github.io/py-console/) · [Български](#български) · [English](#english) · [Author](https://teodor-chupetlov.eu/)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Python / Pyodide](https://img.shields.io/badge/Python_%2F_Pyodide-3776AB?style=for-the-badge&logo=python&logoColor=white)
![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

![License: MIT](https://img.shields.io/badge/License-MIT-087b61)
![Editor: CodeMirror 6](https://img.shields.io/badge/Editor-CodeMirror_6-334155)
![Backend: none](https://img.shields.io/badge/Backend-none-087b61)

</div>

---

## Български

### 🐍 Python навсякъде

**Py Console** е леко уеб приложение за писане и изпълнение на Python директно в браузъра — на iPhone, Android или компютър. Създадено е за кратки упражнения, експерименти и учене, без инсталиране на Python и без настройване на сървър.

Кодът се изпълнява на твоето устройство чрез **Pyodide и WebAssembly**, в отделен Web Worker. Няма backend, регистрация, абонамент или платен Python API. Редакторът и конзолата започват празни: ти избираш какво да напишеш.

### ✨ Какво предлага приложението

| Функция | Какво получаваш |
| --- | --- |
| **Python редактор** | CodeMirror 6, syntax highlighting, номера на редовете и автоматична индентация |
| **Run / Stop** | Локално изпълнение и прекратяване на програмата, включително безкраен цикъл |
| **Output / Console** | Хронологична конзола: вход с префикс `>`, обикновен изход и отличими Python грешки |
| **Интерактивен `input()`** | Празно поле за отговор, след което същото изпълнение продължава |
| **Програмна лента** | Активни бутони за често използвани символи, с хоризонтално превъртане |
| **Auto-save** | Текущият код се пази в localStorage на устройството, без Save бутон |
| **New / Export .py** | Нова сесия и изтегляне на кода като `session.py` |
| **Dark / Light mode** | Тъмен и контрастен светъл режим със запомняне на избора |
| **Offline PWA** | Работа без интернет след успешно кеширане на production версията |
| **Адаптивен интерфейс** | Подредба за телефон, таблет и desktop |

### ⌨️ Програмната лента

```text
TAB  ←  →  ()  []  {}  :  "  '  =  _  #
```

**TAB** вмъква четири интервала. Стрелките местят курсора по една позиция. Скобите и кавичките оставят курсора между двойката; ако има маркиран текст, го обграждат. Бутоните работят с текущата селекция на редактора и улесняват писането от телефон.

### 🚀 Първи стъпки

1. Отвори **[Py Console](https://teochupi.github.io/py-console/)**, напиши Python код и натисни **Run**.
2. Прочети резултата в **Output / Console**.
3. При `input()` въведи отговора и натисни **Enter**.
4. Използвай **Stop**, за да прекратиш изпълнението.
5. Запази важния код с **Export .py**. **New** изчиства кода след потвърждение.

Всеки Run използва нов Python globals речник. Импортирани модули могат да останат в runtime до Stop или New.

### 📱 Инсталиране и offline режим

- **iPhone:** отвори HTTPS адреса в Safari → Share → Add to Home Screen.
- **Android:** браузърно меню → Install app / Add to Home Screen.
- **Desktop:** използвай Install app, когато браузърът го предлага.

При първото успешно онлайн зареждане приложението кешира интерфейса и файловете, необходими за изпълнение на Python. Изчакай **Run** да стане активен, преди да прекъснеш връзката. След това можеш да презареждаш и изпълняваш Python offline, докато кешираните файлове остават на устройството. Това се отнася за публикуваната версия и production build; development режимът не кешира целия проект.

При обновяване **Run** може да е активен със старата версия, докато новата още се изтегля. Изтеглената нова версия се активира след затваряне на прозорците, използващи предишната. Ако не виждаш последните промени, затвори Py Console във всички табове и от Home Screen, после го отвори онлайн отново.

При засечен проблем със зареждането на интерфейса се показва **Обнови приложението**, а при неуспешна или забавена подготовка — **Опитай отново**. Възстановяването изчиства кеша на приложението, без да изтрива кода и темата от localStorage. То не може да възстанови данни, които браузърът или потребителят вече е изтрил.

Браузърът може да освободи локалното хранилище. Използвай **Export .py** за дългосрочно запазване; недостатъчното свободно място може да попречи на offline подготовката.

### 🛠️ Локално стартиране

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

Build проверява TypeScript, генерира `dist` и подготвя offline кеша. За браузърните тестове, след успешен build:

```powershell
npx playwright install chromium webkit
npx playwright test
```

На Windows Chromium тестовете използват инсталирания **Microsoft Edge**. В GitHub Actions се изпълняват **Chromium** и **WebKit с iPhone viewport**. Проверяват се `print()`, интерактивен `input()`, редът на конзолните записи, auto-save, програмната лента, Stop, темите, мобилната подредба и възстановяването при проблем със зареждането. Offline презареждането се проверява в Chromium; WebKit проверката за него е изключена поради ограничение на offline емулацията в Playwright.

Приложението е изпробвано ръчно на телефон, включително от Home Screen. Това допълва автоматизираните проверки и не означава проверка на всеки модел или версия на браузър.

### 🌐 Отвори приложението

**[Стартирай Py Console](https://teochupi.github.io/py-console/)** директно в браузъра — без регистрация и без инсталиране на Python.

<details>
<summary>За разработчици: публикуване на собствено копие с GitHub Pages</summary>

В своето repository отвори **Settings → Pages → Build and deployment → Source** и избери **GitHub Actions**.

Workflow файлът `.github/workflows/pages.yml` инсталира зависимостите, изпълнява тестовете, прави build и публикува `dist` при push към `main` или ръчно стартиране. След deployment проверява публикувания сайт чрез зареждане на интерфейса и изпълнение на Python в Chromium и WebKit.

Ако публикуваш fork, промени `PUBLISHED_URL` в workflow-а към адреса на собственото приложение. Адресът се показва в **Settings → Pages**. Относителните URL адреси позволяват приложението да работи в repository подпапка.

</details>

### 🔒 Данни и възможности

Приложението не изпраща кода или отговорите на `input()` към Python сървър и няма вградени analytics. Кодът и темата се запазват локално. Хостингът получава обичайните заявки за статичните файлове.

V1 поддържа стандартната библиотека, включена в Pyodide, без автоматична инсталация на допълнителни пакети. Не предоставя терминални приложения или сървърна файлова система. Output пази последните 200 000 символа. Приложението няма собствен времеви лимит за чакане на `input()`: програмата чака отговор или Stop. Недовършеният отговор се пази локално и се възстановява при нов Run, когато същият код стигне до същото поредно `input()` със същия prompt. При промяна на кода или New старият отговор не се прилага автоматично. Браузърът или операционната система все пак може да прекъсне изпълнението във фонов режим. При установено прекъсване или презареждане по време на изпълнение се показва съобщение за нов Run; възстановяване на Python от същата инструкция след затваряне не е гарантирано. Потвърждението за изпратен отговор има отделен кратък срок; той не ограничава времето за писане на отговора.

---

## English

### 🐍 Python wherever you are

**Py Console** is a lightweight web app for writing and running Python directly in your browser, on iPhone, Android or desktop. It is built for short exercises, experiments and learning, without installing Python or setting up a server.

Python runs **on your device** through **Pyodide and WebAssembly**, inside a dedicated Web Worker. There is no backend, registration, subscription or paid execution API. The editor and console start empty, ready for your own code.

### ✨ What you can do

| Feature | What it does |
| --- | --- |
| **Python editor** | CodeMirror 6 with syntax highlighting, line numbers and automatic indentation |
| **Run / Stop** | Execute locally and terminate a running program, including an infinite loop |
| **Output / Console** | A chronological transcript: input prefixed with `>`, plain output and distinct Python errors |
| **Interactive `input()`** | Enter a response and resume the same execution |
| **Coding toolbar** | Insert common symbols with working, horizontally scrollable buttons |
| **Automatic saving** | Keep current code in this device's localStorage without a Save button |
| **New / Export .py** | Start a fresh session or download your code as `session.py` |
| **Dark / Light mode** | Switch between dark and high-contrast light themes; remember your choice |
| **Offline PWA** | Work offline once the production app is successfully cached |
| **Responsive layout** | A layout for phones, tablets and desktop screens |

### ⌨️ Mobile coding toolbar

```text
TAB  ←  →  ()  []  {}  :  "  '  =  _  #
```

**TAB** inserts four spaces. Arrows move the cursor one editor position at a time. Brackets and quotes leave the cursor inside the pair or wrap selected text. Buttons operate on the editor's current selection, making Python syntax easier to enter on a phone.

### 🚀 Getting started

1. Open **[Py Console](https://teochupi.github.io/py-console/)**, write Python and select **Run**.
2. Read the result in **Output / Console**.
3. When your program calls `input()`, enter a response and select **Enter**.
4. Select **Stop** to terminate execution.
5. Use **Export .py** for important code. **New** clears existing code after confirmation.

Each run uses a fresh Python globals dictionary. Imported modules may remain in the runtime until Stop or New.

### 📱 Install and use offline

- **iPhone:** open the HTTPS site in Safari → Share → Add to Home Screen.
- **Android:** browser menu → Install app / Add to Home Screen.
- **Desktop:** use the browser's Install app action where supported.

On the first successful online visit, the app caches its interface and the files needed to run Python. Wait until **Run** becomes available before disconnecting. You can then reload and run Python offline while those cached files remain on the device. This applies to the published app and production builds; development mode does not precache the whole project.

During an update, **Run** may be available using the previous version while the new version is still downloading. The downloaded version activates once windows using the previous version close. If changes are missing, close all Py Console tabs and the Home Screen app, then reopen it online.

When an interface-loading problem is detected, the app shows **Обнови приложението** (Refresh app). Failed or delayed preparation shows **Опитай отново** (Try again). Recovery clears the app cache without deleting code or theme preferences from localStorage. It cannot restore data already removed by the browser or user.

Browser storage may be evicted, and caching can fail if storage is full. Use **Export .py** for long-term safekeeping.

### 🛠️ Local development

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

Build typechecks TypeScript, generates `dist` and prepares the offline cache. After a successful build, run browser tests with:

```powershell
npx playwright install chromium webkit
npx playwright test
```

On Windows, Chromium tests use the installed **Microsoft Edge**. GitHub Actions runs **Chromium** and **WebKit with an iPhone viewport**. Coverage includes printing, interactive input, transcript order, autosave, toolbar actions, Stop, themes, mobile layout and startup recovery. Offline reload is checked in Chromium; that check is excluded in WebKit because of Playwright's offline emulation limitation.

The app has also been manually tried on a phone, including Home Screen use. This complements automated checks; it does not establish compatibility with every device or browser version.

### 🌐 Open the app

**[Launch Py Console](https://teochupi.github.io/py-console/)** in your browser — no account or Python installation required.

<details>
<summary>For developers: deploy your own copy with GitHub Pages</summary>

In your repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.

The included `.github/workflows/pages.yml` workflow installs dependencies, runs tests, builds the app and deploys `dist` on pushes to `main` or manual dispatch. After deployment, it checks the published site by loading the interface and executing Python in Chromium and WebKit.

When deploying a fork, change `PUBLISHED_URL` in the workflow to your own app's URL. **Settings → Pages** shows the site address. Relative asset URLs support repository subpaths.

</details>

### 🔒 Privacy and scope

The app does not upload your code or input to a Python server and includes no analytics. Code and theme preferences are stored locally. The hosting provider receives normal static-file requests.

V1 supports the standard library bundled with Pyodide and does not automatically install third-party packages. It is not a full desktop IDE, terminal or server filesystem. Output retains the last 200,000 characters. The app has no input-wait deadline: Python waits for a response or Stop. An unfinished response is stored locally and restored on a new Run when unchanged code reaches the same input number with the same prompt. Changing the code or selecting New prevents the old response from being applied automatically. The browser or OS can still interrupt execution in the background. Detected interruptions, including reloading during a run, show a message to run again; resuming Python at the same instruction after closing is not guaranteed. A separate short response-acknowledgement deadline does not limit how long you can take to type an answer.

---

## 🧩 Technologies / Технологии

| Technology | Role / Роля |
| --- | --- |
| **TypeScript** | Application logic and type checks / Логика на приложението и проверка на типовете |
| **Vite** | Local development and production build / Локална разработка и production build |
| **CodeMirror 6** | Python editor, highlighting and editing / Python редактор, оцветяване и редактиране |
| **Pyodide 0.28.3 + WebAssembly** | Python execution in the browser / Python изпълнение в браузъра |
| **Web Worker** | Python execution outside the UI thread / Изпълнение извън нишката на интерфейса |
| **Service Worker + PWA manifest** | Offline cache, input bridge and installation / Offline кеш, интерактивен вход и инсталиране |
| **localStorage** | Saved code and theme on this device / Код и тема на устройството |
| **Playwright** | Chromium and WebKit browser checks / Браузърни проверки |
| **GitHub Actions + GitHub Pages** | Automated checks and static hosting / Автоматични проверки и статичен хостинг |

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

Created by **Teodor Chupetlov** · [teodor-chupetlov.eu](https://teodor-chupetlov.eu)

