// 질문지 작성시 생성되는 내 질문 데이터
export interface UserQuestion {
  nickname: string;
  question: string;
  confirmCode: string; // 질문 확인 코드
  shareCode: string; // 질문 공유 코드
  answers: Array<UserAnswer>;
  createdAt: number;
}

// 답변 데이터
export interface UserAnswer {
  answer: string;
  createdAt: number;
}
