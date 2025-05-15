# Node.js 18 이미지 사용
FROM node:18

# 앱 디렉토리 생성
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .

# 빌드
RUN npm run build

# 앱 실행
CMD ["node", "dist/main.js"]
