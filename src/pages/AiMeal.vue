<script setup>
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
        <DateRangePickerRoot id="booking">
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
          <button>추천받기</button>
        </div>
      </div>
    </div>

    <!-- Recommendation Menu -->
    <section class="mt-10">
      <div class="space-y-4">
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
      </div>
    </section>
  </MainLayout>
</template>
