import { http } from '@/lib/http';

// API 기본 경로 설정
const API_URL = '/api/recommendations';

/**
 * 식단 추천과 관련된 백엔드 API 호출을 담당하는 서비스 객체입니다.
 */
const recommendation = {

    /**
     * 사용자가 선택한 기간의 데이터를 기반으로 새로운 식단 추천을 요청합니다.
     * @param {string} startDate - 추천 기간의 시작 날짜 (YYYY-MM-DD 형식)
     * @param {string} endDate - 추천 기간의 종료 날짜 (YYYY-MM-DD 형식)
     * @returns {Promise<object>} 서버에서 반환된 식단 추천 응답 데이터
     */
    async executeRecommendation(startDate, endDate) {
        try {
            // 백엔드 POST 요청 (컨트롤러의 POST /api/recommendations 에 매핑됨)
            const response = await http.post(API_URL, {
                startDate: startDate,
                endDate: endDate
                // 백엔드에서 필요한 경우, 다른 사용자 정보(userId 등)는 JWT를 통해 자동으로 처리된다고 가정합니다.
            });
            // HTTP 상태 코드 2xx인 경우 response.data 반환
            return response.data;
        } catch (error) {
            console.error("Error executing recommendation:", error);
            // 오류 발생 시 상위 컴포넌트에서 처리할 수 있도록 throw
            throw new Error("새로운 식단 추천 요청에 실패했습니다.");
        }
    },

    /**
     * 현재 사용자의 가장 최신 식단 추천 기록을 조회합니다.
     * @returns {Promise<object | null>} 최신 추천 기록 데이터 또는 기록이 없을 경우 null
     */
    async fetchLatestRecommendation() {
        try {
            // 백엔드 GET 요청 (컨트롤러의 GET /api/recommendations/latest 에 매핑됨)
            const response = await http.get(`${API_URL}/latest`);

            // HTTP 상태 코드 2xx인 경우 response.data 반환
            return response.data;
        } catch (error) {
            // 404 Not Found (기록 없음) 또는 기타 오류 처리
            if (error.response && error.response.status === 404) {
                console.log("No latest recommendation found for user.");
                return null; // 기록이 없을 경우 null 반환
            }

            console.error("Error fetching latest recommendation:", error);
            throw new Error("최신 추천 기록을 불러오는 데 실패했습니다.");
        }
    }
};

export default recommendation;