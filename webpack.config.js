/** webpack.config.js
 * 참고: https://itnext.io/building-multi-page-application-with-react-f5a338489694
 *
 * 개요
 *  spa 리액트를 mpa로 바꾸게 되면서 각 화면별 html과 js를 만들어 build/ 폴더에 담는 작업을 하는 곳
 *
 * 라이브러리 설명
 *  path: node의 모듈로서 파일경로등의 기능을 사용할 수 있음.
 *  HtmlWebPackPlugin: webpack의 모듈로서(yarn add 해야함) 각 화면별 html을 만들어주는 모듈 (npm or yarn으로 설치)
 *  getFilesFromDir: 이 프로젝트의 config/files에 있는 자바 스크립트 파일 config/file.js
 *  webpack: 웹팩 모듈(npm or yarn으로 설치)
 *  CompressionPlugin, TerserPlugin: 빌드 시 js 파일을 압축하는 두 라이브러리(npm or yarn으로 설치)
 *  WebpackObfuscator: 빌드 시 js 파일을 난독화 하는 라이브러리. (npm or yarn으로 설치)
 *                      하지만 용량도 커지고 디버깅하기가 어려워서 지금은 주석처리를 해놓은 상태입니다.
 *  BundleAnalyzerPlugin: 빌드 시 번들들을 분석하는 플러그인(npm or yarn으로 설치)
 *
 * 코드 설명
 *  1) PAGE_DIR: src/pages/로서 이 안에 불러와 빌드할 .html, js 파일들이 있다.
 *  2) PUBLIC_URL: 환경변수로서 .html 파일들이 존재할 경로이다.(was에 배포)
 *  3) REACT_APP_BASE_HREF: 환경변수로서 css, js, images 등 cdn 경로이다.(cdn에 배포)
 *  4) htmlPlugins: HtmlWebPackPlugin을 이용하여 빌드폴더에 만들 화면이름.html이 정의된 변수
 *    4-1) getFilesFromDir를 이용하여 PAGE_DIR내부의 .html파일들의 경로를 읽어들인다.
 *    4-2) 각 .html 파일들의 경로를 가져와서 HtmlWebPackPlugin(빌드 시 html파일을 만드는 웹팩 라이브러리)을 이용하여 빌드되는 html 파일을 만든다.
 *      4-2-1) chunks: ["파일명" : 특정화면에서 쓰이는 로직이 담겨 있는 js,"vender" : 모든 화면들에서 공통으로 쓰이는 로직들이 들어있는 js]
 *      4-2-2) template: html 파일을 만들때 참조할 원본 html 파일
 *      4-2-3) filename: 결과적으로 만들 .html 파일의 이름 및 경로 : 여기의 경우 pop()으로 끝에 것(화면 url이름)만 빼서 쓴다.
 *    4-3) pages/contact/contact.html은 이렇게 반환된다.
 *      - { chunks:["contact", "vendor"], template: "src/pages/contact.html",  filename: "contact.html"}
 *  5) entry: 각 화면(.html)마다 사용할 [화면이름].js이 정의된 변수
 *    5-1) getFilesFromDir를 이용하여 PAGE_DIR내부의 .js파일들의 경로를 읽어들인다.
 *    5-2)
 *      5-2-1) obj[entryChunkName]: 만들어질 js 파일이름 및 경로
 *      5-2-2) `./${filePath}` 참조하여 원본 js 파일
 *    5-3) pages/contact/contact.js은 이렇게 반환된다.
 *      - { contact: "./src/pages/contact.js" }
 *  6) 본격적으로 리액트 정적파일을 빌드하는 곳이라고 보시면 됩니다.
 *    6-1) mode: 빌드 모드입니다. development, production 이 있는데, 빌드할 때에는 production으로 해야합니다. 왜냐하면 deveopment로 하면 모듈들의 크기가 너무 커져서 로딩 속도가 느립니다.
 *    6-2) devServer는 로컬에서 yarn start해서 작업하실 시 리액트 서버에 대한 설정을 해줄 수 있는 곳입니다.
 *      6-2-1) historyApiFallback: url에 있지 않은 파일을 입력했을 때 error.html로 이동하겠다는 뜻입니다.
 *      6-2-2) 그 외 설정들은 docs 참고: https://webpack.kr/configuration/dev-server/
 *    6-3) {5} 참고
 *    6-4) 빌드된 html 파일을 보면 <head> 마지막 즈음에 <script defer src=...> 이렇게 빌드된 js 파일을 불러옵니다. publicPath, path, filename을 합쳐 해당 script 태그를 생성합니다.
 *    6-5) eval-source-map로 하면은 브라우저 개발자 도구에 우리가 작성한 리액트 코드가 그대로 노출이 된다고 합니다. 그렇기 때문에 로컬에서 돌릴때에는 eval-source-map으로 하였습니다.
 *    6-6) 빌드할 때 사용하는 플러그인들
 *      6-6-1) {4} 참고
 *      6-6-2) DefinePlugin: 우리가 사용하는 환경변수를 빌드된 후에도 사용할 수 있도록 하는 플러그인입니다.
 *          - process.env : JSON.stringify(process.env) 로 한번에 하는 것이 아니라 이렇게 일일히 지정해주어야 합니다. 그렇지 않으면 브라우저 개발자모드에서 vendor.js를 보면 변수명과 함께 환경변수 값이 다 노출됩니다.
 *      6-6-3) WebpackObfuscator: 빌드 시 js 파일을 난독화 하는 라이브러리입니다. 하지만 용량도 커지고 디버깅하기가 어려워서 지금은 주석처리를 해놓은 상태입니다.
 *      6-6-4) CompressionPlugin: js 파일을 빌드할 때에 압축해서 빌드하는 플러그인입니다.
 *      6-6-5) BundleAnalyzerPlugin: 번들 크기 계산하는 것 => 시간이 오래 걸리니 분석할 때가 아니면 주석 해제하지 마시오!
 *    6-7) 모듈을 해석하는 방식을 변경 및 설정 할 수 있습니다. 모듈을 찾는 위치를 변경하거나 모듈들의 별칭을 만드는 등... 자세한 것은 docs 참고: https://webpack.kr/configuration/resolve/
 *      6-7-1) 이렇게 alias를 등록을 해주어야 각 원본 js 파일에서 상대경로가 아닌 절대경로로 import할 때에 바르게 인식합니다.
 *      6-7-2) resolve 할 파일 확장자 이름
 *      6-7-3) babel-loader: 아주 필수적. 이것이 있어야 js, jsx 파일들을 빌드할 수 있습니다.
 *      6-7-4) 빌드 환경이 DEV,LOCAL이 아닌 경우에만 babelrc 참조 2023-10-25 수정
 *      6-7-5) style-loader: css style을 빌드할 수 있음
 *      6-7-6) file-loader: 이미지 파일들을 빌드
 *      6-7-7) file-loader: 폰트 파일들을 빌드
 *    6-8) 모듈 압축 관련 설정하는 곳
 *      6-8-1) js 파일들을 압축하여 올릴지 말지 하는 곳입니다. 압축을 하면 빌드 속도가 느리지만 페이지 로딩속도가 빠르고, 압축을 안하면 빌드 속도는 빠르지만 로딩속도가 느립니다.
 *          - minimize: boolean => true 압축, false 압축안함
 *      6-8-2) minimize할 도구로 TerserPlugin사용
 *        6-8-2-1) 압축 대상 ECMAScript 버전 (ES5 이상을 지원하는 브라우저를 대상으로 한다면 5를 설정)
 *        6-8-2-2) console.log 등의 코드 제거. 그러나 console 중에서 warning이나 error는 살려야 하므로 babelrc로 주석제거하는 것으로 하였음
 *        6-8-2-3) 주석 제거
 *      6-8-3) splitChunks: util등의 모듈을 나누어 빌드하기 때문에 vendeor.js의 크기가 보다 작아집니다. 그리고 해당 모듈을 사용할 때만 불러오므로 lazy 로딩 처럼 되는 것입니다.
 *    6-9) 성능 힌트가 표시되는 방법을 설정합니다. 예를 들어 애셋이 250kb를 초과하면, webpack이 이를 알리는 경고를 표시합니다. 근데 우리는 이게 production 모드일 때만.
 *
 */

const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const getFilesFromDir = require("./config/files");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const WebpackObfuscator = require('webpack-obfuscator');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/* {1} */
const PAGE_DIR = path.join("src", "pages", path.sep);
/* {2} */
const PUBLIC_URL = process.env.PUBLIC_URL || "";
/* {3} */
const REACT_APP_BASE_HREF = process.env.REACT_APP_BASE_HREF ?? PUBLIC_URL;
const isLocal = process.env.REACT_APP_ACTIVE === "LOCAL";
const isDev = process.env.REACT_APP_ACTIVE === "DEV";
// const isStaging = process.env.REACT_APP_ACTIVE === 'STG';

// 2023-10-24 TEST
const isNodeEnvProduction = process.env.NODE_ENV === "production";
// const isNodeEnvProduction = true;
/**
 * {4}
 * 2023-09-06 크로스 플랫폼의 경우 경로 설정에 '\\' 사용하면 문제 발생으로 코드 수정
 */
const htmlPlugins = getFilesFromDir(PAGE_DIR, [".html"]).map((filePath) => {
  //const fileName = filePath.replace(PAGE_DIR, '');
  const baseName = path.basename(filePath, path.extname(filePath));

  return new HtmlWebPackPlugin({
    //chunks: [fileName.replace(path.extname(fileName), '').replace(PAGE_DIR, '').split('\\').pop(), 'vendor'],
    chunks: [baseName, "vendor"],
    template: filePath,
    //filename: fileName.split('\\').pop()
    filename: path.basename(filePath),
  });
});
/* {5} */
const entry = getFilesFromDir(PAGE_DIR, [".js"]).reduce((obj, filePath) => {
  //  const entryChunkName = filePath.replace(path.extname(filePath), '').replace(PAGE_DIR, '').split('\\').pop();
  const entryChunkName = path.basename(filePath, path.extname(filePath));
  /* {5-2-1}, {5-2-2} */
  obj[entryChunkName] = `./${filePath}`;
  return obj;
}, {});

/**
 * 빌드 시작 시간 확인용 함수 => 지우셔도 됩니다.
 */
function getCurrentDateTime() {
  var currentDateTime = new Date();
  var options = {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  var formattedDateTime = currentDateTime.toLocaleString("ko-KR", options);
  console.log("빌드한 시점: " + formattedDateTime);
}
getCurrentDateTime();
/* {2} */
console.log("PUBLIC_URL", PUBLIC_URL);
/* {6} */
module.exports = (env, argv) => ({
  /* {6-1} */
  mode: process.env.NODE_ENV ?? "development",
  /* {6-2} */
  devServer: {
    // https: true,
    // host: 'dev-hmc-cdn.happypointcard.com',
    // overlay: true,
    port: 3000,
    // stats: 'errors-only',
    /* {6-2-1} */
    historyApiFallback: {
      rewrites: [{ from: /./, to: "/error.html" }],
    },
  },
  /* {6-3} */
  entry: entry,
  /* {6-4} */
  output: {
    publicPath: REACT_APP_BASE_HREF,
    path: path.join(__dirname, "build"),
    filename: "[name].[chunkhash].js",
  },
  /* {6-5} */
  devtool: isNodeEnvProduction ? false : "eval-source-map",
  /* {6-6} */
  plugins: [
    /* {6-6-1} */
    ...htmlPlugins,
    /* {6-6-2} */
    new webpack.DefinePlugin({
      "process.env.REACT_APP_ACTIVE": JSON.stringify(
        process.env.REACT_APP_ACTIVE
      ),
      "process.env.REACT_APP_API_WAS_IP": JSON.stringify(
        process.env.REACT_APP_API_WAS_IP
      ),
    }),
    /* {6-6-3} */
    // WebpackObfuscator:
    // new WebpackObfuscator({
    //   // Obfuscator options
    //   // test: /^((?!vendor).\..\.js)$/,
    //   test: /(?!.*\bvendor\b.*\.\w+\.js$)^.*$/,
    //   rotateStringArray: true,
    //   stringArrayThreshold: 0.75
    //   // Add other options as needed
    // }),
    /* {6-6-4} */
    new CompressionPlugin({
      // asset: '[path].gz[query]',
      algorithm: "gzip",
      test: /\.(js|html)$/,
      threshold: 10240, // 10kb
      minRatio: 0.8,
    }),
    /* {6-6-5} */
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   openAnalyzer: false,
    //   generateStatsFile: true,
    //   statsFilename: 'bundle-report.json'
    // })
  ],
  /* {6-7} */
  resolve: {
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "./"),
    ],
    alias: {
      /* {6-7-1} */
      src: path.resolve(__dirname, "src"),
      view: path.resolve(__dirname, "src", "view"),
      common: path.resolve(__dirname, "src", "common"),
      util: path.resolve(__dirname, "src", "util"),
      api: path.resolve(__dirname, "src", "api"),
    },
    /* {6-7-2} */
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          /* {6-7-3} */
          loader: "babel-loader",
          options: {
            /* {6-7-4} */
            // babelrc: isStaging,
            babelrc: !(isDev || isLocal),
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                },
              ],
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        /* {6-7-5} */
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true } },
        ],
        exclude: /node_modules/,
      },
      {
        /* {6-7-6} */
        test: /\.(svg|jpg|gif|png)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: (url, resourcePath, context) => {
                if (argv.mode === "development") {
                  const relativePath = path.relative(context, resourcePath);
                  return `/${relativePath}`;
                }
                return `${PUBLIC_URL}/assets/images/${path.basename(
                  resourcePath
                )}`;
              },
            },
          },
        ],
      },
      {
        /* {6-7-7} */
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: (url, resourcePath, context) => {
                if (argv.mode === "development") {
                  const relativePath = path.relative(context, resourcePath);
                  return `/${relativePath}`;
                }
                return `${PUBLIC_URL}/assets/fonts/${path.basename(
                  resourcePath
                )}`;
              },
            },
          },
        ],
      },
    ],
  },
  /* {6-8} */
  optimization: {
    /* {6-8-1} */
    minimize: isNodeEnvProduction,
    minimizer: [
      /* {6-8-2} */
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          /* {6-8-2-1} */
          ecma: 5,
          /* {6-8-2-2} */
          // compress: {
          //   drop_console: isStaging
          // },
          /* {6-8-2-3} */
          output: {
            comments: false,
          },
        },
      }),
    ],
    /* {6-8-3} */
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "all",
          name: "vendor",
          enforce: true,
        },
      },
    },
  },
  /* {6-9} */
  performance: {
    hints: isNodeEnvProduction ? "warning" : false,
  },
});
