# 프로젝트 구조 (Webview)

## React-native (Webview)
- 안드로이드 심사시 targetSDK 35, 16KB 페이지 크기 지원을 해야함에 따라 react-native 버전은 0.78.1로 세팅
- Stack Navigation 구조 (@react-navigation/native, @react-navigation/stack)
- firebase 푸시 세팅 (@notifee/react-native, @react-native-firebase/app, @react-native-firebase/messaging)
- 오픈 라이브러리 수정시 patch-package 사용하여 patch 저장
- react-native-permissions을 통해 권한 요청
