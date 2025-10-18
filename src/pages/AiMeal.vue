<script setup>
import { ref, onMounted, computed } from 'vue'; // ref, onMounted, computed import
import recommendation from "@/services/recommendation"; // 서비스 파일 import

import { CalendarDays, ChevronRight, ChevronLeft } from "lucide-vue-next";
import {
  DateRangePickerArrow,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  Label,
} from "reka-ui";
import MainLayout from "@/layouts/MainLayout.vue";
import MenuItem from "@/components/menu/MenuItem.vue";

// 1. 상태 관리 정의
// selectedDateRange: 사용자가 선택한 날짜 범위 (reka-ui 컴포넌트 v-model 연결)
const selectedDateRange = ref({ start: null, end: null }); 
// recommendationData: 서버에서 받은 식단 추천 데이터
const recommendationData = ref(null); 
// isLoading: 로딩 상태
const isLoading = ref(false);
// error: 오류 메시지
const error = ref(null);

// 날짜 객체를 'YYYY-MM-DD' 문자열로 포맷하는 헬퍼 함수
const formatDate = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 식사 구분(division)을 영어에서 한국어로 변환하는 맵
 */
const DIVISION_MAP = {
  'BREAKFAST': '아침',
  'LUNCH': '점심',
  'DINNER': '저녁',
  'SNACK': '간식'
};

/**
 * 식사 구분 문자열을 받아 한국어로 변환하여 반환하는 함수
 * @param {string} division - 영문 식사 구분 (예: 'BREAKFAST')
 * @returns {string} - 한글 식사 구분 (예: '아침'), 매핑되지 않으면 원본 문자열 반환
 */
const translateDivision = (division) => {
  // 대문자 처리하여 맵에서 찾고, 없으면 원본 값 또는 빈 문자열 반환
  const upperCaseDivision = (division || '').toUpperCase();
  return DIVISION_MAP[upperCaseDivision] || division;
};

/**
 * recommendationData.meals 배열을 'dayNumber' 기준으로 그룹화하는 computed 속성
 * 템플릿 렌더링을 위해 사용됩니다.
 * @returns {Object<string, Array<Object>>} - 예: { '1': [...meals], '2': [...meals] }
 */
const groupedMeals = computed(() => {
    // 옵셔널 체이닝으로 안전하게 데이터 접근
    const meals = recommendationData.value?.meals;

    if (!Array.isArray(meals) || meals.length === 0) {
        return {};
    }

    // dayNumber (예: 1, 2, 3...)을 키로 사용하여 그룹화
    return meals.reduce((acc, meal) => {
        // dayNumber는 서버에서 받은 값 (숫자라고 가정)
        const dayNum = meal.dayNumber?.toString(); 
        if (dayNum) {
            if (!acc[dayNum]) {
                acc[dayNum] = [];
            }
            acc[dayNum].push(meal);
        }
        return acc;
    }, {});
});

/**
 * 식단 추천 API 호출 함수
 */
const executeRecommendation = async () => {
    // selectedDateRange 구조가 { start: Date, end: Date }라고 가정하고 날짜 추출
    const startDate = formatDate(selectedDateRange.value?.start);
    const endDate = formatDate(selectedDateRange.value?.end);

    // 날짜 선택 유효성 검사 (두 날짜 모두 선택되어야 함)
    if (!startDate || !endDate) {
        error.value = "식단 추천 기간을 시작일과 종료일 모두 설정해주세요.";
        return;
    }

    isLoading.value = true;
    error.value = null;

    try {
        // recommendation를 사용하여 API 호출
        const data = await recommendation.executeRecommendation(startDate, endDate);
        
        recommendationData.value = data;
        console.log('Recommendation successful:', data);

    } catch (err) {
        // 서비스 파일에서 던진 오류 메시지를 표시
        error.value = err.message || "식단 추천 요청 중 알 수 없는 오류가 발생했습니다.";
        console.error("API Call Error:", err);
    } finally {
        isLoading.value = false;
    }
};

/**
 * 최신 추천 기록 조회 함수 (페이지 로딩 시 한 번 실행)
 */
const fetchLatestRecommendation = async () => {
    try {
        // recommendation를 사용하여 API 호출
        const data = await recommendation.fetchLatestRecommendation();
        if (data) {
            recommendationData.value = data;
        }
    } catch (e) {
        // 오류가 발생하면 에러 메시지를 사용자에게 보여주지 않고 콘솔에만 기록
        console.log("Failed to load latest recommendation. Starting fresh.", e);
    }
};

// 4. 컴포넌트 마운트 시 (페이지 로드 시) 최신 기록 조회
onMounted(() => {
    fetchLatestRecommendation();
});
</script>

<style scoped>
/* page-specific styles can go here */
</style>

<template>
  <MainLayout>
    <!-- Period setting -->
    <div class="flex flex-col gap-2">
      <Label class="text-sm text-stone-700" for="booking">
        캘린더에 등록한 식단 기간을 설정 후 추천받기 버튼을 눌러주세요.
      </Label>
      <div class="flex gap-8">
        <DateRangePickerRoot id="booking" v-model="selectedDateRange">
          <DateRangePickerField
            v-slot="{ segments }"
            class="text-green10 flex items-center rounded-lg border bg-white p-1 text-center shadow-sm select-none data-[invalid]:border-red-500"
          >
            <!-- Start: YYYY/MM/DD -->
            <DateRangePickerInput
              part="year"
              type="start"
              class="data-[placeholder]:text-green9 rounded-md p-0.5 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              {{ segments.start.find(s => s.part === "year")?.value }}
            </DateRangePickerInput>
            <span class="px-1">/</span>
            <DateRangePickerInput
              part="month"
              type="start"
              class="data-[placeholder]:text-green9 rounded-md p-0.5 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              {{ segments.start.find(s => s.part === "month")?.value }}
            </DateRangePickerInput>
            <span class="px-1">/</span>
            <DateRangePickerInput
              part="day"
              type="start"
              class="data-[placeholder]:text-green9 rounded-md p-0.5 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              {{ segments.start.find(s => s.part === "day")?.value }}
            </DateRangePickerInput>

            <span class="mx-2"> - </span>

            <!-- End: YYYY/MM/DD -->
            <DateRangePickerInput
              part="year"
              type="end"
              class="data-[placeholder]:text-green9 rounded-md p-0.5 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              {{ segments.end.find(s => s.part === "year")?.value }}
            </DateRangePickerInput>
            <span class="px-1">/</span>
            <DateRangePickerInput
              part="month"
              type="end"
              class="data-[placeholder]:text-green9 rounded-md p-0.5 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              {{ segments.end.find(s => s.part === "month")?.value }}
            </DateRangePickerInput>
            <span class="px-1">/</span>
            <DateRangePickerInput
              part="day"
              type="end"
              class="data-[placeholder]:text-green9 rounded-md p-0.5 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              {{ segments.end.find(s => s.part === "day")?.value }}
            </DateRangePickerInput>

            <DateRangePickerTrigger
              class="ml-4 cursor-pointer rounded p-1 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              <CalendarDays class="h-4 w-4" />
            </DateRangePickerTrigger>
          </DateRangePickerField>

          <DateRangePickerContent
            :side-offset="4"
            class="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade rounded-xl border bg-white shadow-sm will-change-[transform,opacity]"
          >
            <DateRangePickerArrow class="fill-white stroke-gray-300" />
            <DateRangePickerCalendar v-slot="{ weekDays, grid }" class="p-4">
              <DateRangePickerHeader class="flex items-center justify-between">
                <DateRangePickerPrev
                  class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-black hover:bg-stone-100 focus:shadow-[0_0_0_2px] focus:shadow-black active:scale-98 active:transition-all"
                >
                  <ChevronLeft class="h-4 w-4" />
                </DateRangePickerPrev>

                <DateRangePickerHeading class="text-sm font-medium text-black" />
                <DateRangePickerNext
                  class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-black hover:bg-stone-100 focus:shadow-[0_0_0_2px] focus:shadow-black active:scale-98 active:transition-all"
                >
                  <ChevronRight class="h-4 w-4" />
                </DateRangePickerNext>
              </DateRangePickerHeader>
              <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <DateRangePickerGrid
                  v-for="month in grid"
                  :key="month.value.toString()"
                  class="w-full border-collapse space-y-1 select-none"
                >
                  <DateRangePickerGridHead>
                    <DateRangePickerGridRow class="mb-1 flex w-full justify-between">
                      <DateRangePickerHeadCell
                        v-for="day in weekDays"
                        :key="day"
                        class="w-8 rounded-md text-xs !font-normal text-black"
                      >
                        {{ day }}
                      </DateRangePickerHeadCell>
                    </DateRangePickerGridRow>
                  </DateRangePickerGridHead>
                  <DateRangePickerGridBody>
                    <DateRangePickerGridRow
                      v-for="(weekDates, index) in month.rows"
                      :key="`weekDate-${index}`"
                      class="flex w-full"
                    >
                      <DateRangePickerCell
                        v-for="weekDate in weekDates"
                        :key="weekDate.toString()"
                        :date="weekDate"
                      >
                        <DateRangePickerCellTrigger
                          :day="weekDate"
                          :month="month.value"
                          class="relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-normal whitespace-nowrap text-black outline-none before:absolute before:top-[5px] before:hidden before:h-1 before:w-1 before:rounded-full before:bg-white hover:bg-green-200 focus:shadow-[0_0_0_2px] focus:shadow-black data-[highlighted]:bg-emerald-200 data-[outside-view]:text-black/30 data-[selected]:!bg-emerald-600 data-[selected]:text-white data-[today]:before:block data-[today]:before:bg-emerald-500 data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through"
                        />
                      </DateRangePickerCell>
                    </DateRangePickerGridRow>
                  </DateRangePickerGridBody>
                </DateRangePickerGrid>
              </div>
            </DateRangePickerCalendar>
          </DateRangePickerContent>
        </DateRangePickerRoot>
        <div class="flex">
          <button 
            @click="executeRecommendation"
            :disabled="isLoading"
            class="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-emerald-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'AI 분석 중...' : '추천받기' }}
          </button>
        </div>
      </div>
      <!-- 에러 메시지 표시 -->
      <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
    </div>

    <!-- Recommendation Menu -->
    <section class="mt-10">
      <h2 v-if="recommendationData" class="text-xl font-bold mb-4 text-emerald-700">
          AI 식단 추천 결과
      </h2>

      <!-- 추천 이유 표시 (서버 응답에 recommendationReason이 있다고 가정) -->
      <div v-if="recommendationData?.recommendationReason" class="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg">
          <p class="text-sm font-semibold text-emerald-800">추천 이유</p>
          <p class="text-stone-700 mt-1 whitespace-pre-wrap">{{ recommendationData.recommendationReason }}</p>
      </div>

      <!-- 로딩 인디케이터 -->
      <div v-if="isLoading" class="text-center py-10 text-stone-500">
          <svg class="animate-spin h-6 w-6 mr-3 inline-block text-emerald-600" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>데이터를 분석하고 식단을 생성 중입니다...</p>
      </div>

      <!-- groupedMeals를 사용하여 데이터가 있을 때 동적 렌더링 -->
      <div v-else-if="Object.keys(groupedMeals).length > 0" class="space-y-8">
        <div 
            v-for="(meals, dayNumber) in groupedMeals" 
            :key="dayNumber" 
            class="space-y-4 p-4 border rounded-xl shadow-sm bg-white"
        >
            <!-- 일차별 제목 -->
            <h3 class="text-xl font-extrabold text-emerald-800 border-b pb-2 mb-4 border-emerald-300">
                🗓️ {{ dayNumber }}일차 식단
            </h3>
            <!-- 해당 일차의 식사 항목 렌더링 -->
            <MenuItem
                v-for="(item, index) in meals"
                :key="`${dayNumber}-${index}`"
                :title="item.foodName"
                :tag="translateDivision(item.division)"
                :kcal="item.calorie"
                :carbs="item.carbohydrate"
                :protein="item.protein"
                :fat="item.fat"
                :sodium="item.sodium"
            />
        </div>
      </div>

      <!-- 초기 상태 또는 데이터가 없을 때 메시지 -->
      <div v-else class="text-center py-10 border border-dashed rounded-lg text-stone-500 bg-stone-50">
          <CalendarDays class="h-8 w-8 mx-auto mb-3 text-stone-400"/>
          <p class="font-medium">추천 버튼을 눌러 나만을 위한 맞춤형 식단을 받아보세요.</p>
      </div>

      <!-- <div class="space-y-4">
        <MenuItem
          title="오트밀과 바나나"
          tag="아침"
          kcal="350"
          carbs="40"
          protein="8"
          fat="10"
          sodium="5"
        />
        <MenuItem
          title="닭가슴살 샐러드"
          tag="점심"
          kcal="450"
          carbs="60"
          protein="30"
          fat="10"
          sodium="200"
        />
        <MenuItem
          title="연어 구이와 채소"
          tag="저녁"
          kcal="500"
          carbs="50"
          protein="35"
          fat="15"
          sodium="200"
        />
        <MenuItem
          title="견과류 믹스"
          tag="간식"
          kcal="150"
          carbs="20"
          protein="5"
          fat="5"
          sodium="1"
        />
      </div> -->
    </section>
  </MainLayout>
</template>
