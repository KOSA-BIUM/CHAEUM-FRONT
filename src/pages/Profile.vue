<script setup>
import { ref, computed, onMounted } from 'vue'
import MainLayout from "@/layouts/MainLayout.vue";
import { http } from '@/lib/http'

const loading = ref(true)
const saving  = ref(false)
const errorMsg = ref('')
const mode = ref('view') // 'view' | 'create' | 'edit'
const profile = ref(null)

const formCreate = ref({
  birthDate: '',
  gender: '',
  height: null,
  weight: null,
  preferredDiet: ''
})
const formEdit = ref({
  height: null,
  weight: null,
  preferredDiet: ''
})

const genderOptions = [
  { value: 'MALE',   label: '남성' },
  { value: 'FEMALE', label: '여성' },
]
const dietOptions = [
  { value: '',               label: '선택 안 함' },
  { value: 'PROTEIN',        label: '단백질 위주' },
  { value: 'LOW_CALORIE',    label: '저칼로리' },
  { value: 'HEALTHY_AGING',  label: '헬시 에이징' },
  { value: 'LOW_SUGAR',      label: '저당' },
]
const dietLabel = (v) => (dietOptions.find(d => d.value === v)?.label ?? v ?? '-');

const hasProfile = computed(() => !!profile.value)

async function fetchProfile() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data } = await http.get('/api/profile/me')
    profile.value = data
    mode.value = profile.value ? 'view' : 'create'
  } catch (e) {
    if (e?.response?.status === 404) {
      profile.value = null
      mode.value = 'create'
    } else {
      errorMsg.value = e?.response?.data?.message || e?.message || '프로필 조회에 실패했습니다.'
    }
  } finally {
    loading.value = false
  }
}

function toCreate() {
  mode.value = 'create'
  errorMsg.value = ''
  formCreate.value = { birthDate: '', gender: '', height: null, weight: null, preferredDiet: '' }
}

function toEdit() {
  if (!profile.value) return
  mode.value = 'edit'
  errorMsg.value = ''
  formEdit.value = {
    height: profile.value.height ?? null,
    weight: profile.value.weight ?? null,
    preferredDiet: profile.value.preferredDiet ?? ''
  }
}

async function saveCreate() {
  if (!formCreate.value.birthDate || !formCreate.value.gender ||
      formCreate.value.height == null || formCreate.value.weight == null) {
    errorMsg.value = '생년월일, 성별, 키, 몸무게는 필수입니다.'
    return
  }
  saving.value = true
  errorMsg.value = ''
  try {
    const payload = {
      birthDate: formCreate.value.birthDate,
      gender: formCreate.value.gender,
      height: Number(formCreate.value.height),
      weight: Number(formCreate.value.weight),
      ...(formCreate.value.preferredDiet ? { preferredDiet: formCreate.value.preferredDiet } : {})
    }
    const { data } = await http.post('/api/profile', payload, { headers: { 'Content-Type': 'application/json' } })
    profile.value = data
    mode.value = 'view'
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || e?.message || '프로필 등록에 실패했습니다.'
  } finally {
    saving.value = false
  }
}

async function saveEdit() {
  if (formEdit.value.height == null || formEdit.value.weight == null || !formEdit.value.preferredDiet) {
    errorMsg.value = '키, 몸무게, 선호 식단은 필수입니다.'
    return
  }
  saving.value = true
  errorMsg.value = ''
  try {
    const payload = {
      height: Number(formEdit.value.height),
      weight: Number(formEdit.value.weight),
      preferredDiet: formEdit.value.preferredDiet
    }
    const { data } = await http.put('/api/profile', payload, { headers: { 'Content-Type': 'application/json' } })
    profile.value = data
    mode.value = 'view'
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || e?.message || '프로필 수정에 실패했습니다.'
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <MainLayout>
    <div class="page">
      <header class="page__header">
        <h1>내 프로필</h1>
        <p class="muted">생년월일/성별은 최초 등록 후 변경할 수 없어요.</p>
      </header>

      <transition name="fade">
        <div v-if="errorMsg" class="alert alert--error">{{ errorMsg }}</div>
      </transition>

      <div v-if="loading" class="card">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
      </div>

      <template v-else>
        <!-- 보기 모드 -->
        <div v-if="mode === 'view' && profile" class="card">
          <div class="card__section">
            <div class="kv"><span class="k">생년월일</span><span class="v">{{ profile.birthDate }}</span></div>
            <div class="kv"><span class="k">성별</span><span class="v">{{ profile.gender }}</span></div>
          </div>

          <div class="divider"></div>

          <div class="card__section grid-2">
            <div class="kv"><span class="k">키(cm)</span><span class="v">{{ profile.height }}</span></div>
            <div class="kv"><span class="k">몸무게(kg)</span><span class="v">{{ profile.weight }}</span></div>
          </div>

          <div class="card__section">
            <div class="kv">
              <span class="k">선호 식단</span>
              <span class="v">
                <span class="chip" :class="'chip--' + (profile.preferredDiet || 'none').toLowerCase()">
                  {{ dietLabel(profile.preferredDiet) }}
                </span>
              </span>
            </div>
            <div class="kv"><span class="k">기초대사량(BMR)</span><span class="v">{{ profile.bmr }}</span></div>
          </div>

          <div class="card__footer">
            <button class="btn btn--primary" @click="toEdit">프로필 수정</button>
          </div>
        </div>

        <!-- 신규 등록 -->
        <form v-if="mode === 'create'" @submit.prevent="saveCreate" class="card form">
          <h2 class="form__title">프로필 등록</h2>

          <div class="form__row">
            <label class="label">생년월일 <span class="req">*</span></label>
            <input class="input" v-model="formCreate.birthDate" type="date" required />
          </div>

          <div class="form__row">
            <label class="label">성별 <span class="req">*</span></label>
            <select class="input" v-model="formCreate.gender" required>
              <option value="" disabled>선택하세요</option>
              <option v-for="g in genderOptions" :key="g.value" :value="g.value">{{ g.label }}</option>
            </select>
          </div>

          <div class="grid-2">
            <div class="form__row">
              <label class="label">키(cm) <span class="req">*</span></label>
              <input class="input" v-model.number="formCreate.height" type="number" min="0" required placeholder="예) 175" />
            </div>
            <div class="form__row">
              <label class="label">몸무게(kg) <span class="req">*</span></label>
              <input class="input" v-model.number="formCreate.weight" type="number" min="0" required placeholder="예) 70" />
            </div>
          </div>

          <div class="form__row">
            <label class="label">선호 식단 (선택)</label>
            <select class="input" v-model="formCreate.preferredDiet">
              <option v-for="d in dietOptions" :key="d.value" :value="d.value">{{ d.label }}</option>
            </select>
          </div>

          <div class="card__footer">
            <button class="btn btn--primary" :disabled="saving">{{ saving ? '저장 중…' : '등록' }}</button>
            <button class="btn btn--ghost" type="button" @click="fetchProfile">취소</button>
          </div>
        </form>

        <!-- 수정 -->
        <form v-if="mode === 'edit'" @submit.prevent="saveEdit" class="card form">
          <h2 class="form__title">프로필 수정</h2>

          <div class="grid-2">
            <div class="form__row">
              <label class="label">키(cm) <span class="req">*</span></label>
              <input class="input" v-model.number="formEdit.height" type="number" min="0" required />
            </div>
            <div class="form__row">
              <label class="label">몸무게(kg) <span class="req">*</span></label>
              <input class="input" v-model.number="formEdit.weight" type="number" min="0" required />
            </div>
          </div>

          <div class="form__row">
            <label class="label">선호 식단 <span class="req">*</span></label>
            <select class="input" v-model="formEdit.preferredDiet" required>
              <option value="" disabled>선택하세요</option>
              <option v-for="d in dietOptions.slice(1)" :key="d.value" :value="d.value">{{ d.label }}</option>
            </select>
          </div>

          <div class="card__footer">
            <button class="btn btn--primary" :disabled="saving">{{ saving ? '저장 중…' : '수정' }}</button>
            <button class="btn btn--ghost" type="button" @click="fetchProfile">취소</button>
          </div>
        </form>
      </template>
    </div>
  </MainLayout>
</template>

<style scoped>
/* Layout */
.page { max-width: 860px; margin: 32px auto; padding: 0 16px; }
.page__header { margin-bottom: 16px; }
.page__header h1 { font-size: 24px; margin: 0 0 4px; }
.muted { color: #6b7280; font-size: 14px; }

/* Card */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px 16px 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.03);
}
.card__section { padding: 8px 4px; }
.card__footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
.divider { height: 1px; background: #f1f5f9; margin: 6px 0 8px; }

/* Key-Value rows */
.kv { display: flex; justify-content: space-between; padding: 8px 0; }
.k { color: #64748b; }
.v { font-weight: 600; }

/* Chips */
.chip {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}
.chip--protein { border-color:#c7d2fe; background:#eef2ff; }
.chip--low_calorie { border-color:#bbf7d0; background:#f0fdf4; }
.chip--healthy_aging { border-color:#fde68a; background:#fffbeb; }
.chip--low_sugar { border-color:#fecaca; background:#fff1f2; }
.chip--none { opacity: .6; }

/* Form */
.form__title { margin: 4px 2px 12px; font-size: 18px; }
.form__row { display: grid; gap: 6px; margin-bottom: 12px; }
.label { font-size: 13px; color: #475569; }
.req { color: #ef4444; margin-left: 2px; }

.input {
  appearance: none;
  width: 100%;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  background: #fff;
  transition: border-color .15s, box-shadow .15s;
}
.input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}

/* Buttons */
.btn {
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-weight: 600;
  cursor: pointer;
}
.btn--primary {
  background: #2563eb; color:#fff;
}
.btn--primary:hover { background:#1d4ed8; }
.btn--ghost {
  background: transparent; color:#334155; border-color:#e5e7eb;
}
.btn--ghost:hover { background:#f8fafc; }

/* Grid */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Alert */
.alert {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid;
  margin-bottom: 12px;
}
.alert--error { background:#fef2f2; color:#b91c1c; border-color:#fecaca; }

/* Skeleton */
.skeleton { height: 14px; background: linear-gradient(90deg,#f1f5f9 25%,#e5e7eb 37%,#f1f5f9 63%); background-size: 400% 100%; animation: sh 1.4s ease infinite; border-radius: 8px; margin: 8px 0; }
.skeleton--title { height: 20px; width: 40%; }
@keyframes sh { 0% {background-position: 100% 0;} 100% {background-position: -100% 0;} }

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity .16s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
