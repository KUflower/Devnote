#DevNote
일반적으로 코드를 작성하면서 겪는 어려움을 해결하는 노트이다.

기존의 에디터들(Sublime)은 주석의 가독성이 적어 노트와 코드를 분리해야 하는 어려움이 있었고, 노트(Evernote)들은 코드 작성 시 Syntax highlighting이 되지 않아 코드를 읽고 작성하는 데에 불편함이 있었다.

이에 우리는 기존의 두 기능을 합쳐 개발자를 위한 새로운 노트 “Devnote”를 만들고자 한다.
위 산출물은 다음과 같은 기능을 제공한다.

1. 간단한 기호를 통한 자동 마크업
  마크다운을 이용하여 지정된 간단한 기호만으로 마크업을 수행한다.
2. Syntax highlighting
마크다운 상에서 코드로 지정된 부분에 Syntax highlighting을 주어 코드의 가독성을 높인다. 실제 변환된 화면에서 바로 코드를 편집할 수 있어 개발을 용이하게 한다.
3. 코드 추출
주석 기능을 하는 메모와 코드를 분리하여 한 눈에 코드를 확인한다. 추출 된 코드는 로컬이나 구글드라이브로 바로 저장할 수 있다.

##프로젝트 추진 배경

##프로젝트 기대 효과

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

##Youtube Demo
[link here](https://www.youtube.com/watch?v=JLf9q36UsBk)
https://www.youtube.com/watch?v=JLf9q36UsBk

##향후 계획
추후 계정 설정 및 공유가 가능하도록 만들 계획이다.

##시작 하기
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