### src/view/layout/ 각 화면별 html 분리(SPA -> MPA)

makePages/에 있는 makePages.js를 실행하여 src/pages/에 화면별 js, html 파일을 생성해야한다.
makePages/ 내에 있는 DefaultHtml.html과 Default.js를 바탕으로 화면별 js, html 파일을 생성한다.
위의 작업을 수행하기 위해서는 src/view/layout/에 url 명과 메인컴포넌트의 이름이 작성된 name.txt가 존재해야만 이를 읽어 pages/에 js,html 파일을 생성한다.(아래 예시 참고)

```bash
# makePages 디렉토리로 이동
cd makePages

# node로 makePages.js 실행
node makePages.js

# 작업영역을 이전 디렉토리로 복귀
cd ..
```

> 아래는 name.txt 예시이다. (src\view\layout\main\name.txt)

```
main
MainLayout
```
