# 페이지 전용 클래스 → 공통 클래스 전환 설계

## 목표

CSS에 정의된 페이지 전용 클래스(doc-create-digitek-*, ecr-*, doc-classify-*) 총 48개를 공통 클래스로 전환한다. 기존 공통 클래스로 대체 가능한 건 교체하고, 반복 패턴에만 신규 공통 클래스를 최소(11개)로 추가한다.

## 현황

### 페이지 전용 클래스 3그룹

| 그룹 | 클래스 수 | CSS 위치 | 사용 파일 |
|---|---|---|---|
| `doc-create-digitek-*` | 19개 | digitek.css:5769-5884 | doc-create.html, doc-create-full-page.html, approval-line.html |
| `ecr-*` | 19개 | digitek.css:5563-5671 | ecr-review.html, ecr-review-full-page.html |
| `doc-classify-*` | 10개 | digitek.css:5674-5741 | doc-classify.html, doc-classify-full-page.html |

---

## 신규 공통 클래스 (11개)

### 페이지 레이아웃

```css
/* 페이지 콘텐츠 컨테이너 */
.content-page-digitek {
  padding: 24px 32px 80px;
  background: var(--digitek-bg-white);
  min-height: 100%;
}

/* 페이지 상단 헤더 */
.page-header-digitek {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 페이지 제목 */
.page-title-digitek {
  font-size: 20px;
  font-weight: 600;
  color: var(--digitek-text-primary);
  letter-spacing: -0.5px;
}
```

### 섹션 컴포넌트

```css
/* 섹션 카드 컨테이너 */
.content-section-digitek {
  margin-bottom: 16px;
  border: 1px solid var(--digitek-border);
  border-radius: 8px;
  overflow: hidden;
}

/* 섹션 헤더 */
.content-section-header-digitek {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: var(--digitek-bg-gray);
}

/* 섹션 제목 */
.content-section-title-digitek {
  font-size: 14px;
  font-weight: 600;
  color: var(--digitek-primary);
}

/* 섹션 본문 */
.content-section-body-digitek {
  padding: 20px;
}

/* 패널/카드 컨테이너 (섹션보다 가벼운 형태) */
.content-panel-digitek {
  background: var(--digitek-bg-white);
  border: 1px solid var(--digitek-border);
  border-radius: 8px;
  padding: 16px;
}
```

### 폼 테이블

```css
/* 폼 key-value 테이블 */
.form-table-digitek {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: -0.32px;
}

.form-table-digitek th,
.form-table-digitek td {
  padding: 8px 12px;
  border: 1px solid var(--digitek-border);
  vertical-align: middle;
}

/* 폼 라벨 셀 */
.form-label-cell-digitek {
  background: var(--digitek-bg-gray);
  font-weight: 600;
  white-space: nowrap;
  color: var(--digitek-text-secondary);
  width: 120px;
}

/* 폼 값 셀 */
.form-value-cell-digitek {
  background: var(--digitek-bg-white);
}
```

---

## 클래스 매핑 테이블

### 신규 공통 클래스로 교체

| 기존 (페이지 전용) | 신규 (공통) |
|---|---|
| `doc-create-digitek` | `content-page-digitek` |
| `ecr-review-layout` | `content-page-digitek` |
| `doc-classify-layout` | `content-page-digitek` |
| `doc-create-digitek-header` | `page-header-digitek` |
| `doc-classify-page-header` | `page-header-digitek` |
| `doc-create-digitek-header-title` | `page-title-digitek` |
| `doc-create-digitek-section` | `content-section-digitek` |
| `doc-create-digitek-section-header` | `content-section-header-digitek` |
| `doc-classify-panel-header` | `content-section-header-digitek` |
| `doc-create-digitek-section-title` | `content-section-title-digitek` |
| `doc-classify-panel-title` | `content-section-title-digitek` |
| `doc-create-digitek-section-body` | `content-section-body-digitek` |
| `doc-classify-panel` | `content-panel-digitek` |
| `doc-classify-bottom-card` | `content-panel-digitek` |
| `doc-create-digitek-form-table` | `form-table-digitek` |
| `doc-create-digitek-form-label-cell` | `form-label-cell-digitek` |
| `doc-create-digitek-form-value-cell` | `form-value-cell-digitek` |

### 기존 공통 클래스/유틸리티로 교체

| 기존 (페이지 전용) | 대체 |
|---|---|
| `ecr-header-table` | `table-digitek` |
| `ecr-group-table` | `table-digitek` |
| `ecr-task-table` | `table-digitek` |
| `ecr-checkbox-cell` | `text-center` |
| `ecr-dept-name` | `text-center fw-semibold` |
| `ecr-task-content-cell` | `p-0` |
| `ecr-del-cell` | `text-center` |
| `ecr-groups-container` | `d-flex flex-column gap-digitek-8` |
| `doc-create-digitek-header-actions` | `d-flex align-items-center gap-digitek-8` |
| `doc-create-digitek-section-actions` | `d-flex align-items-center gap-digitek-8` |
| `doc-classify-search` | `input-digitek` + `style="width:130px"` |
| `doc-classify-bottom-header` | `mb-digitek-12` |

### 별도 처리 필요

| 기존 | 처리 방법 |
|---|---|
| `doc-create-digitek-section-empty` | `style="min-height:40px"` 인라인 또는 유틸리티 |
| `ecr-header-actions` | `page-header-digitek` + 기존 버튼 구조 활용 |
| `ecr-task-content-empty` | `style="min-height:40px"` 인라인 |
| `ecr-add-task-btn` | `btn-digitek-icon btn-digitek-28` 또는 인라인 |
| `ecr-task-label-cell` | `text-center` + `form-label-cell-digitek` 조합 |
| `doc-classify-top-grid` | `d-grid` + `style="grid-template-columns: 1fr 1fr 1fr; gap: 16px"` |
| `doc-classify-select` | 인라인 스타일 유지 (네이티브 select 전용) |

---

## 수정 대상 파일

| 파일 | 변경 유형 |
|---|---|
| `css/digitek.css` | 신규 11개 클래스 추가, 구 48개 클래스 블록 삭제 |
| `pages/content/doc-create.html` | 클래스명 교체 |
| `pages/detail/doc-create-full-page.html` | 클래스명 교체 |
| `pages/content/ecr-review.html` | 클래스명 교체 |
| `pages/detail/ecr-review-full-page.html` | 클래스명 교체 |
| `pages/content/doc-classify.html` | 클래스명 교체 |
| `pages/manage/doc-classify-full-page.html` | 클래스명 교체 |
| `components/forms/approval-line.html` | doc-create 클래스 사용 여부 확인 후 교체 |

---

## 작업 원칙

1. **CSS 먼저**: 신규 공통 클래스를 먼저 CSS에 추가한 후 HTML 교체
2. **페이지별 작업**: 한 번에 한 페이지씩 교체 후 브라우저 확인
3. **구 클래스 삭제**: HTML 교체 완료 확인 후 CSS에서 구 클래스 삭제
4. **스타일 보정**: 교체 후 시각적 차이가 있으면 신규 공통 클래스 속성 조정
