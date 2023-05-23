# poong-player

🚀 즐겜러 스트리머 풍월량님을 응원하는 게임 영상 시청 플랫폼

#### router 설계

/ -> 홈 (인기/최근업로드/추천)
/join -> 회원가입
/login -> 로그인
/search -> 영상 검색
/most-viewed -> 인기 영상 차트
/streaming-rank -> 풍월량 영상 스트리밍 시간 랭킹
/upload-video -> 영상 업로드, DB 추가

/user/edit -> 회원정보 변경
/user/delete -> 회원탈퇴
/user/change-pw -> 회원 비밀번호 변경
/user/logout -> 로그아웃

/playlist/like -> 좋아요 영상 리스트 페이지
/playlist/mine -> 내 플레이리스트 페이지
/playlist/create -> 플레이리스트 추가

/playlist/:playlistId -> 플레이리스트 상세 페이지
/playlist/:playlistId/edit -> 플레이리스트 편집
/playlist/:playlistId/delete -> 플레이리스트 삭제

/api/video/:videoId/like -> 영상 좋아요 Click
/api/video/:youtubeId/view -> 영상 조회수
/api/video/:youtubeId/point -> 풍월량 영상일 경우, 포인트 획득
/api/video/:videoId -> 영상 Id get

/api/playlist/add-video -> 플레이리스트에 영상 추가
/api/playlist/remove-video -> 플레이리스트에서 영상 삭제
