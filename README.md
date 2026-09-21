# Robex — Local website

React + TypeScript + Vite + Tailwind CSS. 로컬 개발용 첫 시안입니다.

## 실행

Node.js 20.19+ 또는 22 LTS 권장. 현재 환경의 Node 20.11에서도 설치와 빌드를 확인했습니다.

```sh
npm ci
npm run dev
```

터미널에 표시된 localhost 주소를 엽니다. 종료하려면 Ctrl+C.

```sh
npm run build
npm run preview
```

## 콘텐츠 수정

디자인은 그대로 두고 아래 파일을 수정하세요. 개발 서버에서는 저장하면 반영되며, 배포본은 다시 빌드해야 합니다.

| 내용                                  | 파일                            |
| ------------------------------------- | ------------------------------- |
| 구성원 이름·역할·이메일·사진·홈페이지 | `src/content/people.json`       |
| 졸업생                                | `src/content/alumni.json`       |
| 연구 분야                             | `src/content/research.json`     |
| 연구실 소개                           | `src/content/about.md`          |
| 홈 화면 및 News 탭 소식               | `src/content/news.json`         |
| 논문                                  | `src/content/publications.json` |
| 사진                                  | `public/people/`                |
| 레이아웃·페이지 구성                  | `src/main.tsx`                  |
| 색상·폰트·반응형 스타일               | `src/styles.css`                |

JSON 항목을 복사하여 추가하고 쉼표/따옴표를 유지하세요. 구성원 `image`는 `people/name.jpg` 형식이며, 사진이 없으면 빈 문자열을 넣습니다. 표시 순서는 데이터 순서입니다.

논문 예시(형식 설명이며 실제 논문 아님):

```json
[
  {
    "title": "논문 제목",
    "authors": "저자 목록",
    "venue": "학회 또는 저널",
    "year": 2026,
    "url": "https://example.com/paper"
  }
]
```

현재 publications.json은 비어 있으며 Google Scholar의 실제 논문 목록으로 연결됩니다. 홈 Highlights는 확인된 2025년 수상 이력입니다.

## 구현 및 후속 고려사항

- 여섯 화면: Home, Research, People, Publications, News, Contact.
- 해시 주소(`#people` 등)를 사용하므로 정적 호스팅에서 새로고침에 별도 라우팅 설정이 필요하지 않습니다.
- 외부 서버·DB·로그인·추적 도구 없이 실행됩니다.
- 모바일 메뉴, 키보드 포커스, 본문 건너뛰기, 화면별 제목을 포함합니다.
- 공개 전 별도 URL과 검색 엔진용 정적 HTML/메타데이터를 구성하는 작업은 남아 있습니다.
- 파일 기반 편집입니다. 브라우저 관리자 편집 화면은 포함하지 않습니다.

## 내용·사진 출처

2026-09-18 확인:

- 구성원 12명 및 졸업생 1명: https://robex.engin.umich.edu/team/
- 팀 사진: 위 Team 페이지의 WordPress 업로드 원본. 로컬 프로토타입용으로 복사.
- 홈/연구 사진: https://alanpapalia.github.io/assets/img/river_pavilion.jpg
- 소개·수상 이력: https://name.engin.umich.edu/people/alan-papalia/ 및 https://alanpapalia.github.io/
- 지원 안내: https://alanpapalia.github.io/join/
- 논문 링크: https://alanpapalia.github.io/publications/

연구 분야 및 소개 문장은 위 공식 정보에 근거한 편집 초안입니다. GitHub Pages 배포 대상은 `KJYoung/RobexTemp`입니다. 사진 사용 권한 및 최종 문구는 실제 공개 전에 연구실에서 확인하세요.

## 로고 및 헤더

사용자가 제공한 `public/robex-logo.png` 원본을 사용합니다. 이미지의 바깥 여백은 `.logo-crop` 스타일로 화면에서만 숨기며 원본은 보존합니다. 소속 링크는 푸터에 있습니다. 기존 `#join-us` 링크는 Contact로 연결됩니다.

## 개인 페이지와 Topics 관리

구성원 사진과 이름은 `#people/alan-papalia` 같은 개인 페이지로 연결됩니다. `id`는 주소로 사용하므로 이름 표시를 수정해도 가급적 유지하세요.

- `src/content/topics.json`: 공통 태그 목록. 항목 형식은 `{ "id": "slam", "label": "SLAM" }`입니다.
- `people.json` 또는 `alumni.json`의 `topics`: 공통 목록의 ID 배열. 예: `["slam"]`.
- `fullBio`: Markdown 문자열.
- `researches`: `{ "title": "...", "description": "Markdown 내용", "url": "https://..." }` 항목 배열. URL은 생략 가능합니다.
- People 오른쪽 패널에서 태그를 선택하면 해당 태그를 가진 구성원과 졸업생이 표시됩니다. PI는 항상 표시되며 목록과 개인 페이지에서 Topics를 표시하지 않습니다. 개인 페이지를 보고 목록으로 돌아오면 필터가 유지됩니다.

현재 디자인 확인용으로 Topic 1 / Topic 2를 무작위 배정했고, 개인 소개와 연구 항목에는 임시 예시 문구를 넣었습니다. 실제 연구 분야나 경력이 아닙니다. 공개 전에 실제 내용으로 교체하세요.

이메일은 데이터 파일에서도 `name (at) umich (dot) edu` 형식으로 관리하며, 화면에는 일반 텍스트로 표시합니다. `mailto:` 링크는 사용하지 않습니다.

## GitHub Pages 배포

`.github/workflows/deploy.yml`은 `main` 브랜치 push 또는 수동 실행 시 사이트를 빌드하고 배포합니다. Settings → Pages → Source는 GitHub Actions를 사용합니다. 배포 경로는 Pages 설정에서 자동으로 가져옵니다. 로컬에서는 계속 `npm run dev`를 사용합니다.

예정 주소: https://kjyoung.github.io/RobexTemp/

## Google Sheets → People 동기화

원본: https://docs.google.com/spreadsheets/d/1Ji6d41RBSASJ6CPgB0OV_-XoevKH5qxCY_Xt_5u2tbA/edit

`People` 탭의 첫 행은 필드명, 두 번째 행부터 한 사람씩 입력합니다. `name`으로 매칭하며 앞뒤 공백과 대소문자는 무시합니다. `id`는 이름 매칭 키가 아닌 개인 페이지 주소입니다.

- 값이 있는 셀만 기존 `src/content/people.json`에 덮어씁니다. 빈 셀은 현재 JSON 값을 유지합니다.
- 시트에서 빠진 구성원은 유지합니다. 새 이름은 오타로 잘못 연결하지 않도록 오류로 처리합니다. 새 구성원은 먼저 JSON에 추가하세요.
- `topics`: 쉼표로 구분하거나 JSON 배열을 사용합니다. 새 태그는 `topics.json`에도 등록됩니다.
- `fullBio`: 여러 줄 문장과 Markdown을 지원합니다.
- `res-1-title`, `res-1-desc`, `res-1-url`: 첫 번째 연구 항목의 제목·설명·링크입니다. 숫자를 늘려 추가할 수 있습니다. 빈 셀은 해당 항목의 기존 필드를 유지합니다.
- `researches` 전체를 JSON 배열로 입력할 수도 있습니다.
- 이메일의 @와 .는 저장 시 (at), (dot)으로 변환됩니다. 테스트 숫자도 비어 있지 않으면 반영됩니다.

`npm run sync:people`로 즉시 동기화합니다. `npm run dev`와 `npm run build`도 시작 전에 자동 동기화합니다. 서버 실행 중 시트를 수정했다면 `npm run sync:people`을 다시 실행하세요. 네트워크 없이 기존 데이터만 쓰려면 `SKIP_PEOPLE_SYNC=1 npm run dev` 또는 `SKIP_PEOPLE_SYNC=1 npm run build`를 사용하세요.

GitHub Actions의 기존 Build 단계도 동일한 동기화를 실행합니다. 시트만 수정한 경우 Actions → Deploy RobEx to GitHub Pages → Run workflow로 재배포하세요. 자동 주기 실행은 설정하지 않았습니다.

시트는 GitHub Actions에서 로그인 없이 읽을 수 있어야 합니다. 다운로드·검증 실패 시 기존 people.json을 보존하고 빌드를 중단하여 기존 배포를 유지합니다. 빈 셀은 Git의 최초 값으로 복원하는 기능이 아니라, 실행 시점의 JSON 값을 유지하는 의미입니다.
