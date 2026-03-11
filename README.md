# Digiteki PLM HTML Template

Digitek PLM 웹 애플리케이션의 HTML/CSS/JS 디자인 시스템 및 레이아웃 템플릿.

---

## 프로젝트 구조

```
digiteki_plm_html_copy/
├── css/
│   ├── digitek.css          # Digitek 커스텀 스타일
│   ├── icons.css            # PNG 기반 아이콘 시스템
│   └── bootstrap.min.css
├── js/
│   └── digitek.js           # 인터랙션 라이브러리 (Router 포함)
├── images/icons/            # 아이콘 및 로고 에셋
├── components/              # UI 컴포넌트 스니펫
│   ├── atoms/               # 버튼, 뱃지, 프로그레스 등
│   ├── forms/               # 인풋, 셀렉트, 체크박스 등
│   ├── content/             # 카드, 테이블, 패널 등
│   └── navigation/          # GNB, 사이드바, 페이지네이션 등
├── pages/
│   ├── shell.html           # AJAX 라우팅용 Shell 레이아웃 (★)
│   ├── content/             # AJAX 콘텐츠 프래그먼트 (GNB/Sidebar 없음)
│   ├── manage/              # 관리 페이지 전체 레이아웃
│   ├── detail/              # 상세 페이지 전체 레이아웃
│   ├── search/              # 검색 페이지 전체 레이아웃
│   └── popup/               # 팝업 페이지
└── docs/                    # 문서
```

---

## AJAX 라우팅 (GNB/Sidebar 유지)

GNB와 Sidebar를 재로드 없이 유지하면서 콘텐츠 영역만 교체하는 방식.

### 동작 방식

```
최초 접속 (shell.html 또는 서버 레이아웃)
  └─ GNB + Sidebar 한 번만 렌더링 → 이후 유지

메뉴 클릭 (data-route 속성 감지)
  └─ fetch(url, { X-Requested-With: XMLHttpRequest })
  └─ #page-content innerHTML 교체
  └─ history.pushState로 URL 갱신
  └─ Digitek.reinit() 호출

브라우저 뒤로가기/앞으로가기
  └─ popstate 이벤트 → 이전 콘텐츠 복원
```

### 사이드바 메뉴에 data-route 추가

```html
<!-- 리프 메뉴(페이지 이동)에만 data-route 추가 -->
<a class="sidebar-digitek-submenu-item"
   href="/search/list"
   data-route="/search/list">
  <span class="sidebar-digitek-menu-label">검색 목록</span>
</a>

<!-- 서브메뉴 토글(상위 메뉴)에는 data-route 없음 -->
<a class="sidebar-digitek-menu-item" href="#" aria-expanded="false">
  PMS
</a>
```

### JS API

```javascript
// 프로그래밍 방식으로 페이지 이동
window.Digitek.Router.navigate('/search/list');

// 콘텐츠 교체 후 컴포넌트 재초기화 (Router가 자동 호출)
window.Digitek.reinit();
```

---

## Spring Boot 연동 가이드

### 1. 의존성 추가

`build.gradle`:
```groovy
implementation 'nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect'
```

### 2. 템플릿 구조

```
src/main/resources/templates/
├── layout/
│   └── shell.html           # GNB + Sidebar 뼈대 레이아웃
├── fragments/
│   ├── sidebar.html         # 사이드바 프래그먼트
│   └── gnb.html             # GNB 프래그먼트
└── pages/
    ├── search/
    │   └── searchlist.html  # layout:decorate 적용
    └── ...
```

### 3. layout/shell.html

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
      <layout:fragment name="content"></layout:fragment>
    </div>
  </div>
</div>
<script th:src="@{/js/digitek.js}"></script>
</body>
</html>
```

### 4. 각 페이지 템플릿

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
    <!-- #page-content에 주입될 콘텐츠 -->
    <div class="digitek-search-page">
      ...
    </div>
  </th:block>
</body>
</html>
```

### 5. Controller — AJAX 요청 감지

```java
@GetMapping("/search/list")
public String searchList(HttpServletRequest request, Model model) {
    boolean isAjax = "XMLHttpRequest".equals(
        request.getHeader("X-Requested-With")
    );

    model.addAttribute("items", service.getList());

    if (isAjax) {
        // 콘텐츠 프래그먼트만 반환 (GNB/Sidebar 없음)
        return "pages/search/searchlist :: content";
    }
    // 전체 페이지 반환 (직접 URL 접근, JS 비활성화 폴백)
    return "pages/search/searchlist";
}
```

### 6. Sidebar active 상태 (Thymeleaf)

```html
<!-- fragments/sidebar.html -->
<a th:href="@{/search/list}"
   th:attr="data-route=@{/search/list}"
   th:classappend="${currentMenu == 'searchList'} ? 'sidebar-digitek-active'"
   class="sidebar-digitek-submenu-item">
  <span class="sidebar-digitek-menu-label">검색 목록</span>
</a>
```

Controller에서 `model.addAttribute("currentMenu", "searchList")` 전달.

---

## 개발 환경 (HTML 프로토타입)

로컬 서버 없이는 `fetch()`가 CORS로 차단됩니다. Python으로 간단히 실행:

```bash
python3 -m http.server 8080
# 브라우저: http://localhost:8080/pages/shell.html
```

---

## CSS 클래스 레퍼런스

`docs/css-class-reference.md` 참조.
