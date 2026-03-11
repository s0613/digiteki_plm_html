# Digitek PLM CSS 클래스 레퍼런스

> `css/digitek.css` (6,087줄) 기준 — Bootstrap 4.6.2 위에 확장된 커스텀 클래스 목록
>
> **네이밍 컨벤션**: `{컴포넌트}-digitek-{수식어}` (예: `btn-digitek-primary`, `sidebar-digitek-expanded`)

---

## 목차

1. [디자인 토큰 (CSS Variables)](#1-디자인-토큰-css-variables)
2. [Button (버튼)](#2-button-버튼)
3. [Input (입력 필드)](#3-input-입력-필드)
4. [Select (셀렉트)](#4-select-셀렉트)
5. [DateSelect (날짜 선택)](#5-dateselect-날짜-선택)
6. [Badge (배지)](#6-badge-배지)
7. [TabButton (탭)](#7-tabbutton-탭)
8. [Pagination (페이지네이션)](#8-pagination-페이지네이션)
9. [Accordion (아코디언)](#9-accordion-아코디언)
10. [Fieldset (필드셋)](#10-fieldset-필드셋)
11. [FormField / FormGrid](#11-formfield--formgrid)
12. [Breadcrumb (브레드크럼)](#12-breadcrumb-브레드크럼)
13. [FileUpload (파일 업로드)](#13-fileupload-파일-업로드)
14. [Progress (프로그레스)](#14-progress-프로그레스)
15. [ColorAsset (색상 선택)](#15-colorasset-색상-선택)
16. [Table (테이블)](#16-table-테이블)
17. [TextEditor (텍스트 에디터)](#17-texteditor-텍스트-에디터)
18. [GNB (Global Navigation Bar)](#18-gnb-global-navigation-bar)
19. [Sidebar (사이드바)](#19-sidebar-사이드바)
20. [Layout (앱 레이아웃)](#20-layout-앱-레이아웃)
21. [유틸리티 클래스](#21-유틸리티-클래스)
22. [CodeBlock (코드 블록)](#22-codeblock-코드-블록)
23. [페이지별 레이아웃 클래스](#23-페이지별-레이아웃-클래스)

---

## 1. 디자인 토큰 (CSS Variables)

`:root`에 정의된 CSS 커스텀 프로퍼티. 모든 컴포넌트에서 참조됨.

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--digitek-primary` | `#2f66ba` | 브랜드 메인 컬러 |
| `--digitek-primary-hover` | `#1f489b` | 브랜드 hover |
| `--digitek-primary-bg` | `rgba(47,102,186,0.04)` | 브랜드 배경 |
| `--digitek-text-primary` | `#111` | 본문 텍스트 |
| `--digitek-text-secondary` | `#555` | 보조 텍스트 |
| `--digitek-text-tertiary` | `#767676` | 3차 텍스트 |
| `--digitek-text-placeholder` | `#767676` | placeholder |
| `--digitek-text-disabled` | `#999` | 비활성 텍스트 |
| `--digitek-text-white` | `#fff` | 밝은 텍스트 |
| `--digitek-success` | `#29c23b` | 성공 |
| `--digitek-error` | `#dc0000` | 에러 |
| `--digitek-warning` | `#f09436` | 경고 |
| `--digitek-info` | `#0088ff` | 정보 |
| `--digitek-border` | `#e5e5ec` | 기본 보더 |
| `--digitek-border-focus` | `#0875e3` | 포커스 보더 |
| `--digitek-bg-white` | `#fff` | 흰색 배경 |
| `--digitek-bg-gray` | `#f7f7fb` | 회색 배경 |
| `--digitek-bg-dark` | `#555` | 어두운 배경 |
| `--digitek-font-family` | `'Pretendard', ...` | 기본 폰트 |
| `--digitek-shadow-dropdown` | `0px 4px 8px ...` | 드롭다운 그림자 |
| `--digitek-shadow-calendar` | `0px 0px 1px ...` | 캘린더 그림자 |
| `--digitek-split-search-width` | `28%` | SearchSplit 검색패널 너비 |
| `--digitek-split-search-min` | `350px` | SearchSplit 검색패널 최소 |
| `--digitek-split-detail-width` | `35%` | SearchSplit 상세패널 너비 |
| `--digitek-split-detail-min` | `450px` | SearchSplit 상세패널 최소 |
| `--digitek-pms-info-left-width` | `24%` | PMS 좌측 정보 너비 |
| `--digitek-pms-gantt-table-width` | `46.5%` | 간트 테이블 너비 |
| `--digitek-gantt-week-cell` | `60px` | 간트 주간 셀 너비 |
| `--sidebar-item-height` | `36px` | 사이드바 메뉴 항목 높이 |

---

## 2. Button (버튼)

```html
<button class="btn-digitek btn-digitek-primary btn-digitek-44">확인</button>
```

| 클래스 | 설명 |
|--------|------|
| `.btn-digitek` | 버튼 베이스 (inline-flex, font-weight 600) |
| `.btn-digitek-primary` | 파란 배경 + 흰 글씨 |
| `.btn-digitek-secondary` | 회색(#555) 배경 + 흰 글씨 |
| `.btn-digitek-outline` | 흰 배경 + 보더 |
| `.btn-digitek-24` | 높이 24px (font 12px) |
| `.btn-digitek-36` | 높이 36px (font 13px) |
| `.btn-digitek-44` | 높이 44px (font 14px) |
| `.btn-digitek-48` | 높이 48px (font 14px) |
| `.btn-digitek-56` | 높이 56px (font 16px) |
| `.btn-digitek-icon-plain` | 투명 아이콘 전용 버튼 |

**상태**: `:hover`, `:disabled` 스타일 자동 적용

---

## 3. Input (입력 필드)

```html
<label class="input-digitek-label input-digitek-label-required">제목</label>
<div class="input-digitek">
  <input class="input-digitek-field" placeholder="입력...">
</div>
```

| 클래스 | 설명 |
|--------|------|
| `.input-digitek-label` | 인풋 라벨 (14px, 600) |
| `.input-digitek-label-required` | 필수 표시 (* 붙음) |
| `.input-digitek` | 인풋 래퍼 (border + padding) |
| `.input-digitek-field` | 실제 input 요소 스타일 |
| `.input-digitek-disabled` | 비활성 상태 |
| `.input-digitek-error` | 에러 보더 (빨강) |
| `.input-digitek-success` | 성공 보더 (초록) |
| `.input-digitek-error-msg` | 에러 메시지 텍스트 |
| `.input-digitek-success-msg` | 성공 메시지 텍스트 |
| `.input-digitek-gnb` | GNB 검색 인풋 (pill 형태) |
| `.input-digitek-gnb-field` | GNB 검색 input 요소 |
| `.input-digitek-sm` | 테이블 인라인 인풋 (축소) |

---

## 4. Select (셀렉트)

```html
<div class="select-digitek">
  <button class="select-digitek-trigger">
    <span class="select-digitek-text">선택</span>
    <span class="select-digitek-icon">▼</span>
  </button>
  <div class="select-digitek-dropdown">
    <button class="select-digitek-option">옵션 1</button>
  </div>
</div>
```

| 클래스 | 설명 |
|--------|------|
| `.select-digitek` | 셀렉트 컨테이너 (relative, 335px) |
| `.select-digitek-trigger` | 트리거 버튼 |
| `.select-digitek-trigger-open` | 드롭다운 열림 상태 |
| `.select-digitek-trigger-disabled` | 비활성 상태 |
| `.select-digitek-text` | 선택값 텍스트 |
| `.select-digitek-placeholder` | placeholder 컬러 |
| `.select-digitek-icon` | 드롭다운 아이콘 |
| `.select-digitek-dropdown` | 드롭다운 목록 |
| `.select-digitek-option` | 개별 옵션 |
| `.select-digitek-option-selected` | 선택된 옵션 (bold) |

---

## 5. DateSelect (날짜 선택)

| 클래스 | 설명 |
|--------|------|
| `.date-select-digitek` | 컨테이너 |
| `.date-select-digitek-trigger` | 트리거 버튼 |
| `.date-select-digitek-trigger-focused` | 포커스 상태 |
| `.date-select-digitek-trigger-disabled` | 비활성 상태 |
| `.date-select-digitek-text` | 날짜 텍스트 |
| `.date-select-digitek-placeholder` | placeholder |
| `.date-select-digitek-calendar` | 캘린더 팝업 |
| `.date-select-digitek-calendar-header` | 캘린더 헤더 |
| `.date-select-digitek-calendar-title` | 월/년 제목 |
| `.date-select-digitek-nav-btn` | 이전/다음 버튼 |
| `.date-select-digitek-grid` | 날짜 그리드 |
| `.date-select-digitek-week-header` | 요일 헤더 |
| `.date-select-digitek-day-header` | 요일 셀 |
| `.date-select-digitek-month-weeks` | 주 행 컨테이너 |
| `.date-select-digitek-week-row` | 주 행 |
| `.date-select-digitek-day` | 날짜 셀 |
| `.date-select-digitek-day-weekend` | 주말 (빨강) |
| `.date-select-digitek-day-other-month` | 이전/다음 달 (투명) |
| `.date-select-digitek-day-selected` | 선택된 날짜 (파랑 배경) |

---

## 6. Badge (배지)

### 알림 배지

| 클래스 | 설명 |
|--------|------|
| `.badge-digitek-notification` | 빨간 원형 알림 배지 |
| `.badge-digitek-notification-single` | 한 자리 (20px 원형) |
| `.badge-digitek-notification-multi` | 두 자리 이상 (pill) |

### 상태 아이콘 배지

| 클래스 | 설명 |
|--------|------|
| `.badge-digitek-status-icon` | 원형 상태 아이콘 (38px) |
| `.badge-digitek-status-icon-blue` | 파랑 배경 |
| `.badge-digitek-status-icon-green` | 초록 배경 |
| `.badge-digitek-status-icon-gray` | 회색 배경 |
| `.badge-digitek-status-icon-text` | 아이콘 내 텍스트 |

### 권한 배지

| 클래스 | 설명 |
|--------|------|
| `.badge-digitek-permission` | 권한 pill 배지 |
| `.badge-digitek-permission-approved` | 승인 (초록) |
| `.badge-digitek-permission-rejected` | 거부 (빨강) |
| `.badge-digitek-permission-pending` | 대기 (회색) |
| `.badge-digitek-dot` | 작은 dot (5px) |
| `.badge-digitek-permission-dot` | 권한 dot |
| `.badge-digitek-dot-approved` | 승인 dot (초록) |
| `.badge-digitek-dot-rejected` | 거부 dot (빨강) |
| `.badge-digitek-dot-pending` | 대기 dot (회색) |

### 진행 상태 배지

| 클래스 | 설명 |
|--------|------|
| `.badge-digitek-progress` | 진행 상태 컨테이너 |
| `.badge-digitek-progress-dot` | 진행 dot (8px) |
| `.badge-digitek-dot-waiting` | 대기 (회색) |
| `.badge-digitek-dot-before-start` | 시작 전 (주황) |
| `.badge-digitek-dot-in-progress` | 진행 중 (초록) |
| `.badge-digitek-dot-completed` | 완료 (파랑) |
| `.badge-digitek-dot-delayed` | 지연 (빨강) |
| `.badge-digitek-progress-text` | 진행 텍스트 |

### 기타 배지

| 클래스 | 설명 |
|--------|------|
| `.badge-digitek-category` | 항목 구분 배지 (파랑 텍스트) |
| `.badge-digitek-assignee` | 담당자 배지 (pill, 파랑 보더) |
| `.badge-digitek-priority` | 중요도 dots 컨테이너 |
| `.badge-digitek-priority-dot` | 중요도 dot (11px) |
| `.badge-digitek-priority-dot-filled` | 채워진 dot |
| `.badge-digitek-priority-dot-empty` | 빈 dot |
| `.badge-digitek-timeline` | 타임라인 배지 |
| `.badge-digitek-timeline-{blue,orange,green,red}` | 색상 변형 |
| `.badge-digitek-timeline-bar` | 타임라인 바 (세로) |
| `.badge-digitek-avatar` | 프로필 아바타 (22px) |
| `.badge-digitek-level` | 레벨 배지 (라벨+값) |
| `.badge-digitek-outline-primary` | 아웃라인 배지 |

---

## 7. TabButton (탭)

```html
<div class="tab-digitek-group">
  <button class="tab-digitek tab-digitek-lg tab-digitek-active">탭 1</button>
  <button class="tab-digitek tab-digitek-lg">탭 2</button>
</div>
```

| 클래스 | 설명 |
|--------|------|
| `.tab-digitek-group` | 탭 그룹 컨테이너 (회색 배경) |
| `.tab-digitek-group-auto` | 콘텐츠 너비 맞춤 |
| `.tab-digitek` | 탭 버튼 |
| `.tab-digitek-active` | 활성 탭 (흰 배경) |
| `.tab-digitek-lg` | 큰 탭 (16px) |
| `.tab-digitek-sm` | 작은 탭 (14px) |

---

## 8. Pagination (페이지네이션)

| 클래스 | 설명 |
|--------|------|
| `.pagination-digitek` | 페이지네이션 컨테이너 |
| `.page-link-digitek` | 페이지 버튼 (36x36) |
| `.page-link-digitek-active` | 활성 페이지 (파랑) |
| `.page-link-digitek-disabled` | 비활성 페이지 |

---

## 9. Accordion (아코디언)

### 페이지 아코디언 (파란 헤더)

| 클래스 | 설명 |
|--------|------|
| `.accordion-digitek-page` | 컨테이너 |
| `.accordion-digitek-page-header` | 헤더 (파란 배경) |
| `.accordion-digitek-page-header-open` | 열린 상태 (하단 둥근 모서리 제거) |
| `.accordion-digitek-page-title` | 제목 (흰 글씨, 18px) |
| `.accordion-digitek-page-content` | 내용 영역 |

### 이너 아코디언 (흰 헤더)

| 클래스 | 설명 |
|--------|------|
| `.accordion-digitek-inner` | 컨테이너 |
| `.accordion-digitek-inner-header` | 헤더 (흰 배경, 보더) |
| `.accordion-digitek-inner-header-open` | 열린 상태 |
| `.accordion-digitek-inner-title` | 제목 (파란 글씨, 16px) |
| `.accordion-digitek-inner-header-right` | 헤더 우측 영역 |
| `.accordion-digitek-inner-content` | 내용 영역 |
| `.accordion-digitek-inner--table` | 테이블용 변형 (패딩 제거) |

### 공통

| 클래스 | 설명 |
|--------|------|
| `.accordion-digitek-chevron` | 쉐브론 아이콘 |
| `.accordion-digitek-chevron-closed` | 닫힌 상태 (180deg 회전) |

---

## 10. Fieldset (필드셋)

| 클래스 | 설명 |
|--------|------|
| `.fieldset-digitek` | 필드셋 컨테이너 (보더) |
| `.fieldset-digitek-legend` | 범례 |
| `.fieldset-digitek-content` | 내용 영역 |
| `.fieldset-digitek-compact` | 좁은 패딩 변형 |
| `.fieldset-digitek-gray` | 회색 배경 변형 |
| `.fieldset-digitek-no-legend` | 범례 없는 변형 |

---

## 11. FormField / FormGrid

| 클래스 | 설명 |
|--------|------|
| `.formfield-digitek` | 폼 필드 래퍼 (세로 정렬, gap 8px) |
| `.formfield-digitek-label` | 폼 라벨 (14px, 파랑) |
| `.formfield-digitek-label-required` | 필수 표시 (* 추가) |
| `.formfield-digitek-grid` | 폼 그리드 (세로, gap 16px) |
| `.formfield-digitek-row` | 폼 행 (가로, gap 16px) |

### 결재자 지정

| 클래스 | 설명 |
|--------|------|
| `.approval-designator` | 결재자 지정 컨테이너 |
| `.approval-designator-header` | 헤더 |
| `.approval-designator-title` | 제목 |
| `.approval-line-item` | 결재 라인 항목 |
| `.approval-line-step` | 단계 번호 (원형) |
| `.approval-line-info` | 결재자 정보 |

### 담당자 태그

| 클래스 | 설명 |
|--------|------|
| `.assignee-tags-list` | 태그 목록 (flex wrap) |
| `.assignee-tag` | 담당자 태그 (pill, 파랑) |
| `.assignee-tag-remove` | 태그 삭제 버튼 |

---

## 12. Breadcrumb (브레드크럼)

```html
<ol class="breadcrumb-digitek">
  <li class="breadcrumb-digitek-item">
    <a class="breadcrumb-digitek-depth breadcrumb-digitek-clickable">홈</a>
    <i class="dicon dicon-breadcrumb-separator"></i>
  </li>
</ol>
```

| 클래스 | 설명 |
|--------|------|
| `.breadcrumb-digitek` | 컨테이너 |
| `.breadcrumb-digitek-item` | 항목 |
| `.breadcrumb-digitek-depth` | 경로 텍스트 |
| `.breadcrumb-digitek-clickable` | 클릭 가능 |
| `.breadcrumb-digitek-back-btn` | 뒤로가기 버튼 |

---

## 13. FileUpload (파일 업로드)

| 클래스 | 설명 |
|--------|------|
| `.file-upload-digitek` | 업로드 존 (대시 보더) |
| `.file-upload-digitek-dragging` | 드래그 중 |
| `.file-upload-digitek-icon` | 업로드 아이콘 |
| `.file-upload-digitek-label` | 안내 텍스트 |
| `.file-upload-digitek-input` | 숨김 input[type=file] |
| `.file-upload-digitek-file-list` | 파일 목록 컨테이너 |

---

## 14. Progress (프로그레스)

### 원형 프로그레스

```html
<span class="progress-digitek-circular" style="--percent: 75;"></span>
```

| 클래스 | 설명 |
|--------|------|
| `.progress-digitek-circular` | conic-gradient 원형 프로그레스 |

커스터마이징: `--progress-size`, `--progress-color`, `--progress-bg` CSS 변수 오버라이드

### 직선 프로그레스

```html
<div class="progress-digitek-linear" style="--percent: 65;"></div>
```

Thymeleaf: `<div class="progress-digitek-linear" th:style="'--percent:' + ${progress}"></div>`

| 클래스 | 설명 |
|--------|------|
| `.progress-digitek-linear` | 직선 프로그레스바 |

커스터마이징: `--progress-width` (기본 200px), `--progress-height` (기본 6px), `--progress-color`, `--progress-bg` CSS 변수 오버라이드

---

## 15. ColorAsset (색상 선택)

| 클래스 | 설명 |
|--------|------|
| `.color-asset-digitek` | 색상 원형 (20px) |
| `.color-asset-digitek-{black,red,blue,orange,green,gray}` | 색상 변형 |
| `.color-asset-digitek-selected` | 선택 상태 (ring) |
| `.color-asset-digitek-checkmark` | 체크마크 오버레이 |

---

## 16. Table (테이블)

### 데이터 테이블

| 클래스 | 설명 |
|--------|------|
| `.table-digitek-scroll` | 스크롤 컨테이너 (max-height 320px) |
| `.table-digitek` | 테이블 베이스 |
| `.table-digitek-checkbox` | 체크박스 열 (64px) |
| `.table-digitek-input-row` | 인풋 행 (회색 배경) |
| `.table-digitek-date` | 날짜 셀 (아이콘 + 텍스트) |
| `.table-digitek-actions` | 액션 버튼 영역 |
| `.table-digitek-col-fixed` | 고정 너비 열 (300px) |

### 2열 Bordered 테이블

| 클래스 | 설명 |
|--------|------|
| `.table-digitek-bordered` | 보더 테이블 (separate spacing) |
| `.table-digitek-cell` | 셀 내부 flex 레이아웃 |
| `.table-digitek-action-links` | 액션 링크 그룹 |
| `.table-digitek-action-link` | 파랑 밑줄 링크 |
| `.table-digitek-action-link-muted` | 회색 밑줄 링크 |

### 드래그앤드롭

| 클래스 | 설명 |
|--------|------|
| `.draggable-row` | 드래그 가능 행 |
| `.draggable-row.drag-over` | 드래그 오버 상태 |
| `.drag-handle` | 드래그 핸들 (grab cursor) |

---

## 17. TextEditor (텍스트 에디터)

| 클래스 | 설명 |
|--------|------|
| `.text-editor-digitek` | 에디터 컨테이너 |
| `.text-editor-digitek-toolbar` | 툴바 |
| `.text-editor-digitek-toolbar-group` | 툴바 버튼 그룹 |
| `.text-editor-digitek-icon-btn` | 아이콘 버튼 |
| `.text-editor-digitek-icon-btn-active` | 활성 아이콘 버튼 |
| `.text-editor-digitek-bar-btn` | 텍스트+아이콘 버튼 |
| `.text-editor-digitek-contents` | 편집 영역 (contenteditable) |
| `.text-editor-digitek-dropdown-container` | 드롭다운 래퍼 |
| `.text-editor-digitek-split-btn` | 스플릿 버튼 |
| `.text-editor-digitek-size-btn` | 글씨 크기 버튼 |
| `.text-editor-digitek-chevron-btn` | 드롭다운 쉐브론 |
| `.text-editor-digitek-color-btn` | 색상 버튼 |
| `.text-editor-digitek-color-dot` | 색상 dot |
| `.text-editor-digitek-dropdown` | 드롭다운 메뉴 |
| `.text-editor-digitek-size-dropdown` | 글씨 크기 드롭다운 |
| `.text-editor-digitek-size-item` | 글씨 크기 옵션 |
| `.text-editor-digitek-size-{body,subheading,heading,title}` | 크기별 프리뷰 |
| `.text-editor-digitek-align-dropdown` | 정렬 드롭다운 |
| `.text-editor-digitek-align-item` | 정렬 옵션 |
| `.text-editor-digitek-color-dropdown` | 색상 드롭다운 |
| `.text-editor-digitek-color-list` | 색상 목록 |
| `.text-editor-digitek-color-swatch` | 색상 견본 |
| `.text-editor-digitek-selected` | 선택 상태 |
| `.text-editor-digitek-popover` | 링크 팝오버 |
| `.text-editor-digitek-popover-input` | 링크 URL 입력 |
| `.text-editor-digitek-popover-btn` | 링크 확인 버튼 |
| `.text-editor-digitek-attachment` | 첨부파일 카드 |
| `.text-editor-digitek-attachment-name` | 파일명 |
| `.text-editor-digitek-attachment-size` | 파일 크기 |
| `.text-editor-digitek-attachment-remove` / `-close` | 삭제 버튼 |
| `.text-editor-digitek-image-resize-overlay` | 이미지 리사이즈 오버레이 |
| `.text-editor-digitek-resize-handle` | 리사이즈 핸들 |
| `.text-editor-digitek-resize-handle-se` | 우하단 핸들 |

---

## 18. GNB (Global Navigation Bar)

```html
<header class="gnb-digitek">
  <div class="gnb-digitek-search-wrap">
    <input class="gnb-digitek-search-field" placeholder="검색...">
  </div>
  <div class="gnb-digitek-right">
    <div class="gnb-digitek-icon-group">...</div>
    <div class="gnb-digitek-profile">
      <div class="gnb-digitek-avatar">...</div>
      <span class="gnb-digitek-profile-name">홍길동</span>
    </div>
  </div>
</header>
```

| 클래스 | 설명 |
|--------|------|
| `.gnb-digitek` | GNB 컨테이너 (flex, between) |
| `.gnb-digitek-search-wrap` | 검색 래퍼 (pill, 480px) |
| `.gnb-digitek-search-field` | 검색 input |
| `.gnb-digitek-icon-btn` | 아이콘 버튼 (알림, 메일) |
| `.gnb-digitek-badge` | 알림 배지 (absolute, 빨강) |
| `.gnb-digitek-right` | 우측 영역 |
| `.gnb-digitek-icon-group` | 아이콘 그룹 |
| `.gnb-digitek-profile` | 프로필 영역 |
| `.gnb-digitek-avatar` | 프로필 아바타 (32px) |
| `.gnb-digitek-profile-name` | 프로필 이름 |
| `.gnb-digitek-locale-wrap` | 다국어 래퍼 |
| `.gnb-digitek-locale-btn` | 다국어 버튼 |
| `.gnb-digitek-locale-dropdown` | 다국어 드롭다운 |
| `.gnb-digitek-locale-option` | 다국어 옵션 |

---

## 19. Sidebar (사이드바)

### 구조

```html
<div class="sidebar-digitek-container">
  <nav class="sidebar-digitek sidebar-digitek-expanded">
    <div class="sidebar-digitek-header">
      <div class="sidebar-digitek-logo sidebar-logo-full">...</div>
      <div class="sidebar-digitek-logo sidebar-logo-collapsed">...</div>
      <button class="sidebar-collapse-handle sidebar-toggle-btn">...</button>
    </div>
    <div class="sidebar-digitek-menu-area">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="sidebar-digitek-menu-item sidebar-digitek-active">
            <span class="sidebar-digitek-icon-label">
              <i class="dicon dicon-file-blank icon-digitek-20"></i>
              <span class="sidebar-digitek-menu-label">메뉴</span>
            </span>
            <span class="sidebar-digitek-chevron">...</span>
          </a>
          <ul class="sidebar-digitek-submenu">
            <li class="nav-item">
              <a class="sidebar-digitek-submenu-item">서브메뉴</a>
              <ul class="sidebar-digitek-sub-submenu">
                <li class="nav-item">
                  <a class="sidebar-digitek-sub-submenu-item">3레벨</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</div>
```

### 레이아웃

| 클래스 | 설명 |
|--------|------|
| `.sidebar-digitek-container` | 사이드바 외부 래퍼 |
| `.sidebar-digitek` | 사이드바 본체 (파란 배경) |
| `.sidebar-digitek-expanded` | 펼침 상태 (250px) |
| `.sidebar-digitek-collapsed` | 접힘 상태 (96px) |
| `.sidebar-digitek-header` | 헤더 (로고 + 토글) |
| `.sidebar-digitek-logo` | 로고 래퍼 |
| `.sidebar-logo-full` | 펼침 로고 |
| `.sidebar-logo-collapsed` | 접힘 로고 |
| `.sidebar-collapse-handle` | 접기 버튼 (28x28) |
| `.sidebar-toggle-btn` | 토글 버튼 (JS 이벤트 대상) |
| `.sidebar-digitek-menu-area` | 메뉴 스크롤 영역 |

### 메뉴 항목

| 클래스 | 설명 |
|--------|------|
| `.sidebar-digitek-menu-item` | 1레벨 메뉴 |
| `.sidebar-digitek-menu-label` | 메뉴 텍스트 (15px, 600) |
| `.sidebar-digitek-icon-label` | 아이콘+라벨 래퍼 (gap 16px) |
| `.sidebar-digitek-chevron` | 쉐브론 아이콘 (ml-auto) |
| `.sidebar-digitek-chevron-open` | 열린 상태 (180deg 회전) |
| `.sidebar-digitek-submenu` | 2레벨 서브메뉴 컨테이너 |
| `.sidebar-digitek-submenu-item` | 2레벨 메뉴 항목 |
| `.sidebar-digitek-submenu-icon` | 서브메뉴 아이콘 (20px) |
| `.sidebar-digitek-sub-submenu` | 3레벨 서브메뉴 컨테이너 |
| `.sidebar-digitek-sub-submenu-item` | 3레벨 메뉴 항목 |

### 상태 클래스

| 클래스 | 설명 |
|--------|------|
| `.sidebar-digitek-active` | 현재 활성 메뉴 (흰 배경, 파란 글씨) |
| `.sidebar-digitek-parent-open` | 서브메뉴 열린 부모 (반투명 흰 배경) |
| `.sidebar-digitek-sub-active` | 3레벨 활성 항목 |

### PNG 아이콘

| 클래스 | 설명 |
|--------|------|
| `.sidebar-icon-png` | PNG 아이콘 이미지 (20px, filter: invert) |

> **Thymeleaf 통합**: `th:classappend="${...} ? 'sidebar-digitek-active'"` 로 서버에서 active 상태 주입

---

## 20. Layout (앱 레이아웃)

| 클래스 | 설명 |
|--------|------|
| `.layout-digitek` | 최상위 레이아웃 (flex, 100vh) |
| `.layout-digitek-main-area` | 메인 영역 (사이드바 제외) |
| `.layout-digitek-content` | 콘텐츠 영역 (스크롤) |
| `.main-page-grid` | 메인 페이지 6열 그리드 |
| `.main-page-area` | 메인 페이지 영역 카드 |

---

## 21. 유틸리티 클래스

Bootstrap 4 미지원 유틸리티를 보완합니다. 네이밍: `.{속성}-digitek-{값}`

### Gap

`.gap-digitek-{2,4,6,8,10,12,16,20,24,32,40,48}`

### Width (px)

`.w-digitek-{16,20,24,32,40,48,60,80,96,100,120,140,160,180,200,240,250,280,300,320,360,400,480}`
`.w-digitek-full` (100%), `.w-digitek-auto`

### Height (px)

`.h-digitek-{16,20,24,28,32,36,38,40,44,48,56,64,80,100,120,160,200,240,300,400,500}`
`.h-digitek-full` (100%), `.h-digitek-screen` (100vh), `.h-digitek-auto`

### Min/Max Width

`.min-w-digitek-{0,60,80,100,120,160,200,full}`
`.max-w-digitek-{200,300,400,480,600,800,full,none}`

### Min/Max Height

`.min-h-digitek-{0,100,200,300,400,full,screen}`
`.max-h-digitek-{200,300,320,400,500,600,full,screen,none}`

### Icon 크기

`.icon-digitek-{11,13,14,16,20,24,30,32,37,48}` — width + height 동시 지정

### Overflow

`.overflow-digitek-{hidden,auto,scroll,visible}`
`.overflow-x-digitek-{auto,hidden}`, `.overflow-y-digitek-{auto,hidden}`

### Text Overflow

| 클래스 | 설명 |
|--------|------|
| `.text-digitek-truncate` | 한 줄 말줄임 |
| `.text-digitek-line-clamp-2` | 2줄 말줄임 |
| `.text-digitek-line-clamp-3` | 3줄 말줄임 |

### Position

`.pos-digitek-{relative,absolute,fixed,sticky,static}`
`.{top,right,bottom,left}-digitek-0`, `.inset-digitek-0`

### Flex

`.flex-digitek-{1,auto,none}`
`.flex-digitek-grow-{0,1}`, `.flex-digitek-shrink-{0,1}`
`.flex-digitek-basis-{0,auto}`

### Border

`.border-digitek`, `.border-digitek-{top,bottom,left,right}`, `.border-digitek-0`

### Border Radius

`.rounded-digitek-{0,2,4,6,8,12,full}`

### Cursor

`.cursor-digitek-{pointer,default,not-allowed}`

### 배경색

| 클래스 | 색상 |
|--------|------|
| `.bg-digitek-white` | #fff |
| `.bg-digitek-gray` | #f7f7fb |
| `.bg-digitek-primary` | #2f66ba |
| `.bg-digitek-primary-light` | rgba(47,102,186,0.04) |
| `.bg-digitek-success` | rgba(41,194,59,0.08) |
| `.bg-digitek-error` | rgba(220,0,0,0.08) |
| `.bg-digitek-pending` | rgba(153,153,153,0.08) |

### 텍스트 색상

| 클래스 | 색상 |
|--------|------|
| `.text-digitek-primary` | #111 |
| `.text-digitek-secondary` | #555 |
| `.text-digitek-tertiary` | #767676 |
| `.text-digitek-placeholder` | #767676 |
| `.text-digitek-disabled` | #999 |
| `.text-digitek-white` | #fff |
| `.text-digitek-blue` | #2f66ba |
| `.text-digitek-success` | #29c23b |
| `.text-digitek-error` | #dc0000 |
| `.text-digitek-warning` | #f09436 |

### Font Size

`.fs-digitek-{11,12,13,14,15,16,18,20,24}`

### Font Weight

`.fw-digitek-{400,500,600,700}`

---

## 22. CodeBlock (코드 블록)

| 클래스 | 설명 |
|--------|------|
| `.codeblock-digitek` | 코드 블록 컨테이너 |
| `.codeblock-digitek-header` | 헤더 (언어명 + 복사 버튼) |
| `.codeblock-digitek-title` | 언어 제목 |
| `.codeblock-digitek-copy-btn` | 복사 버튼 |
| `.codeblock-digitek-pre` | pre 래퍼 |
| `.codeblock-digitek-code` | code 요소 |

---

## 23. 페이지별 레이아웃 클래스

### 의뢰등록 (Request Registration) — `digitek-*`

| 클래스 | 설명 |
|--------|------|
| `.digitek-form-page` | 페이지 컨테이너 (회색 배경, padding 32px) |
| `.digitek-page-header` | 헤더 (제목 + 액션) |
| `.digitek-page-title` | 페이지 제목 (28px) |
| `.digitek-page-header-actions` | 액션 버튼 그룹 |
| `.digitek-sections` | 섹션 컨테이너 (gap 24px) |
| `.digitek-form-grid` | 폼 그리드 (세로, gap 16px) |
| `.digitek-form-row` | 폼 행 (가로) |
| `.digitek-form-field` | 폼 필드 래퍼 |
| `.digitek-form-label` | 폼 라벨 (파랑) |
| `.digitek-form-label-required` | 필수 라벨 (* 추가) |
| `.digitek-editor-wrap` | 에디터 래퍼 (TextEditor 포함) |
| `.digitek-file-card` | 파일 카드 (320px) |
| `.table-digitek` | 데이터 테이블 |
| `.digitek-approval-table` | 결재 정보 테이블 |
| `.digitek-role-badge` | 역할 배지 (pill) |
| `.digitek-action-link` | 액션 링크 (파랑 밑줄) |

### PMS (Project Management System) — `digitek-*`

| 클래스 | 설명 |
|--------|------|
| `.digitek-dashboard-page` | 페이지 컨테이너 (흰 배경) |
| `.digitek-page-header` | 헤더 |
| `.digitek-page-title-sm` | 제목 (24px) |
| `.digitek-phase-stepper` | 단계 표시기 |
| `.digitek-phase-step` | 단계 항목 |
| `.digitek-phase-step-active` | 활성 단계 (초록 배경) |
| `.digitek-info-grid` | 정보 그리드 |
| `.digitek-info-section` | 정보 섹션 (좌-우 분할) |
| `.digitek-customer-timeline` | 고객 타임라인 |
| `.digitek-milestone` | 마일스톤 |
| `.digitek-dashboard-tabs` | 탭 영역 |
| `.digitek-filter-bar` | 필터 바 |
| `.digitek-action-chip` | 액션 칩 |
| `.digitek-legend` | 범례 |

### PMS 간트차트 — `digitek-gantt-*`

| 클래스 | 설명 |
|--------|------|
| `.digitek-gantt` | 간트 컨테이너 |
| `.digitek-gantt-container` | 간트 내부 flex |
| `.digitek-gantt-table-wrap` | 좌측 테이블 래퍼 |
| `.digitek-gantt-resizer` | 리사이저 (4px) |
| `.digitek-gantt-table` | 테이블 |
| `.digitek-gantt-row-{project,level-0,level-1,level-2}` | 행 레벨 |
| `.digitek-gantt-task-name` | 태스크 이름 |
| `.digitek-gantt-toggle` | 펼침/접힘 토글 |
| `.digitek-gantt-timeline-wrap` | 우측 타임라인 래퍼 |
| `.digitek-gantt-timeline` | 타임라인 |
| `.digitek-gantt-header` | 타임라인 헤더 (sticky) |
| `.digitek-gantt-bar` | 간트 바 (absolute, pill) |
| `.digitek-gantt-bar-{blue,green,orange,red,gray}` | 바 색상 |
| `.digitek-gantt-today` | 오늘 마커 (주황 선) |
| `.digitek-gantt-col-{task,priority,level,role,date,status}` | 열 너비 |

### 검색 목록형 (Search List) — `digitek-search-*`

| 클래스 | 설명 |
|--------|------|
| `.digitek-search-page` | 페이지 컨테이너 (회색 배경) |
| `.digitek-search-content` | 콘텐츠 래퍼 |
| `.digitek-search-header` | 헤더 (제목 + 브레드크럼) |
| `.digitek-search-title` | 페이지 제목 (28px) |
| `.digitek-search-panel` | 검색 패널 (흰 카드) |
| `.digitek-search-row` | 검색 행 |
| `.digitek-field` | 필드 래퍼 (flex-1) |
| `.digitek-field-fixed` | 고정 너비 필드 (210px) |
| `.digitek-field-label` | 필드 라벨 (파랑) |
| `.digitek-search-input` | 검색 인풋 (아이콘 포함) |
| `.digitek-search-actions` | 검색 액션 영역 |
| `.digitek-filter-toggle` | 필터 토글 버튼 |
| `.digitek-search-filter-area` | 필터 영역 (숨김/표시) |
| `.digitek-search-filter-area.show` | 필터 표시 상태 |
| `.digitek-search-filter-row` | 필터 행 |
| `.digitek-search-legacy-checkbox-wrap` | 구객체 체크박스 래퍼 |
| `.digitek-search-legacy-label` | 구객체 라벨 |
| `.digitek-search-legacy-warning` | 구객체 경고 (빨강) |
| `.digitek-search-results` | 결과 영역 (흰 카드) |
| `.digitek-results-header` | 결과 헤더 |
| `.digitek-results-title` | 결과 제목 |
| `.digitek-search-results-count` | 건수 (파랑) |
| `.digitek-search-results-toggle` | 아코디언 토글 |
| `.digitek-results-actions` | 결과 액션 |
| `.digitek-search-view-option` | 보기 옵션 |
| `.digitek-search-pagination` | 페이지네이션 래퍼 |

### 검색 분할형 (Search Split) — `digitek-split-*`

| 클래스 | 설명 |
|--------|------|
| `.digitek-split-body` | 3패널 레이아웃 (flex) |
| `.digitek-split-body-detail-open` | 상세 패널 열림 |
| `.digitek-split-body-fullview` | 전체 보기 (상세만 표시) |
| `.digitek-split-search-collapsed` | 검색 패널 접힘 |
| `.digitek-split-panel-wrapper` | 검색 패널 래퍼 (28%) |
| `.digitek-split-search-panel` | 검색 패널 |
| `.digitek-split-header` | 검색 헤더 |
| `.digitek-split-title` | 페이지 제목 (28px) |
| `.digitek-split-search-fields` | 검색 필드 그룹 |
| `.digitek-split-search-input` | 검색 인풋 |
| `.digitek-split-divider` | 구분선 |
| `.digitek-filter-toggle` | 필터 토글 |
| `.digitek-split-filter-area` | 필터 영역 |
| `.digitek-split-filter-row` | 필터 행 (2열) |
| `.digitek-field` | 필드 래퍼 |
| `.digitek-field-label` | 필드 라벨 (파랑) |
| `.digitek-split-search-collapse-handle` | 검색 패널 접기 핸들 |
| `.digitek-split-results` | 결과 영역 |
| `.digitek-split-view-tabs` | 뷰 탭 (나란히/펼쳐서) |
| `.digitek-split-view-tab` | 뷰 탭 버튼 |
| `.digitek-split-results-card` | 결과 카드 |
| `.digitek-results-header` | 결과 헤더 |
| `.digitek-results-title` | 결과 제목 |
| `.digitek-split-results-count` | 건수 (파랑) |
| `.digitek-split-results-toggle` | 아코디언 토글 |
| `.digitek-split-table-wrap` | 테이블 래퍼 |
| `.digitek-split-table-row` | 테이블 행 (클릭 가능) |
| `.digitek-split-table-row.active` | 선택 행 |
| `.digitek-split-pagination` | 페이지네이션 |
| `.digitek-split-detail` | 상세 패널 (absolute, right) |
| `.digitek-split-detail-header` | 상세 헤더 |
| `.digitek-split-detail-title` | 상세 제목 (28px) |
| `.digitek-split-detail-body` | 상세 본문 (스크롤) |
| `.digitek-split-detail-section` | 상세 섹션 |
| `.digitek-split-section-divider` | 섹션 구분선 |
| `.digitek-split-info-grid` | 정보 그리드 |
| `.digitek-split-info-row` | 정보 행 |
| `.digitek-split-info-label` | 정보 라벨 (107px) |
| `.digitek-split-info-value` | 정보 값 |
| `.digitek-split-detail-badge` | 상세 배지 |
| `.digitek-split-detail-btn` | 상세 액션 버튼 (42x42) |
| `.digitek-split-modal-overlay` | 모달 오버레이 |
| `.digitek-split-modal` | 모달 (1200px, 85vh) |
| `.digitek-split-modal-body` | 모달 본문 (2열) |

### 그룹/사용자 관리 — `group-manage-*`

| 클래스 | 설명 |
|--------|------|
| `.group-manage-layout` | 레이아웃 (flex column) |
| `.group-manage-header` | 헤더 |
| `.group-manage-body` | 본문 (3열 grid) |
| `.group-manage-col` | 열 컨테이너 |
| `.group-manage-col-title` | 열 제목 |
| `.group-manage-table-wrap` | 테이블 래퍼 (스크롤) |
| `.dhtmlx-grid-area` | Dhtmlx Grid 영역 |

### 코드 관리 — `code-manage-*`

| 클래스 | 설명 |
|--------|------|
| `.code-manage-layout` | 레이아웃 |
| `.code-manage-header` | 헤더 |
| `.code-manage-search-bar` | 검색 바 |
| `.code-manage-body` | 본문 (좌-목록, 우-상세) |
| `.code-manage-list` | 좌측 목록 (35%) |
| `.code-manage-detail` | 우측 상세 |
| `.code-manage-section-title` | 섹션 제목 (파랑) |

### 결재 라인 (재사용) — `approval-line-digitek-*`

| 클래스 | 설명 |
|--------|------|
| `.approval-line-digitek` | 결재 테이블 |
| `.approval-line-digitek-step` | 단계 셀 (200px) |
| `.approval-line-digitek-input-row` | 결재자 입력 행 |
| `.approval-line-digitek-assignee-list` | 결재자 목록 |
| `.approval-line-digitek-assignee-tag` | 결재자 태그 |
| `.approval-line-digitek-assignee-remove` | 삭제 버튼 |
| `.approval-line-digitek-required` | 필수 표시 (* 추가) |

### 팝업 — `popup-*`

| 클래스 | 설명 |
|--------|------|
| `.popup-header` | 팝업 헤더 |
| `.popup-title` | 팝업 제목 |
| `.popup-body` | 팝업 본문 |
| `.popup-footer` | 팝업 하단 (액션 버튼) |

### 모달 확장

| 클래스 | 설명 |
|--------|------|
| `.modal-dialog-resizable` | 리사이즈 가능 모달 |
| `.modal-resize-handle` | 리사이즈 핸들 (우하단) |

---

## 아이콘 시스템 (`icons.css`)

```html
<i class="dicon dicon-search icon-digitek-20"></i>
```

- **베이스**: `.dicon` — inline-block, background-image 기반
- **이름**: `.dicon-{name}` — 65개 PNG 아이콘
- **크기**: `.icon-digitek-{11,13,14,16,20,24,30,32,37,48}` 으로 조절
- **카테고리**: navigation, action, file, communication, chart, editor, status, layout
- **색상 변경**: PNG 파일 교체 또는 `-white`, `-blue` 접미사 파일 사용
- **사이드바 내**: 자동으로 `filter: brightness(0) invert(1)` 적용 (흰색 변환)

---

## JS 모듈 연동 (`digitek.js`)

CSS 클래스와 연동되는 JavaScript 모듈:

| 모듈 | 조작하는 CSS 클래스 |
|------|---------------------|
| `Sidebar` | `sidebar-digitek-expanded/collapsed`, `sidebar-digitek-active`, `sidebar-digitek-parent-open`, `sidebar-digitek-chevron-open`, `sidebar-digitek-sub-active` |
| `Accordion` | `accordion-digitek-page-header-open`, `accordion-digitek-inner-header-open`, `accordion-digitek-chevron-closed` |
| `TabButton` | `tab-digitek-active` |
| `Select` | `select-digitek-trigger-open`, `select-digitek-option-selected` |
| `TextEditor` | `text-editor-digitek-icon-btn-active`, `text-editor-digitek-selected`, `active` (color dot) |
| `GNBSearch` | GNB 검색 창 열기/닫기 |
| `FileUpload` | `file-upload-digitek-dragging` |
| `SearchList` | `digitek-search-filter-area.show` |
| `SearchSplit` | `digitek-split-body-detail-open`, `digitek-split-body-fullview`, `digitek-split-search-collapsed` |
| `Locale` | `gnb-digitek-locale-wrap.open` |
| `GanttResizer` | 간트 테이블/타임라인 너비 조절 |
| `DraggableTable` | `draggable-row`, `drag-over` |

> 모든 모듈은 `window.Digitek` 네임스페이스로 접근 가능.
> 동적 HTML 삽입 후 `Digitek.reinit()` 호출.
