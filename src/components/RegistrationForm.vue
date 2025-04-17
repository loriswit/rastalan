<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import type { FormFields } from "@/util/types.ts"
import "@/assets/styles/spinner.css"

const { days, eventNumber } = defineProps<{
  days: Date[]
  eventNumber: number
}>()

const saved = JSON.parse(localStorage.getItem("form") ?? "{}") as FormFields

const fields = reactive<FormFields>({
  name: saved.name ?? "",
  hardware: {
    pc: saved.hardware?.pc ?? false,
    laptop: saved.hardware?.laptop ?? false,
    console: saved.hardware?.console ?? false,
  },
  everyday: saved.everyday ?? false,
  notEveryDay: saved.notEveryDay ?? false,
  days: saved.days ?? Array(days.length).fill(false),
  conditionsRead: saved.conditionsRead ?? false,
  conditionsAccepted: saved.conditionsAccepted ?? false,
  registered: saved.registered ?? false,
  eventNumber,
})

let loading = ref(false)

watch(
  () => fields.everyday,
  val => (fields.notEveryDay = val ? !val : fields.notEveryDay),
)
watch(
  () => fields.notEveryDay,
  val => (fields.everyday = val ? !val : fields.everyday),
)
watch(fields, val => localStorage.setItem("form", JSON.stringify(val)))

const nameValid = computed(() => fields.name.length > 0)
const hardwareValid = computed(() => Object.values(fields.hardware).includes(true))
const daysValid = computed(() => fields.everyday || (fields.notEveryDay && fields.days.includes(true)))
const formValid = computed(() => nameValid.value && hardwareValid.value && daysValid.value)

async function register() {
  if (!formValid.value) return
  loading.value = true

  const payload = {
    name: fields.name,
    hardware: fields.hardware,
    days: fields.everyday ? Array(days.length).fill(true) : fields.days,
    conditionsRead: fields.conditionsRead,
    conditionsAccepted: fields.conditionsAccepted,
  }

  const res = await fetch("/register", {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  })

  if (res.status >= 400) {
    loading.value = false
    alert("Erreur : " + (await res.text()))
  } else fields.registered = new Date()
  location.href = `/participants?registration=${res.status === 201 ? "new" : "updated"}`
}
</script>

<template>
  <form @submit.prevent="register">
    <p>Je suis</p>
    <div class="required" title="Champ obligatoire">
      <input type="text" class="required" placeholder="Nom" required minlength="2" autofocus v-model="fields.name" />
    </div>

    <template v-if="nameValid">
      <p>Je débarque avec</p>
      <label class="field">
        <input type="checkbox" v-model="fields.hardware.pc" />
        <span class="name">un PC fixe</span>
      </label>
      <label class="field">
        <input type="checkbox" v-model="fields.hardware.laptop" />
        <span class="name">un PC portable</span>
      </label>
      <label class="field">
        <input type="checkbox" v-model="fields.hardware.console" />
        <span class="name">une console</span>
      </label>

      <template v-if="hardwareValid">
        <p>Je viendrai</p>
        <label class="field">
          <input type="checkbox" v-model="fields.everyday" />
          <span class="name">plus ou moins tous les jours</span>
        </label>
        <label class="field">
          <input type="checkbox" v-model="fields.notEveryDay" />
          <span class="name">quelques jours</span>
        </label>

        <template v-if="fields.notEveryDay">
          <p>Quand</p>
          <p class="small">approximativement</p>
          <label class="field" v-for="(day, index) in days">
            <input type="checkbox" v-model="fields.days[index]" />
            <span class="name">
              {{
                day.toLocaleString("fr-CH", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              }}
            </span>
          </label>
        </template>

        <p></p>
        <template v-if="formValid">
          <label>
            <input type="checkbox" v-model="fields.conditionsAccepted" />
            J'ai lu et j'accepte les
            <a href="/conditions">conditions de participation</a>.
          </label>

          <button type="submit" :disabled="loading">
            <span class="spinner" v-if="loading"></span>
            <span v-else>Je m'inscris</span>
          </button>
        </template>
      </template>
    </template>
  </form>
</template>

<style scoped>
form {
  max-width: 400px;
  margin: -20px auto 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;

  p {
    transform: skew(-10deg);
    margin-bottom: 0;
    font-size: 1.2em;

    &.small {
      font-size: 0.7em;
      margin-top: -0.2em;
    }
  }
}

.required {
  position: relative;
}

.required:after {
  content: "*";
  position: absolute;
  bottom: -0.2em;
  right: 0.3em;
  font-size: 2em;
  color: #f38;
}

textarea {
  resize: none;
}

label {
  display: block;
  padding: 15px;
  text-align: left;
  font-size: 0.85em;

  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

label:has(input[type="checkbox"]) {
  cursor: pointer;
}
</style>
