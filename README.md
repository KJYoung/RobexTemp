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

## Google Sheets → People 실시간 갱신

원본: https://docs.google.com/spreadsheets/d/1Ji6d41RBSASJ6CPgB0OV_-XoevKH5qxCY_Xt_5u2tbA/edit

브라우저에서 `src/hooks/usePeople.ts`가 페이지를 열 때와 30초마다 공개 Sheet를 읽습니다. 탭이 숨겨져 있으면 주기 요청을 쉬고, 탭으로 돌아오거나 네트워크가 복구되면 다시 읽습니다. Google 측 캐시로 추가 지연이 생길 수 있으므로 즉시 push되는 방식은 아닙니다. Sheet 수정에 재배포나 새로고침은 필요하지 않습니다.

`People` 탭의 첫 행은 필드명, 두 번째 행부터 한 사람씩 입력합니다. `name`으로 매칭하며 앞뒤 공백과 대소문자는 무시합니다. `id`는 이름 매칭 키가 아닌 개인 페이지 주소입니다.

- 최초 화면은 번들에 포함된 `src/content/people.json`을 사용합니다. Sheet의 값이 있는 셀만 화면 데이터에 덮어씁니다. 빈 셀은 현재 값을 유지합니다. 같은 페이지 세션에서 이전에 읽은 값도 유지되며, 새로 열면 JSON부터 다시 시작합니다.
- 시트에서 빠진 구성원은 유지합니다. 새 이름은 오타로 잘못 연결하지 않도록 오류로 처리합니다. 새 구성원은 먼저 JSON에 추가하고 배포하세요.
- `topics`: 쉼표로 구분하거나 JSON 배열을 사용합니다. 새 태그는 화면의 필터와 프로필에 자동으로 나타납니다.
- `fullBio`: 여러 줄 문장과 Markdown을 지원합니다.
- `res-1-title`, `res-1-desc`, `res-1-url`: 첫 번째 연구 항목의 제목·설명·링크입니다. 숫자를 늘려 추가할 수 있습니다. 빈 셀은 해당 항목의 기존 필드를 유지합니다.
- `researches` 전체를 JSON 배열로 입력할 수도 있습니다.
- 이메일의 @와 .는 표시 시 (at), (dot)으로 변환됩니다. 테스트 숫자도 비어 있지 않으면 반영됩니다.

Sheet는 방문자의 브라우저에서 로그인 없이 읽을 수 있어야 합니다. 읽기·검증 실패 시 마지막 성공 데이터를 유지하며, 첫 요청이 실패하면 JSON으로 표시합니다. 다음 주기에 다시 시도합니다. 중복 이름 등 잘못된 Sheet는 일부만 적용하지 않고 전체 갱신을 거부합니다.

`npm run dev`와 `npm run build`는 Sheet 다운로드 없이 실행됩니다. localhost와 GitHub Pages 모두 브라우저에서 같은 방식으로 갱신됩니다. 브라우저는 저장소의 JSON 파일을 수정하지 않습니다.

JSON 자체에 최신 값을 저장하고 싶을 때만 `npm run sync:people`을 실행하세요. 이 명령은 기존처럼 people.json을 덮어쓰고 새 topics를 topics.json에 등록합니다. 변경 파일을 커밋·배포하면 다음 방문의 기본 데이터가 됩니다. 병합 규칙 테스트는 `npm run test:sync`로 실행합니다.

## Alumni / News 실시간 갱신

People과 동일하게 Alumni와 News도 브라우저에서 30초마다 독립적으로 갱신됩니다. 한 시트의 실패가 다른 시트의 갱신을 막지 않습니다.

- Alumni: `name,destination,url,image,note,id,topics`. name으로 매칭하고 빈 셀은 현재 값을 유지합니다. 새 구성원은 고유 id와 name을 입력하면 추가됩니다. fullBio/researches는 alumni.json에서 제거했으며 졸업생 프로필에도 표시하지 않습니다.
- News: `id,date,type,title,text,url (optional)`. JSON에서는 마지막 필드를 `url`로 저장하며 생략할 수 있습니다. id는 문자열 고유 키이며, 기존 id의 빈 셀은 현재 값을 유지합니다. 제목이 없는 준비용 행은 숨깁니다. 성공적으로 읽으면 시트의 목록을 ID 내림차순으로 정렬하므로 시트에서 제거한 뉴스는 화면에서도 사라집니다. 링크가 없는 항목은 클릭되지 않는 카드로 표시합니다. type은 각 소식 위에 표시합니다.
- 최초 화면/연결 실패 시에는 로컬 JSON을 기본값으로 사용합니다. 기존 기본값에 url이 있으면 Sheet의 빈 url은 그 링크를 유지합니다.
- `npm run sync:people` 수동 파일 저장 명령은 People에만 적용됩니다. Alumni/News는 화면에서만 갱신됩니다.

People 링크는 `linkedin`, `homepage`로 관리합니다. 값이 있는 링크만 각각 LinkedIn/지구본 아이콘으로 표시하며 목록과 개인 프로필에 동일하게 적용됩니다. 기존 `url` Sheet 열은 주소에 따라 두 필드 중 하나로 읽되, 명시한 새 열을 우선합니다. Alumni의 url 형식은 유지됩니다. Home의 Latest news는 ID 내림차순의 첫 3개를 날짜와 제목만 표시합니다.

News의 date는 날짜 파싱/포맷 변환 없이 CSV 텍스트로 표시합니다 (예: Spring 2026). 정렬은 date와 무관하게 ID 내림차순이며 숫자 ID 10은 9보다 먼저 나옵니다.

News는 숫자 연도와 계절 텍스트가 섞여 있어도 값이 누락되지 않도록 gviz 쿼리 대신 CSV export(gid=874971636)를 사용합니다. News 탭을 삭제 후 새로 만들면 useSheet.ts의 gid도 갱신해야 합니다.

시트의 표시용 텍스트에 입력한 문자 `\n`은 실제 줄바꿈으로 표시됩니다. 셀 안의 실제 줄바꿈도 유지됩니다. News 본문/제목/날짜, People 소개/연구/직책/비고, Alumni 소속/비고에 적용하며 URL과 ID는 변환하지 않습니다.

News의 선택 필드 `tldr`는 Home에서 제목 아래 짧은 설명으로 표시합니다. 비어 있으면 설명을 생략합니다. News 탭에서는 기존 title과 text를 표시합니다. tldr도 문자 `\n` 줄바꿈과 빈 셀의 기존 값 유지 규칙을 지원합니다.

People/Alumni/News 모두 원본 CSV export를 사용하여 자동 헤더/타입 추정을 피합니다. People에 이름만 있고 나머지가 빈 미등록 행은 무시하며, 미등록 이름에 실제 수정 값이 있으면 오류를 유지합니다. 시트 탭 재생성 시 useSheet.ts의 SHEET_IDS를 갱신하세요.
