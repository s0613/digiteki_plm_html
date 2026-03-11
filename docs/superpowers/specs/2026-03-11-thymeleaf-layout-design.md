# Thymeleaf Layout Dialect 전환 설계

## Goal

기존 AJAX Router(클라이언트 JS) 방식을 제거하고, Thymeleaf Layout Dialect 기반의 서버사이드 렌더링 구조로 전환한다. GNB/Sidebar는 layout 템플릿에 한 번만 정의하고, 각 페이지는 콘텐츠 부분만 작성한다.

## Architecture

- **No AJAX** — 페이지 이동 시 전체 페이지 새로고침 (Spring Boot controller → Thymeleaf 렌더링)
- **No Router JS** — `digitek.js`의 Router 모듈 제거
- **Thymeleaf Layout Dialect** — `layout:decorate` + `layout:fragment` 로 GNB/Sidebar 재사용
- **Active 상태** — controller에서 `model.addAttribute("currentMenu", "...")` 전달, sidebar에서 `th:classappend` 처리

## 파일 구조 변경

```
Before                                     After
──────────────────────────────────────────────────────────────
pages/shell.html                    →  삭제
pages/content/*.html (10개)         →  삭제
pages/manage/main-full-page.html    →  pages/manage/main.html
pages/manage/code-manage-...        →  pages/manage/code-manage.html
pages/manage/doc-classify-...       →  pages/manage/doc-classify.html
pages/manage/group-manage-...       →  pages/manage/group-manage.html
pages/detail/doc-create-...         →  pages/detail/doc-create.html
pages/detail/ecr-review-...         →  pages/detail/ecr-review.html
pages/detail/pms-...                →  pages/detail/pms.html
pages/detail/requestregister-...    →  pages/detail/requestregister.html
pages/search/searchlist-...         →  pages/search/searchlist.html
pages/search/searchsplit-...        →  pages/search/searchsplit.html
                                    +  layout/shell.html (신규)
                                    +  fragments/gnb.html (신규)
                                    +  fragments/sidebar.html (신규)
```

## 신규 파일 상세

### layout/shell.html (베이스 레이아웃)

```html
<!DOCTYPE html>
<html lang="ko"
      xmlns:th="http://www.thymeleaf.org"
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

### fragments/gnb.html

- `th:fragment="gnb"` 으로 GNB HTML 전체를 감쌈
- 로그인 사용자 정보: `th:text="${user.name}"` 등 (placeholder 주석 처리)

### fragments/sidebar.html

- `th:fragment="sidebar"` 으로 사이드바 전체를 감쌈
- 각 메뉴 링크: `th:href="@{/manage/main}"` 형태
- Active 처리: `th:classappend="${currentMenu == 'main'} ? 'sidebar-digitek-active'"`
- `data-route` 속성 제거 (AJAX 불필요)

### pages/*/페이지명.html (각 페이지 템플릿)

```html
<!DOCTYPE html>
<html lang="ko"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/shell}">
<head>
  <title>페이지 제목</title>
</head>
<body>
  <th:block layout:fragment="content">
    <!-- 기존 full-page에서 콘텐츠 div만 여기에 이동 -->
  </th:block>
</body>
</html>
```

## 각 페이지 콘텐츠 추출 기준

| 파일 | 추출 대상 (기존 full-page의 id="page-content" 내부) |
|------|------|
| main | `.main-page-grid` 전체 |
| searchlist | `.digitek-search-page` 전체 |
| searchsplit | `.digitek-split-body` 전체 |
| pms | `.digitek-dashboard-page` 전체 |
| requestregister | `.digitek-form-page` 전체 |
| doc-create | `.doc-create-digitek` 전체 |
| ecr-review | `.ecr-review-layout` 전체 |
| group-manage | `.group-manage-layout` 전체 |
| code-manage | `.code-manage-layout` 전체 |
| doc-classify | `.doc-classify-layout` 전체 |

## Router JS 제거 범위

`js/digitek.js`에서 제거:
- `var Router = { ... }` 블록 전체
- `Router.init()` 호출 (initAll 내부)
- `window.Digitek.Router` 노출
- `reinit()`에서 Router 관련 코드

## Active 메뉴 처리 (Spring Boot 연동 가이드)

Controller에서 `model.addAttribute("currentMenu", "searchlist")` 전달.
Sidebar 템플릿에서 `th:classappend="${currentMenu == 'searchlist'} ? 'sidebar-digitek-active'"` 처리.

## 검증 기준

- `layout/shell.html`을 브라우저로 직접 열면 GNB + Sidebar + 빈 콘텐츠 영역이 보임
- 각 `pages/*/페이지명.html`은 단독으로도 열 수 있음 (layout:decorate는 무시, 콘텐츠만 표시)
- 기존 `pages/content/`, `pages/shell.html` 삭제 후 링크 오류 없음
- `js/digitek.js`에 `Router` 관련 코드 없음
