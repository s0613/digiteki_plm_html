# AJAX Content Router Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GNB + Sidebar를 유지하면서 콘텐츠 영역만 AJAX로 교체하고, URL은 history.pushState로 관리한다.

**Architecture:** `digitek.js` 내부 IIFE에 `Router` 모듈을 추가한다. 사이드바 링크에 `data-route` 속성을 부여하고, 클릭 시 `fetch()`로 콘텐츠 프래그먼트를 받아 `#page-content`에 주입한다. 서버는 `X-Requested-With: XMLHttpRequest` 헤더로 전체 페이지 vs 프래그먼트를 구분해 응답한다. `history.pushState`로 URL을 갱신하고, `popstate`로 뒤로가기를 처리한다.

**Tech Stack:** Vanilla JS (IIFE 패턴), Fetch API, History API, Spring MVC + Thymeleaf (백엔드), Apache + Tomcat ×2 (인프라)

---

## Chunk 1: HTML 구조 준비

### Task 1: 콘텐츠 영역에 id 추가

**Files:**
- Modify: `pages/manage/main-full-page.html:276`
- Modify: `pages/search/searchlist-full-page.html` (동일 패턴)
- Modify: `pages/search/searchsplit-full-page.html`
- Modify: `pages/detail/pms-full-page.html`
- Modify: `pages/detail/doc-create-full-page.html`
- Modify: `pages/detail/ecr-review-full-page.html`
- Modify: `pages/detail/requestregister-full-page.html`
- Modify: `pages/manage/group-manage-full-page.html`
- Modify: `pages/manage/code-manage-full-page.html`
- Modify: `pages/manage/doc-classify-full-page.html`

현재 콘텐츠 영역:
```html
<div class="flex-grow-1 overflow-y-digitek-auto" style="background: var(--digitek-bg-gray);">
```

변경 후:
```html
<div id="page-content" class="flex-grow-1 overflow-y-digitek-auto" style="background: var(--digitek-bg-gray);">
```

- [ ] **Step 1: main-full-page.html 콘텐츠 영역에 id 추가**

  `pages/manage/main-full-page.html` 의 콘텐츠 div에 `id="page-content"` 추가.

- [ ] **Step 2: 나머지 전체 페이지에 동일하게 적용**

  위 목록의 모든 full-page.html 파일에 동일하게 `id="page-content"` 추가.

- [ ] **Step 3: 브라우저에서 확인**

  `pages/manage/main-full-page.html` 열고 DevTools → Elements에서 `#page-content` 존재 확인.

---

### Task 2: Shell 페이지 생성

**Files:**
- Create: `pages/shell.html`

Shell 페이지는 GNB + Sidebar 고정, 콘텐츠 영역은 비어 있는 레이아웃 뼈대.
사이드바 각 메뉴 항목에 `data-route` 속성으로 실제 URL 경로를 지정.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Digitek PLM</title>
  <link rel="stylesheet" href="../css/bootstrap.min.css">
  <link rel="stylesheet" href="../css/digitek.css">
  <link rel="stylesheet" href="../css/icons.css">
  <style>body { margin: 0; background: #fff; }</style>
</head>
<body>
<div class="layout-digitek">
  <div class="sidebar-digitek-container">
    <nav class="sidebar-digitek sidebar-digitek-expanded" aria-label="메인 메뉴">
      <!-- 헤더 -->
      <div class="sidebar-digitek-header">
        <div class="sidebar-digitek-logo sidebar-logo-full">
          <img src="../images/icons/logo.png" width="108" height="52" alt="HLKlemove 로고">
        </div>
        <div class="sidebar-digitek-logo sidebar-logo-collapsed">
          <img src="../images/icons/logo-collapsed.png" width="54" height="26" alt="HL 로고">
        </div>
        <button class="sidebar-collapse-handle sidebar-toggle-btn" aria-label="사이드바 접기/펼치기">
          <i class="dicon dicon-chevron-left icon-digitek-20"></i>
        </button>
      </div>

      <!-- 메뉴 영역 -->
      <!-- [주의] 리프 메뉴 항목에 data-route="/실제/경로" 추가 필요 -->
      <!-- 예시: data-route="/search/list" -->
      <div class="flex-grow-1 overflow-auto sidebar-digitek-menu-area">
        <ul class="nav flex-column">
          <!-- 각 메뉴 항목에 data-route 추가 (아래는 예시) -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item" href="#"
               data-route="/main">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-file-blank icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">결재 관리</span>
              </span>
            </a>
          </li>
          <!-- 실제 메뉴 구조는 전체 페이지에서 복사 후 data-route 추가 -->
        </ul>
      </div>
    </nav>
  </div>

  <div class="layout-digitek-main-area">
    <header class="gnb-digitek">
      <!-- GNB 내용 (전체 페이지에서 복사) -->
    </header>

    <!-- 콘텐츠 영역: Router가 여기에 콘텐츠를 주입 -->
    <div id="page-content" class="flex-grow-1 overflow-y-digitek-auto"
         style="background: var(--digitek-bg-gray);">
      <!-- 초기 로딩 표시 -->
      <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--digitek-text-secondary);">
        페이지를 불러오는 중...
      </div>
    </div>
  </div>
</div>

<script src="../js/jquery.slim.min.js"></script>
<script src="../js/bootstrap.bundle.min.js"></script>
<script src="../js/digitek.js"></script>
</body>
</html>
```

- [ ] **Step 1: `pages/shell.html` 파일 생성**

  위 코드로 `pages/shell.html` 생성.

- [ ] **Step 2: main-full-page.html에서 실제 GNB HTML 복사**

  `pages/manage/main-full-page.html`의 `<header class="gnb-digitek">` 전체를 shell.html GNB 영역에 붙여넣기.

- [ ] **Step 3: main-full-page.html에서 실제 Sidebar 메뉴 복사**

  sidebar 메뉴 영역 전체를 shell.html에 붙여넣기.

---

### Task 3: 콘텐츠 프래그먼트 파일 생성 (HTML 프로토타입용)

**Files:**
- Create: `pages/content/main.html`
- Create: `pages/content/searchlist.html`
- Create: `pages/content/searchsplit.html`
- Create: `pages/content/pms.html`
- Create: `pages/content/doc-create.html`
- Create: `pages/content/ecr-review.html`
- Create: `pages/content/requestregister.html`
- Create: `pages/content/group-manage.html`
- Create: `pages/content/code-manage.html`
- Create: `pages/content/doc-classify.html`

각 content 파일은 해당 full-page.html에서 `#page-content` div 안쪽 내용만 추출.

예시 (`pages/content/main.html`):
```html
<!-- 메인 페이지 콘텐츠 프래그먼트 (GNB/Sidebar 없음) -->
<div class="main-page-grid">
  <!-- main-full-page.html의 #page-content 내부 내용 그대로 -->
</div>
```

- [ ] **Step 1: `pages/content/` 디렉토리 생성**

- [ ] **Step 2: 각 full-page.html에서 콘텐츠 추출하여 content 파일 생성**

  `#page-content` div의 **내부 innerHTML**만 복사 (div 태그 자체 제외).

- [ ] **Step 3: Commit**

  ```bash
  git add pages/content/ pages/shell.html
  git commit -m "feat: add content fragments and shell page for AJAX router"
  ```

---

## Chunk 2: Router 모듈 구현

### Task 4: digitek.js에 Router 모듈 추가

**Files:**
- Modify: `js/digitek.js`

`initAll()` 함수 바로 위에 Router 모듈 추가. `delegateEvent`가 동일 IIFE 내에 있으므로 직접 사용 가능.

```javascript
/* ================================================================== */
/*  Router — AJAX 콘텐츠 교체 + history.pushState                      */
/* ================================================================== */

var Router = {
  contentEl: null,

  init: function () {
    Router.contentEl = document.getElementById('page-content');
    if (!Router.contentEl) return; // shell 페이지가 아니면 비활성화

    // 사이드바 [data-route] 링크 클릭 인터셉트
    delegateEvent('click', '[data-route]', function (e, el) {
      e.preventDefault();
      var url = el.getAttribute('data-route');
      if (url) Router.navigate(url);
    });

    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', function (e) {
      if (e.state && e.state.route) {
        Router._load(e.state.route, false);
      }
    });

    // 최초 진입 시 현재 URL에 해당하는 콘텐츠 로드
    var initialRoute = window.location.pathname;
    var hasContent = Router.contentEl.children.length > 0 &&
      !Router.contentEl.querySelector('[data-router-placeholder]');
    if (!hasContent) {
      Router._load(initialRoute, false);
    }
  },

  /**
   * 특정 URL로 AJAX 이동
   * @param {string} url - 이동할 경로 (예: "/search/list")
   */
  navigate: function (url) {
    Router._load(url, true);
  },

  _load: function (url, pushState) {
    if (!Router.contentEl) return;

    // 로딩 상태 표시
    Router.contentEl.setAttribute('aria-busy', 'true');
    Router.contentEl.style.opacity = '0.5';

    fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/html'
      }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        // 서버가 전체 페이지를 반환한 경우: #page-content 내부만 추출
        // 서버가 프래그먼트를 반환한 경우: 그대로 사용
        var content = Router._extractContent(html);
        Router.contentEl.innerHTML = content;
        Router.contentEl.removeAttribute('aria-busy');
        Router.contentEl.style.opacity = '';

        if (pushState) {
          history.pushState({ route: url }, '', url);
        }

        // 페이지별 컴포넌트 재초기화
        window.Digitek.reinit();

        // 활성 메뉴 상태 업데이트
        Router._updateActiveMenu(url);

        // 페이지 최상단으로 스크롤
        Router.contentEl.scrollTop = 0;
      })
      .catch(function (err) {
        console.error('[Router] 콘텐츠 로드 실패:', url, err);
        Router.contentEl.innerHTML =
          '<div style="padding:2rem;color:var(--digitek-danger);">페이지를 불러오지 못했습니다.</div>';
        Router.contentEl.removeAttribute('aria-busy');
        Router.contentEl.style.opacity = '';
      });
  },

  /**
   * 서버 응답이 전체 HTML인 경우 #page-content 내부만 추출
   * 프래그먼트인 경우 그대로 반환
   */
  _extractContent: function (html) {
    // 전체 HTML 문서인지 확인
    if (html.trim().toLowerCase().indexOf('<!doctype') === -1 &&
        html.trim().toLowerCase().indexOf('<html') === -1) {
      return html; // 이미 프래그먼트
    }
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var contentEl = doc.getElementById('page-content');
    return contentEl ? contentEl.innerHTML : html;
  },

  /**
   * 사이드바 활성 메뉴 상태 갱신
   */
  _updateActiveMenu: function (url) {
    // 기존 active 제거
    document.querySelectorAll(
      '.sidebar-digitek-active, .sidebar-digitek-sub-active'
    ).forEach(function (el) {
      el.classList.remove('sidebar-digitek-active', 'sidebar-digitek-sub-active');
    });

    // 현재 URL과 매칭되는 data-route 링크에 active 추가
    var link = document.querySelector('[data-route="' + url + '"]');
    if (!link) return;

    link.classList.add('sidebar-digitek-active');

    // 부모 서브메뉴 항목도 active 처리
    var parentSubmenuItem = link.closest('ul.sidebar-digitek-submenu');
    if (parentSubmenuItem) {
      var parentLink = parentSubmenuItem.previousElementSibling;
      if (parentLink && parentLink.classList.contains('sidebar-digitek-submenu-item')) {
        parentLink.classList.add('sidebar-digitek-sub-active');
      }
    }
  }
};
```

- [ ] **Step 1: `digitek.js`의 `initAll()` 함수 바로 위에 Router 모듈 코드 삽입**

  `/* ================================================================== */`
  `/*  초기화 & 공개 API` 섹션 바로 위에 붙여넣기.

- [ ] **Step 2: `initAll()` 함수에 `Router.init()` 추가**

  ```javascript
  function initAll() {
    Router.init();      // ← 추가 (가장 먼저 초기화)
    Sidebar.init();
    Accordion.init();
    // ...나머지 동일
  }
  ```

- [ ] **Step 3: `window.Digitek` 노출에 Router 추가**

  ```javascript
  window.Digitek = {
    reinit: function () {
      TextEditor.init();
    },
    Router: Router,   // ← 추가
    // ...나머지 동일
  };
  ```

- [ ] **Step 4: `reinit()` 함수 보완**

  AJAX 이동 후 콘텐츠가 교체되면 페이지별 모듈 재초기화 필요.
  `delegateEvent` 기반 모듈은 document 레벨이므로 자동 동작. TextEditor만 직접 바인딩이므로 재초기화 필요.

  ```javascript
  reinit: function () {
    // delegateEvent 기반: 재초기화 불필요 (document 레벨 리스너)
    // 직접 바인딩 모듈만 재초기화
    TextEditor.init();
    // Select 커스텀 드롭다운: 새로 삽입된 DOM에 대해 재초기화
    Select.init();
  },
  ```

---

### Task 5: 사이드바 링크에 data-route 속성 추가

**Files:**
- Modify: `pages/shell.html` (사이드바 메뉴)
- Modify: 모든 `*-full-page.html` (전체 페이지에서도 동일 동작 원할 경우)

리프 메뉴 항목(클릭 시 페이지 이동하는 항목)에 `data-route` 추가:

```html
<!-- 이전 -->
<a class="sidebar-digitek-submenu-item" href="#">
  <span class="sidebar-digitek-icon-label">
    <span class="sidebar-digitek-menu-label">시작 검색</span>
  </span>
</a>

<!-- 이후 -->
<a class="sidebar-digitek-submenu-item" href="/search/list"
   data-route="/search/list">
  <span class="sidebar-digitek-icon-label">
    <span class="sidebar-digitek-menu-label">시작 검색</span>
  </span>
</a>
```

**규칙:**
- `href` = 실제 서버 URL (JavaScript 비활성화 시 폴백)
- `data-route` = Router가 인터셉트할 경로 (href와 동일값)
- 서브메뉴 토글 전용 항목(chevron 있는 상위 메뉴)에는 `data-route` 없음

- [ ] **Step 1: `pages/shell.html` 사이드바의 각 리프 메뉴에 `data-route` 추가**

- [ ] **Step 2: HTML 프로토타입용 경로는 상대 경로로 설정**

  예: `data-route="../content/searchlist.html"` (shell.html 기준 상대 경로)

- [ ] **Step 3: Commit**

  ```bash
  git add js/digitek.js pages/shell.html
  git commit -m "feat: add AJAX Router module and data-route attributes"
  ```

---

## Chunk 3: 통합 검증 및 Spring 백엔드 가이드

### Task 6: HTML 프로토타입 동작 검증

- [ ] **Step 1: `pages/shell.html` 브라우저에서 열기**

  로컬 서버 필요 (`file://` 에서는 fetch가 CORS로 차단됨).

  ```bash
  # Python 로컬 서버 실행
  cd /Users/songseungju/digitek/digiteki_plm_html_copy
  python3 -m http.server 8080
  # 브라우저: http://localhost:8080/pages/shell.html
  ```

- [ ] **Step 2: 메뉴 클릭 시 콘텐츠 교체 확인**

  - GNB가 유지되는지 확인
  - Sidebar가 유지되는지 확인
  - 콘텐츠 영역만 교체되는지 확인
  - URL이 변경되는지 확인 (`/pages/content/searchlist.html`)

- [ ] **Step 3: 뒤로가기/앞으로가기 확인**

  여러 메뉴 클릭 후 브라우저 뒤로가기 → 이전 콘텐츠 복원 확인.

- [ ] **Step 4: 직접 URL 접근 확인**

  `http://localhost:8080/pages/content/searchlist.html` 직접 접근 시 콘텐츠만 표시.

---

### Task 7: Spring + Thymeleaf 백엔드 연동 가이드

**Files:**
- Create: `docs/thymeleaf-ajax-integration.md`

Spring 백엔드에서 AJAX 요청 감지 및 프래그먼트 반환 패턴:

```java
// Controller 예시
@GetMapping("/search/list")
public String searchList(HttpServletRequest request, Model model) {
    // AJAX 요청 감지
    boolean isAjax = "XMLHttpRequest".equals(
        request.getHeader("X-Requested-With")
    );

    model.addAttribute("data", service.getData());

    if (isAjax) {
        // 콘텐츠 프래그먼트만 반환
        return "pages/search/searchlist :: content";
    }
    // 전체 페이지 반환 (직접 URL 접근 or JS 비활성화)
    return "pages/search/searchlist";
}
```

**Thymeleaf 템플릿 구조:**

```
templates/
├── layout/
│   └── shell.html          ← GNB + Sidebar + #page-content 뼈대
├── pages/
│   ├── search/
│   │   └── searchlist.html ← th:replace="layout/shell :: layout" 사용
│   └── ...
└── fragments/
    ├── sidebar.html        ← Sidebar 프래그먼트
    └── gnb.html            ← GNB 프래그먼트
```

**Thymeleaf Layout Dialect 사용 예시:**

`templates/pages/search/searchlist.html`:
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/shell}">
<head>
  <title>검색 목록</title>
</head>
<body>
  <!-- layout/shell의 #page-content에 주입될 콘텐츠 -->
  <th:block layout:fragment="content">
    <div class="searchlist-digitek-wrap">
      <!-- 페이지 콘텐츠 -->
    </div>
  </th:block>
</body>
</html>
```

`templates/layout/shell.html`:
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
<head>
  <th:block layout:fragment="head-extra"></th:block>
</head>
<body>
<div class="layout-digitek">
  <th:block th:replace="~{fragments/sidebar :: sidebar}"></th:block>
  <div class="layout-digitek-main-area">
    <th:block th:replace="~{fragments/gnb :: gnb}"></th:block>
    <div id="page-content" class="flex-grow-1 overflow-y-digitek-auto"
         style="background: var(--digitek-bg-gray);">
      <th:block layout:fragment="content"></th:block>
    </div>
  </div>
</div>
</body>
</html>
```

**Sidebar active 상태 처리:**

```html
<!-- fragments/sidebar.html -->
<a class="sidebar-digitek-submenu-item"
   th:href="@{/search/list}"
   th:attr="data-route=@{/search/list}"
   th:classappend="${#request.requestURI.startsWith('/search/list')} ? 'sidebar-digitek-active'">
  <span class="sidebar-digitek-menu-label">검색 목록</span>
</a>
```

- [ ] **Step 1: `docs/thymeleaf-ajax-integration.md` 문서 작성**

- [ ] **Step 2: Final commit**

  ```bash
  git add docs/
  git commit -m "docs: add Thymeleaf AJAX integration guide"
  ```

---

## 요약: 동작 흐름

```
최초 진입 (예: /main)
  └─ shell.html 로드 (GNB + Sidebar 렌더링)
  └─ Router.init() 실행
  └─ 현재 URL의 콘텐츠 자동 로드 → #page-content에 주입

메뉴 클릭 (예: /search/list)
  └─ delegateEvent [data-route] 감지
  └─ e.preventDefault()
  └─ fetch("/search/list", { X-Requested-With: XMLHttpRequest })
  └─ 서버: 프래그먼트 HTML 반환
  └─ #page-content.innerHTML = 프래그먼트
  └─ history.pushState({ route: "/search/list" }, "", "/search/list")
  └─ Digitek.reinit() 호출
  └─ 사이드바 active 상태 갱신

브라우저 뒤로가기
  └─ popstate 이벤트
  └─ e.state.route 로 Router._load() 호출
  └─ 이전 콘텐츠 복원
```
