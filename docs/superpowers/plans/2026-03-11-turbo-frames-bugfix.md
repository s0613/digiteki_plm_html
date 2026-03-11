# Turbo Frames 버그 수정 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 코드 리뷰에서 발견된 Critical 2개·Important 3개·Suggestion 2개 이슈를 수정하여 Turbo Frames SPA 내비게이션이 실제로 동작하도록 만든다.

**Architecture:** 사이드바 링크에 `data-turbo-frame="main-content"` 속성 추가로 Drive → Frame 전환을 수정하고, 컴포넌트 재초기화 중복 방지 가드를 추가한 뒤, updateSidebarActive()의 서브메뉴 초기화 로직 보완, 팝업 페이지에서 불필요한 turbo-frame 래퍼를 제거한다.

**Tech Stack:** HTML (Thymeleaf fragments), Vanilla JavaScript (digitek.js), Hotwire Turbo 8

---

## Chunk 1: Critical 수정

### Task 1: 사이드바 링크에 `data-turbo-frame="main-content"` 추가

**Files:**
- Modify: `fragments/sidebar.html`

사이드바 링크는 `<turbo-frame>` 밖에 위치하므로, 속성 없이 클릭하면 Turbo Drive가 전체 `<body>`를 교체한다.
`href="#"`인 아코디언 토글 링크(accordion 부모 메뉴 항목)에는 추가하지 않는다.

탐색 대상 링크 목록 (총 21개, 구현 시 시험 링크 포함 확인):
- `sidebar-digitek-menu-item`: 결재 관리, 문서 관리, 부품 관리, 도면 관리, 설계 변경, 문서 등록, ECR 검토, 대시보드
- `sidebar-digitek-submenu-item`: 프로젝트 검색, 프로젝트 등록, My Task, 이슈 검색, 그룹 관리, 코드 관리, 문서 분류 관리
- `sidebar-digitek-sub-submenu-item`: 시작 검색, 시작 의뢰 등록, 시작 결과 등록, MPR 검색, MPR 등록

- [ ] **Step 1: 1레벨 탐색 링크에 속성 추가**

`th:href`가 있는 모든 `sidebar-digitek-menu-item` 링크에 추가:
```html
<!-- 예시: 결재 관리 -->
<a class="sidebar-digitek-menu-item"
   th:href="@{/approve/manage}"
   data-turbo-frame="main-content"
   th:classappend="${currentMenu == 'main'} ? 'sidebar-digitek-active'">
```

대상 라인 (fragments/sidebar.html):
- 27-29행 (결재 관리)
- 39-41행 (문서 관리)
- 51-53행 (부침 관리)
- 63-65행 (도면 관리)
- 126-128행 (설계 변경)
- 222-224행 (문서 등록)
- 234-236행 (ECR 검토)
- 289-291행 (대시보드)

`href="#"`인 PMS, 시험/시작/해석, 관리 아코디언 토글 항목에는 **추가하지 않는다.**

- [ ] **Step 2: 2레벨 서브메뉴 링크에 속성 추가**

대상 라인 (fragments/sidebar.html):
- 90-92행 (프로젝트 검색)
- 98-100행 (프로젝트 등록)
- 106-108행 (My Task)
- 114-116행 (이슈 검색)
- 261-263행 (그룹 관리)
- 269-271행 (코드 관리)
- 277-279행 (문서 분류 관리)

`href="#"`인 시작(3레벨 토글) 항목에는 **추가하지 않는다.**

- [ ] **Step 3: 3레벨 서브-서브메뉴 링크에 속성 추가**

대상 라인 (fragments/sidebar.html):
- 181-183행 (시작 검색)
- 188-190행 (시작 의뢰 등록)
- 194-196행 (시작 결과 등록)
- 202-204행 (MPR 검색)
- 208-210행 (MPR 등록)

- [ ] **Step 4: 결과 확인**

```bash
grep -n 'data-turbo-frame' fragments/sidebar.html
```

Expected: `href="#"`이 없는 탐색 링크마다 `data-turbo-frame="main-content"` 출력

- [ ] **Step 5: Commit**

```bash
git add fragments/sidebar.html
git commit -m "fix: add data-turbo-frame to sidebar nav links for Frame navigation"
```

---

### Task 2: README 스크립트 로딩 순서 수정

**Files:**
- Modify: `README.md`

README 82-83행의 예시 코드가 실제 `layout/shell.html`과 반대 순서:
- README (잘못됨): `digitek.js → turbo.js`
- shell.html (올바름): `turbo.js → digitek.js`

- [ ] **Step 1: README 82-83행 순서 교정**

```html
<!-- 현재 (잘못됨) -->
<script th:src="@{/js/digitek.js}"></script>
<script th:src="@{/js/turbo.js}"></script>

<!-- 수정 후 (올바름) -->
<script th:src="@{/js/turbo.js}"></script>
<script th:src="@{/js/jquery.slim.min.js}"></script>
<script th:src="@{/js/bootstrap.bundle.min.js}"></script>
<script th:src="@{/js/digitek.js}"></script>
```

- [ ] **Step 2: 결과 확인**

```bash
grep -n 'turbo.js\|digitek.js\|jquery\|bootstrap' README.md | head -10
```

Expected: turbo.js 라인이 digitek.js 라인보다 먼저 출력

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "fix: correct script loading order in README (turbo.js before digitek.js)"
```

---

## Chunk 2: Important 수정

### Task 3: 컴포넌트 재초기화 중복 이벤트 리스너 방지

**Files:**
- Modify: `js/digitek.js`

`GanttResizer.init()`, `DraggableTable.initTable()`, `TextEditor._initEditor()`가 요소에 `addEventListener`를 가드 없이 추가하므로, Turbo Frame 전환 시마다 동일 핸들러가 누적된다.
해결책: 각 요소에 `data-initialized` 속성을 붙여 중복 초기화를 방지한다.

- [ ] **Step 1: GanttResizer.init()에 가드 추가**

`digitek.js` 1431행 수정:
```javascript
// 수정 전
document.querySelectorAll(".digitek-gantt-resizer").forEach(function (resizer) {
  resizer.addEventListener("mousedown", function (e) {

// 수정 후
document.querySelectorAll(".digitek-gantt-resizer:not([data-initialized])").forEach(function (resizer) {
  resizer.setAttribute("data-initialized", "true");
  resizer.addEventListener("mousedown", function (e) {
```

- [ ] **Step 2: DraggableTable.initTable()에 가드 추가**

`digitek.js` 1481행 수정:
```javascript
// 수정 전
tbody.querySelectorAll(".draggable-row").forEach(function (row) {
  row.addEventListener("dragstart", function (e) {

// 수정 후
tbody.querySelectorAll(".draggable-row:not([data-initialized])").forEach(function (row) {
  row.setAttribute("data-initialized", "true");
  row.addEventListener("dragstart", function (e) {
```

- [ ] **Step 3: TextEditor._initEditor()에 가드 추가**

`digitek.js`의 `_initEditor` 함수 시작 부분 수정 (약 693행, `editor` 파라미터를 받는 함수):
```javascript
_initEditor: function (editor) {
  // 이미 초기화된 에디터는 스킵
  if (editor.dataset.initialized) return;
  editor.dataset.initialized = "true";
  // ... 이하 기존 코드
```

- [ ] **Step 4: 동작 확인**

브라우저에서 동일 페이지를 Turbo Frame 탐색으로 2회 이상 방문 후, GanttResizer가 있는 페이지에서 F12 콘솔에서 다음 실행:
```javascript
document.querySelectorAll('.digitek-gantt-resizer').forEach(el => console.log(el.dataset.initialized))
// Expected: 모두 "true" 1개씩만 출력
```

- [ ] **Step 5: Commit**

```bash
git add js/digitek.js
git commit -m "fix: prevent duplicate event listeners in GanttResizer, DraggableTable, TextEditor on re-init"
```

---

### Task 4: updateSidebarActive() 서브메뉴 초기화 보완

**Files:**
- Modify: `js/digitek.js`

현재 `updateSidebarActive()`는 `sidebar-digitek-active` 클래스만 제거하고, 이전에 열린 서브메뉴의 `maxHeight`, `aria-expanded`, `sidebar-digitek-parent-open`, `sidebar-digitek-chevron-open` 상태를 초기화하지 않아 다른 메뉴로 이동 후에도 서브메뉴가 시각적으로 열려 있을 수 있다.

- [ ] **Step 1: 기존 active 클래스 제거 블록 확장**

`js/digitek.js` 1926-1931행의 "기존 active 클래스 전부 제거" 블록 아래에 서브메뉴 초기화 추가:

```javascript
// 기존 active 클래스 전부 제거
document.querySelectorAll(
  ".sidebar-digitek-menu-item, .sidebar-digitek-submenu-item, .sidebar-digitek-sub-submenu-item"
).forEach(function (link) {
  link.classList.remove("sidebar-digitek-active", "sidebar-digitek-sub-active");
  // 아코디언 부모 상태 초기화
  link.classList.remove("sidebar-digitek-parent-open");
  link.classList.remove("sidebar-digitek-chevron-open");  // 버튼 자체에는 없지만 방어용
  if (link.hasAttribute("aria-expanded")) {
    link.setAttribute("aria-expanded", "false");
  }
});

// 열려 있는 서브메뉴 maxHeight 초기화
document.querySelectorAll(
  ".sidebar-digitek-submenu, .sidebar-digitek-sub-submenu"
).forEach(function (submenu) {
  submenu.style.maxHeight = "0";
});

// chevron 닫기
document.querySelectorAll(".sidebar-digitek-chevron").forEach(function (chev) {
  chev.classList.remove("sidebar-digitek-chevron-open");
});
```

- [ ] **Step 2: 동작 확인**

1. 브라우저에서 PMS > 프로젝트 검색 페이지로 이동 (서브메뉴 열림 확인)
2. 사이드바에서 문서 관리 클릭 (1레벨 메뉴)
3. PMS 서브메뉴가 닫히고 문서 관리만 active 상태인지 확인

- [ ] **Step 3: Commit**

```bash
git add js/digitek.js
git commit -m "fix: reset submenu maxHeight and aria-expanded in updateSidebarActive()"
```

---

### Task 5: 팝업 페이지에서 불필요한 turbo-frame 래퍼 제거

**Files:**
- Modify: `pages/popup/assignee-selector.html`
- Modify: `pages/popup/popup-base.html`
- Modify: `pages/popup/searchsplit-detail-popup.html`

팝업 페이지는 `window.open()`으로 열리는 독립 페이지로 `shell.html`을 사용하지 않아 turbo.js가 로드되지 않는다. `<turbo-frame>` 래퍼는 기능하지 않으므로 제거한다.

먼저 각 파일에서 turbo-frame 래퍼 위치를 확인:
```bash
grep -n 'turbo-frame' pages/popup/assignee-selector.html pages/popup/popup-base.html pages/popup/searchsplit-detail-popup.html
```

- [ ] **Step 1: assignee-selector.html에서 turbo-frame 래퍼 제거**

`<turbo-frame id="main-content">` 여는 태그와 `</turbo-frame>` 닫는 태그 제거 (내용 유지)

- [ ] **Step 2: popup-base.html에서 turbo-frame 래퍼 제거**

동일하게 제거

- [ ] **Step 3: searchsplit-detail-popup.html에서 turbo-frame 래퍼 제거**

동일하게 제거

- [ ] **Step 4: 결과 확인**

```bash
grep -n 'turbo-frame' pages/popup/assignee-selector.html pages/popup/popup-base.html pages/popup/searchsplit-detail-popup.html
```

Expected: 출력 없음

- [ ] **Step 5: Commit**

```bash
git add pages/popup/assignee-selector.html pages/popup/popup-base.html pages/popup/searchsplit-detail-popup.html
git commit -m "fix: remove non-functional turbo-frame wrapper from popup pages"
```

---

## Chunk 3: 코드 품질 개선

### Task 6: initContent() 주석 개선 및 turbo:load 폴백 핸들러 추가

**Files:**
- Modify: `js/digitek.js`

- [ ] **Step 1: initContent() 주석에 제외 컴포넌트 명시**

`js/digitek.js` 1986-1987행 주석 수정:
```javascript
// 컨텐츠 영역 컴포넌트만 재초기화 (turbo-frame 교체 후 호출)
// delegateEvent 기반 컴포넌트는 재초기화 불필요:
//   Accordion, TabButton, FileUpload (document 위임)
//   SearchList, SearchSplit (내부에서 delegateEvent 전용으로 구현, 재초기화 시 부작용 발생)
//   GNBSearch (GNB 영역은 프레임 교체 대상이 아님)
//   Locale (초기화 1회로 충분)
//   Sidebar (레이아웃 영역, 프레임 교체 대상이 아님)
```

- [ ] **Step 2: turbo:load 폴백 핸들러 추가**

`js/digitek.js`의 `turbo:frame-load` 이벤트 리스너 다음(1017행 이후)에 추가:
```javascript
// Turbo Drive 전체 페이지 전환 시 폴백 초기화
// (Turbo Frame이 아닌 Drive navigation 또는 hard refresh 후 turbo:load 발생)
document.addEventListener("turbo:load", function () {
  // DOMContentLoaded와 중복 방지: turbo:load는 Drive nav 후에만 처리
  // (Drive nav가 일어나면 DOMContentLoaded는 다시 발생하지 않음)
  initAll();
});
```

- [ ] **Step 3: Commit**

```bash
git add js/digitek.js
git commit -m "chore: improve initContent() comments and add turbo:load fallback handler"
```

---

## 최종 검증

- [ ] **전체 흐름 확인**

1. 브라우저에서 앱 로드 (`/manage/main` 등)
2. 사이드바 링크 클릭 → URL 변경, GNB/사이드바 유지, 콘텐츠만 교체 확인
3. 브라우저 개발자 도구 Network 탭에서 클릭 시 전체 HTML이 아닌 partial response 확인
4. 서브메뉴 메뉴(PMS 등)로 이동 후 다른 1레벨 메뉴 클릭 → 서브메뉴 닫힘 확인
5. 팝업 페이지 정상 렌더링 확인

- [ ] **수정 사항 커밋 이력 확인**

```bash
git log --oneline -6
```

Expected: 5개 fix/chore 커밋 확인
