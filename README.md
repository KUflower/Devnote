#DevNote
DevNote는 마크다운 문서와 파일(.c, .java ...)을 합친 새로운 형태의 에디터이다.

개발할 때 코드 중간에 주석을 사용하는 경우가 많지만 가독성이 낮다는 문제점이 있다. 개발 문서를 볼 때 코드와 분리되어 각각 따로 보아야 했다. 노트앱(Evernote)을 이용할 경우 코드 Syntax highlighting이 되지 않아 코드를 읽고 작성하는 데에 적합하지 않다. 

이에 우리는 기존의 두 기능을 합쳐 개발자를 위한 새로운 에디터 “DevNote”를 만들고자 한다.
DevNote는 다음과 같은 기능을 제공한다.

1. 주석 안에서 마크다운 형식 지원
기존 주석은 한가지 서식으로만 작성해야 했지만 DevNote에서는 마크다운을 이용하여 주석을 작성할 수 있어 가독성이 좋아진다. 이를 통해 개발과 문서 작성을 동시에 할 수 있다.

2. 마크다운 실시간 프리뷰 제공
마크다운을 작성하고 실시간 프리뷰를 제공하여 문서 형태로 볼 수 있게 한다.

3. Syntax highlighting
Sublime Text와 같은 에디터와 같이 코드 Syntax highlighting을 주어 가독성을 높인다.

4. 코드 추출
주석 기능을 하는 메모와 코드를 분리하여 한 눈에 코드를 확인한다. 추출 된 코드는 로컬이나 구글드라이브로 바로 저장할 수 있다.

##DevNote의 장점
1. 코드의 가독성을 높일 수 있다.
기존 코드에서 마크다운을 추가로 사용할 수 있어 높은 가독성을 제공한다.

2. 코드와 개발문서를 동시에 작성할 수 있다.

3. 빠르고 쉽다.
마크다운 기반으로 쉽게 빠르고 쉽게 문서를 작성할 수 있다. 구조적인 글을 빠르게 작성할 수 있고 나중에 읽기도 쉽다.

4. 검색/Git
plain text 기반이기 때문에 검색과 git을 사용하는데 문제가 없다. 

##개발
DevNote는 [`Electron`](https://github.com/atom/electron) 프레임 워크를 사용하여 크로스 플랫폼 데스크탑 어플리케이션을 개발 하였다. 그 외에도 아래의 오픈소스들을 이용하였다.

##Open Source License
**[electron](https://github.com/atom/electron)**
>Copyright (c) 2015 GitHub Inc.
License: MIT

**[marked](https://github.com/chjj/marked)**
>Copyright (c) 2011-2014, Christopher Jeffrey.
License: MIT

**[MathJax](http://www.mathjax.org/)**
>Copyright (c) 2009-2013 The MathJax Consortium
License: Apache 2.0

**[vkBeautify](http://www.eslinstructor.net/vkbeautify/)**
>Copyright (c) 2012 Vadim Kiryukhin ( vkiryukhin @ gmail.com )
License: Dual licensed under the MIT (see below) and GPL licenses

##Demo Video
[link here](https://www.youtube.com/watch?v=JLf9q36UsBk)
https://www.youtube.com/watch?v=JLf9q36UsBk

##향후 계획
추후 계정 설정 및 공유가 가능하도록 만들 계획이다.

##시작하기
Clone and run the code in this tutorial by using the [`KUflower/Devnote`](https://github.com/KUflower/Devnote)
repository.
**Note**: Running this requires [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which includes [npm](https://npmjs.org)) on your system.

```bash
# Clone the repository
$ git clone https://github.com/KUflower/Devnote
# Go into the repository
$ cd Devnote/Devnote
# Install dependencies and run the app
$ npm install && npm start
```

##License
The source code is licensed under GPL v3. License is available [here](https://github.com/KUflower/Devnote/blob/master/LICENSE).