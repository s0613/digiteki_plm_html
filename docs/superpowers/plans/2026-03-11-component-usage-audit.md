# Component Usage Audit Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 각 페이지별로 공통 컴포넌트 사용 현황을 점검하고, 누락된 컴포넌트를 식별하여 `docs/component-usage-audit.md` 리포트로 정리한다.

**Architecture:** 대상 페이지를 full-page 템플릿과 content partial로 구분한 뒤, grep으로 각 공통 컴포넌트 클래스의 사용 여부를 확인한다. 결과를 마크다운 매트릭스 테이블로 정리하고 누락 항목에 ❌를 표시한다.

**Tech Stack:** Grep/Bash, Markdown

---

## 감사 대상

### Full-page 템플릿 (자체 GNB+사이드바 포함)

| 파일 경로 | 페이지 설명 |
|---|---|
| `pages/manage/main-full-page.html` | 메인(대시보드) |
| `pages/manage/code-manage-full-page.html` | 코드 관리 |
| `pages/manage/doc-classify-full-page.html` | 문서 분류 |
| `pages/manage/group-manage-full-page.html` | 그룹 관리 |
| `pages/detail/pms-full-page.html` | PMS 상세 |
| `pages/detail/doc-create-full-page.html` | 문서 생성 |
| `pages/detail/requestregister-full-page.html` | 의뢰 등록 |
| `pages/detail/ecr-review-full-page.html` | ECR 검토 |
| `pages/search/searchlist-full-page.html` | 검색 리스트 |
| `pages/search/searchsplit-full-page.html` | 검색 스플릿 |

### Content partial (shell에 삽입되는 콘텐츠만)

| 파일 경로 | 페이지 설명 |
|---|---|
| `pages/content/main.html` | 메인 콘텐츠 |
| `pages/content/code-manage.html` | 코드 관리 |
| `pages/content/doc-classify.html` | 문서 분류 |
| `pages/content/group-manage.html` | 그룹 관리 |
| `pages/content/pms.html` | PMS |
| `pages/content/doc-create.html` | 문서 생성 |
| `pages/content/requestregister.html` | 의뢰 등록 |
| `pages/content/ecr-review.html` | ECR 검토 |
| `pages/content/searchlist.html` | 검색 리스트 |
| `pages/content/searchsplit.html` | 검색 스플릿 |

### Popup 페이지

| 파일 경로 | 페이지 설명 |
|---|---|
| `pages/popup/popup-base.html` | 팝업 기본 |
| `pages/popup/assignee-selector.html` | 담당자 선택 |
| `pages/popup/searchsplit-detail-popup.html` | 검색 상세 팝업 |

---

## 공통 컴포넌트 감사 항목

### Full-page 필수 컴포넌트

| # | 컴포넌트 | 감지 키워드 | 모든 full-page 필수? |
|---|---|---|---|
| 1 | Layout wrapper | `layout-digitek` | ✅ 필수 |
| 2 | GNB 헤더 | `gnb-digitek` | ✅ 필수 |
| 3 | Sidebar | `sidebar-digitek` | ✅ 필수 |
| 4 | 브레드크럼 | `breadcrumb-digitek` | ✅ 필수 (main 제외 가능) |
| 5 | 라우터 컨테이너 | `id="router-content"` | ✅ 필수 |

### 페이지 기능별 컴포넌트 (있어야 하면 ✅)

| # | 컴포넌트 | 감지 키워드 | 적용 대상 |
|---|---|---|---|
| 6 | 버튼 | `btn-digitek` | 모든 페이지 |
| 7 | 인풋 | `input-digitek` | 폼이 있는 페이지 |
| 8 | 셀렉트 | `select-digitek` | 폼이 있는 페이지 |
| 9 | 날짜 선택 | `dateselect-digitek` | 폼이 있는 페이지 |
| 10 | 필드셋 | `fieldset-digitek` | 폼 그룹이 있는 페이지 |
| 11 | 테이블 | `table-digitek` | 리스트가 있는 페이지 |
| 12 | 페이지네이션 | `pagination-digitek` | 리스트가 있는 페이지 |
| 13 | 뱃지 | `badge-digitek` | 상태 표시가 있는 페이지 |
| 14 | 탭버튼 | `tabbutton-digitek` | 탭이 있는 페이지 |
| 15 | 아코디언 | `accordion-digitek` | 접이식 섹션이 있는 페이지 |
| 16 | 파일 업로드 | `fileupload-digitek` | 첨부 기능이 있는 페이지 |
| 17 | 텍스트 에디터 | `texteditor-digitek` | 서술형 입력이 있는 페이지 |
| 18 | 결재선 | `approval-line-digitek` | 결재 기능이 있는 페이지 |
| 19 | 체크박스 | `checkbox-digitek` | 다중 선택이 있는 페이지 |
| 20 | 라디오 버튼 | `radio-digitek` | 단일 선택이 있는 페이지 |

---

## Chunk 1: Full-page 감사

### Task 1: layout-digitek / gnb-digitek / sidebar-digitek 확인

**Files:**
- Read: `pages/manage/main-full-page.html`, `pages/manage/code-manage-full-page.html`, `pages/manage/doc-classify-full-page.html`, `pages/manage/group-manage-full-page.html`
- Read: `pages/detail/pms-full-page.html`, `pages/detail/doc-create-full-page.html`, `pages/detail/requestregister-full-page.html`, `pages/detail/ecr-review-full-page.html`
- Read: `pages/search/searchlist-full-page.html`, `pages/search/searchsplit-full-page.html`

- [ ] **Step 1: layout-digitek 사용 여부 grep**

```bash
grep -l "layout-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

누락 파일(미출력 파일) 기록

- [ ] **Step 2: gnb-digitek 사용 여부 grep**

```bash
grep -l "gnb-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 3: sidebar-digitek 사용 여부 grep**

```bash
grep -l "sidebar-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 4: breadcrumb-digitek 사용 여부 grep**

```bash
grep -l "breadcrumb-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 5: router-content ID 사용 여부 grep**

```bash
grep -l 'id="router-content"' pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 6: 결과를 임시 노트에 기록**

각 grep에서 **미출력된 파일** = 해당 컴포넌트 미사용 = ❌ 로 마크

---

### Task 2: 기능 컴포넌트 사용 여부 확인 (전체 full-page)

- [ ] **Step 1: 버튼 컴포넌트 확인**

```bash
grep -l "btn-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 2: 인풋/셀렉트/날짜 확인**

```bash
grep -l "input-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "select-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "dateselect-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 3: 폼 그룹/테이블/페이지네이션 확인**

```bash
grep -l "fieldset-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "table-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "pagination-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 4: UI 컴포넌트 확인**

```bash
grep -l "badge-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "tabbutton-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "accordion-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

- [ ] **Step 5: 폼 특수 컴포넌트 확인**

```bash
grep -l "fileupload-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "texteditor-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "approval-line-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "checkbox-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
grep -l "radio-digitek" pages/manage/*-full-page.html pages/detail/*-full-page.html pages/search/*-full-page.html
```

---

## Chunk 2: Content partial / Popup 감사

### Task 3: Content partial 기능 컴포넌트 확인

Content partial은 GNB/sidebar가 없어야 정상. 기능 컴포넌트만 감사한다.

- [ ] **Step 1: GNB/sidebar가 partial에 잘못 포함됐는지 확인**

```bash
grep -l "gnb-digitek\|sidebar-digitek\|layout-digitek" pages/content/*.html
```

출력이 있으면 이상 (partial에 레이아웃 컴포넌트 혼입)

- [ ] **Step 2: 버튼/인풋/셀렉트/테이블 사용 확인**

```bash
grep -l "btn-digitek" pages/content/*.html
grep -l "input-digitek" pages/content/*.html
grep -l "select-digitek" pages/content/*.html
grep -l "table-digitek" pages/content/*.html
```

- [ ] **Step 3: 브레드크럼이 partial에 있는지 확인** (있어서는 안 됨)

```bash
grep -l "breadcrumb-digitek" pages/content/*.html
```

출력이 있으면 이상 (full-page에만 있어야 함)

- [ ] **Step 4: 그 외 기능 컴포넌트 확인**

```bash
grep -l "pagination-digitek\|badge-digitek\|accordion-digitek\|fileupload-digitek" pages/content/*.html
```

---

### Task 4: Popup 페이지 감사

- [ ] **Step 1: 팝업에 레이아웃 컴포넌트 혼입 여부 확인**

```bash
grep -l "gnb-digitek\|sidebar-digitek\|layout-digitek\|breadcrumb-digitek" pages/popup/*.html
```

출력이 있으면 이상

- [ ] **Step 2: 팝업 내 사용 컴포넌트 조회**

```bash
grep -oh "[a-z-]*-digitek[a-z-]*" pages/popup/*.html | sort | uniq
```

사용 컴포넌트 목록 기록

---

## Chunk 3: 리포트 생성

### Task 5: `docs/component-usage-audit.md` 작성

위 감사 결과를 바탕으로 아래 형식의 마크다운 리포트를 작성한다.

**Files:**
- Create: `docs/component-usage-audit.md`

- [ ] **Step 1: 리포트 파일 생성 - 헤더 및 범례**

```markdown
# 컴포넌트 사용 현황 감사 리포트

> 생성일: YYYY-MM-DD
> 대상: pages/ 하위 전체 HTML 파일

## 범례
- ✅ 사용 중
- ❌ 미사용 (해당 페이지에 있어야 하는 컴포넌트)
- ➖ 해당 없음 (해당 페이지에 필요 없는 컴포넌트)
```

- [ ] **Step 2: Full-page 필수 컴포넌트 매트릭스 작성**

```markdown
## Full-page 필수 컴포넌트

| 페이지 | layout | gnb | sidebar | breadcrumb | router-content |
|--------|--------|-----|---------|------------|----------------|
| main-full-page | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| code-manage-full-page | ... | ... | ... | ... | ... |
| doc-classify-full-page | ... |
| group-manage-full-page | ... |
| pms-full-page | ... |
| doc-create-full-page | ... |
| requestregister-full-page | ... |
| ecr-review-full-page | ... |
| searchlist-full-page | ... |
| searchsplit-full-page | ... |
```

- [ ] **Step 3: 기능 컴포넌트 매트릭스 작성**

```markdown
## 기능 컴포넌트 사용 현황 (Full-page)

| 페이지 | btn | input | select | dateselect | fieldset | table | pagination | badge | tab | accordion | fileupload | texteditor | approval-line | checkbox | radio |
|--------|-----|-------|--------|-----------|---------|-------|-----------|-------|-----|-----------|-----------|-----------|--------------|---------|-------|
| main-full-page | ✅/❌/➖ | ... |
| ... |
```

- [ ] **Step 4: Content partial 이상 사항 작성**

```markdown
## Content Partial 이상 감지

### 레이아웃 컴포넌트 혼입 (있어서는 안 됨)
- 파일명: 감지된 클래스

### 브레드크럼 혼입 (full-page에만 있어야 함)
- 파일명: 감지된 클래스
```

- [ ] **Step 5: 누락/이상 항목 요약 섹션 작성**

```markdown
## 누락/이상 항목 요약

### 즉시 수정 필요
- [ ] `페이지명` - 누락 컴포넌트: `컴포넌트명`

### 검토 필요 (의도적 제외일 수 있음)
- [ ] `페이지명` - 없는 컴포넌트: `컴포넌트명`
```

- [ ] **Step 6: 커밋**

```bash
git add docs/component-usage-audit.md
git commit -m "docs: add component usage audit report"
```

---

## 주의사항

1. **Content partial vs Full-page 구분**: `pages/content/` 파일은 shell에 삽입되는 조각이므로 GNB/sidebar/layout/breadcrumb이 없는 게 정상이다.
2. **의도적 미사용**: 일부 컴포넌트(예: main 페이지의 breadcrumb)는 의도적으로 없을 수 있다. 리포트에서 ❌와 ➖로 구분한다.
3. **CSS 클래스 검색 정확도**: `-digitek` 접미사가 없는 일부 오래된 클래스가 있을 수 있으니 의심되는 경우 해당 파일을 직접 열어 확인한다.
