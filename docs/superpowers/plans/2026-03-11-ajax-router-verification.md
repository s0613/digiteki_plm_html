# AJAX Router 전체 페이지 적용 검증 Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모든 전체 페이지에 AJAX 라우팅이 올바르게 적용되었는지 정적 검사 + 브라우저 테스트로 검증하고, 누락된 항목을 수정한다.

**Architecture:** 정적 검사(grep)로 `id="page-content"` 및 `data-route` 누락을 확인하고, Playwright로 shell.html에서 각 콘텐츠 프래그먼트가 GNB/Sidebar를 유지한 채 정상 로드되는지 브라우저 자동화 검증한다.

**Tech Stack:** Bash(grep), Python Playwright, HTML

---

## 현재 상태 요약

| 항목 | 상태 |
|------|------|
| `id="page-content"` — 전체 페이지 10개 | ✅ 모두 적용 |
| `pages/content/*.html` 프래그먼트 10개 | ✅ 모두 존재 |
| shell.html 잔여 상대경로 1건 (`시작 검색`) | ❌ 미수정 |
| shell.html 누락 메뉴 (doc-create, ecr-review, group-manage, code-manage, doc-classify) | ❌ 링크 없음 |

---

## Chunk 1: shell.html 수정

### Task 1: 잔여 상대경로 수정

**Files:**
- Modify: `pages/shell.html:177-178`

현재 (잘못된 상대 경로):
```html
<a class="sidebar-digitek-sub-submenu-item" href="content/searchlist.html"
   data-route="content/searchlist.html">
  <span class="sidebar-digitek-menu-label">시작 검색</span>
</a>
```

수정 후 (절대 경로):
```html
<a class="sidebar-digitek-sub-submenu-item" href="/pages/content/searchlist.html"
   data-route="/pages/content/searchlist.html">
  <span class="sidebar-digitek-menu-label">시작 검색</span>
</a>
```

- [ ] **Step 1: shell.html 177-178번째 줄 수정**

  `href="content/searchlist.html"` 및 `data-route="content/searchlist.html"` →
  `/pages/content/searchlist.html` 로 변경.

- [ ] **Step 2: 수정 확인**

  ```bash
  grep -n 'data-route=' pages/shell.html | grep -v '/pages/content/'
  ```
  Expected: 주석 라인 외 결과 없음

---

### Task 2: 누락 메뉴 항목 추가

**Files:**
- Modify: `pages/shell.html` (사이드바 메뉴 영역)

현재 shell.html 메뉴에 없는 페이지들:
- 문서 등록 → `doc-create.html`
- ECR 검토 → `ecr-review.html`
- 그룹 관리 → `group-manage.html`
- 코드 관리 → `code-manage.html`
- 문서 분류 관리 → `doc-classify.html`

`대시보드` 메뉴 아이템 바로 위에 아래 항목들을 추가:

```html
<!-- 문서 등록 (리프 메뉴) -->
<li class="nav-item">
  <a class="sidebar-digitek-menu-item" href="/pages/content/doc-create.html"
     data-route="/pages/content/doc-create.html">
    <span class="sidebar-digitek-icon-label">
      <i class="dicon dicon-file-edit icon-digitek-20"></i>
      <span class="sidebar-digitek-menu-label">문서 등록</span>
    </span>
  </a>
</li>

<!-- ECR 검토 (리프 메뉴) -->
<li class="nav-item">
  <a class="sidebar-digitek-menu-item" href="/pages/content/ecr-review.html"
     data-route="/pages/content/ecr-review.html">
    <span class="sidebar-digitek-icon-label">
      <i class="dicon dicon-reload icon-digitek-20"></i>
      <span class="sidebar-digitek-menu-label">ECR 검토</span>
    </span>
  </a>
</li>

<!-- 관리 (서브메뉴 토글) -->
<li class="nav-item">
  <a class="sidebar-digitek-menu-item" href="#" aria-expanded="false">
    <span class="sidebar-digitek-icon-label">
      <i class="dicon dicon-settings icon-digitek-20"></i>
      <span class="sidebar-digitek-menu-label">관리</span>
    </span>
    <span class="sidebar-digitek-chevron">
      <i class="dicon dicon-chevron-down icon-digitek-20"></i>
    </span>
  </a>
  <ul class="nav flex-column sidebar-digitek-submenu" style="max-height: 0;" aria-label="관리 하위 메뉴">
    <li class="nav-item">
      <a class="sidebar-digitek-submenu-item" href="/pages/content/group-manage.html"
         data-route="/pages/content/group-manage.html">
        <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
        <span class="sidebar-digitek-menu-label">그룹 관리</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="sidebar-digitek-submenu-item" href="/pages/content/code-manage.html"
         data-route="/pages/content/code-manage.html">
        <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
        <span class="sidebar-digitek-menu-label">코드 관리</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="sidebar-digitek-submenu-item" href="/pages/content/doc-classify.html"
         data-route="/pages/content/doc-classify.html">
        <span class="sidebar-digitek-submenu-icon" aria-hidden="true"></span>
        <span class="sidebar-digitek-menu-label">문서 분류 관리</span>
      </a>
    </li>
  </ul>
</li>
```

- [ ] **Step 1: shell.html의 `대시보드` 메뉴 항목 바로 위에 위 코드 삽입**

- [ ] **Step 2: 전체 data-route 개수 확인**

  ```bash
  grep -c 'data-route="/pages/content/' pages/shell.html
  ```
  Expected: `10` (10개 콘텐츠 프래그먼트 모두 커버)

- [ ] **Step 3: Commit**

  ```bash
  git add pages/shell.html
  git commit -m "fix: add missing menu items and fix relative path in shell.html"
  ```

---

## Chunk 2: 정적 검증

### Task 3: 전체 페이지 정적 검사 스크립트 실행

아래 명령을 순서대로 실행하고 모두 통과하는지 확인.

- [ ] **Step 1: 모든 full-page.html에 `id="page-content"` 존재 확인**

  ```bash
  grep -rn 'id="page-content"' pages/ --include="*-full-page.html"
  ```
  Expected: 10줄 출력 (10개 파일 각 1줄)

  ```
  pages/detail/doc-create-full-page.html:...
  pages/detail/ecr-review-full-page.html:...
  pages/detail/pms-full-page.html:...
  pages/detail/requestregister-full-page.html:...
  pages/manage/code-manage-full-page.html:...
  pages/manage/doc-classify-full-page.html:...
  pages/manage/group-manage-full-page.html:...
  pages/manage/main-full-page.html:...
  pages/search/searchlist-full-page.html:...
  pages/search/searchsplit-full-page.html:...
  ```

- [ ] **Step 2: content 프래그먼트 10개 존재 확인**

  ```bash
  ls pages/content/ | wc -l
  ```
  Expected: `10`

- [ ] **Step 3: shell.html에 잘못된 상대경로 없음 확인**

  ```bash
  grep -n 'data-route=' pages/shell.html | grep -v '/pages/content/' | grep -v '<!--'
  ```
  Expected: 출력 없음

- [ ] **Step 4: Router 모듈이 digitek.js에 존재 확인**

  ```bash
  grep -c 'var Router = {' js/digitek.js
  ```
  Expected: `1`

  ```bash
  grep -c 'Router.init()' js/digitek.js
  ```
  Expected: `1`

---

## Chunk 3: 브라우저 자동화 검증

### Task 4: Playwright 전체 페이지 라우팅 검증

**Files:**
- Create: `/tmp/test_all_routes.py`

- [ ] **Step 1: 로컬 서버 실행**

  ```bash
  python3 -m http.server 8090 &
  echo "http://localhost:8090/pages/shell.html"
  ```

- [ ] **Step 2: 검증 스크립트 작성 및 실행**

  `/tmp/test_all_routes.py` 내용:

  ```python
  """
  전체 페이지 AJAX 라우팅 검증
  - shell.html에서 data-route가 있는 모든 링크를 클릭
  - 클릭 후 GNB/Sidebar 유지 확인
  - 콘텐츠 영역이 교체되었는지 확인
  - URL 변경 확인
  """
  from playwright.sync_api import sync_playwright

  BASE = "http://localhost:8090/pages/shell.html"

  # data-route → 로드 후 존재해야 할 콘텐츠 셀렉터
  ROUTES = [
      ("/pages/content/main.html",            ".main-page-grid"),
      ("/pages/content/searchlist.html",      ".digitek-search-page"),
      ("/pages/content/searchsplit.html",     ".digitek-split-body"),
      ("/pages/content/pms.html",             ".digitek-dashboard-page"),
      ("/pages/content/requestregister.html", ".digitek-form-page, form"),
      ("/pages/content/doc-create.html",      ".doc-create-digitek, form"),
      ("/pages/content/ecr-review.html",      ".ecr-review-page, .ecr-header-table"),
      ("/pages/content/group-manage.html",    ".group-manage-layout"),
      ("/pages/content/code-manage.html",     ".code-manage-layout"),
      ("/pages/content/doc-classify.html",    ".doc-classify-layout"),
  ]

  def check(label, ok, detail=""):
      mark = "✅" if ok else "❌"
      print(f"  {mark} {label}" + (f" ({detail})" if detail else ""))
      return ok

  passed = 0
  failed = 0

  with sync_playwright() as p:
      browser = p.chromium.launch(headless=True)
      page = browser.new_page()

      # shell.html 로드
      page.goto(BASE)
      page.wait_for_load_state("networkidle")

      gnb_html_initial = page.locator(".gnb-digitek").inner_html()
      sidebar_html_initial = page.locator(".sidebar-digitek-container").inner_html()

      print(f"\n{'─'*50}")
      print(f"Shell 로드: GNB ✅  Sidebar ✅")
      print(f"{'─'*50}\n")

      for route, selector in ROUTES:
          print(f"▶ {route}")

          # data-route 링크 클릭
          link = page.locator(f'[data-route="{route}"]').first
          if link.count() == 0:
              print(f"  ❌ data-route='{route}' 링크 없음 — shell.html에 추가 필요")
              failed += 1
              continue

          link.click()

          try:
              # 콘텐츠 로드 대기 (셀렉터는 쉼표로 OR 조건)
              first_selector = selector.split(",")[0].strip()
              page.wait_for_selector(f"#page-content {first_selector}", timeout=5000)
              content_ok = True
          except Exception:
              content_ok = False

          gnb_html_after = page.locator(".gnb-digitek").inner_html()

          r1 = check("GNB 유지됨",     gnb_html_after == gnb_html_initial)
          r2 = check("콘텐츠 로드됨",  content_ok, selector)
          r3 = check("URL 변경됨",     route in page.url, page.url)

          if r1 and r2 and r3:
              passed += 1
          else:
              failed += 1

          print()

      browser.close()

  print(f"{'─'*50}")
  print(f"결과: {passed} 통과 / {failed} 실패 / {passed + failed} 전체")
  if failed == 0:
      print("✅ 모든 페이지 AJAX 라우팅 정상 동작")
  else:
      print("❌ 일부 페이지 수정 필요")
  ```

  실행:
  ```bash
  python3 /tmp/test_all_routes.py
  ```

  Expected 출력:
  ```
  ──────────────────────────────────────────────────
  결과: 10 통과 / 0 실패 / 10 전체
  ✅ 모든 페이지 AJAX 라우팅 정상 동작
  ```

- [ ] **Step 3: 실패한 항목 수정 후 재실행**

  실패한 항목이 있다면:
  - `data-route 링크 없음` → shell.html에 해당 경로 메뉴 추가
  - `콘텐츠 로드됨 ❌` → 해당 content/*.html 파일의 최상위 셀렉터 확인
  - `URL 변경됨 ❌` → Router._load에서 pushState 로직 확인

- [ ] **Step 4: 서버 종료**

  ```bash
  pkill -f "python3 -m http.server 8090"
  ```

- [ ] **Step 5: 검증 완료 커밋**

  ```bash
  git add pages/shell.html
  git commit -m "test: verify AJAX router applied to all full pages (10/10 pass)"
  ```
