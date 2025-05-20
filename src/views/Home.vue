<template>
  <div class="gif-background">
    <div class="container mt-5">
      <!-- ฟอร์มและแสดงข้อมูลเหมือนเดิม -->
      <div class="row">
        <div class="col-lg-6">
          <div class="card rounded-4 shadow">
            <div class="card-body p-4">
              <form class="form-control border-0" @submit.prevent="addOrUpdate">
                <div class="row mb-2">
                  <div class="col-12">
                    <label class="form-label">first name : </label>
                    <input
                      v-model="firstName"
                      class="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col-12">
                    <label class="form-label">last name :</label>
                    <input
                      v-model="lastName"
                      class="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-12">
                    <label class="form-label">number</label>
                    <input
                      v-model.number="number"
                      class="form-control"
                      type="number"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-6 text-center">
                    <button
                      type="button"
                      @click="increase"
                      class="btn btn-success w-50"
                    >
                      increase
                    </button>
                  </div>
                  <div class="col-6 text-center">
                    <button
                      type="button"
                      @click="decrease"
                      class="btn btn-danger w-50"
                    >
                      decrease
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 mt-5">
                    <button
                      type="submit"
                      class="btn btn-primary w-25 d-block mx-auto"
                    >
                      {{ editIndex !== null ? "Update" : "Add" }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12 mt-md-3 mt-sm-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Firstname :</h5>
                  <p class="card-text">{{ firstName }}</p>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 col-sm-12 mt-md-3 mt-sm-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">lastname :</h5>
                  <p class="card-text">{{ lastName }}</p>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 col-sm-12 mt-md-3 mt-sm-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Number :</h5>
                  <p class="card-text">{{ number }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />

    <!-- ตารางข้อมูลล่าง -->

    <div class="container">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- array object new data-->
          <tr v-for="(item, index) in paginatedItems" :key="index">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td>{{ item.firstName }}</td>
            <td>{{ item.lastName }}</td>
            <td>{{ item.number }}</td>
            <td>
              <button
                class="btn btn-outline-secondary btn-sm me-1"
                @click="editItem(index)"
              >
                edit🖋️
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteItem(index)"
              >
                delete🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->

      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="goToPage(currentPage - 1)"
              >«</a
            >
          </li>

          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{
              page
            }}</a>
          </li>

          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="goToPage(currentPage + 1)"
              >»</a
            >
          </li>
        </ul>
      </nav>
    </div>

    <!-- รวมส่วน Selected Pokémon for Battle -->

    <div class="container">
      <div class="d-flex justify-content-center">
        <div class="card shadow rounded-5 p-3 bg-dark bg-opacity-50 text-white">
          <h2 class="text-center m-0">Let's Start Battle 🔥</h2>
        </div>
      </div>
      <div class="row">
        <div class="d-flex justify-content-center">
          <div
            class="card shadow rounded-5 p-3 bg-dark bg-opacity-50 text-white mt-3"
          >
            <div
              v-if="store.selectedPokemons.length === 0"
              class="text-center m-0"
            >
              No Pokémon selected
            </div>
          </div>
        </div>
      </div>
      <transition-group
        v-elses
        name="fade-slide"
        tag="div"
        class="row justify-content-center"
      >
        <div
          v-for="poke in store.selectedPokemons"
          :key="poke.id"
          class="col-12 col-md-6 col-lg-4 mb-4"
        >
          <div class="card shadow-sm p-3">
            <img
              :src="poke.sprites.front_default"
              :alt="poke.name"
              class="img-fluid mx-auto d-block"
              style="height: 120px; object-fit: contain"
            />
            <h5 class="text-capitalize text-center mt-2">{{ poke.name }}</h5>

            <div class="mt-3">
              <div
                v-for="stat in poke.stats"
                :key="stat.stat.name"
                class="mb-2"
              >
                <label class="form-label d-flex justify-content-between">
                  <span class="text-capitalize">{{ stat.stat.name }}</span>
                  <span>{{ stat.base_stat }}</span>
                </label>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{ width: stat.base_stat + '%' }"
                    :class="getStatColor(stat.base_stat)"
                  ></div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between mt-4">
              <button
                class="btn btn-outline-danger btn-sm"
                @click="removeFromBattle(poke.id)"
              >
                delete
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- ⭐ Battle Modal -->
    <transition name="fade">
      <div
        v-if="isBattleModalOpen"
        class="modal d-block bg-dark bg-opacity-75"
        style="z-index: 1050"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4 text-center">
            <button
              type="button"
              class="btn-close ms-auto"
              aria-label="Close"
              @click="closeBattleModal"
            ></button>

            <img
              :src="battlePokemon?.sprites.front_default"
              :alt="battlePokemon?.name"
              class="mx-auto"
              style="height: 120px"
            />
            <h4 class="mt-3 text-capitalize">{{ battlePokemon?.name }}</h4>

            <h5
              class="mt-4 fw-bold"
              :class="battleResult === 'win' ? 'text-success' : 'text-danger'"
            >
              {{ battleResult === "win" ? "You Win!" : "You Lose!" }}
            </h5>

            <button class="btn btn-secondary mt-3" @click="closeBattleModal">
              ปิด
            </button>
          </div>
        </div>
      </div>
    </transition>
    <div>
                      <button
                class="btn btn-outline-success btn-sm"
                @click="startBattle(poke)"
              >
                Battle
              </button>
              </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { favorites } from "../stores/favorites";
import { store } from "../stores/store";

const firstName = ref("");
const lastName = ref("");
const number = ref(0);
const items = ref([]);
const editIndex = ref(null);
const currentPage = ref(1);
const perPage = 3;

function increase() {
  number.value++;
}

function decrease() {
  number.value--;
}

function addOrUpdate() {
  if (!firstName.value || !lastName.value || number.value === null) {
    alert("กรุณากรอกข้อมูลให้ครบค่ะ");
    return;
  }

  const newItem = {
    firstName: firstName.value,
    lastName: lastName.value,
    number: number.value,
  };

  if (editIndex.value !== null) {
    items.value[editIndex.value] = newItem;
    editIndex.value = null;
  } else {
    items.value.push(newItem);
  }

  firstName.value = "";
  lastName.value = "";
  number.value = 0;
}

function deleteItem(index) {
  if (confirm("ต้องการลบข้อมูลนี้หรือไม่ ?")) {
    items.value.splice(index, 1);
  }
}

function editItem(index) {
  const item = items.value[index];
  firstName.value = item.firstName;
  lastName.value = item.lastName;
  number.value = item.number;
  editIndex.value = index;
}

onMounted(() => {
  const saved = localStorage.getItem("my-items");
  if (saved) {
    items.value = JSON.parse(saved);
  }
});

watch(
  items,
  (newItems) => {
    localStorage.setItem("my-items", JSON.stringify(newItems));
  },
  { deep: true }
);

const totalPages = computed(() => Math.ceil(items.value.length / perPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return items.value.slice(start, start + perPage);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function getStatColor(value) {
  if (value >= 100) return "bg-success";
  if (value >= 70) return "bg-warning";
  if (value >= 50) return "bg-info";
  return "bg-danger";
}

// 🧠 New methods for battle
function removeFromBattle(pokeId) {
  store.selectedPokemons = store.selectedPokemons.filter(
    (p) => p.id !== pokeId
  );
}

// battle modal state
const isBattleModalOpen = ref(false);
const battleResult = ref(null);
const battlePokemon = ref(null);

function startBattle(pokemon) {
  // สุ่มผลลัพธ์
  const result = Math.random() > 0.5 ? "win" : "lose";
  battleResult.value = result;
  battlePokemon.value = pokemon;
  isBattleModalOpen.value = true;
}

function closeBattleModal() {
  isBattleModalOpen.value = false;
}

import { useRoute } from "vue-router";

const route = useRoute();
const selectedPokemonIds = ref([]);

onMounted(() => {
  if (route.query.selected) {
    selectedPokemonIds.value = route.query.selected
      .split(",")
      .map((id) => Number(id));
    // ใช้ selectedPokemonIds นี้ดึงข้อมูล Pokémon มาแสดง หรือดึงจาก store ก็ได้
    console.log("Selected Pokémon IDs:", selectedPokemonIds.value);
  }
});

onMounted(() => {
  // โหลดข้อมูลฟอร์มจาก localStorage
  const saved = localStorage.getItem("my-items");
  if (saved) {
    items.value = JSON.parse(saved);
  }

  // ดึง query string: ?selected=1,4,7,...
  if (route.query.selected) {
    selectedPokemonIds.value = route.query.selected
      .split(",")
      .map((id) => Number(id));

    // ตรวจสอบว่ามี allPokemons แล้วหรือยัง
    if (store.allPokemons.length > 0) {
      const selected = store.allPokemons.filter((poke) =>
        selectedPokemonIds.value.includes(poke.id)
      );

      // เคลียร์ของเก่าแล้วเพิ่มใหม่ทั้งหมด
      store.selectedPokemons = [];
      selected.forEach((p) => store.addPokemon(p));
    } else {
      console.warn(
        "⚠️ ยังไม่มีข้อมูล allPokemons ใน store – ต้องโหลดก่อนเรียกหน้า Home"
      );
    }
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* พื้นหลัง GIF ที่ container */
.gif-background {
  background-image: url("https://img.itch.zone/aW1nLzEwNDcxMzQ0LmdpZg==/original/T3LMCL.gif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.gif-background > * {
  border-radius: 0.9rem;
  padding: 1rem;
}
.custom-bg {
  background-color: rgba(48, 48, 48, 0.318); /* สีดำโปร่งใส 75% */
}
</style>
