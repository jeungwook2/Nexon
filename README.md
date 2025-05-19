#Nexon 이벤트 시스템 프로젝트

안녕하세요, 김정욱입니다.
이런 소중한 기회를 주셔서 진심으로 감사드립니다.

##프로젝트 개요

본 프로젝트는 7일 출석 이벤트 시스템입니다.
보상은 1일부터 7일까지 각각 개별로 지급되도록 설계했습니다.
민감한 정보는 .env 파일을 활용해 최대한 숨기도록 구현했습니다.

현재는 이벤트 시작일과 실제 시간을 기준으로 검증하기 때문에,
오늘 날짜 기준으로는 보상 요청을 1번만 실행할 수 있습니다.
테스트 목적으로 날짜를 변경하실 경우,
src/action/action.service.ts 파일의 create 메서드 내부를 참고해 주세요.

##개발 환경 및 실행 방법

필수 설치사항: Docker, VSCode, Node.js
최상단 루트의 docker-compose.yml 파일이 존재하는 위치에서 아래 명령어 실행
docker compose up --build
API 테스트는 POSTMAN을 추천드립니다.
JSON 형태 요청으로 다양한 API 호출이 가능합니다.
API 사용법 요약

###1. 초기 세팅 (관리자 계정 등록, 이벤트 코드 생성)
요청 방식: GET
URL: http://localhost:3000/setting
이미 데이터가 존재하면 중복 등록 방지를 위해 예외 처리됩니다.
###2. 관리자 로그인
요청 방식: POST
URL: http://localhost:3000/admin/login
요청 Body 예시:
{
  "email": "admin",
  "pwd": "1234"
}
이메일은 "admin", "operator", "auditor" 중 하나 사용 가능
로그인 성공 시 1시간 유효한 JWT 토큰 발행
이후 모든 API 요청 헤더에 다음과 같이 토큰 포함 필수
Key              	Value
Authorization	    Bearer 발급받은_토큰값
###3. 유저 등록
요청 방식: POST
URL: http://localhost:3000/user/insert
요청 Body 예시:
{
  "email": "user01@nexon.com",
  "pwd": "1234",
  "nick": "wook2"
}
비밀번호는 SHA-256 방식으로 암호화 처리됨
성공 시 JSON 메시지로 결과 반환
###4. 이벤트 목록 조회
요청 방식: GET
URL: http://localhost:3000/events/list
초기에는 빈 배열로 출력될 수 있음
###5. 이벤트 생성 (관리자)
요청 방식: POST
URL: http://localhost:3000/events
요청 Body 예시:
{
  "title": "가정의 달 7 일 출석이벤트",
  "conditionCode": "INVITE",
  "conditionParams": {
    "inviteCount": 7
  },
  "steps": [
    { "day": 1, "reward": [{ "name": "500 메이플 포인트", "count": 1 }] },
    { "day": 2, "reward": [{ "name": "경험치 2배 쿠폰 (15분)", "count": 1 }] },
    { "day": 3, "reward": [{ "name": "정령의 펜던트 (1일)", "count": 1 }] },
    { "day": 4, "reward": [{ "name": "메가 버닝 부스터", "count": 1 }] },
    { "day": 5, "reward": [{ "name": "황금 마일리지 티켓", "count": 1 }] },
    { "day": 6, "reward": [{ "name": "스페셜 명예의 훈장", "count": 1 }] },
    { "day": 7, "reward": [{ "name": "카오스 서큘레이터", "count": 1 }] }
  ],
  "startAt": "2025-05-18T18:00:00+09:00",
  "endAt": "2025-05-24T23:00:00+09:00"
}
이벤트명은 고유하며 활성화 상태에 따라 등록 가능
등록 후 GET /events/list 재요청 시 간략 정보 확인 가능
###6. 이벤트 상세 조회
요청 방식: GET
URL: http://localhost:3000/events/list/{_id}
{_id}는 이벤트 목록 조회에서 확인한 이벤트 ID
###7. 유저 로그인
요청 방식: POST
URL: http://localhost:3000/user/login
요청 Body 예시:
{
  "email": "user01@nexon.com",
  "pwd": "1234"
}
성공 시 role:user 토큰 발급
헤더에 Authorization: Bearer 토큰값 포함 필수
###8. 출석 체크 및 보상 요청 (유저)
요청 방식: POST
URL: http://localhost:3000/events/attendance
요청 Body 예시:
{
  "eventTitle": "가정의 달 7 일 출석이벤트"
}
정상 출석 시 보상 지급
중복 요청 시 예외 메시지 반환:
"err": "이미 참여한 이벤트입니다 / 보상을 이미 받으셨습니다."
###9. 유저 출석 및 요청 현황 조회
요청 방식: GET
URL: http://localhost:3000/events/user
요청 Body 예시:
{
  "eventTitle": "가정의 달 7 일 출석이벤트"
}
유저의 출석 날짜 배열 및 요청 성공/실패 내역 확인 가능
###10. 관리자용 전체 유저 요청 및 출석 조회
요청 방식: GET
URL: http://localhost:3000/events/admin
요청 Body 예시:
{
  "eventTitle": "가정의 달 7 일 출석이벤트"
}
###11. 보상 추가하기 (관리자)
요청 방식: POST
URL: http://localhost:3000/events/reward/add
요청 Body 예시:
{
  "title": "가정의 달 7 일 출석이벤트",
  "name": "메가버닝 부스터",
  "count": 1,
  "day": 1
}
이벤트 상세 조회 시 해당 보상이 추가된 것을 확인 가능
종료 및 정리

Docker 종료 및 관련 볼륨 삭제
docker compose down -v
마무리

긴 시간 테스트와 함께해 주셔서 진심으로 감사합니다.
이 프로젝트가 저에게 큰 성장의 기회를 주었습니다.
다시 한 번 깊은 감사의 말씀드립니다. :)
