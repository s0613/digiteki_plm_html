# 테이블 클래스 통합 및 CSS 미정의 클래스 정리

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 테이블 컴포넌트의 이중 클래스명(`digitek-table-*` / `table-digitek-*`)을 `table-digitek-*`로 통합하고, CSS 미정의 클래스 2건을 해결한다.

**Architecture:** `table-digitek-*`가 디자인 시스템의 공식 명명 규칙(`{component}-digitek`)을 따르는 원본이고, `digitek-table-*`는 리네이밍 과정에서 `request-digitek-table` → `digitek-table`로 변환되며 생긴 중복이다. HTML에서 `digitek-table-*`를 `table-digitek-*`로 변경한 뒤, CSS에서 중복 블록을 삭제한다. 단, `table-digitek-scroll`에 빠진 `overflow-x: auto`와 `table-digitek-date .dicon` 셀렉터를 `digitek-table-*` 쪽에서 가져와 보강한다.

**Tech Stack:** HTML, CSS (Bootstrap 4.6.2 + digitek.css)

---

## 수정 범위 요약

| # | 문제 | 파일 | 작업 |
|---|------|------|------|
| A | 테이블 클래스 이중 정의 | CSS 1, HTML 2, MD 1 | `digitek-table-*` → `table-digitek-*` 통합 |
| B | `input-digitek-sm` CSS 미정의 | CSS 1 | 스타일 정의 추가 |
| C | `file-upload-digitek-file-list` CSS 미정의 | CSS 1 | 스타일 정의 추가 |

---

## Chunk 1: 테이블 클래스 통합 + 미정의 클래스 정리

### Task 1: CSS — `table-digitek-scroll`에 overflow-x 보강

`digitek-table-scroll`에만 있고 `table-digitek-scroll`에 없는 `overflow-x: auto` 속성을 추가한다.

**Files:**
- Modify: `css/digitek.css:1790-1794`

- [ ] **Step 1: `table-digitek-scroll`에 overflow-x 추가**

```css
/* 변경 전 (line 1790-1794) */
.table-digitek-scroll {
  max-height: 320px;
  overflow-x: auto;
  overflow-y: auto;
}

/* 이미 overflow-x: auto가 있으므로 변경 불필요 — 확인만 수행 */
```

> **참고:** 재확인 결과 `table-digitek-scroll`에는 이미 `overflow-x: auto`가 있다. 따라서 이 스텝은 확인(verify)만 하고 넘어간다.

- [ ] **Step 2: 브라우저에서 `table-digitek-scroll` 동작 확인**

`pages/search/searchlist-full-page.html`을 브라우저에서 열어 테이블 가로 스크롤이 정상 작동하는지 확인한다.

---

### Task 2: HTML — `digitek-table-*` → `table-digitek-*` 치환

리네이밍 산물인 `digitek-table-*` 클래스를 공식 `table-digitek-*`로 변경한다.

**Files:**
- Modify: `pages/detail/requestregister-full-page.html:575-625`
- Modify: `pages/detail/doc-create-full-page.html:390-393`

**치환 규칙 (길이 순 — 긴 것부터):**

| 변경 전 | 변경 후 |
|---------|---------|
| `digitek-table-input-row` | `table-digitek-input-row` |
| `digitek-table-checkbox` | `table-digitek-checkbox` |
| `digitek-table-actions` | `table-digitek-actions` |
| `digitek-table-scroll` | `table-digitek-scroll` |
| `digitek-table-date` | `table-digitek-date` |
| `digitek-table` | `table-digitek` |

- [ ] **Step 1: `requestregister-full-page.html` 치환**

아래 6개 치환을 순서대로(긴 것부터) 적용:

```
digitek-table-input-row  →  table-digitek-input-row
digitek-table-checkbox   →  table-digitek-checkbox
digitek-table-actions    →  table-digitek-actions
digitek-table-scroll     →  table-digitek-scroll
digitek-table-date       →  table-digitek-date
digitek-table            →  table-digitek
```

대상 라인: 575, 576, 579, 592, 600, 603, 610, 612, 613, 625

- [ ] **Step 2: `doc-create-full-page.html` 치환**

```
digitek-table-checkbox  →  table-digitek-checkbox
digitek-table           →  table-digitek
```

대상 라인: 390, 393

- [ ] **Step 3: 치환 검증**

전 프로젝트에서 `digitek-table` (하이픈 뒤 table)이 0건인지 확인:

```bash
grep -r "digitek-table" pages/ components/ --include="*.html" | grep -v "table-digitek"
```

Expected: 출력 없음

---

### Task 3: CSS — `digitek-table-*` 중복 블록 삭제

`table-digitek-*`로 통합했으므로 `digitek-table-*` CSS 블록(line 3660-3732)을 삭제한다.

**Files:**
- Modify: `css/digitek.css:3660-3732`

- [ ] **Step 1: 삭제 전 `table-digitek-date` 아이콘 셀렉터 보강**

`digitek-table-date svg` (line 3722)에만 있는 SVG 셀렉터를 `table-digitek-date`에 추가한다.
현재 `table-digitek-date .dicon` (line 1853)은 `.dicon` 아이콘만 커버하므로, svg도 커버하도록 셀렉터를 확장:

```css
/* 변경 전 (line 1853-1858) */
.table-digitek-date .dicon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--digitek-text-tertiary);
}

/* 변경 후 */
.table-digitek-date .dicon,
.table-digitek-date svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--digitek-text-tertiary);
}
```

- [ ] **Step 2: `digitek-table-*` CSS 블록 삭제**

`css/digitek.css`에서 line 3660 ~ 3732 (아래 내용) 전체 삭제:

```css
.digitek-table-scroll { ... }
/* ── 데이터 테이블 ── */
.digitek-table { ... }
.digitek-table th { ... }
.digitek-table td { ... }
.digitek-table tbody tr:not(.digitek-table-input-row):hover { ... }
.digitek-table-row-selected { ... }
.digitek-table-checkbox { ... }
.digitek-table-checkbox .checkbox-digitek { ... }
.digitek-table-input-row td { ... }
.digitek-table-date { ... }
.digitek-table-date svg { ... }
.digitek-table-actions { ... }
```

- [ ] **Step 3: CSS에 `digitek-table` 참조 0건 확인**

```bash
grep "\.digitek-table" css/digitek.css
```

Expected: 출력 없음

---

### Task 4: CSS — `input-digitek-sm` 정의 추가

테이블 인라인 입력용 작은 사이즈 인풋. 기존 `input-digitek`(padding 14px 16px, width 304px)을 축소한 변형.

**Files:**
- Modify: `css/digitek.css` (line 266 부근, `.input-digitek-disabled` 앞)

- [ ] **Step 1: CSS 정의 추가**

`input-digitek-disabled` 바로 앞(line 262 뒤)에 삽입:

```css
.input-digitek-sm {
  width: 100%;
  padding: 8px 12px;
}
```

> 테이블 td 안에서 사용되므로 `width: 100%`로 셀에 맞추고, padding을 줄여 행 높이를 축소한다.

- [ ] **Step 2: 브라우저 확인**

`pages/detail/requestregister-full-page.html`을 열어 부품 테이블 인풋 행(line 612-620)의 입력 필드가 적절한 크기인지 확인한다.

---

### Task 5: CSS — `file-upload-digitek-file-list` 정의 추가

파일 업로드 후 파일 목록이 표시될 컨테이너. JS에서 동적으로 항목을 추가하는 영역.

**Files:**
- Modify: `css/digitek.css` (line 1678 부근, `.file-upload-digitek-input` 뒤)

- [ ] **Step 1: CSS 정의 추가**

`.file-upload-digitek-input` 정의 뒤(line 1678 뒤)에 삽입:

```css
.file-upload-digitek-file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

> 파일 카드들이 세로로 나열되는 컨테이너. 항목이 없으면 높이 0으로 자동 수축.

- [ ] **Step 2: 브라우저 확인**

`pages/detail/doc-create-full-page.html`을 열어 파일 업로드 영역 아래에 파일 목록 자리가 정상적인지 확인한다.

---

### Task 6: docs — css-class-reference.md 업데이트

`digitek-table` 참조를 `table-digitek`로 변경하고, 새 클래스 2건을 추가한다.

**Files:**
- Modify: `docs/css-class-reference.md:756`

- [ ] **Step 1: `digitek-table` → `table-digitek` 변경**

```markdown
/* 변경 전 (line 756) */
| `.digitek-table` | 데이터 테이블 |

/* 변경 후 */
| `.table-digitek` | 데이터 테이블 |
```

- [ ] **Step 2: `input-digitek-sm`, `file-upload-digitek-file-list` 추가**

적절한 섹션에 아래 행 추가:

Input 섹션(line ~400 부근):
```markdown
| `.input-digitek-sm` | 테이블 인라인 인풋 (축소) |
```

File Upload 섹션(line ~450 부근):
```markdown
| `.file-upload-digitek-file-list` | 파일 목록 컨테이너 |
```

---

### Task 7: 최종 검증 및 커밋

- [ ] **Step 1: 전체 잔여 확인**

```bash
# digitek-table 잔존 확인 (table-digitek은 OK)
grep -r "digitek-table" pages/ components/ css/ js/ docs/ --include="*.html" --include="*.css" --include="*.js" --include="*.md" | grep -v "table-digitek"

# input-digitek-sm CSS 정의 확인
grep "input-digitek-sm" css/digitek.css

# file-upload-digitek-file-list CSS 정의 확인
grep "file-upload-digitek-file-list" css/digitek.css
```

Expected:
- 첫 번째: 출력 없음
- 두 번째: `.input-digitek-sm {` 1건
- 세 번째: `.file-upload-digitek-file-list {` 1건

- [ ] **Step 2: 브라우저 전 페이지 확인**

아래 페이지를 각각 열어 테이블 렌더링 이상 없는지 확인:
1. `pages/detail/requestregister-full-page.html` — 부품 테이블
2. `pages/detail/doc-create-full-page.html` — 연관 Document 테이블
3. `pages/search/searchlist-full-page.html` — 검색 결과 테이블
4. `pages/search/searchsplit-full-page.html` — 검색 결과 테이블
5. `pages/manage/doc-classify-full-page.html` — 문서 유형 테이블

- [ ] **Step 3: 커밋**

```bash
git add css/digitek.css \
  pages/detail/requestregister-full-page.html \
  pages/detail/doc-create-full-page.html \
  docs/css-class-reference.md
git commit -m "refactor: unify table classes (digitek-table → table-digitek) and add missing CSS definitions

- Merge duplicate digitek-table-* into shared table-digitek-*
- Add input-digitek-sm for inline table inputs
- Add file-upload-digitek-file-list container style
- Update css-class-reference.md"
```
