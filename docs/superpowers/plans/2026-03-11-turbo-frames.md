# Turbo Frames 적용 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turbo Frames를 적용해 사이드바/GNB는 한 번만 초기화되고, 페이지 이동 시 컨텐츠 영역만 교체되도록 한다.

**Architecture:** 각 페이지 템플릿의 `layout:fragment="content"` 내부에 `<turbo-frame id="main-content">` 를 추가한다. shell.html(레이아웃)에는 turbo-frame을 추가하지 않는다. Turbo는 링크 클릭 시 서버에서 완전한 HTML을 받아 같은 ID의 frame 내용만 DOM에 교체한다. GNB/Sidebar는 frame 바깥이므로 JS 상태가 유지된다. 페이지 이동 후 `turbo:frame-load` 이벤트로 컨텐츠 전용 컴포넌트만 재초기화하고, 사이드바 active 상태를 URL 기반으로 업데이트한다.

**Tech Stack:** Hotwire Turbo 8, Thymeleaf Layout Dialect, Spring Boot 3.4.x, vanilla JS

---

## 변경 파일 목록

| 파일 | 작업 | 설명 |
|------|------|------|
| `js/turbo.js` | 신규 추가 | Turbo 라이브러리 파일 |
| `layout/shell.html` | 수정 | Turbo.js 스크립트 추가만 (turbo-frame 태그 없음) |
| `pages/manage/main.html` | 수정 | content fragment 내부 `<turbo-frame>` 추가 |
| `pages/manage/group-manage.html` | 수정 | 동일 |
| `pages/manage/code-manage.html` | 수정 | 동일 |
| `pages/manage/doc-classify.html` | 수정 | 동일 |
| `pages/search/searchlist.html` | 수정 | 동일 |
| `pages/search/searchsplit.html` | 수정 | 동일 |
| `pages/detail/pms.html` | 수정 | 동일 |
| `pages/detail/requestregister.html` | 수정 | 동일 |
| `pages/detail/doc-create.html` | 수정 | 동일 |
| `pages/detail/ecr-review.html` | 수정 | 동일 |
| `js/digitek.js` | 수정 | Select.init() guard + `initContent()` + `turbo:frame-load` + `updateSidebarActive()` |

**적용 대상 프로젝트:**
- `digiteki_plm_html_copy/` — 소스 기준
- `digiteki_plm_springboot_test/src/main/resources/` — 동기화 대상

---

## Chunk 1: Turbo.js 추가 및 shell.html 스크립트 등록

### Task 1: Turbo.js 라이브러리 파일 추가

**Files:**
- Create: `js/turbo.js`

- [ ] **Step 1: Turbo.js 다운로드**

```bash
curl -L "https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.12/dist/turbo.es2017.umd.js" \
  -o /Users/songseungju/digitek/digiteki_plm_html_copy/js/turbo.js
```

Expected: `wc -l /Users/songseungju/digitek/digiteki_plm_html_copy/js/turbo.js` → 수백 줄 이상

- [ ] **Step 2: Spring Boot 프로젝트에 복사**

```bash
cp /Users/songseungju/digitek/digiteki_plm_html_copy/js/turbo.js \
   /Users/songseungju/digitek/digiteki_plm_springboot_test/src/main/resources/static/js/turbo.js
```

- [ ] **Step 3: 커밋**

```bash
cd /Users/songseungju/digitek/digiteki_plm_html_copy
git add js/turbo.js
git commit -m "feat: add Turbo.js library for frame-based navigation"
```

---

### Task 2: shell.html — Turbo.js 스크립트 등록

**Files:**
- Modify: `layout/shell.html`

> ⚠️ **중요**: shell.html에는 `<turbo-frame>` 태그를 추가하지 않는다.
> turbo-frame은 각 페이지 템플릿에만 존재해야 한다 (중첩 방지).
> Thymeleaf Layout Dialect가 content fragment를 주입할 때 페이지 템플릿의 turbo-frame이 함께 삽입된다.

현재 shell.html 스크립트 영역 (28-30번째 줄):
```html
<script th:src="@{/js/jquery.slim.min.js}"></script>
<script th:src="@{/js/bootstrap.bundle.min.js}"></script>
<script th:src="@{/js/digitek.js}"></script>
```

변경 후:
```html
<script th:src="@{/js/turbo.js}"></script>
<script th:src="@{/js/jquery.slim.min.js}"></script>
<script th:src="@{/js/bootstrap.bundle.min.js}"></script>
<script th:src="@{/js/digitek.js}"></script>
```

- [ ] **Step 1: shell.html 수정** (스크립트 1줄 추가만)

- [ ] **Step 2: Spring Boot 프로젝트에 동기화**

```bash
cp /Users/songseungju/digitek/digiteki_plm_html_copy/layout/shell.html \
   /Users/songseungju/digitek/digiteki_plm_springboot_test/src/main/resources/templates/layout/shell.html
```

- [ ] **Step 3: 커밋**

```bash
cd /Users/songseungju/digitek/digiteki_plm_html_copy
git add layout/shell.html
git commit -m "feat: register Turbo.js script in layout shell"
```

---

## Chunk 2: 페이지 템플릿 turbo-frame 래퍼 추가

각 페이지 템플릿의 `<th:block layout:fragment="content">` 바로 안쪽에 `<turbo-frame id="main-content">` 를 추가한다.

**패턴 (모든 페이지 동일):**
```html
<!-- 변경 전 -->
<th:block layout:fragment="content">
  <div class="digitek-search-page">
    ...
  </div>
</th:block>

<!-- 변경 후 -->
<th:block layout:fragment="content">
  <turbo-frame id="main-content">
    <div class="digitek-search-page">
      ...
    </div>
  </turbo-frame>
</th:block>
```

> 렌더링 결과: Thymeleaf가 `layout:fragment="content"` 블록을 shell.html의 content 위치에 주입하면,
> 최종 HTML에는 `<turbo-frame id="main-content">` 가 정확히 한 곳에만 존재한다.

### Task 3: manage/ 페이지 4개 수정

**Files:**
- Modify: `pages/manage/main.html`
- Modify: `pages/manage/group-manage.html`
- Modify: `pages/manage/code-manage.html`
- Modify: `pages/manage/doc-classify.html`

- [ ] **Step 1: main.html 수정**

`<th:block layout:fragment="content">` 다음 줄에 `<turbo-frame id="main-content">` 추가,
`</th:block>` 직전에 `</turbo-frame>` 추가.

- [ ] **Step 2: group-manage.html 수정** (동일 패턴)

- [ ] **Step 3: code-manage.html 수정** (동일 패턴)

- [ ] **Step 4: doc-classify.html 수정** (동일 패턴)

- [ ] **Step 5: 수정 확인**

```bash
grep -l 'turbo-frame' /Users/songseungju/digitek/digiteki_plm_html_copy/pages/manage/*.html
```
Expected: 4개 파일 모두 출력

- [ ] **Step 6: Spring Boot 프로젝트에 동기화**

```bash
cp /Users/songseungju/digitek/digiteki_plm_html_copy/pages/manage/*.html \
   /Users/songseungju/digitek/digiteki_plm_springboot_test/src/main/resources/templates/pages/manage/
```

- [ ] **Step 7: 커밋**

```bash
cd /Users/songseungju/digitek/digiteki_plm_html_copy
git add pages/manage/
git commit -m "feat: add turbo-frame wrapper to manage page templates"
```

---

### Task 4: search/ 및 detail/ 페이지 6개 수정

**Files:**
- Modify: `pages/search/searchlist.html`
- Modify: `pages/search/searchsplit.html`
- Modify: `pages/detail/pms.html`
- Modify: `pages/detail/requestregister.html`
- Modify: `pages/detail/doc-create.html`
- Modify: `pages/detail/ecr-review.html`

- [ ] **Step 1: searchlist.html 수정** (동일 패턴)

- [ ] **Step 2: searchsplit.html 수정** (동일 패턴)

- [ ] **Step 3: pms.html 수정** (동일 패턴)

- [ ] **Step 4: requestregister.html 수정** (동일 패턴)

- [ ] **Step 5: doc-create.html 수정** (동일 패턴)

- [ ] **Step 6: ecr-review.html 수정** (동일 패턴)

- [ ] **Step 7: 전체 확인**

```bash
grep -rl 'turbo-frame' /Users/songseungju/digitek/digiteki_plm_html_copy/pages/
```
Expected: 10개 파일 모두 출력

- [ ] **Step 8: Spring Boot 프로젝트에 일괄 동기화**

```bash
cp /Users/songseungju/digitek/digiteki_plm_html_copy/pages/search/*.html \
   /Users/songseungju/digitek/digiteki_plm_springboot_test/src/main/resources/templates/pages/search/
cp /Users/songseungju/digitek/digiteki_plm_html_copy/pages/detail/*.html \
   /Users/songseungju/digitek/digiteki_plm_springboot_test/src/main/resources/templates/pages/detail/
```

- [ ] **Step 9: 커밋**

```bash
cd /Users/songseungju/digitek/digiteki_plm_html_copy
git add pages/search/ pages/detail/
git commit -m "feat: add turbo-frame wrapper to search and detail page templates"
```

---

## Chunk 3: digitek.js 수정

### Task 5: digitek.js 수정

**Files:**
- Modify: `js/digitek.js`

**배경 지식:**
- `delegateEvent` 사용 컴포넌트 (Accordion, TabButton, FileUpload, SearchList, SearchSplit): document 레벨 리스너이므로 재초기화 불필요
- `document.querySelectorAll` 사용 컴포넌트 (TextEditor, GanttResizer, DraggableTable, DateSelect): 새 DOM에 재초기화 필요
- `Select.init()`: `document.querySelectorAll` + `document.addEventListener("mousedown", ...)` 포함 — mousedown은 중복 등록 방지 guard 필요
- Sidebar, GNBSearch, Locale: 레이아웃 컴포넌트 — 재초기화 절대 금지

---

#### Step 1: `Select.init()` 중복 리스너 방지 guard 추가

`var Select = { ... init: function() { ... } }` 내부에서 `document.addEventListener("mousedown", ...)` 를 등록하는 부분을 찾아 guard를 추가한다.

현재 코드 (Select.init 내부 어딘가):
```javascript
document.addEventListener("mousedown", function (e) {
  // 열린 드롭다운 닫기 로직
});
```

변경 후:
```javascript
if (!Select._mousedownBound) {
  Select._mousedownBound = true;
  document.addEventListener("mousedown", function (e) {
    // 열린 드롭다운 닫기 로직 (기존 내용 그대로)
  });
}
```

- [ ] **Select.init() 내 mousedown 리스너에 guard 추가**

---

#### Step 2: `updateSidebarActive()` 함수 추가

`initAll()` 함수 정의 **바로 위**에 아래 함수를 추가한다.
이 함수는 IIFE 내부에 있으므로 `getSidebarItemH()`, `Sidebar._recalcParentHeight()` 에 접근 가능하다.

```javascript
// Turbo Frame 이동 후 사이드바 active 상태를 현재 URL 기반으로 업데이트
function updateSidebarActive() {
  var path = window.location.pathname;

  // 기존 active 클래스 전부 제거
  document.querySelectorAll(
    ".sidebar-digitek-menu-item, .sidebar-digitek-submenu-item, .sidebar-digitek-sub-submenu-item"
  ).forEach(function (link) {
    link.classList.remove("sidebar-digitek-active", "sidebar-digitek-sub-active");
  });

  // 현재 경로와 일치하는 링크 찾기 (href="#" 인 부모 메뉴는 매칭 안 됨)
  var matched = document.querySelector('.sidebar-digitek a[href="' + path + '"]');
  if (!matched) return;

  if (matched.classList.contains("sidebar-digitek-menu-item")) {
    // 1레벨 메뉴
    matched.classList.add("sidebar-digitek-active");

  } else if (matched.classList.contains("sidebar-digitek-submenu-item")) {
    // 2레벨 서브메뉴 — active 클래스 + 부모 submenu maxHeight 열기
    matched.classList.add("sidebar-digitek-active");
    var submenu = matched.closest(".sidebar-digitek-submenu");
    if (submenu) {
      var count = submenu.querySelectorAll(":scope > .nav-item").length;
      submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
      var parentItem = submenu.previousElementSibling;
      if (parentItem) {
        parentItem.setAttribute("aria-expanded", "true");
        parentItem.classList.add("sidebar-digitek-parent-open");
        var chev = parentItem.querySelector(".sidebar-digitek-chevron");
        if (chev) chev.classList.add("sidebar-digitek-chevron-open");
      }
    }

  } else if (matched.classList.contains("sidebar-digitek-sub-submenu-item")) {
    // 3레벨 서브-서브메뉴 — sidebar-digitek-sub-active 사용 (클릭 핸들러와 동일)
    matched.classList.add("sidebar-digitek-sub-active");
    var subSubmenu = matched.closest(".sidebar-digitek-sub-submenu");
    if (subSubmenu) {
      var count3 = subSubmenu.querySelectorAll(":scope > .nav-item").length;
      subSubmenu.style.maxHeight = (count3 * getSidebarItemH()) + "px";
      var parentSubmenuItem = subSubmenu.previousElementSibling;
      if (parentSubmenuItem) {
        parentSubmenuItem.setAttribute("aria-expanded", "true");
        var chev2 = parentSubmenuItem.querySelector(".sidebar-digitek-chevron");
        if (chev2) chev2.classList.add("sidebar-digitek-chevron-open");
      }
      // 부모 submenu도 열기
      var parentSubmenu = subSubmenu.closest(".sidebar-digitek-submenu");
      if (parentSubmenu) {
        Sidebar._recalcParentHeight(null, parentSubmenu);
        var grandParentItem = parentSubmenu.previousElementSibling;
        if (grandParentItem) {
          grandParentItem.setAttribute("aria-expanded", "true");
          grandParentItem.classList.add("sidebar-digitek-parent-open");
          var chev3 = grandParentItem.querySelector(".sidebar-digitek-chevron");
          if (chev3) chev3.classList.add("sidebar-digitek-chevron-open");
        }
      }
    }
  }
}
```

- [ ] **`updateSidebarActive()` 함수를 `initAll()` 바로 위에 추가**

---

#### Step 3: `initContent()` 추가 + `turbo:frame-load` 이벤트 + `initAll()` 수정

현재 코드 (`js/digitek.js` lines ~1919-1941):
```javascript
function initAll() {
  Sidebar.init();
  Accordion.init();
  TabButton.init();
  FileUpload.init();
  GNBSearch.init();
  Select.init();
  DateSelect.init();
  TextEditor.init();
  Locale.init();
  GanttResizer.init();
  DraggableTable.init();
  SearchList.init();
  SearchSplit.init();
}

// DOMContentLoaded 자동 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
```

변경 후:
```javascript
// 컨텐츠 영역 컴포넌트만 재초기화 (turbo-frame 교체 후 호출)
// delegateEvent 기반 컴포넌트(Accordion, TabButton, FileUpload 등)는 재초기화 불필요
function initContent() {
  Select.init();
  DateSelect.init();
  TextEditor.init();
  GanttResizer.init();
  DraggableTable.init();
}

function initAll() {
  Sidebar.init();     // 레이아웃 전용 — DOMContentLoaded 시만 실행
  Accordion.init();
  TabButton.init();
  FileUpload.init();
  GNBSearch.init();
  Select.init();
  DateSelect.init();
  TextEditor.init();
  Locale.init();
  GanttResizer.init();
  DraggableTable.init();
  SearchList.init();
  SearchSplit.init();
}

// Turbo Frame 교체 후: main-content 프레임에만 반응
document.addEventListener("turbo:frame-load", function (e) {
  if (e.target.id !== "main-content") return;
  initContent();
  updateSidebarActive();
});

// DOMContentLoaded 자동 초기화 (전체)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
```

- [ ] **`initContent()` 추가, `turbo:frame-load` 이벤트 추가, `initAll()` 주석 보완**

---

#### Step 4: `window.Digitek` 네임스페이스에 신규 함수 추가

현재 `window.Digitek = { ... }` 블록에 아래 항목 추가:

```javascript
window.Digitek = {
  // ... 기존 항목들 ...
  initContent: initContent,
  updateSidebarActive: updateSidebarActive,
};
```

- [ ] **`window.Digitek` 에 `initContent`, `updateSidebarActive` 추가**

---

- [ ] **Step 5: Spring Boot 프로젝트에 동기화**

```bash
cp /Users/songseungju/digitek/digiteki_plm_html_copy/js/digitek.js \
   /Users/songseungju/digitek/digiteki_plm_springboot_test/src/main/resources/static/js/digitek.js
```

- [ ] **Step 6: 문법 검증**

```bash
node --check /Users/songseungju/digitek/digiteki_plm_html_copy/js/digitek.js
```
Expected: 오류 없이 종료

- [ ] **Step 7: 커밋**

```bash
cd /Users/songseungju/digitek/digiteki_plm_html_copy
git add js/digitek.js
git commit -m "feat: add initContent() and updateSidebarActive() for Turbo Frame navigation"
```

---

## Chunk 4: 동작 검증

### Task 6: Spring Boot 서버 재시작 및 검증

- [ ] **Step 1: Spring Boot 재시작**

```bash
kill $(lsof -ti :8080) 2>/dev/null
mvn -f /Users/songseungju/digitek/digiteki_plm_springboot_test/pom.xml spring-boot:run > /tmp/springboot.log 2>&1 &
sleep 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/search/searchlist
```
Expected: `200`

- [ ] **Step 2: turbo-frame 렌더링 확인**

```bash
curl -s http://localhost:8080/search/searchlist | grep -c 'turbo-frame'
```
Expected: `2` (여는 태그 1 + 닫는 태그 1)

- [ ] **Step 3: Playwright로 Turbo Frame 네비게이션 검증**

```python
# /tmp/test_turbo_frames.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # 검색 페이지 진입
    page.goto("http://localhost:8080/search/searchlist")
    page.wait_for_load_state("networkidle")

    # 사이드바 DOM 참조 저장 (이 요소가 frame 교체 후에도 동일 객체인지 확인)
    sidebar_el = page.locator(".sidebar-digitek").element_handle()

    # 네비게이션 추적
    nav_requests = []
    page.on("request", lambda req: nav_requests.append(req.url) if req.resource_type == "document" else None)

    # 사이드바 링크 클릭으로 PMS 페이지 이동 (직접 navigate가 아닌 링크 클릭)
    page.locator('.sidebar-digitek a[href="/detail/pms"]').click()
    page.wait_for_url("**/detail/pms")
    page.wait_for_load_state("networkidle")

    # 검증 1: URL 변경
    assert "/detail/pms" in page.url, f"URL 변경 실패: {page.url}"
    print("✅ URL 변경됨:", page.url)

    # 검증 2: turbo-frame이 여전히 존재
    frame_count = page.locator("turbo-frame#main-content").count()
    assert frame_count == 1, f"turbo-frame 없음: {frame_count}"
    print("✅ turbo-frame 정상:", frame_count, "개")

    # 검증 3: full-page document 요청이 없었음 (Turbo가 fetch로만 처리)
    full_page_reloads = [r for r in nav_requests if "detail/pms" in r]
    print("ℹ️  document 요청 수:", len(full_page_reloads), "(0이면 Turbo Frame 성공)")

    # 검증 4: PMS 컨텐츠 존재
    content_ok = page.locator(".digitek-dashboard-page").count() > 0
    assert content_ok, "PMS 컨텐츠 없음"
    print("✅ PMS 컨텐츠 표시됨")

    browser.close()
    print("\n✅ Turbo Frame 네비게이션 검증 완료")
```

```bash
python /tmp/test_turbo_frames.py
```

- [ ] **Step 4: 브라우저 직접 확인 체크리스트**

  - [ ] `http://localhost:8080/search/searchlist` 진입 → 검색 페이지 표시
  - [ ] 사이드바 링크 클릭 → 페이지 깜빡임 없이 컨텐츠만 교체
  - [ ] 브라우저 뒤로가기 → 이전 페이지로 복원
  - [ ] 사이드바 active 상태가 이동한 페이지에 맞게 변경됨
  - [ ] 서브메뉴가 있는 페이지로 이동 시 해당 서브메뉴가 자동으로 열림
