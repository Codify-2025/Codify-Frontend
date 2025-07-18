---
name: Bug report
about: Create a report to help us improve
title: "[BUG]"
labels: bug
assignees: siiion

---

name: 🐞 Bug Report
description: '버그를 발견했을 때 작성해 주세요'
labels: [bug]
body:
  - type: textarea
    id: what-happened
    attributes:
      label: 💥 문제 설명
      description: 무엇이 잘못되었는지 명확하게 설명해 주세요.
      placeholder: '예: 버튼을 눌렀는데 아무 동작이 없음'
    validations:
      required: true

  - type: textarea
    id: reproduce
    attributes:
      label: 🔁 재현 방법
      description: 버그를 재현하는 단계
      placeholder: |
        1. 앱 실행
        2. 로그인 클릭
        3. 에러 발생
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: ✅ 기대 동작
      description: 예상했던 올바른 동작은 무엇인가요?

  - type: input
    id: environment
    attributes:
      label: 🧪 환경 정보
      placeholder: '예: Chrome 114, iOS 16, Flutter 3.22 등'
