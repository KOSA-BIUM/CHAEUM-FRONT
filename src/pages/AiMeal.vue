<template>
  <MainLayout>
    <!-- Period setting -->
    <div class="flex flex-col gap-2">
    <Label
      class="text-sm text-stone-700"
      for="booking"
    >
      캘린더에 등록한 식단 기간을 설정 후 추천받기 버튼을 눌러주세요.
    </Label>
    <div class="flex gap-8">
      <DateRangePickerRoot
        id="booking"
      >
        <DateRangePickerField
          v-slot="{ segments }"
          class="flex select-none bg-white items-center rounded-lg text-center text-green10 border shadow-sm p-1 data-[invalid]:border-red-500"
        >
          <template
            v-for="item in segments.start"
            :key="item.part"
          >
            <DateRangePickerInput
              v-if="item.part === 'literal'"
              :part="item.part"
              type="start"
            >
              {{ item.value }}
            </DateRangePickerInput>
            <DateRangePickerInput
              v-else
              :part="item.part"
              class="rounded-md p-0.5 focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-green9"
              type="start"
            >
              {{ item.value }}
            </DateRangePickerInput>
          </template>
          <span class="mx-2">
  
            -
          </span>
          <template
            v-for="item in segments.end"
            :key="item.part"
          >
            <DateRangePickerInput
              v-if="item.part === 'literal'"
              :part="item.part"
              type="end"
            >
              {{ item.value }}
            </DateRangePickerInput>
            <DateRangePickerInput
              v-else
              :part="item.part"
              class="rounded-md p-0.5 focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-green9"
              type="end"
            >
              {{ item.value }}
            </DateRangePickerInput>
          </template>
  
          <DateRangePickerTrigger class="ml-4 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none rounded p-1">
            <CalendarDays
              class="w-4 h-4"
            />
          </DateRangePickerTrigger>
        </DateRangePickerField>
  
        <DateRangePickerContent
          :side-offset="4"
          class="rounded-xl bg-white border shadow-sm will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        >
          <DateRangePickerArrow class="fill-white stroke-gray-300" />
          <DateRangePickerCalendar
            v-slot="{ weekDays, grid }"
            class="p-4"
          >
            <DateRangePickerHeader class="flex items-center justify-between">
              <DateRangePickerPrev
                class="inline-flex items-center cursor-pointer text-black justify-center rounded-md bg-transparent w-7 h-7 hover:bg-stone-100 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
              >
                <ChevronLeft
                  class="w-4 h-4"
                />
              </DateRangePickerPrev>
  
              <DateRangePickerHeading class="text-sm text-black font-medium" />
              <DateRangePickerNext
                class="inline-flex items-center cursor-pointer text-black justify-center rounded-md bg-transparent w-7 h-7 hover:bg-stone-100 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
              >
                <ChevronRight
                  class="w-4 h-4"
                />
              </DateRangePickerNext>
            </DateRangePickerHeader>
            <div
              class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <DateRangePickerGrid
                v-for="month in grid"
                :key="month.value.toString()"
                class="w-full border-collapse select-none space-y-1"
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
                        class="relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal text-black w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[outside-view]:text-black/30 data-[selected]:!bg-green10 data-[selected]:text-white hover:bg-green5 data-[highlighted]:bg-green5 data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-green9 "
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
        <button>
          추천받기
        </button>
      </div>
    </div>
  </div>

    <!-- Recommendation Menu -->
    <section>
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

<script setup >
import { CalendarDays,ChevronRight,ChevronLeft } from "lucide-vue-next";
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
} from 'reka-ui'
import MainLayout from "@/layouts/MainLayout.vue";
import MenuItem from "@/components/menu/MenuItem.vue";
</script>

<style scoped>
/* page-specific styles can go here */
</style>
