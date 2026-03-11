# CSS Class Migration: Remaining Pages Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 나머지 5개 페이지에서 페이지 전용 CSS 클래스를 제거하고 공통 컴포넌트 클래스로 마이그레이션한다.

**Architecture:** ecr-review.html과 searchsplit-detail-popup.html은 진정한 페이지 전용 클래스를 보유하고 있어 즉시 마이그레이션이 필요하다. searchlist.html, searchsplit.html, pms.html은 이미 `digitek.css`에 정의된 공통 CSS 클래스를 사용하고 있으나 검증이 필요하다. 마이그레이션 후 미사용 CSS 블록을 제거하여 코드를 정리한다.

**Tech Stack:** HTML (Thymeleaf), CSS (digitek.css), Bootstrap 5

---

## CSS 클래스 분류 (작업 전 이해 필수)

### 진정한 페이지 전용 클래스 (마이그레이션 필요)
- `ecr-dept-row`, `ecr-task-row` — CSS 정의 없음. HTML 마커로만 사용됨
- `searchsplit-digitek-*` — 팝업 파일에서 사용. `digitek-split-*`로 대체 가능

### 이미 공통 CSS 클래스 (마이그레이션 불필요)
- `digitek-search-*` — `css/digitek.css` 4512번째 줄부터 정의됨
- `digitek-split-*` — `css/digitek.css` 4827번째 줄부터 정의됨
- `digitek-dashboard-*`, `digitek-phase-*`, `digitek-info-*` — `css/digitek.css` 3810번째 줄부터 정의됨

---

## Chunk 1: ecr-review.html 정리

### Task 1: ecr-review.html에서 페이지 전용 row 클래스 제거

**Files:**
- Modify: `pages/detail/ecr-review.html`

**분석:**
- `ecr-dept-row` — CSS 정의 없는 순수 HTML 마커 클래스. `<tr>` 4곳에서 사용.
- `ecr-task-row` — CSS 정의 없는 순수 HTML 마커 클래스. `<tr>` 4곳에서 사용.
- `draggable-row` — `digitek.css` 2016번째 줄에 정의된 **공통 클래스**. 유지.

**클래스 매핑:**
| 현재 클래스 | 대체 | 이유 |
|-----------|------|------|
| `ecr-dept-row` | (제거) | CSS 없음, JavaScript 참조 없음 |
| `ecr-task-row` | (제거) | CSS 없음, JavaScript 참조 없음 |
| `draggable-row` | 유지 | 공통 CSS 클래스 |

- [ ] **Step 1: 파일 읽기 및 `ecr-dept-row` 사용 위치 확인**

```bash
grep -n "ecr-dept-row\|ecr-task-row" pages/detail/ecr-review.html
```

기대값: `ecr-dept-row` 4개, `ecr-task-row` 4개

- [ ] **Step 2: `ecr-dept-row` 클래스 제거**

`pages/detail/ecr-review.html`에서 모든 `class="ecr-dept-row"` 를 `<tr>`에서 제거.

변경 전: `<tr class="ecr-dept-row">`
변경 후: `<tr>`

(4곳 모두)

- [ ] **Step 3: `ecr-task-row` 클래스 제거**

`pages/detail/ecr-review.html`에서 모든 `class="ecr-task-row"` 를 `<tr>`에서 제거.

변경 전: `<tr class="ecr-task-row">`
변경 후: `<tr>`

(4곳 모두)

- [ ] **Step 4: 결과 검증**

```bash
grep -n "ecr-dept-row\|ecr-task-row" pages/detail/ecr-review.html
```

기대값: 아무것도 출력되지 않음 (0 matches)

- [ ] **Step 5: 커밋**

```bash
git add pages/detail/ecr-review.html
git commit -m "refactor: remove unused ecr-dept-row and ecr-task-row classes from ecr-review"
```

---

## Chunk 2: searchsplit-detail-popup.html 마이그레이션

### Task 2: searchsplit-detail-popup.html — `searchsplit-digitek-*` → `digitek-split-*`

**Files:**
- Modify: `pages/popup/searchsplit-detail-popup.html`

**분석:**
팝업 파일의 상세 패널 구조는 `searchsplit.html`의 우측 상세 패널과 동일하다.
`digitek-split-*` 클래스가 이미 모든 스타일을 정의하고 있으므로 1:1 매핑이 가능하다.

**클래스 매핑 (전체):**
| `searchsplit-digitek-*` (현재) | `digitek-split-*` (대체) |
|-------------------------------|--------------------------|
| `searchsplit-digitek-detail-badge` | `digitek-split-detail-badge` |
| `searchsplit-digitek-detail-btn` | `digitek-split-detail-btn` |
| `searchsplit-digitek-schedule-header` | `digitek-split-schedule-header` |
| `searchsplit-digitek-schedule-label` | `digitek-split-schedule-label` |
| `searchsplit-digitek-schedule-label-date` | `digitek-split-schedule-label-date` |
| `searchsplit-digitek-section-divider` | `digitek-split-section-divider` |
| `searchsplit-digitek-schedule-rows` | `digitek-split-schedule-rows` |
| `searchsplit-digitek-schedule-row` | `digitek-split-schedule-row` |
| `searchsplit-digitek-info-label` | `digitek-split-info-label` |
| `searchsplit-digitek-info-value` | `digitek-split-info-value` |
| `searchsplit-digitek-info-grid` | `digitek-split-info-grid` |
| `searchsplit-digitek-info-row` | `digitek-split-info-row` |
| `searchsplit-digitek-detail-section-contact` | `digitek-split-detail-section-contact` |

- [ ] **Step 1: 현재 `searchsplit-digitek-*` 클래스 목록 확인**

```bash
grep -n "searchsplit-digitek-" pages/popup/searchsplit-detail-popup.html
```

- [ ] **Step 2: `searchsplit-digitek-detail-badge` → `digitek-split-detail-badge` 교체**

Line 39: `<span class="searchsplit-digitek-detail-badge">` → `<span class="digitek-split-detail-badge">`

- [ ] **Step 3: `searchsplit-digitek-detail-btn` → `digitek-split-detail-btn` 교체**

Line 41: `<button ... class="searchsplit-digitek-detail-btn"` → `class="digitek-split-detail-btn"`

- [ ] **Step 4: 스케줄 관련 클래스 일괄 교체**

- `searchsplit-digitek-schedule-header` → `digitek-split-schedule-header`
- `searchsplit-digitek-schedule-label` → `digitek-split-schedule-label` (2곳)
- `searchsplit-digitek-schedule-label-date` → `digitek-split-schedule-label-date`
- `searchsplit-digitek-section-divider` → `digitek-split-section-divider`
- `searchsplit-digitek-schedule-rows` → `digitek-split-schedule-rows`
- `searchsplit-digitek-schedule-row` → `digitek-split-schedule-row` (3곳)

- [ ] **Step 5: info 그리드 관련 클래스 일괄 교체**

- `searchsplit-digitek-info-grid` → `digitek-split-info-grid` (2곳)
- `searchsplit-digitek-info-row` → `digitek-split-info-row` (11곳)
- `searchsplit-digitek-info-label` → `digitek-split-info-label` (11곳)
- `searchsplit-digitek-info-value` → `digitek-split-info-value` (11곳)

- [ ] **Step 6: `searchsplit-digitek-detail-section-contact` → `digitek-split-detail-section-contact`**

Line 121: `class="accordion-digitek-inner searchsplit-digitek-detail-section-contact"` → `class="accordion-digitek-inner digitek-split-detail-section-contact"`

- [ ] **Step 7: 결과 검증**

```bash
grep -n "searchsplit-digitek-" pages/popup/searchsplit-detail-popup.html
```

기대값: 아무것도 출력되지 않음 (0 matches)

- [ ] **Step 8: 시각적 확인**

브라우저에서 팝업을 열어 스케줄 컬럼, info 그리드, 배지 스타일이 `searchsplit.html`의 우측 상세 패널과 동일하게 표시되는지 확인.

- [ ] **Step 9: 커밋**

```bash
git add pages/popup/searchsplit-detail-popup.html
git commit -m "refactor: migrate searchsplit-detail-popup from searchsplit-digitek-* to digitek-split-* classes"
```

---

## Chunk 3: 공통 CSS 사용 검증 (변경 없음)

### Task 3: searchlist.html 공통 클래스 사용 검증

**Files:**
- Read-only: `pages/search/searchlist.html`, `css/digitek.css`

**분석:**
`searchlist.html`의 `digitek-search-*` 클래스들은 `digitek.css` 4512번째 줄부터 정의된 **공통 컴포넌트**다. HTML 변경 불필요. 검증만 수행.

- [ ] **Step 1: HTML 사용 클래스와 CSS 정의 대조**

```bash
grep -o 'class="[^"]*"' pages/search/searchlist.html | grep -o '"[^"]*"' | tr ' ' '\n' | sort -u | grep "digitek-"
```

- [ ] **Step 2: 각 클래스가 CSS에 정의되어 있는지 확인**

```bash
grep -c "digitek-search-\|digitek-field\|digitek-filter\|digitek-results" css/digitek.css
```

기대값: 30개 이상

- [ ] **Step 3: 결론 문서화**

searchlist.html은 공통 CSS 클래스를 올바르게 사용 중임을 확인. 추가 마이그레이션 불필요.

### Task 4: searchsplit.html 공통 클래스 사용 검증

**Files:**
- Read-only: `pages/search/searchsplit.html`, `css/digitek.css`

**분석:**
`searchsplit.html`의 `digitek-split-*` 클래스들은 `digitek.css` 4827번째 줄부터 정의된 **공통 컴포넌트**다. HTML 변경 불필요.

- [ ] **Step 1: `digitek-split-*` 클래스 CSS 정의 수 확인**

```bash
grep -c "^\.digitek-split-" css/digitek.css
```

기대값: 40개 이상

- [ ] **Step 2: HTML에서 미정의 클래스 존재 여부 확인**

```bash
# HTML에서 사용된 digitek-split-* 클래스 목록
grep -oh 'digitek-split-[a-z-]*' pages/search/searchsplit.html | sort -u
```

각 클래스가 CSS에 정의되어 있는지 확인.

- [ ] **Step 3: 결론 문서화**

searchsplit.html은 공통 CSS 클래스를 올바르게 사용 중임을 확인. 추가 마이그레이션 불필요.

### Task 5: pms.html 공통 클래스 사용 검증

**Files:**
- Read-only: `pages/detail/pms.html`, `css/digitek.css`

**분석:**
pms.html의 `digitek-dashboard-*`, `digitek-page-header*`, `digitek-phase-*`, `digitek-info-*`, `digitek-gantt-*` 클래스들이 `digitek.css`에 정의되어 있는지 확인.

- [ ] **Step 1: CSS에서 관련 클래스 수 확인**

```bash
grep -c "^\.digitek-dashboard-\|^\.digitek-phase-\|^\.digitek-page-header\|^\.digitek-info-\|^\.digitek-gantt-" css/digitek.css
```

기대값: 30개 이상

- [ ] **Step 2: HTML에서 사용된 페이지 전용 패턴 확인**

```bash
# pms 페이지에서만 사용되고 CSS에 없는 클래스가 있는지 확인
grep -oh 'class="[^"]*"' pages/detail/pms.html | grep -v "digitek-\|btn-\|tab-\|accordion-\|breadcrumb-\|badge-\|table-\|form-\|d-flex\|justify-\|align-\|gap-\|mb-\|mt-\|ms-\|me-\|p-\|fw-\|text-\|w-\|h-"
```

- [ ] **Step 3: 미정의 클래스 발견 시 후속 작업 결정**

발견 없음: pms.html 마이그레이션 불필요로 기록.
발견 있음: 별도 Task로 분리하여 처리.

---

## Chunk 4: CSS 정리

### Task 6: 제거된 클래스에 대한 CSS 블록 정리

**Files:**
- Modify: `css/digitek.css`

**분석:**
HTML 마이그레이션 완료 후 더 이상 HTML에서 참조되지 않는 CSS 클래스를 제거한다.

- [ ] **Step 1: `ecr-dept-row`, `ecr-task-row` CSS 정의 존재 여부 확인**

```bash
grep -n "ecr-dept-row\|ecr-task-row" css/digitek.css
```

기대값: 없음 (이미 CSS 정의 없음 확인됨)

- [ ] **Step 2: `searchsplit-digitek-*` CSS 정의 존재 여부 확인**

```bash
grep -n "searchsplit-digitek-" css/digitek.css
```

정의가 있으면 해당 CSS 블록 제거.

- [ ] **Step 3: CSS 정리 후 시각적 검증**

브라우저에서 다음 페이지들이 정상 표시되는지 확인:
1. `pages/detail/ecr-review.html` - 테이블 구조 유지
2. `pages/popup/searchsplit-detail-popup.html` - 팝업 스타일 정상
3. `pages/search/searchsplit.html` - 분할 뷰 정상
4. `pages/search/searchlist.html` - 검색 목록 정상
5. `pages/detail/pms.html` - 대시보드 정상

- [ ] **Step 4: 최종 검증**

```bash
# 모든 페이지에서 페이지 전용 클래스가 없는지 확인
grep -rn "ecr-dept-row\|ecr-task-row\|searchsplit-digitek-" pages/
```

기대값: 0 matches

- [ ] **Step 5: 커밋**

```bash
git add css/digitek.css
git commit -m "refactor: remove unused page-specific CSS blocks after HTML migration"
```

---

## 완료 체크리스트

- [ ] ecr-review.html: `ecr-dept-row`, `ecr-task-row` 제거
- [ ] searchsplit-detail-popup.html: 13개 `searchsplit-digitek-*` → `digitek-split-*` 교체
- [ ] searchlist.html: 공통 CSS 사용 검증 완료
- [ ] searchsplit.html: 공통 CSS 사용 검증 완료
- [ ] pms.html: 공통 CSS 사용 검증 완료
- [ ] CSS 미사용 블록 정리 완료
- [ ] 브라우저 시각적 검증 완료
- [ ] 모든 커밋 완료

## 주의사항

- `digitek-search-*`, `digitek-split-*`, `digitek-dashboard-*` 클래스는 **이름에 페이지 힌트가 있어도 이미 공통 CSS**다. 이름만 보고 제거하지 말 것.
- `draggable-row`는 `digitek.css` 2016번째 줄에 정의된 공통 클래스다. 제거하지 말 것.
- JavaScript에서 클래스를 셀렉터로 참조하는 경우 HTML 변경 전 `js/digitek.js` 확인 필요.
