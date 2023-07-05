# 🚀 Poong Player (풍-플레이어)

프로 즐겜러 스트리머 `풍월량`님의 유튜브 영상을 모아서 볼 수 있는 Youtube 아카이빙 & 스트리밍 플랫폼입니다.

![screenshot_mockup](https://github.com/fbc93/poong-player/assets/81315091/931fcf3e-7cfe-4f45-96ee-207b6c019cc1)

<br>

> 👉 [Poong Player 바로가기](https://poong-player.herokuapp.com/) 
> 
> 테스트 계정
> - ID : admin
> - P/W : 1234

<br>

## 1. 서비스 소개
#### 스트리머 풍월량님의 유튜브 영상을 모아서 볼 수 있는 YouTube 아카이빙 & 스트리밍 플랫폼입니다.
- 원하는 YouTube 영상을 업로드하여 플레이어의 DB로 사용할 수 있습니다.
- 검색을 통해 업로드한 영상을 찾을 수 있습니다.
- 좋아하는 영상들의 조합으로 플레이리스트를 생성하여 영상을 추가/삭제/플레이 할 수 있습니다.
- 각 영상별로 `좋아요`를 클릭하여 DB에 반영할 수 있습니다.
- 플레이어에서 영상이 종료되면 조회수가 증가하며 DB에 반영됩니다.

<br>

## 2. 기술 스택
- FE : `Pug`, `JavaScript`, `SCSS`
- BE : `Node.js`, `Express.js`, `MongoDB`, `Mongoose`
- API : `YouTube Iframe API`
- Module Bundler : `Webpack`
- Deploy : `Heroku`

<br>

## 3. 개발 일정
- 1인 프로젝트
- 개발 : 2023-05-22 ~ 2023-06-05 (15일)
- 배포 : 2023-06-06 (1일)
- 1차 버그수정 : 2023-06-06 ~ 2023-06-08 (2일)

<br>

## 4. 주요 기능
### 📌 Yellow Or Dark 모드
- 스트리머 풍월량님의 트레이드 마크인 🟨 노란색 머리를 `라이트모드` 테마 컬러로 구현했습니다. 
- 왼쪽 상단 전구 아이콘(💡)를 클릭하여 `라이트모드`와 `다크모드`를 선택할 수 있습니다.

![theme](https://github.com/fbc93/poong-player/assets/81315091/a9f58afa-3fbe-4caf-8bee-22e9508f8461)

<br>

### 📌 YouTube Iframe API로 구현한 영상 플레이어
- 화면 하단에 Fixed되어있는 Player를 열어서 영상을 플레이합니다.
- 플레이어의 아이콘(🔺/🔻)을 클릭하여 영상 화면을 아래로 숨기거나 위로 펼칠 수 있습니다.
- 플레이어 화면이 숨겨지거나 펼쳐지더라도 `영상 재생은 지속`됩니다.
- 영상의 `현재 진행시간`과 `전체 재생시간`을 확인할 수 있습니다.
- Progress Bar의 진행도를 화면으로 확인하고 Hover/Click하여 `타임라인을 확인/이동`합니다.
- 이전, 재생, 정지, 이후(⏪️/▶️/⏸️/⏩️) 아이콘을 클릭하여 `기본적인 플레이어 명령`을 수행합니다.

##### 🔽 Player를 감추거나 펼칠 수 있습니다. 
![player_01](https://github.com/fbc93/poong-player/assets/81315091/4f8c33da-65f7-4658-9a8f-b280590cd64f)

##### 🔽 현재 진행시간 Tooltip, 해당 타임라인으로 이동합니다.
![ezgif com-gif-maker](https://github.com/fbc93/poong-player/assets/81315091/4e30a0aa-eac5-47a0-af53-7c1300835b50)

##### 🔽 이전, 이후, 재생, 정지는 플레이어를 숨겨도 작동합니다. 
![ezgif com-video-to](https://github.com/fbc93/poong-player/assets/81315091/a6a49741-7128-47d5-ba04-686897ba8ae1)

<br>

### 📌 디테일한 Player의 기능을 모두 구현했습니다.
- 랜덤반복(🔀), 일반반복(🔁), 1개만 반복(↪️) 아이콘을 클릭하여 `반복타입을 결정`합니다.
- 볼륨(📢) 아이콘을 Hover/Click하여 `볼륨량을 조절`합니다.
- 현재 플레이리스트에 `영상을 추가하거나 삭제`할 수 있습니다.
- `추천 플레이리스트` 영상 목록을 재생합니다.

##### 🔽 재생타입을 클릭하여 선택합니다. (일반반복/1개만반복/랜덤반복)
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/a65e3329-be97-4407-9263-94416e19a9d6)

##### 🔽 볼륨값을 조절하고 음소거를 적용합니다.
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/215a543a-be7b-4ecb-9cc0-031b339180c7)

##### 🔽 현재 재생중인 플레이리스트에 다른 영상을 추가/삭제할 수 있습니다.
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/931ba19a-6b63-4819-8cda-65efb7beaf3d)
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/f520db5e-bda9-4bde-9944-ff8718db1545)

##### 🔽 플레이리스트의 영상목록을 가져와서 재생합니다.
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/d7bead55-0315-402a-bc5b-f0a6e49a6cd2)


<br>


### 📌 YouTube 링크로 간편하게 Player DB에 영상을 아카이빙합니다.
- YouTube 영상이 가지고 있는 고유의 id값을 이용하여 각 영상을 구별하여 저장합니다.
- 업로드 전 프리뷰 화면을 확인할 수 있고 썸네일을 자동으로 생성합니다.
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/496b8511-2600-4013-82e4-df0724dc8087)

<br>

### 📌 조회수 순으로 리스트업된 인기영상 & 영상 검색
- Poong Player DB내에서 찾고자 하는 영상을 검색할 수 있습니다.
- keyword가 포함된 모든 데이터를 검색합니다.
- 검색한 영상을 `사용자의 플레이리스트에 추가`하거나 `좋아요(👍)`를 클릭하여 반영할 수 있습니다.
- `좋아요`한 영상들의 리스트는 `나의 좋아요 영상`에서 다시 볼 수 있습니다.
- 인기영상은 조회수 순으로 20개의 영상을 노출합니다.
- (조회수는 시청하던 영상이 종료되면, 1증가하여 DB에 반영됩니다.)

##### 🔽 키워드 검색과 결과영상을 플레이리스트에 담기
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/b25236ab-3c1f-4d43-82a2-f40b8e78d1b5)

##### 🔽 `좋아요`반영
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/86794d84-4ac6-421e-928a-5fad1477a827)

##### 🔽 조회수 기준으로 20개의 영상이 리스트업된 인기영상 
<img width="800" alt="스크린샷 2023-06-09 오전 11 00 38" src="https://github.com/fbc93/poong-player/assets/81315091/3aa72150-fdbe-44c4-af74-20703b92fbce">

<br>

### 📌 원하는 영상들로 사용자만의 플레이리스트를 생성합니다.
- 내 플레이리스트에서 `새 플레이리스트를 생성/삭제`할 수 있습니다.
- 플레이리스트 커버 이미지 안에 있는 메뉴를 Click하여` 플레이리스트의 이름을 수정`할 수 있습니다.
- 플레이 버튼(▶️)을 Click하여 `플레이리스트 영상 전체를 Play`합니다.

![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/a27c3159-b0b1-4d9c-826e-171a7eef822c)

##### 🔽 사용자의 `내 플레이리스트` 화면, `플레이리스트 개별 화면`에서도 모두 재생할 수 있습니다.
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/4145c6df-9840-489f-aeee-6535faed61eb)
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/301e5413-b046-4d0d-86ae-fe05869422dd)

<br>

### 📌 회원정보를 수정합니다.
- 사용자의 프로필 사진(3중 1택)과 유저네임을 업데이트할 수 있습니다.
- 비밀번호 변경시, 기존 비밀번호를 체크한 후, 신규 비밀번호를 받습니다.

![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/f06633b9-6ff9-4fc9-a14c-6b7cf020cbbf)

<br>

### 📌 사용자를 위한 알림 메시지 구현.
- 사용자가 잘못된 경로에 있거나, `권한이 없는 화면에 접근했을때 좌측하단의 메시지`로 알려줍니다.

![ezgif com-video-to-gif (1)](https://github.com/fbc93/poong-player/assets/81315091/ed12cb17-db65-4a4d-9056-a92cedb7b3fa)

<br>

### 📌 반응형 디자인 작업으로 `웹에서 모바일웹까지` 구현합니다.
- 데스크탑에서 모바일까지 UI 사용 환경에 제한되지 않습니다.

##### 🔽 데스크탑에서의 반응형
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/971d4e1c-c508-44ea-bc7e-92d0557f5a67)
![ezgif com-video-to-gif](https://github.com/fbc93/poong-player/assets/81315091/d6c18e8e-3d48-44bf-a0da-80860d0db2d6)

##### 🔽 모바일 웹뷰 반응형
|다크모드|라이트모드|
|------|---|
|![ezgif com-resize](https://github.com/fbc93/poong-player/assets/81315091/3e2588fd-5b93-47a7-9d5c-af9b574ce58a)|![ezgif com-crop](https://github.com/fbc93/poong-player/assets/81315091/80c33011-5ed0-453f-b3da-126688871c38)|


