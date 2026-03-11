# 페이지 전용 클래스 → 공통 클래스 전환 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CSS에 정의된 페이지 전용 클래스(doc-create-digitek-*, ecr-*, doc-classify-*) 48개를 신규 공통 클래스 12개 + 기존 공통 클래스/유틸리티로 전환하고, 구 CSS 블록을 삭제한다.

**Architecture:** CSS에 신규 공통 클래스를 먼저 추가한 뒤, 페이지별로 HTML 클래스명을 교체하고, 마지막에 구 CSS 블록을 삭제한다. HTML/CSS 작업이므로 "테스트"는 브라우저에서 시각적 확인으로 대체한다.

**Tech Stack:** HTML, CSS (digitek.css), 브라우저 시각 확인

---

## 파일 구조

| 파일 | 변경 유형 |
|---|---|
| `css/digitek.css` | 신규 12개 클래스 추가 (5563라인 앞), 구 3개 블록(5564-5887) 삭제 |
| `pages/content/doc-create.html` | 13종 클래스명 교체 |
| `pages/detail/doc-create-full-page.html` | 13종 클래스명 교체 |
| `components/forms/approval-line.html` | doc-create 클래스 사용 여부 확인 후 교체 |
| `pages/content/ecr-review.html` | 13종 클래스명 교체 |
| `pages/detail/ecr-review-full-page.html` | 13종 클래스명 교체 |
| `pages/content/doc-classify.html` | 9종 클래스명 교체 |
| `pages/manage/doc-classify-full-page.html` | 9종 클래스명 교체 |

---

## 클래스 교체 매핑 레퍼런스

### doc-create 매핑
| 기존 | 교체값 |
|---|---|
| `doc-create-digitek` | `content-page-digitek` + `style="padding: 24px 32px 80px"` |
| `doc-create-digitek-header` | `page-header-digitek` |
| `doc-create-digitek-header-title` | `page-title-digitek` |
| `doc-create-digitek-header-actions` | `d-flex align-items-center gap-digitek-8 flex-shrink-0` |
| `doc-create-digitek-section` | `content-section-digitek` |
| `doc-create-digitek-section-header` | `content-section-header-digitek` |
| `doc-create-digitek-section-title` | `content-section-title-digitek` |
| `doc-create-digitek-section-actions` | `d-flex align-items-center gap-digitek-8` |
| `doc-create-digitek-section-body` | `content-section-body-digitek` |
| `doc-create-digitek-section-empty` | (클래스 제거) + `style="min-height:40px"` 추가 |
| `doc-create-digitek-form-table` | `form-table-digitek` |
| `doc-create-digitek-form-label-cell` | `form-label-cell-digitek` |
| `doc-create-digitek-form-value-cell` | `form-value-cell-digitek` |

### ecr 매핑
| 기존 | 교체값 |
|---|---|
| `ecr-review-layout` | `content-page-digitek` |
| `ecr-header-actions` | `d-flex justify-content-end mb-digitek-12 gap-digitek-8` |
| `ecr-header-table` | `table-digitek` + `style="table-layout:fixed"` |
| `ecr-groups-container` | `d-flex flex-column gap-digitek-8 mt-digitek-8` |
| `ecr-group-table` | `table-digitek` + `style="table-layout:fixed"` |
| `ecr-checkbox-cell` | `text-center` |
| `ecr-dept-name` | `text-center fw-semibold` |
| `ecr-task-label-cell` | `form-label-cell-digitek text-center` + `style="font-size:12px"` |
| `ecr-add-task-btn` | `btn-digitek-circle-sm` (신규 공통 클래스) |
| `ecr-task-content-cell` | `p-0` |
| `ecr-task-content-empty` | (클래스 제거) + `style="min-height:40px"` 추가 |
| `ecr-task-table` | `table-digitek` |
| `ecr-del-cell` | `text-center` |

### doc-classify 매핑
| 기존 | 교체값 |
|---|---|
| `doc-classify-layout` | `content-page-digitek` + `style="padding:16px; display:flex; flex-direction:column; gap:16px"` |
| `doc-classify-page-header` | `page-header-digitek` + `style="margin-bottom:0"` |
| `doc-classify-top-grid` | (인라인) `style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px"` |
| `doc-classify-panel` | `content-panel-digitek` |
| `doc-classify-panel-header` | `content-section-header-digitek` + `style="padding:0; background:none; border:none"` |
| `doc-classify-panel-title` | `content-section-title-digitek` |
| `doc-classify-search` | `input-digitek` + `style="width:130px"` |
| `doc-classify-select` | (클래스 제거) + `style="width:100%; flex:1; min-height:180px; border:1px solid var(--digitek-border); border-radius:4px; font-size:13px; padding:4px 0; outline:none;"` |
| `doc-classify-bottom-card` | `content-panel-digitek` + `style="gap:0"` |
| `doc-classify-bottom-header` | `mb-digitek-12` |

---

## Chunk 1: 신규 CSS 클래스 추가

### Task 1: `css/digitek.css`에 신규 공통 클래스 12개 추가

**Files:**
- Modify: `css/digitek.css` (5563라인 앞에 삽입)

- [ ] **Step 1: 5563라인 앞 위치 확인**

```bash
grep -n "ECR 검토 화면" css/digitek.css
```

Expected: `5564:/* ── ECR 검토 화면 ── */` (또는 유사한 라인)

- [ ] **Step 2: 신규 공통 클래스 블록을 5563라인 위에 삽입**

5562라인(searchsplit 블록 마지막 `}`) 다음, 5564라인(`/* ── ECR 검토 화면 ── */`) 바로 앞에 아래 블록을 삽입한다:

```css
/* ========================================================================== */
/*  공통 페이지 레이아웃 컴포넌트                                                 */
/* ========================================================================== */

/* ── 페이지 컨테이너 ── */
.content-page-digitek {
  padding: 24px;
  background: var(--digitek-bg-white);
  min-height: 100%;
}

/* ── 페이지 헤더 (제목 + 우측 액션 버튼) ── */
.page-header-digitek {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* ── 페이지 제목 ── */
.page-title-digitek {
  font-size: 20px;
  font-weight: 600;
  color: var(--digitek-text-primary);
  letter-spacing: -0.5px;
  line-height: 28px;
  margin: 0;
}

/* ── 섹션 카드 컨테이너 ── */
.content-section-digitek {
  margin-bottom: 16px;
  border: 1px solid var(--digitek-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--digitek-bg-white);
}

/* ── 섹션 헤더 (제목 + 우측 액션) ── */
.content-section-header-digitek {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: var(--digitek-bg-gray);
  border-bottom: 1px solid var(--digitek-border);
}

/* ── 섹션 제목 ── */
.content-section-title-digitek {
  font-size: 14px;
  font-weight: 600;
  color: var(--digitek-primary);
  line-height: 20px;
}

/* ── 섹션 본문 ── */
.content-section-body-digitek {
  padding: 20px;
}

/* ── 패널/카드 컨테이너 ── */
.content-panel-digitek {
  background: var(--digitek-bg-white);
  border: 1px solid var(--digitek-border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── 폼 key-value 테이블 ── */
.form-table-digitek {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 20px;
}
.form-table-digitek td {
  padding: 8px 16px;
  vertical-align: middle;
}
.form-table-digitek td + td {
  border-left: 1px solid var(--digitek-border);
}
.form-table-digitek tr + tr td {
  border-top: 1px solid var(--digitek-border);
}
.form-table-digitek select,
.form-table-digitek input[type="text"] {
  width: 100%;
  height: 30px;
  border: 1px solid var(--digitek-border);
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 13px;
  color: var(--digitek-text-primary);
  background: var(--digitek-bg-white);
}
.form-table-digitek input[type="text"]::placeholder {
  color: var(--digitek-text-tertiary);
}

/* ── 폼 라벨 셀 (회색 배경, 굵은 글씨) ── */
.form-label-cell-digitek {
  background: var(--digitek-bg-gray);
  font-weight: 600;
  color: var(--digitek-text-primary);
  white-space: nowrap;
}

/* ── 폼 값 셀 ── */
.form-value-cell-digitek {
  background: var(--digitek-bg-white);
}

/* ── 작은 원형 추가 버튼 (목록 행 추가용) ── */
.btn-digitek-circle-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--digitek-border);
  background: #fff;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  vertical-align: middle;
}
.btn-digitek-circle-sm:hover {
  background: var(--digitek-primary-bg);
  border-color: var(--digitek-primary);
  color: var(--digitek-primary);
}
```

- [ ] **Step 3: 삽입 확인**

```bash
grep -n "content-page-digitek\|page-header-digitek\|content-section-digitek\|form-table-digitek\|btn-digitek-circle-sm" css/digitek.css | head -15
```

Expected: 12개 신규 클래스 정의 라인이 출력됨

- [ ] **Step 4: 커밋**

```bash
git add css/digitek.css
git commit -m "feat: add common layout/form component classes to digitek.css"
```

---

## Chunk 2: doc-create 마이그레이션

### Task 2: doc-create HTML 파일 2개 + approval-line 클래스 교체

**Files:**
- Modify: `pages/content/doc-create.html`
- Modify: `pages/detail/doc-create-full-page.html`
- Modify: `components/forms/approval-line.html` (doc-create 클래스 사용 여부 확인 필요)

- [ ] **Step 1: 현재 사용 중인 doc-create 클래스 목록 확인**

```bash
grep -oh "doc-create-digitek[a-z-]*" pages/content/doc-create.html | sort | uniq
grep -oh "doc-create-digitek[a-z-]*" components/forms/approval-line.html | sort | uniq
```

- [ ] **Step 2: `pages/content/doc-create.html` 클래스 교체**

아래 교체를 순서대로 적용한다 (각 클래스는 Replace All로 처리):

1. `doc-create-digitek-form-label-cell` → `form-label-cell-digitek`
2. `doc-create-digitek-form-value-cell` → `form-value-cell-digitek`
3. `doc-create-digitek-form-table` → `form-table-digitek`
4. `doc-create-digitek-section-empty` → (클래스 제거, `style="min-height:40px"` 추가)
5. `doc-create-digitek-section-actions` → `d-flex align-items-center gap-digitek-8`
6. `doc-create-digitek-section-body` → `content-section-body-digitek`
7. `doc-create-digitek-section-title` → `content-section-title-digitek`
8. `doc-create-digitek-section-header` → `content-section-header-digitek`
9. `doc-create-digitek-section` → `content-section-digitek`
10. `doc-create-digitek-header-actions` → `d-flex align-items-center gap-digitek-8 flex-shrink-0`
11. `doc-create-digitek-header-title` → `page-title-digitek`
12. `doc-create-digitek-header` → `page-header-digitek`
13. `doc-create-digitek` (컨테이너) → `content-page-digitek` (+ `style="padding: 24px 32px 80px"` 추가)

> **주의:** 13번은 가장 마지막에 처리해야 `doc-create-digitek-*` 하위 클래스와 충돌 없이 교체됨

- [ ] **Step 3: `pages/detail/doc-create-full-page.html` 동일하게 교체**

Step 2와 동일한 순서로 적용

- [ ] **Step 4: `components/forms/approval-line.html` 확인 및 교체**

Step 1 결과에 doc-create 클래스가 있으면 동일하게 교체, 없으면 스킵

- [ ] **Step 5: 잔여 doc-create 클래스 없는지 확인**

```bash
grep -rn "doc-create-digitek" pages/content/doc-create.html pages/detail/doc-create-full-page.html components/forms/approval-line.html
```

Expected: 출력 없음 (0건)

- [ ] **Step 6: 브라우저에서 시각 확인**

`pages/detail/doc-create-full-page.html`을 브라우저에서 열어 레이아웃이 이전과 동일한지 확인:
- 페이지 헤더(제목 + 버튼) 정렬
- 섹션 카드 헤더(회색 배경, 파란 제목)
- 폼 테이블 셀 구분선

- [ ] **Step 7: 커밋**

```bash
git add pages/content/doc-create.html pages/detail/doc-create-full-page.html components/forms/approval-line.html
git commit -m "refactor: migrate doc-create page-specific classes to common classes"
```

---

## Chunk 3: ecr-review 마이그레이션

### Task 3: ecr-review HTML 파일 2개 클래스 교체

**Files:**
- Modify: `pages/content/ecr-review.html`
- Modify: `pages/detail/ecr-review-full-page.html`

- [ ] **Step 1: 현재 사용 중인 ecr 클래스 목록 확인**

```bash
grep -oh "ecr-[a-z-]*" pages/content/ecr-review.html | sort | uniq
```

- [ ] **Step 2: `pages/content/ecr-review.html` 클래스 교체**

아래 교체를 순서대로 적용:

1. `ecr-add-task-btn` → `btn-digitek-circle-sm`
2. `ecr-task-content-empty` → (클래스 제거, `style="min-height:40px"` 추가)
3. `ecr-task-content-cell` → `p-0`
4. `ecr-del-cell` → `text-center`
5. `ecr-checkbox-cell` → `text-center`
   - 단, `ecr-checkbox-cell .checkbox-digitek` → `.text-center .checkbox-digitek { justify-content: center; }` (이 자식 선택자 CSS는 Task 5에서 신규 공통 클래스에 추가)
6. `ecr-dept-name` → `text-center fw-semibold`
7. `ecr-task-label-cell` → `form-label-cell-digitek text-center` (+ `style="font-size:12px"` 추가)
8. `ecr-task-table` → `table-digitek`
9. `ecr-group-table` → `table-digitek` (해당 태그에 `style="table-layout:fixed"` 추가)
10. `ecr-groups-container` → `d-flex flex-column gap-digitek-8 mt-digitek-8`
11. `ecr-header-table` → `table-digitek` (해당 태그에 `style="table-layout:fixed"` 추가)
12. `ecr-header-actions` → `d-flex justify-content-end mb-digitek-12 gap-digitek-8`
13. `ecr-review-layout` → `content-page-digitek`

- [ ] **Step 3: `pages/detail/ecr-review-full-page.html` 동일하게 교체**

Step 2와 동일한 순서로 적용

- [ ] **Step 4: 잔여 ecr 클래스 없는지 확인**

```bash
grep -rn "ecr-" pages/content/ecr-review.html pages/detail/ecr-review-full-page.html
```

Expected: 출력 없음 (0건)

- [ ] **Step 5: 브라우저에서 시각 확인**

`pages/detail/ecr-review-full-page.html`을 브라우저에서 열어 확인:
- 헤더 버튼 영역 우측 정렬
- 부서 그룹 테이블 구조 및 셀 구분선
- 업무 테이블 컬럼 너비

- [ ] **Step 6: CSS에 `.text-center .checkbox-digitek` 보완 추가**

Step 2의 5번(ecr-checkbox-cell) 교체 후 checkbox 정렬이 깨지면 `css/digitek.css`의 신규 공통 클래스 블록에 추가:

```css
/* checkbox가 text-center 컨테이너 안에서 가운데 정렬 */
.text-center .checkbox-digitek {
  justify-content: center;
}
```

- [ ] **Step 7: 커밋**

```bash
git add pages/content/ecr-review.html pages/detail/ecr-review-full-page.html css/digitek.css
git commit -m "refactor: migrate ecr-review page-specific classes to common classes"
```

---

## Chunk 4: doc-classify 마이그레이션

### Task 4: doc-classify HTML 파일 2개 클래스 교체

**Files:**
- Modify: `pages/content/doc-classify.html`
- Modify: `pages/manage/doc-classify-full-page.html`

- [ ] **Step 1: 현재 사용 중인 doc-classify 클래스 목록 확인**

```bash
grep -oh "doc-classify-[a-z-]*" pages/content/doc-classify.html | sort | uniq
```

- [ ] **Step 2: `pages/content/doc-classify.html` 클래스 교체**

아래 교체를 순서대로 적용:

1. `doc-classify-search` → `input-digitek` (해당 태그에 `style="width:130px"` 추가)
2. `doc-classify-select` → (클래스 제거, 기존 스타일을 인라인으로 이전)
   - `style="width:100%; flex:1; min-height:180px; border:1px solid var(--digitek-border); border-radius:4px; font-size:13px; padding:4px 0; outline:none;"`
   - focus/option pseudo 스타일은 제거 (브라우저 기본 스타일 사용)
3. `doc-classify-bottom-header` → `mb-digitek-12`
4. `doc-classify-panel-title` → `content-section-title-digitek`
5. `doc-classify-panel-header` → (클래스 제거, `d-flex justify-content-between align-items-center`로 교체)
6. `doc-classify-panel` → `content-panel-digitek`
7. `doc-classify-bottom-card` → `content-panel-digitek` (해당 태그에 `style="gap:0"` 추가)
8. `doc-classify-top-grid` → (클래스 제거, `style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px"` 추가)
9. `doc-classify-page-header` → `page-header-digitek` (해당 태그에 `style="margin-bottom:0"` 추가)
10. `doc-classify-layout` → `content-page-digitek` (해당 태그에 `style="padding:16px; display:flex; flex-direction:column; gap:16px"` 추가)

- [ ] **Step 3: `pages/manage/doc-classify-full-page.html` 동일하게 교체**

Step 2와 동일한 순서로 적용

- [ ] **Step 4: 잔여 doc-classify 클래스 없는지 확인**

```bash
grep -rn "doc-classify-" pages/content/doc-classify.html pages/manage/doc-classify-full-page.html
```

Expected: 출력 없음 (0건)

- [ ] **Step 5: 브라우저에서 시각 확인**

`pages/manage/doc-classify-full-page.html`을 브라우저에서 열어 확인:
- 3열 그리드 패널 레이아웃
- 각 패널의 헤더/선택박스 높이
- 하단 카드 레이아웃

- [ ] **Step 6: 커밋**

```bash
git add pages/content/doc-classify.html pages/manage/doc-classify-full-page.html
git commit -m "refactor: migrate doc-classify page-specific classes to common classes"
```

---

## Chunk 5: 구 CSS 클래스 블록 삭제

### Task 5: `css/digitek.css`에서 페이지 전용 CSS 블록 삭제

**Files:**
- Modify: `css/digitek.css`

- [ ] **Step 1: 삭제 전 잔여 클래스 사용 확인 (HTML 전체)**

```bash
grep -rn "doc-create-digitek\|ecr-review-layout\|ecr-header\|ecr-group\|ecr-task\|ecr-dept\|ecr-checkbox\|ecr-del\|ecr-add\|doc-classify-" pages/ components/
```

Expected: 출력 없음 (0건). 출력이 있으면 해당 파일 먼저 수정 후 진행

- [ ] **Step 2: `css/digitek.css`에서 ECR 블록 삭제**

삭제 범위: `/* ── ECR 검토 화면 ── */` 주석부터 `}` (`.ecr-del-cell`)까지
→ 현재 기준 약 5564-5673라인

삭제 후 확인:
```bash
grep -n "ecr-" css/digitek.css
```
Expected: 출력 없음

- [ ] **Step 3: `css/digitek.css`에서 doc-classify 블록 삭제**

삭제 범위: `/* ── 문서 분류 관리 화면 ── */`부터 `.doc-classify-bottom-header { }` 끝까지
→ 현재 기준 약 5675-5743라인

삭제 후 확인:
```bash
grep -n "doc-classify-" css/digitek.css
```
Expected: 출력 없음

- [ ] **Step 4: `css/digitek.css`에서 doc-create 블록 삭제**

삭제 범위: `/* ========== 문서 등록 페이지 ========== */` 섹션 주석부터
`.doc-create-digitek-form-table input[type="text"]::placeholder { }` 끝까지
→ 현재 기준 약 5766-5887라인

삭제 후 확인:
```bash
grep -n "doc-create-digitek" css/digitek.css
```
Expected: 출력 없음

- [ ] **Step 5: 전체 잔여 확인**

```bash
grep -n "doc-create-digitek\|ecr-review-layout\|\.ecr-header\|\.ecr-group\|\.ecr-task\|\.ecr-dept\|\.ecr-checkbox\|\.ecr-del\|\.ecr-add\|doc-classify-" css/digitek.css
```

Expected: 출력 없음

- [ ] **Step 6: 브라우저에서 최종 시각 확인**

3개 페이지를 다시 열어 CSS 삭제 후에도 스타일이 유지되는지 확인:
- `pages/detail/doc-create-full-page.html`
- `pages/detail/ecr-review-full-page.html`
- `pages/manage/doc-classify-full-page.html`

- [ ] **Step 7: 커밋**

```bash
git add css/digitek.css
git commit -m "refactor: remove page-specific CSS blocks (replaced by common classes)"
```

---

## 주의사항

1. **교체 순서 엄수**: `doc-create-digitek-*` 하위 클래스를 먼저 교체하고 `doc-create-digitek` 컨테이너를 마지막에 교체해야 한다. 역순으로 하면 부분 매칭 오류 발생.

2. **CSS 삭제는 HTML 교체 완료 후**: HTML 파일에서 구 클래스가 완전히 제거된 것을 grep으로 확인한 뒤에만 CSS를 삭제한다.

3. **doc-classify-select focus/option 스타일 손실**: `doc-classify-select`의 `:focus`, `option:checked` 스타일은 인라인으로 이전이 불가능하므로 제거된다. 브라우저 기본 스타일로 대체됨을 확인하고, 문제가 있으면 `css/digitek.css`의 공통 블록에 새 선택자로 추가한다.

4. **ecr-header-table thead th 스타일**: `ecr-header-table th`가 가진 회색 배경(`#f8fafc`)과 연한 텍스트(`#a3a3a3`)는 `table-digitek`에서는 다를 수 있다. 시각 확인 후 `table-digitek thead th` 공통 스타일 조정 또는 개별 `style` 속성으로 보완한다.
