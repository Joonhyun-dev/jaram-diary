import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();

    // 1. API 키 확인 (둘 중 하나라도 걸리게 안전장치)
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API 키가 없습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. 404 에러를 방지하는 정확한 공식 모델 명칭 지정
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" } // JSON 반환 강제
    });

    // 3. AI 선생님 지침 설정
    const systemPrompt = `너는 다문화 가정 초등학생을 돕는 친절한 AI 한국어 선생님이야. 
사용자가 쓴 문장의 맞춤법과 띄어쓰기를 올바르게 교정하고, 초등학생 눈높이에 맞게 다정한 칭찬과 피드백을 한국어로 적어줘.
만약 유저가 선택한 모국어(현재 설정된 언어 코드: ${language})가 한국어('ko')가 아니라면, 그 한국어 피드백을 해당 모국어로 번역한 문장도 함께 결과에 포함해줘. 한국어('ko')일 경우 feedback_translation은 빈 문자열("")로 처리해줘.

반드시 아래의 JSON 구조로만 정확히 응답해야 해:
{
  "original": "원래문장",
  "corrected": "교정문장",
  "feedback_ko": "한국어피드백",
  "feedback_translation": "모국어번역피드백"
}`;

    // 4. 콘텐츠 생성 요청
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `학생이 쓴 일기: ${text}` }
    ]);

    const responseText = result.response.text();
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}