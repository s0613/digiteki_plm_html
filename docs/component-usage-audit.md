# 컴포넌트 사용 현황 감사 리포트

> 생성일: 2026-03-11
> 대상: pages/ 하위 전체 HTML 파일

## 범례
- ✅ 사용 중
- ❌ 미사용 (페이지 성격상 있어야 함)
- ➖ 해당 없음 (페이지 성격상 없어도 됨)

---

## 1. Full-page 필수 컴포넌트

> `router-content`: 전체 full-page에 미구현 — AJAX 라우터 통합 플랜에 포함되어 있으나 아직 미완료

| 파일 | layout-digitek | gnb-digitek | sidebar-digitek | breadcrumb-digitek | router-content |
|---|:---:|:---:|:---:|:---:|:---:|
| main-full-page.html | ✅ | ✅ | ✅ | ➖ | ❌ |
| code-manage-full-page.html | ✅ | ✅ | ✅ | ➖ | ❌ |
| doc-classify-full-page.html | ✅ | ✅ | ✅ | ➖ | ❌ |
| group-manage-full-page.html | ✅ | ✅ | ✅ | ➖ | ❌ |
| pms-full-page.html | ✅ | ✅ | ✅ | ✅ | ❌ |
| doc-create-full-page.html | ✅ | ✅ | ✅ | ➖ | ❌ |
| requestregister-full-page.html | ✅ | ✅ | ✅ | ✅ | ❌ |
| ecr-review-full-page.html | ✅ | ✅ | ✅ | ➖ | ❌ |
| searchlist-full-page.html | ✅ | ✅ | ✅ | ✅ | ❌ |
| searchsplit-full-page.html | ✅ | ✅ | ✅ | ✅ | ❌ |

**비고:**
- `breadcrumb-digitek`: 대시보드·관리 페이지(main, code-manage, doc-classify, group-manage, doc-create, ecr-review)는 없어도 됨(➖), 상세·검색 페이지(pms, requestregister, searchlist, searchsplit)는 있어야 함(✅)
- `router-content`: 전체 10개 파일 모두 미구현(❌) — 추후 일괄 작업 필요

---

## 2. Full-page 기능 컴포넌트

> 없음은 페이지 성격에 따라 선택적이므로 모두 ➖ 처리

| 파일명 | btn | input | select | dateselect | fieldset | table | pagination | badge | tabbutton | accordion | fileupload | texteditor | approval-line | checkbox | radio |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| main-full-page.html | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| code-manage-full-page.html | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| doc-classify-full-page.html | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| group-manage-full-page.html | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| pms-full-page.html | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| doc-create-full-page.html | ✅ | ✅ | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ | ✅ | ➖ |
| requestregister-full-page.html | ✅ | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ✅ | ➖ |
| ecr-review-full-page.html | ✅ | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ✅ | ➖ |
| searchlist-full-page.html | ✅ | ➖ | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| searchsplit-full-page.html | ✅ | ➖ | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |

---

## 3. Content Partial 감사

### 레이아웃 컴포넌트 혼입 여부

이상 없음 — content partial 파일에 `gnb-digitek`, `sidebar-digitek`, `layout-digitek` 클래스 혼입 없음

### breadcrumb-digitek 혼입 여부

| 파일 | breadcrumb-digitek |
|---|:---:|
| pms.html | ⚠️ 발견 — 검토 필요 |
| 기타 partial | 없음 |

### 기능 컴포넌트 사용 현황

| 파일 | btn | input | select | table | pagination | badge | accordion | fileupload | dateselect | fieldset |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| main.html | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| code-manage.html | ✅ | ➖ | ✅ | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ |
| doc-classify.html | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| group-manage.html | ➖ | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| pms.html | ✅ | ➖ | ➖ | ✅ | ➖ | ✅ | ✅ | ➖ | ➖ | ➖ |
| doc-create.html | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ | ✅ | ✅ | ➖ |
| requestregister.html | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ✅ | ✅ | ➖ | ➖ |
| ecr-review.html | ✅ | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ |
| searchlist.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ |
| searchsplit.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ➖ |

---

## 4. Popup 페이지 감사

### 레이아웃 컴포넌트 혼입 여부

이상 없음 — 팝업 파일에 `gnb-digitek`, `sidebar-digitek`, `layout-digitek` 클래스 혼입 없음

### 팝업별 사용 컴포넌트

| 팝업 파일 | 사용 컴포넌트 |
|---|---|
| popup-base.html | `btn-digitek`, `btn-digitek-outline`, `btn-digitek-primary`, `btn-digitek-36` |
| assignee-selector.html | `btn-digitek`, `btn-digitek-primary`, `btn-digitek-36`, `btn-digitek-outline` |
| searchsplit-detail-popup.html | `btn-digitek` 계열, `accordion-digitek-inner` 계열, `progress-digitek-circular`, `searchsplit-digitek-*` (페이지 전용 클래스), `icon-digitek-16`, `gap-digitek-8` |

**비고:** `searchsplit-detail-popup.html`의 `searchsplit-digitek-*` 클래스는 페이지 전용(non-shared) 클래스이므로 공통 컴포넌트 정의 파일에 포함되지 않도록 주의

---

## 5. 주요 발견 사항

### 즉시 수정 필요

| # | 위치 | 내용 |
|---|---|---|
| 1 | 전체 full-page (10개) | `router-content` 미구현 — AJAX 라우터 통합 작업 일괄 필요 |

### 검토 필요

| # | 위치 | 내용 |
|---|---|---|
| 1 | `pages/detail/pms.html` (content partial) | `breadcrumb-digitek` 혼입 — content partial에는 breadcrumb이 없어야 하는지 확인 후 제거 또는 유지 결정 필요 |
| 2 | `searchsplit-detail-popup.html` | `searchsplit-digitek-*` 페이지 전용 클래스 — 공통 CSS 파일로 누출되지 않도록 범위 관리 필요 |

### 참고: breadcrumb-digitek 미사용 full-page

아래 full-page는 현재 breadcrumb 없음(➖)으로 분류되었으나, 향후 페이지 성격이 상세/검색으로 변경될 경우 추가 검토 필요:

- `doc-create-full-page.html`
- `ecr-review-full-page.html`
