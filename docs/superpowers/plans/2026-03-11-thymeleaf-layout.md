# Thymeleaf Layout Dialect 전환 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AJAX Router(클라이언트 JS)를 제거하고 Thymeleaf Layout Dialect 기반 서버사이드 렌더링 구조로 전환한다 — GNB/Sidebar는 `fragments/`에 한 번만 정의, 각 페이지는 `layout:decorate`로 콘텐츠만 작성.

**Architecture:** `layout/shell.html`이 GNB+Sidebar+콘텐츠 자리를 정의하고, `fragments/gnb.html`·`fragments/sidebar.html`을 `th:replace`로 포함한다. 각 페이지 템플릿은 `layout:decorate="~{layout/shell}"`을 선언하고 `layout:fragment="content"` 안에 콘텐츠만 작성한다. 페이지 이동은 일반 `<a>` 링크 + Spring Boot 전체 페이지 렌더링으로 동작한다.

**Tech Stack:** HTML, Thymeleaf Layout Dialect, Vanilla JS (Router 모듈 제거)

---

## 파일 변경 목록

| 액션 | 파일 |
|------|------|
| 생성 | `layout/shell.html` |
| 생성 | `fragments/gnb.html` |
| 생성 | `fragments/sidebar.html` |
| 생성 (변환) | `pages/manage/main.html` ← `main-full-page.html` |
| 생성 (변환) | `pages/search/searchlist.html` ← `searchlist-full-page.html` |
| 생성 (변환) | `pages/search/searchsplit.html` ← `searchsplit-full-page.html` |
| 생성 (변환) | `pages/detail/pms.html` ← `pms-full-page.html` |
| 생성 (변환) | `pages/detail/requestregister.html` ← `requestregister-full-page.html` |
| 생성 (변환) | `pages/detail/doc-create.html` ← `doc-create-full-page.html` |
| 생성 (변환) | `pages/detail/ecr-review.html` ← `ecr-review-full-page.html` |
| 생성 (변환) | `pages/manage/group-manage.html` ← `group-manage-full-page.html` |
| 생성 (변환) | `pages/manage/code-manage.html` ← `code-manage-full-page.html` |
| 생성 (변환) | `pages/manage/doc-classify.html` ← `doc-classify-full-page.html` |
| 수정 | `js/digitek.js` — Router 제거, Sidebar auto-expand 추가 |
| 삭제 | `pages/shell.html` |
| 삭제 | `pages/content/*.html` (10개) |
| 삭제 | `pages/*/\*-full-page.html` (10개) |

---

## Chunk 1: Fragment 파일 + 레이아웃 생성

### Task 1: `fragments/gnb.html` 생성

**Files:**
- Create: `fragments/gnb.html`

GNB HTML을 `pages/shell.html` 288~330행에서 추출하여 `th:fragment="gnb"` 적용.

- [ ] **Step 1: `fragments/` 디렉토리 생성**

  ```bash
  mkdir -p fragments
  ```

- [ ] **Step 2: `fragments/gnb.html` 작성**

  ```html
  <!DOCTYPE html>
  <html lang="ko" xmlns:th="http://www.thymeleaf.org">
  <body>
  <!-- GNB 프래그먼트 -->
  <header th:fragment="gnb" class="gnb-digitek">
    <!-- [커스텀] 검색 인풋: 필요 시 주석 해제
    <div class="gnb-digitek-search-wrap">
      <input type="text" class="gnb-digitek-search-field" placeholder="검색어를 입력해 주세요" aria-label="검색어 입력" />
      <button class="btn-digitek-icon-plain" aria-label="검색">
        <i class="dicon dicon-search-lg icon-digitek-24 text-digitek-secondary"></i>
      </button>
    </div>
    -->
    <div class="gnb-digitek-right">
      <div class="gnb-digitek-icon-group">
        <button class="gnb-digitek-icon-btn" aria-label="알림">
          <i class="dicon dicon-bell icon-digitek-24 text-digitek-secondary"></i>
          <span class="gnb-digitek-badge" th:text="${notificationCount} ?: '0'">5</span>
        </button>
        <button class="gnb-digitek-icon-btn" aria-label="메일">
          <i class="dicon dicon-mail icon-digitek-24 text-digitek-secondary"></i>
          <span class="gnb-digitek-badge" th:text="${mailCount} ?: '0'">12</span>
        </button>
      </div>

      <div class="gnb-digitek-locale-wrap">
        <button class="gnb-digitek-locale-btn" aria-label="언어 선택" aria-haspopup="menu" aria-expanded="false">
          KO
          <i class="dicon dicon-chevron-down-sm" style="width: 12px; height: 12px;" aria-hidden="true"></i>
        </button>
        <div class="gnb-digitek-locale-dropdown" role="menu">
          <button class="gnb-digitek-locale-option active" role="menuitem">KO</button>
          <button class="gnb-digitek-locale-option" role="menuitem">EN</button>
        </div>
      </div>

      <div class="gnb-digitek-profile" role="button" tabindex="0" aria-label="프로필 메뉴" aria-haspopup="menu" aria-expanded="false">
        <div class="gnb-digitek-avatar">
          <img th:src="@{/images/icons/avatar.png}" width="32" height="32" alt="" aria-hidden="true" style="border-radius: 50%;">
        </div>
        <span class="gnb-digitek-profile-name" th:text="${session.userName} ?: '사용자 이름'">사용자 이름</span>
      </div>
    </div>
  </header>
  </body>
  </html>
  ```

- [ ] **Step 3: 확인**

  ```bash
  grep 'th:fragment="gnb"' fragments/gnb.html
  ```
  Expected: `th:fragment="gnb"` 포함 1줄

---

### Task 2: `fragments/sidebar.html` 생성

**Files:**
- Create: `fragments/sidebar.html`

`pages/shell.html` 19~283행 Sidebar HTML에서 추출. 변경 사항:
- `href="/pages/content/..."` → `th:href="@{/실제URL}"` (Spring Boot URL 플레이스홀더 사용)
- `data-route="..."` 속성 전부 제거
- 리프 메뉴에 `th:classappend="${currentMenu == 'xxx'} ? 'sidebar-digitek-active'"` 추가
- `img src` → `th:src="@{/...}"`

> **currentMenu 값 → 페이지 매핑:**
> `main`(결재관리/부품관리/도면관리/대시보드), `searchlist`(문서관리), `searchsplit`(설계변경), `pms`(프로젝트등록/MyTask), `requestregister`(시작의뢰등록/시작결과등록/MPR등록), `doc-create`(문서등록), `ecr-review`(ECR검토), `group-manage`(그룹관리), `code-manage`(코드관리), `doc-classify`(문서분류관리)

- [ ] **Step 1: `fragments/sidebar.html` 작성**

  ```html
  <!DOCTYPE html>
  <html lang="ko" xmlns:th="http://www.thymeleaf.org">
  <body>
  <!-- Sidebar 프래그먼트 -->
  <div th:fragment="sidebar" class="sidebar-digitek-container">
    <nav class="sidebar-digitek sidebar-digitek-expanded" aria-label="메인 메뉴">

      <!-- 헤더 (로고 + 접기 버튼) -->
      <div class="sidebar-digitek-header">
        <div class="sidebar-digitek-logo sidebar-logo-full">
          <img th:src="@{/images/icons/logo.png}" width="108" height="52" alt="HLKlemove 로고" aria-hidden="true">
        </div>
        <div class="sidebar-digitek-logo sidebar-logo-collapsed">
          <img th:src="@{/images/icons/logo-collapsed.png}" width="54" height="26" alt="HL 로고" aria-hidden="true">
        </div>
        <button class="sidebar-collapse-handle sidebar-toggle-btn" aria-label="사이드바 접기/펼치기">
          <i class="dicon dicon-chevron-left icon-digitek-20" aria-hidden="true"></i>
        </button>
      </div>

      <!-- 메뉴 영역 -->
      <div class="flex-grow-1 overflow-auto sidebar-digitek-menu-area">
        <ul class="nav flex-column">

          <!-- 결재 관리 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/approve/manage}"
               th:classappend="${currentMenu == 'main'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-file-blank icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">결재 관리</span>
              </span>
            </a>
          </li>

          <!-- 문서 관리 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/doc/search}"
               th:classappend="${currentMenu == 'searchlist'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-folder icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">문서 관리</span>
              </span>
            </a>
          </li>

          <!-- 부품 관리 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/part/manage}"
               th:classappend="${currentMenu == 'partManage'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-settings icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">부품 관리</span>
              </span>
            </a>
          </li>

          <!-- 도면 관리 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/draw/manage}"
               th:classappend="${currentMenu == 'drawManage'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-folder-edit icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">도면 관리</span>
              </span>
            </a>
          </li>

          <!-- PMS (서브메뉴 토글) -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               href="#" aria-expanded="false"
               th:classappend="${currentMenuGroup == 'pms'} ? 'sidebar-digitek-active sidebar-digitek-parent-open'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-layer icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">PMS</span>
              </span>
              <span class="sidebar-digitek-chevron"
                    th:classappend="${currentMenuGroup == 'pms'} ? 'sidebar-digitek-chevron-open'">
                <i class="dicon dicon-chevron-down icon-digitek-20"></i>
              </span>
            </a>
            <ul class="nav flex-column sidebar-digitek-submenu" aria-label="PMS 하위 메뉴"
                th:style="${currentMenuGroup == 'pms'} ? 'max-height: 144px;' : 'max-height: 0;'">
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/pms/project}"
                   th:classappend="${currentMenu == 'pmsProjectSearch'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
                  <span class="sidebar-digitek-menu-label">프로젝트 검색</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/pms/project/new}"
                   th:classappend="${currentMenu == 'pms'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
                  <span class="sidebar-digitek-menu-label">프로젝트 등록</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/pms/task}"
                   th:classappend="${currentMenu == 'pmsTask'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
                  <span class="sidebar-digitek-menu-label">My Task</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/pms/issue}"
                   th:classappend="${currentMenu == 'pmsIssue'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
                  <span class="sidebar-digitek-menu-label">이슈 검색</span>
                </a>
              </li>
            </ul>
          </li>

          <!-- 설계 변경 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/ecr/list}"
               th:classappend="${currentMenu == 'searchsplit'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-reload icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">설계 변경</span>
              </span>
            </a>
          </li>

          <!-- 시험/시작/해석 (서브메뉴 토글) -->
          <!-- currentMenuGroup: 'test'(시험 직속), 'start'(시작 3레벨) 모두 이 그룹을 열어야 함 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               href="#" aria-expanded="false"
               th:classappend="${currentMenuGroup == 'test' or currentMenuGroup == 'start'} ? 'sidebar-digitek-active sidebar-digitek-parent-open'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-chart-bar icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">시험/시작/해석</span>
              </span>
              <span class="sidebar-digitek-chevron"
                    th:classappend="${currentMenuGroup == 'test' or currentMenuGroup == 'start'} ? 'sidebar-digitek-chevron-open'">
                <i class="dicon dicon-chevron-down icon-digitek-20"></i>
              </span>
            </a>
            <ul class="nav flex-column sidebar-digitek-submenu" aria-label="시험/시작/해석 하위 메뉴"
                th:style="${currentMenuGroup == 'test' or currentMenuGroup == 'start'} ? 'max-height: 216px;' : 'max-height: 0;'">
              <!-- 시험 (리프) -->
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/test/list}"
                   th:classappend="${currentMenu == 'testList'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-icon-label">
                    <i class="dicon dicon-flask icon-digitek-20"></i>
                    <span class="sidebar-digitek-menu-label">시험</span>
                  </span>
                </a>
              </li>
              <!-- 시작 (3레벨 토글) -->
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   href="#" aria-expanded="false"
                   th:classappend="${currentMenuGroup == 'start'} ? 'sidebar-digitek-active sidebar-digitek-parent-open'">
                  <span class="sidebar-digitek-icon-label">
                    <i class="dicon dicon-start-arrow icon-digitek-20"></i>
                    <span class="sidebar-digitek-menu-label">시작</span>
                  </span>
                  <span class="sidebar-digitek-chevron"
                        th:classappend="${currentMenuGroup == 'start'} ? 'sidebar-digitek-chevron-open'">
                    <i class="dicon dicon-chevron-down icon-digitek-16"></i>
                  </span>
                </a>
                <ul class="nav flex-column sidebar-digitek-sub-submenu" aria-label="시작 하위 메뉴"
                    th:style="${currentMenuGroup == 'start'} ? 'max-height: 180px;' : 'max-height: 0;'">
                  <li class="nav-item">
                    <a class="sidebar-digitek-sub-submenu-item"
                       th:href="@{/start/search}"
                       th:classappend="${currentMenu == 'startSearch'} ? 'sidebar-digitek-active'">
                      <span class="sidebar-digitek-menu-label">시작 검색</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="sidebar-digitek-sub-submenu-item"
                       th:href="@{/start/request/new}"
                       th:classappend="${currentMenu == 'requestregister'} ? 'sidebar-digitek-active'">
                      <span class="sidebar-digitek-menu-label">시작 의뢰 등록</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="sidebar-digitek-sub-submenu-item"
                       th:href="@{/start/result/new}"
                       th:classappend="${currentMenu == 'requestregister'} ? 'sidebar-digitek-active'">
                      <span class="sidebar-digitek-menu-label">시작 결과 등록</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="sidebar-digitek-sub-submenu-item"
                       th:href="@{/mpr/search}"
                       th:classappend="${currentMenu == 'mprSearch'} ? 'sidebar-digitek-active'">
                      <span class="sidebar-digitek-menu-label">MPR 검색</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="sidebar-digitek-sub-submenu-item"
                       th:href="@{/mpr/new}"
                       th:classappend="${currentMenu == 'mprNew'} ? 'sidebar-digitek-active'">
                      <span class="sidebar-digitek-menu-label">MPR 등록</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <!-- 문서 등록 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/doc/create}"
               th:classappend="${currentMenu == 'doc-create'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-file-edit icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">문서 등록</span>
              </span>
            </a>
          </li>

          <!-- ECR 검토 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/ecr/review}"
               th:classappend="${currentMenu == 'ecr-review'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-reload icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">ECR 검토</span>
              </span>
            </a>
          </li>

          <!-- 관리 (서브메뉴 토글) -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               href="#" aria-expanded="false"
               th:classappend="${currentMenuGroup == 'admin'} ? 'sidebar-digitek-active sidebar-digitek-parent-open'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-settings icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">관리</span>
              </span>
              <span class="sidebar-digitek-chevron"
                    th:classappend="${currentMenuGroup == 'admin'} ? 'sidebar-digitek-chevron-open'">
                <i class="dicon dicon-chevron-down icon-digitek-20"></i>
              </span>
            </a>
            <ul class="nav flex-column sidebar-digitek-submenu" aria-label="관리 하위 메뉴"
                th:style="${currentMenuGroup == 'admin'} ? 'max-height: 108px;' : 'max-height: 0;'">
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/admin/group}"
                   th:classappend="${currentMenu == 'group-manage'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
                  <span class="sidebar-digitek-menu-label">그룹 관리</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/admin/code}"
                   th:classappend="${currentMenu == 'code-manage'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
                  <span class="sidebar-digitek-menu-label">코드 관리</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="sidebar-digitek-submenu-item"
                   th:href="@{/admin/doc-classify}"
                   th:classappend="${currentMenu == 'doc-classify'} ? 'sidebar-digitek-active'">
                  <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
                  <span class="sidebar-digitek-menu-label">문서 분류 관리</span>
                </a>
              </li>
            </ul>
          </li>

          <!-- 대시보드 -->
          <li class="nav-item">
            <a class="sidebar-digitek-menu-item"
               th:href="@{/dashboard}"
               th:classappend="${currentMenu == 'dashboard'} ? 'sidebar-digitek-active'">
              <span class="sidebar-digitek-icon-label">
                <i class="dicon dicon-chart-pie icon-digitek-20"></i>
                <span class="sidebar-digitek-menu-label">대시보드</span>
              </span>
            </a>
          </li>

        </ul>
      </div>
    </nav>
  </div>
  </body>
  </html>
  ```

- [ ] **Step 2: 확인**

  ```bash
  grep 'th:fragment="sidebar"' fragments/sidebar.html
  grep -c 'data-route' fragments/sidebar.html
  ```
  Expected: `th:fragment="sidebar"` 1줄, `data-route` 0줄

---

### Task 3: `layout/shell.html` 생성

**Files:**
- Create: `layout/shell.html`

- [ ] **Step 1: `layout/` 디렉토리 생성**

  ```bash
  mkdir -p layout
  ```

- [ ] **Step 2: `layout/shell.html` 작성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title layout:title-pattern="$CONTENT_TITLE - Digitek PLM">Digitek PLM</title>
    <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
    <link rel="stylesheet" th:href="@{/css/digitek.css}">
    <link rel="stylesheet" th:href="@{/css/icons.css}">
    <style>body { margin: 0; background: #fff; }</style>
    <th:block layout:fragment="head-extra"></th:block>
  </head>
  <body>
  <div class="layout-digitek">
    <th:block th:replace="~{fragments/sidebar :: sidebar}"></th:block>
    <div class="layout-digitek-main-area">
      <th:block th:replace="~{fragments/gnb :: gnb}"></th:block>
      <div id="page-content" class="flex-grow-1 overflow-y-digitek-auto"
           style="background: var(--digitek-bg-gray);">
        <layout:fragment name="content">
          <!-- 각 페이지 콘텐츠가 여기에 주입됩니다 -->
        </layout:fragment>
      </div>
    </div>
  </div>
  <script th:src="@{/js/jquery.slim.min.js}"></script>
  <script th:src="@{/js/bootstrap.bundle.min.js}"></script>
  <script th:src="@{/js/digitek.js}"></script>
  </body>
  </html>
  ```

- [ ] **Step 3: 확인**

  ```bash
  grep 'layout:fragment="content"' layout/shell.html
  grep 'th:replace.*sidebar' layout/shell.html
  grep 'th:replace.*gnb' layout/shell.html
  ```
  Expected: 각 1줄씩

- [ ] **Step 4: Commit**

  ```bash
  git add fragments/gnb.html fragments/sidebar.html layout/shell.html
  git commit -m "feat: add Thymeleaf layout shell and fragments (gnb, sidebar)"
  ```

---

## Chunk 2: 페이지 템플릿 전환 (10개)

각 페이지는 동일한 패턴으로 전환한다:
1. 새 파일 생성 (`layout:decorate` 헤더 + `layout:fragment="content"` 안에 콘텐츠)
2. 콘텐츠는 기존 `*-full-page.html`의 `id="page-content"` div **내부** HTML을 그대로 복사
3. 기존 `*-full-page.html` 삭제

> **보일러플레이트 헤더 (모든 페이지 공통):**
> ```html
> <!DOCTYPE html>
> <html lang="ko"
>       xmlns:th="http://www.thymeleaf.org"
>       xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
>       layout:decorate="~{layout/shell}">
> <head>
>   <title>페이지제목</title>
> </head>
> <body>
>   <th:block layout:fragment="content">
>     <!-- 콘텐츠 여기 -->
>   </th:block>
> </body>
> </html>
> ```

---

### Task 4: `pages/manage/main.html` 전환

**Files:**
- Create: `pages/manage/main.html`
- Delete: `pages/manage/main-full-page.html`

콘텐츠 소스: `pages/manage/main-full-page.html` 277행 `<div id="page-content"...>` 내부 ~ 301행

- [ ] **Step 1: `pages/manage/main.html` 작성**

  `pages/manage/main-full-page.html`을 열어 `id="page-content"` div(276행)의 **내부 내용**(277~301행)을 복사하여 아래 템플릿으로 작성:

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>메인</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/manage/main-full-page.html id="page-content" 내부 복사 -->
      <div class="main-page-grid">
        <!-- 1행: 3등분 (각 span 2) -->
        <div class="main-page-area" style="grid-column: span 2; height: 200px;">
          <!-- [커스텀] 영역 1 내용 -->
        </div>
        <div class="main-page-area" style="grid-column: span 2; height: 200px;">
          <!-- [커스텀] 영역 2 내용 -->
        </div>
        <div class="main-page-area" style="grid-column: span 2; height: 200px;">
          <!-- [커스텀] 영역 3 내용 -->
        </div>
        <!-- 2행: 2등분 (각 span 3) -->
        <div class="main-page-area" style="grid-column: span 3; height: 250px;">
          <!-- [커스텀] 영역 4 내용 -->
        </div>
        <div class="main-page-area" style="grid-column: span 3; height: 250px;">
          <!-- [커스텀] 영역 5 내용 -->
        </div>
        <!-- 3행: 전체 너비 (span 6) -->
        <div class="main-page-area" style="grid-column: span 6; height: 200px;">
          <!-- [커스텀] 영역 6 내용 -->
        </div>
      </div>
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/manage/main-full-page.html
  ```

- [ ] **Step 3: 확인**

  ```bash
  grep 'layout:decorate' pages/manage/main.html
  grep 'layout:fragment="content"' pages/manage/main.html
  ls pages/manage/main-full-page.html 2>/dev/null && echo "삭제 안됨" || echo "삭제 완료"
  ```

---

### Task 5: `pages/search/searchlist.html` 전환

**Files:**
- Create: `pages/search/searchlist.html`
- Delete: `pages/search/searchlist-full-page.html`

콘텐츠 소스: `pages/search/searchlist-full-page.html` 282행~789행 (`id="page-content"` 내부)

- [ ] **Step 1: 새 파일 생성**

  `pages/search/searchlist-full-page.html`을 열어 281행 `<div id="page-content"...>` **바로 다음 줄**부터 파일 끝 `</div>` 직전(</div></div></div> 중 page-content를 닫는 것)까지 내용을 복사.

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>문서 검색</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/search/searchlist-full-page.html id="page-content" 내부 복사 (282행~) -->
    </th:block>
  </body>
  </html>
  ```

  > **힌트:** `id="page-content"` div 내부는 `<div class="digitek-search-page">` 로 시작한다.
  > 복사 범위: `searchlist-full-page.html` 282행부터 `<script src=` 태그 이전 `</div>` 까지.

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/search/searchlist-full-page.html
  ```

- [ ] **Step 3: 확인**

  ```bash
  grep 'layout:decorate' pages/search/searchlist.html
  grep 'digitek-search-page' pages/search/searchlist.html
  ```

---

### Task 6: `pages/search/searchsplit.html` 전환

**Files:**
- Create: `pages/search/searchsplit.html`
- Delete: `pages/search/searchsplit-full-page.html`

콘텐츠 소스: `pages/search/searchsplit-full-page.html` 284행~ (내부 루트: `<div class="digitek-split-body">`)

> **주의:** `searchsplit` 페이지의 `id="page-content"` div는 `class="flex-grow-1 d-flex overflow-digitek-hidden"` 이다. 이 div **내부** 콘텐츠(`.digitek-split-body` div 전체)만 복사.

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>설계 변경</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/search/searchsplit-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="digitek-split-body"> -->
    </th:block>
  </body>
  </html>
  ```

  > **레이아웃 주의:** `searchsplit` 콘텐츠는 좌우 분할 레이아웃이다. `layout/shell.html`의 `id="page-content"` div가 `overflow-y-digitek-auto`인데, searchsplit은 `d-flex overflow-digitek-hidden`이 필요하다.
  > 해결: `layout:fragment="content"` 안의 루트 div(`.digitek-split-body`)에 `style="display:flex; height:100%; overflow:hidden;"` 추가하거나, `layout/shell.html`의 `id="page-content"`에서 스타일을 제거하고 각 페이지가 관리하게 한다. **이 프로토타입에서는 `.digitek-split-body` 자체에 필요한 스타일이 이미 있으므로 그대로 복사하면 된다.**

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/search/searchsplit-full-page.html
  ```

---

### Task 7: `pages/detail/pms.html` 전환

**Files:**
- Create: `pages/detail/pms.html`
- Delete: `pages/detail/pms-full-page.html`

콘텐츠 소스: `pages/detail/pms-full-page.html` 277행~ (내부 루트: `<div class="digitek-dashboard-page">`)

> **주의:** `pms` 페이지의 `id="page-content"` div는 `style="overflow-y: auto; background: #fff;"` 를 갖는다. 콘텐츠 내부(`.digitek-dashboard-page`)를 복사할 때 이 스타일은 layout이 제공하므로 fragment에는 포함하지 않는다.

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>PMS 대시보드</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/detail/pms-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="digitek-dashboard-page"> -->
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/detail/pms-full-page.html
  ```

---

### Task 8: `pages/detail/requestregister.html` 전환

**Files:**
- Create: `pages/detail/requestregister.html`
- Delete: `pages/detail/requestregister-full-page.html`

콘텐츠 소스: `pages/detail/requestregister-full-page.html` 277행~ (내부 루트: `<div class="digitek-page-header">`)

> **주의:** `requestregister`의 `id="page-content"` div는 `class="flex-grow-1 digitek-form-page overflow-y-digitek-auto"`이다. `digitek-form-page` 클래스가 CSS 레이아웃에 영향을 준다면, fragment 최상위 div에 `class="digitek-form-page"` 추가 필요. 기존 내부 내용을 확인하여 최상위 래퍼를 보존한다.

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>시작 의뢰 등록</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/detail/requestregister-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="digitek-page-header"> -->
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/detail/requestregister-full-page.html
  ```

---

### Task 9: `pages/detail/doc-create.html` 전환

**Files:**
- Create: `pages/detail/doc-create.html`
- Delete: `pages/detail/doc-create-full-page.html`

콘텐츠 소스: `pages/detail/doc-create-full-page.html` 278행~ (내부 루트: `<div class="doc-create-digitek-header">`)

> **주의:** `doc-create`의 `id="page-content"` div는 `class="flex-grow-1 doc-create-digitek overflow-y-digitek-auto"`이다. `doc-create-digitek` 클래스가 내부 레이아웃에 영향을 준다면 fragment 최상위에 `<div class="doc-create-digitek">` 래퍼를 추가한다. 내용을 확인 후 결정.

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>문서 등록</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/detail/doc-create-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="doc-create-digitek-header"> -->
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/detail/doc-create-full-page.html
  ```

---

### Task 10: `pages/detail/ecr-review.html` 전환

**Files:**
- Create: `pages/detail/ecr-review.html`
- Delete: `pages/detail/ecr-review-full-page.html`

콘텐츠 소스: `pages/detail/ecr-review-full-page.html` 278행~ (내부 루트: `<div class="ecr-review-layout">`)

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>ECR 검토</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/detail/ecr-review-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="ecr-review-layout"> -->
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/detail/ecr-review-full-page.html
  ```

---

### Task 11: `pages/manage/group-manage.html` 전환

**Files:**
- Create: `pages/manage/group-manage.html`
- Delete: `pages/manage/group-manage-full-page.html`

콘텐츠 소스: `pages/manage/group-manage-full-page.html` 277행~ (내부 루트: `<div class="group-manage-layout">`)

> **주의:** `group-manage`의 `id="page-content"` div는 `class="flex-grow-1 d-flex flex-column overflow-hidden"`이다. fragment 최상위 div(`.group-manage-layout`)에 이 레이아웃 특성이 이미 있는지 확인.

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>그룹 관리</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/manage/group-manage-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="group-manage-layout"> -->
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/manage/group-manage-full-page.html
  ```

---

### Task 12: `pages/manage/code-manage.html` 전환

**Files:**
- Create: `pages/manage/code-manage.html`
- Delete: `pages/manage/code-manage-full-page.html`

콘텐츠 소스: `pages/manage/code-manage-full-page.html` 277행~ (내부 루트: `<div class="code-manage-layout">`)

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>코드 관리</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/manage/code-manage-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="code-manage-layout"> -->
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/manage/code-manage-full-page.html
  ```

---

### Task 13: `pages/manage/doc-classify.html` 전환

**Files:**
- Create: `pages/manage/doc-classify.html`
- Delete: `pages/manage/doc-classify-full-page.html`

콘텐츠 소스: `pages/manage/doc-classify-full-page.html` 277행~ (내부 루트: `<div class="doc-classify-layout">`)

- [ ] **Step 1: 새 파일 생성**

  ```html
  <!DOCTYPE html>
  <html lang="ko"
        xmlns:th="http://www.thymeleaf.org"
        xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
        layout:decorate="~{layout/shell}">
  <head>
    <title>문서 분류 관리</title>
  </head>
  <body>
    <th:block layout:fragment="content">
      <!-- pages/manage/doc-classify-full-page.html id="page-content" 내부 복사 -->
      <!-- 내부 루트: <div class="doc-classify-layout"> -->
    </th:block>
  </body>
  </html>
  ```

- [ ] **Step 2: 기존 파일 삭제**

  ```bash
  rm pages/manage/doc-classify-full-page.html
  ```

- [ ] **Step 3: 페이지 전환 완료 커밋**

  ```bash
  git add pages/manage/ pages/search/ pages/detail/
  git commit -m "feat: convert all full-page HTML to Thymeleaf layout:decorate templates"
  ```

---

## Chunk 3: JS 정리 + 파일 삭제

### Task 14: `js/digitek.js` — Router 제거 + Sidebar auto-expand 추가

**Files:**
- Modify: `js/digitek.js`

**변경 1: Router 모듈 전체 제거**

`js/digitek.js` 1629행~1762행의 Router 블록 전체를 삭제:
```
  /* ================================================================== */
  /*  Router — AJAX 콘텐츠 교체 + history.pushState                      */
  /* ================================================================== */

  var Router = {
    ...
  };
```

**변경 2: `initAll()` 에서 `Router.init()` 제거**

현재 (2011행):
```javascript
  function initAll() {
    Router.init();      // 가장 먼저 초기화 (shell 페이지에서만 활성화됨)
    Sidebar.init();
```

변경 후:
```javascript
  function initAll() {
    Sidebar.init();
```

**변경 3: `window.Digitek` 에서 `Router`·`reinit` 제거 및 정리**

현재 (2035~2059행):
```javascript
  window.Digitek = {
    reinit: function () {
      TextEditor.init();
      Select.init();
    },
    Router: Router,
    Accordion: Accordion,
    ...
  };
```

변경 후 (`reinit` 및 `Router` 제거):
```javascript
  window.Digitek = {
    Accordion: Accordion,
    TabButton: TabButton,
    Sidebar: Sidebar,
    FileUpload: FileUpload,
    GNBSearch: GNBSearch,
    Select: Select,
    DateSelect: DateSelect,
    TextEditor: TextEditor,
    Locale: Locale,
    GanttResizer: GanttResizer,
    DraggableTable: DraggableTable,
    SearchList: SearchList,
    SearchSplit: SearchSplit,
  };
```

**변경 4: `Sidebar.init()` 끝에 active 서브메뉴 자동 열기 추가**

`Sidebar.init()` 함수(324행 직전, `_toggleCollapse` 바로 앞)에 아래 코드 추가:

```javascript
      // 페이지 로드 시: active 메뉴가 포함된 서브메뉴 자동 열기
      // (Thymeleaf가 서버에서 sidebar-digitek-active를 렌더링한 경우)
      document.querySelectorAll(".sidebar-digitek-submenu").forEach(function (submenu) {
        if (!submenu.querySelector(".sidebar-digitek-active")) return;
        var count = submenu.querySelectorAll(":scope > .nav-item").length;
        submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
        var parentItem = submenu.previousElementSibling;
        if (parentItem) {
          parentItem.setAttribute("aria-expanded", "true");
          parentItem.classList.add("sidebar-digitek-parent-open");
          var chev = parentItem.querySelector(".sidebar-digitek-chevron");
          if (chev) chev.classList.add("sidebar-digitek-chevron-open");
        }
      });
      document.querySelectorAll(".sidebar-digitek-sub-submenu").forEach(function (submenu) {
        if (!submenu.querySelector(".sidebar-digitek-active")) return;
        var count = submenu.querySelectorAll(":scope > .nav-item").length;
        submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
        var parentItem = submenu.previousElementSibling;
        if (parentItem) {
          parentItem.setAttribute("aria-expanded", "true");
          var chev = parentItem.querySelector(".sidebar-digitek-chevron");
          if (chev) chev.classList.add("sidebar-digitek-chevron-open");
        }
        // 부모 서브메뉴도 열기 (note: _recalcParentHeight의 nav 파라미터는 함수 내부에서 미사용이므로 인라인으로 처리)
        var parentSubmenu = submenu.closest(".sidebar-digitek-submenu");
        if (parentSubmenu) {
          var count3 = parentSubmenu.querySelectorAll(":scope > .nav-item").length;
          parentSubmenu.style.maxHeight = (count3 * getSidebarItemH()) + "px";
          var grandParentItem = parentSubmenu.previousElementSibling;
          if (grandParentItem) {
            grandParentItem.setAttribute("aria-expanded", "true");
            grandParentItem.classList.add("sidebar-digitek-parent-open");
            var chev2 = grandParentItem.querySelector(".sidebar-digitek-chevron");
            if (chev2) chev2.classList.add("sidebar-digitek-chevron-open");
          }
        }
      });
```

- [ ] **Step 1: Router 블록 제거 (1629~1762행)**

  `js/digitek.js`에서 `/* Router — AJAX ...` 주석부터 `};` (1762행)까지 삭제.

- [ ] **Step 2: `initAll()`에서 `Router.init();` 한 줄 제거**

- [ ] **Step 3: `window.Digitek`에서 `reinit`, `Router` 제거**

- [ ] **Step 4: `Sidebar.init()` 끝 (324행 직전)에 auto-expand 코드 추가**

- [ ] **Step 5: 확인**

  ```bash
  grep -c 'var Router' js/digitek.js
  grep -c 'Router.init()' js/digitek.js
  grep -c 'reinit' js/digitek.js
  grep -c 'sidebar-digitek-active.*auto' js/digitek.js
  ```
  Expected: 모두 `0`, `0`, `0`, (auto-expand 코드 1줄 이상)

---

### Task 15: 불필요 파일 삭제 + 최종 검증

**Files:**
- Delete: `pages/shell.html`
- Delete: `pages/content/` (디렉토리 전체)

- [ ] **Step 1: AJAX용 파일 삭제**

  ```bash
  rm pages/shell.html
  rm -rf pages/content/
  ```

- [ ] **Step 2: 새 파일 구조 검증**

  ```bash
  ls layout/
  ls fragments/
  ls pages/manage/
  ls pages/search/
  ls pages/detail/
  ```

  Expected:
  ```
  layout/: shell.html
  fragments/: gnb.html  sidebar.html
  pages/manage/: main.html  code-manage.html  doc-classify.html  group-manage.html
  pages/search/: searchlist.html  searchsplit.html
  pages/detail/: doc-create.html  ecr-review.html  pms.html  requestregister.html
  ```

- [ ] **Step 3: `*-full-page.html` 없음 확인**

  ```bash
  find pages/ -name '*-full-page.html'
  ```
  Expected: 출력 없음

- [ ] **Step 4: `data-route` 잔존 없음 확인**

  ```bash
  grep -r 'data-route' fragments/ pages/ layout/
  ```
  Expected: 출력 없음

- [ ] **Step 5: `Router` JS 완전 제거 확인**

  ```bash
  grep -n 'var Router\|Router\.init\|Router\.navigate' js/digitek.js
  ```
  Expected: 출력 없음

- [ ] **Step 6: 최종 커밋**

  ```bash
  git add -A
  git commit -m "feat: migrate to Thymeleaf Layout Dialect — remove AJAX Router, add fragments and layout"
  ```

---

## Spring Boot 개발자 인계 참고사항

### 의존성 (build.gradle)
```groovy
implementation 'nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect'
```

### currentMenu / currentMenuGroup 전달 예시
```java
@GetMapping("/doc/search")
public String docSearch(Model model) {
    model.addAttribute("currentMenu", "searchlist");
    return "pages/search/searchlist";
}

@GetMapping("/pms/project/new")
public String pmsNew(Model model) {
    model.addAttribute("currentMenu", "pms");
    model.addAttribute("currentMenuGroup", "pms");
    return "pages/detail/pms";
}

@GetMapping("/start/request/new")
public String startRequest(Model model) {
    model.addAttribute("currentMenu", "requestregister");
    // currentMenuGroup = "start" → 시험/시작/해석 그룹 + 시작 서브 모두 자동 열림
    model.addAttribute("currentMenuGroup", "start");
    return "pages/detail/requestregister";
}
```

### 템플릿 파일 위치
```
src/main/resources/
├── templates/
│   ├── layout/shell.html
│   ├── fragments/
│   │   ├── gnb.html
│   │   └── sidebar.html
│   └── pages/
│       ├── manage/
│       ├── search/
│       └── detail/
└── static/
    ├── css/
    ├── js/
    └── images/
```
