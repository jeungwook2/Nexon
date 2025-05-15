# 베이스 이미지
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 전체 소스 복사
COPY . .

# NestJS 빌드
RUN npm run build

# 앱 실행
CMD ["node", "dist/main.js"]
