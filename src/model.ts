import { db } from '../config/mongo_config';
import { customAlphabet } from 'nanoid';
import { UserAnswer, UserQuestion } from './type';

/** 질문지 생성하기 */
export async function createAnswer (nickname: string, question: string,) {
  const confirmCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)();
  const shareCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)();

  try {
    await db.collection('answers').insertOne({
      nickname,
      question,
      confirmCode,
      shareCode,
      createdAt : Date.now(),
      answers : [],
    }, {});
    return {
      confirmCode,
      shareCode,
    };
  } catch (err) {
    console.error(err);
    if (err instanceof Error) throw new Error(`DBERROR ${err.message}`);
  }
}

/** shareCode로 질문 가져오기(답변용) */
export async function getShareAnswer (shareCode: string) {
  try {
    const result = await db.collection('answers').findOne({
      shareCode,
    });
    return result as unknown as UserQuestion;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) throw new Error(`DBERROR ${err.message}`);
  }
}

/** shareCode로 답변 등록하기(답변용) */
export async function insertAnswer (shareCode: string, answer: string) {
  try {
    await db.collection('answers').updateOne({ shareCode }, {
      $push : {
        answers : {
          $each: [{
            answer,
            createdAt: Date.now(),
          }],
          $sort: { createdAt: -1 },
        },
      }
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) throw new Error(`DBERROR ${err.message}`);
  }
}

/** confirmCode로 내 질문지 가져오기(확인용) */
export async function getConfirmAnswer (confirmCode: string) {
  try {
    const result = await db.collection('answers').findOne({
      confirmCode,
    });
    return result as unknown as UserQuestion;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) throw new Error(`DBERROR ${err.message}`);
  }
}
