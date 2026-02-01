# ERP 프로젝트 구조

## 1. 개요

Vite + React 기반 ERP 프론트엔드입니다. Ant Design UI, 권한별 메뉴, MDI 탭, 이중 사이드바/상단 탭바 레이아웃 옵션을 지원합니다.

---

## 2. 디렉터리 구조

```
src/
├── components/          # 공통 컴포넌트
│   ├── ui/              # 업무 화면용 UI
│   │   ├── DataTable.jsx
│   │   ├── IBSheetGrid.jsx
│   │   ├── PageHeader.jsx
│   │   ├── SearchForm.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusTag.jsx
│   │   └── index.js
│   └── SettingsPopup.jsx
├── contexts/            # 전역 상태
│   ├── MenuContext.jsx
│   ├── TabContext.jsx
│   └── ThemeContext.jsx
├── layouts/
│   └── MainLayout.jsx   # 메인 레이아웃
├── lib/
│   └── antd.js          # Ant Design re-export
├── pages/                # 업무 화면 (모듈별)
│   ├── accounting/      # 회계관리
│   ├── auth/            # 로그인
│   ├── construction/    # 공사관리
│   └── Home.jsx
├── routes/              # 라우트 정의
│   ├── accountingRoutes.jsx
│   ├── authRoutes.jsx
│   ├── constructionRoutes.jsx
│   └── index.jsx
├── services/
│   └── api.js           # API (메뉴, 사용자, 로그인)
├── utils/
│   ├── ibsheetManager.js
│   └── iconMapping.jsx
├── index.css
└── main.jsx
```

---

## 3. 역할별 설명

### 3.1 layouts/

| 파일 | 설명 |
|------|------|
| **MainLayout.jsx** | 메인 레이아웃. ThemeContext의 `layoutType`에 따라 **이중 사이드바** 또는 **상단 탭바**를 렌더. MDI 탭은 ERP 전체 단일 탭바로 동작. 모듈 클릭 시 해당 모듈 메뉴로 이동, 탭 클릭 시 해당 탭의 모듈로 URL/사이드바 동기화. |

### 3.2 contexts/

| 파일 | 설명 |
|------|------|
| **ThemeContext.jsx** | 다크/라이트 테마, 레이아웃 타입(`sidebar` / `top`). localStorage에 저장. |
| **TabContext.jsx** | MDI 탭 목록, 활성 탭, 탭 추가/삭제/활성화. IBSheet 탭별 dispose 연동. |
| **MenuContext.jsx** | 사용자별 메뉴·모듈 로드(권한 필터), 동적 페이지 컴포넌트 레지스트리. |

### 3.3 components/

| 경로 | 설명 |
|------|------|
| **ui/** | PageHeader, SearchForm, DataTable, IBSheetGrid, StatCard, StatusTag 등. `@/components/ui` 에서 import. |
| **SettingsPopup.jsx** | 설정 모달 (테마, 레이아웃, 비밀번호, 정보). |

### 3.4 lib/

| 파일 | 설명 |
|------|------|
| **antd.js** | Ant Design 컴포넌트·아이콘 re-export. `@/lib/antd` 에서 import. |

### 3.5 pages/

| 경로 | 설명 |
|------|------|
| **accounting/** | 회계관리 (대시보드, 분개장, 계정과목, 전표관리, 마감현황). |
| **construction/** | 공사관리 (대시보드, 공사목록, 계약관리, 기성관리 등). |
| **auth/** | 로그인. |
| **Home.jsx** | 로그인 후 진입 홈. |

각 페이지 컴포넌트는 MDI 탭으로 열릴 때 **`tabKey`** props를 받습니다.

### 3.6 routes/

| 파일 | 설명 |
|------|------|
| **accountingRoutes.jsx** | `/accounting` 하위 라우트. MainLayout에 `module="accounting"` 전달. |
| **constructionRoutes.jsx** | `/construction` 하위 라우트. MainLayout에 `module="construction"` 전달. |
| **authRoutes.jsx** | 로그인/로그아웃 라우트. |
| **index.jsx** | 라우트 통합, componentRegistry, menuConfig export. |

### 3.7 services/

| 파일 | 설명 |
|------|------|
| **api.js** | 메뉴/사용자 조회, **사용자별 메뉴**(권한 필터), 로그인(Mock). 실제 백엔드 연동 시 URL·함수만 교체. |

### 3.8 utils/

| 파일 | 설명 |
|------|------|
| **ibsheetManager.js** | IBSheet 그리드 생성/해제, 탭별 dispose. |
| **iconMapping.jsx** | 메뉴 아이콘 문자열 → React 아이콘 컴포넌트 매핑. |

---

## 4. 데이터/설정

| 경로 | 설명 |
|------|------|
| **public/mock/menus.json** | 모듈·메뉴 정의. `modules`(id, name, icon, sortOrder), `menus`(id, moduleId, key, label, icon, componentPath, sortOrder). |
| **public/mock/users.json** | 사용자별 `menuAuth`(메뉴 ID 배열). `*` 이면 전체 메뉴. |

---

## 5. 개발자 영역

- **새 화면 추가**: `pages/모듈명/` 에 컴포넌트 추가 → `routes/` 와 `menus.json` 에 등록.
- **공통 UI**: `@/components/ui` 의 PageHeader, SearchForm, DataTable, IBSheetGrid 등 사용.
- **API**: `@/services/api` 확장 또는 업무용 API 클라이언트 추가.

---

## 6. 주요 동작

- **레이아웃**: 설정에서 이중 사이드바 / 상단 탭바 선택 가능.
- **MDI 탭**: 모든 모듈의 탭이 한 탭바에 표시. 탭 클릭 시 해당 모듈로 URL·사이드바 동기화.
- **모듈 클릭**: 회계/공사 등 모듈 클릭 시 해당 모듈 URL로 이동, 사이드바만 해당 모듈 메뉴로 변경 (열린 탭 때문에 되돌아가지 않음).
