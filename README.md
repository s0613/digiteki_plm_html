# Digiteki PLM HTML Template

Digitek PLM 웹 애플리케이션의 HTML/CSS/JS 디자인 시스템 및 레이아웃 템플릿.

---

## 프로젝트 구조

```
digiteki_plm_html_copy/
├── css/
│   ├── digitek.css          # Digitek 커스텀 스타일 (6,000+ 줄)
│   ├── icons.css            # PNG 기반 아이콘 시스템
│   └── bootstrap.min.css
├── js/
│   ├── digitek.js           # 인터랙션 라이브러리
│   ├── turbo.js             # Hotwire Turbo (프레임 기반 네비게이션)
│   ├── bootstrap.bundle.min.js
│   └── jquery.slim.min.js
├── images/icons/            # 아이콘 및 로고 에셋
├── components/              # UI 컴포넌트 스니펫
│   ├── atoms/               # 버튼, 배지, 프로그레스 등
│   ├── forms/               # 인풋, 셀렉트, 체크박스 등
│   ├── content/             # 카드, 테이블, 패널 등
│   ├── navigation/          # GNB, 사이드바, 페이지네이션 등
│   └── reference/           # 아이콘, 색상 레퍼런스
├── pages/
│   ├── manage/              # 관리 페이지 (main, code-manage, doc-classify, group-manage)
│   ├── detail/              # 상세 페이지 (pms, doc-create, requestregister, ecr-review)
│   ├── search/              # 검색 페이지 (searchlist, searchsplit)
│   └── popup/               # 팝업 페이지
└── docs/                    # 문서
    ├── css-class-reference.md      # CSS 클래스 레퍼런스
    └── component-usage-audit.md    # 컴포넌트 사용 현황 감사
```

---

## Turbo Frames 네비게이션 (GNB/Sidebar 유지)

GNB와 Sidebar를 재로드 없이 유지하면서 콘텐츠 영역만 교체하는 방식.
[Hotwire Turbo 8](https://turbo.hotwired.dev/) 기반.

### 동작 방식

```
최초 접속 (서버에서 전체 페이지 반환)
  └─ GNB + Sidebar 한 번만 렌더링 → 이후 DOM에 유지

사이드바 메뉴 클릭 (일반 <a> 링크)
  └─ Turbo가 자동 인터셉트 → 서버에서 전체 HTML fetch
  └─ 응답 HTML에서 <turbo-frame id="main-content"> 추출
  └─ 현재 DOM의 동일 frame 요소만 교체 (GNB/Sidebar 유지)
  └─ URL 자동 갱신 (history.pushState)
  └─ turbo:frame-load 이벤트 → initContent() 자동 호출
```

### Shell 레이아웃 (`layout/shell.html`)

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
      <th:block layout:fragment="content">
        <!-- 각 페이지 템플릿의 turbo-frame이 여기에 주입됨 -->
      </th:block>
    </div>
  </div>
</div>
<script th:src="@{/js/turbo.js}"></script>
<script th:src="@{/js/jquery.slim.min.js}"></script>
<script th:src="@{/js/bootstrap.bundle.min.js}"></script>
<script th:src="@{/js/digitek.js}"></script>
</body>
</html>
```

### 각 페이지 템플릿

```html
<!-- pages/search/searchlist.html -->
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/shell}">
<head>
  <title>검색 목록</title>
</head>
<body>
  <th:block layout:fragment="content">
    <turbo-frame id="main-content">
      <!-- 콘텐츠 -->
      <div class="digitek-search-page">
        ...
      </div>
    </turbo-frame>
  </th:block>
</body>
</html>
```

> **핵심**: `<turbo-frame id="main-content">` 래퍼를 각 페이지 템플릿의 `layout:fragment="content"` 안에 배치. Shell 레이아웃에는 frame을 두지 않는다 (중첩 방지).

### Spring Boot Controller

Turbo는 일반 GET 요청을 사용하므로 AJAX 분기 없이 항상 전체 페이지를 반환하면 됩니다.

```java
@GetMapping("/search/list")
public String searchList(Model model) {
    model.addAttribute("items", service.getList());
    return "pages/search/searchlist";  // 항상 전체 페이지 반환
}
```

### Sidebar active 상태

Turbo 네비게이션 후 `updateSidebarActive()`가 자동으로 `window.location.pathname`을 기준으로 사이드바 활성 상태를 갱신합니다. 서버에서 `th:classappend`로 초기 상태를 주입할 수도 있습니다.

```html
<!-- fragments/sidebar.html -->
<a th:href="@{/search/list}"
   th:classappend="${currentMenu == 'searchList'} ? 'sidebar-digitek-active'"
   class="sidebar-digitek-submenu-item">
  <span class="sidebar-digitek-menu-label">검색 목록</span>
</a>
```

---

## JS API

```javascript
// 콘텐츠 영역 컴포넌트 재초기화 (turbo:frame-load 시 자동 호출)
window.Digitek.initContent();

// 사이드바 active 상태 갱신 (turbo:frame-load 시 자동 호출)
window.Digitek.updateSidebarActive();

// 개별 모듈 접근
window.Digitek.Sidebar
window.Digitek.Accordion
window.Digitek.Select
window.Digitek.DateSelect
window.Digitek.TextEditor
window.Digitek.SearchList
window.Digitek.SearchSplit
// ...
```

---

## Spring Boot 의존성

`build.gradle`:
```groovy
implementation 'nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect'
```

---

## 개발 환경 (HTML 프로토타입)

```bash
python3 -m http.server 8080
# 브라우저: http://localhost:8080/pages/manage/main.html
```

---

## CSS 클래스 레퍼런스

`docs/css-class-reference.md` 참조.
