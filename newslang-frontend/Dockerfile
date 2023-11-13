# 가져올 이미지를 정의 as로 이름을 builder로 지정
FROM node:21-alpine AS base

# 멀티 스테이지 빌드
# 각 빌드 단계에 필요한 파일과
# 빌드 완료 후 실행해 필요한 파일은 다르다.
# 그 점을 이용한 스테이지를 여러개로 모듈을 다운 받는 스테이지
# 다운받은 공간에서 모듈을 빌려와 빌드를 하는 스테이지
# 빌드된 파일들이 있는 공간에서 빌드 파일을 빌려와
# 도커 이미지로 빌드하는 스테이지등으로 나눠서 빌드하는 방식
FROM base as deps

RUN apk add --no-cache libc6-compat

# 경로 설정하기
WORKDIR /app
# package.json 워킹 디렉토리에 복사 (.은 설정한 워킹 디렉토리를 뜻함)
COPY package.json package-lock.json ./

# 명령어 실행 (의존성 설치)
# lock 파일을 통해 최적화 및 버전 프레임워크 버전을 통일한다.
RUN npm ci

# 캐시공간 삭제로 이미지 용량 최적화
RUN rm -rf ./.next/cache

FROM base AS builder

WORKDIR /app
# deps스테이지의 /app/build 경로에 생성된 빌드파일을
COPY --from=deps /app/node_modules ./node_modules
# .next?
# 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사한다.
COPY . .

# 각각의 명령어들은 한줄 한줄씩 캐싱되어 실행된다.
# package.json의 내용은 자주 바뀌진 않을 거지만
# 소스 코드는 자주 바뀌는데
# npm install과 COPY . . 를 동시에 수행하면
# 소스 코드가 조금 달라질때도 항상 npm install을 수행해서 리소스가 낭비된다.

RUN npm run build
# nextjs 기반 프로젝트는 build를 해줘야 start로 실행 할 수 있다.
# COPY명령으로 복사해온 코드를 기반으로 빌드해준다.
# nextjs 기반 프로젝트는 빌드시 온전히 비동기 코드들로만 동작해야한다.
# 이번 프로젝트의 경우 HTML의<script>태그가 말썽이었다.
# nextjs 기반의 next/Script <Script>태그를 사용해야 한다.

# 3000번 포트 노출
EXPOSE 3000
ENV PORT 3000

# npm start 스크립트 실행
CMD ["npm", "start"]

# 그리고 Dockerfile로 docker 이미지를 빌드해야한다.
# $ docker build .