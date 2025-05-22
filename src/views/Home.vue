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

    <div class="row">
      <div class="col-12 d-flex justify-content-center">
        <div
          class="card shadow rounded-5 p-3 bg-danger bg-opacity-75 text-white"
        >
          <h2 class="text-center m-0">Battle Wars</h2>
        </div>
      </div>

      <!-- ปุ่ม Battle แยกออกมาอยู่บนสุด -->
      <div class="row mt-3 mb-4" v-if="store.selectedPokemons.length > 0">
        <div class="col-12 d-flex justify-content-center">
          <button class="btn battle-btn" @click="startBattle()">
            ⚔️ Start Battle ⚔️
          </button>
        </div>
      </div>

      <!-- แสดงค่าเฉลี่ย stats -->
      <div class="row mb-5" v-if="store.selectedPokemons.length > 0">
        <div class="col-12 d-flex justify-content-center">
          <div class="bg-light p-3 rounded shadow">
            <h5 class="text-center">Average Stats</h5>
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item d-flex justify-content-between"
                v-for="(value, key) in averageStats"
                :key="key"
              >
                <span class="text-capitalize">{{ key }}</span>
                <span>{{ value.toFixed(2) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="!store.selectedPokemons.length" class="row">
        <div class="d-flex justify-content-center">
          <div
            class="card shadow rounded-5 p-3 bg-dark bg-opacity-50 text-white mt-3"
          >
            <div class="empty-state">No Pokémon selected</div>
          </div>
        </div>
      </div>
      <transition-group name="fade-slide" tag="div" class="row">
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

            <div class="d-flex justify-content-center mt-4">
              <button
                class="btn btn-outline-danger btn-sm"
                @click="removeFromBattle(poke.id)"
              >
                Remove
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
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content p-4 text-center">
            <button
              type="button"
              class="btn-close ms-auto"
              aria-label="Close"
              @click="closeBattleModal"
            ></button>

            <h3 class="mb-4">Battle Results</h3>

            <div class="battle-winner">
              <div
                class="winner-badge bg-success text-white d-inline-block px-3 py-1 rounded-pill mb-3"
              >
                Winner
              </div>

              <div class="row justify-content-center">
                <div class="col-md-6">
                  <div class="card bg-light">
                    <img
                      :src="battleWinner?.sprites.front_default"
                      :alt="battleWinner?.name"
                      class="mx-auto"
                      style="height: 180px"
                    />
                    <div class="card-body">
                      <h4 class="mt-2 text-capitalize">
                        {{ battleWinner?.name }}
                      </h4>

                      <div class="mt-3">
                        <div
                          v-for="stat in battleWinner?.stats"
                          :key="stat.stat.name"
                          class="mb-2"
                        >
                          <label
                            class="form-label d-flex justify-content-between"
                          >
                            <span class="text-capitalize">{{
                              stat.stat.name
                            }}</span>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn btn-primary mt-4 px-4" @click="closeBattleModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from "vue";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { favorites } from "../stores/favorites";
import { store } from "../stores/store";
import { useRoute } from "vue-router";

const firstName = ref("");
const lastName = ref("");
const number = ref(0);
const items = ref([]);
const editIndex = ref(null);
const currentPage = ref(1);
const perPage = 3;
const route = useRoute();
const selectedPokemonIds = ref([]);

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

// ฟังก์ชั่นสำหรับบันทึก selectedPokemons ลงใน localStorage
function saveSelectedPokemons() {
  try {
    // เก็บเฉพาะ ID เพื่อลดขนาดข้อมูลและป้องกันปัญหา circular reference
    const pokemonIds = store.selectedPokemons.map((pokemon) => pokemon.id);
    localStorage.setItem("selected-pokemon-ids", JSON.stringify(pokemonIds));
    console.log("Saved pokemon ids to localStorage:", pokemonIds);
  } catch (error) {
    console.error("Error saving selected pokemons:", error);
  }
}

// ฟังก์ชั่นสำหรับโหลด selectedPokemons จาก localStorage
function loadSelectedPokemons() {
  try {
    const savedIds = localStorage.getItem("selected-pokemon-ids");
    if (savedIds) {
      const pokemonIds = JSON.parse(savedIds);
      console.log("Loaded pokemon ids from localStorage:", pokemonIds);

      // ตรวจสอบว่ามี allPokemons แล้วหรือไม่
      if (store.allPokemons && store.allPokemons.length > 0) {
        restoreSelectedPokemons(pokemonIds);
      } else {
        // ถ้ายังไม่มี allPokemons ให้เก็บ ID ไว้ก่อน
        selectedPokemonIds.value = pokemonIds;
        console.log("Waiting for allPokemons to be loaded...");
      }
    }
  } catch (error) {
    console.error("Error loading selected pokemons:", error);
  }
}

// ฟังก์ชั่นสำหรับเรียกคืน pokemons จาก ID ที่บันทึกไว้
function restoreSelectedPokemons(pokemonIds) {
  console.log("Restoring pokemons from ids:", pokemonIds);
  console.log("Available allPokemons:", store.allPokemons.length);

  // เคลียร์ค่าเดิมก่อน
  store.selectedPokemons = [];

  // หา pokemon จาก ID และเพิ่มเข้าไปใน selectedPokemons
  pokemonIds.forEach((id) => {
    const pokemon = store.allPokemons.find((p) => p.id === id);
    if (pokemon) {
      store.addPokemon(pokemon);
    }
  });

  console.log("Restored selectedPokemons:", store.selectedPokemons.length);
}

onMounted(async () => {
  const saved = localStorage.getItem("my-items");
  if (saved) {
    items.value = JSON.parse(saved);
  }

  loadSelectedPokemons();

  if (route.query.selected) {
    selectedPokemonIds.value = route.query.selected
      .split(",")
      .map((id) => Number(id));
    console.log("Found selected pokemon ids in URL:", selectedPokemonIds.value);
  }

  // ตรวจสอบและโหลด allPokemons ถ้ายังไม่มี
  if (!store.allPokemons || store.allPokemons.length === 0) {
    await fetchAllPokemons(); // เรียกจาก store
  }

  if (selectedPokemonIds.value.length > 0) {
    restoreSelectedPokemons(selectedPokemonIds.value);
  }
});


// เพิ่ม watcher สำหรับ allPokemons เพื่อเรียกคืนข้อมูล selectedPokemons เมื่อโหลดเสร็จ
watch(
  () => store.allPokemons,
  (newAllPokemons) => {
    if (
      newAllPokemons &&
      newAllPokemons.length > 0 &&
      selectedPokemonIds.value.length > 0
    ) {
      console.log("allPokemons loaded, restoring selected pokemons...");
      nextTick(() => {
        restoreSelectedPokemons(selectedPokemonIds.value);
      });
    }
  },
  { deep: false }
);

// เพิ่ม watcher สำหรับ selectedPokemons เพื่อบันทึกลงใน localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
watch(
  () => store.selectedPokemons,
  () => {
    nextTick(() => {
      saveSelectedPokemons();
    });
  },
  { deep: true }
);

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
  // บันทึกการเปลี่ยนแปลงทันที
  saveSelectedPokemons();
}

// battle modal state
const isBattleModalOpen = ref(false);
const battleWinner = ref(null);

// ฟังก์ชั่นเริ่มการต่อสู้และเลือกผู้ชนะ
function startBattle() {
  // ตรวจสอบว่ามีโปเกมอนอย่างน้อย 1 ตัว
  if (store.selectedPokemons.length === 0) {
    alert("Please select at least 1 Pokémon to battle");
    return;
  }
  let winner = null;
  let highestTotalStat = -Infinity;

  store.selectedPokemons.forEach((pokemon) => {
    const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
    if (total > highestTotalStat) {
      highestTotalStat = total;
      winner = pokemon;
    }
  });
  console.log( store.selectedPokemons.length,"selectedPokemonIds")

  battleWinner.value = winner;
  isBattleModalOpen.value = true;
}

function closeBattleModal() {
  isBattleModalOpen.value = false;
  battleWinner.value = null;
}

// คำนวณค่าเฉลี่ยของ stats แต่ละตัว เช่น hp, attack, defense ฯลฯ
const averageStats = computed(() => {
  const result = {};
  const pokemons = store.selectedPokemons;

  if (pokemons.length === 0) return result;

  const statNames = pokemons[0].stats.map((s) => s.stat.name);
  statNames.forEach((name) => {
    let sum = 0;
    pokemons.forEach((p) => {
      const stat = p.stats.find((s) => s.stat.name === name);
      sum += stat ? stat.base_stat : 0;
    });
    result[name] = sum / pokemons.length;
  });

  return result;
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

/* เพิ่มสไตล์สำหรับผู้ชนะการต่อสู้ */
.battle-winner {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

.battle-btn {
  background: linear-gradient(135deg, #ff1f1f, #ffa41f);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.75rem 3rem;
  border: none;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.battle-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2),
    transparent 70%
  );
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease-out;
  border-radius: 50%;
  z-index: 0;
}

.battle-btn:hover::before {
  transform: translate(-50%, -50%) scale(1);
}

.battle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 31, 31, 0.8);
  cursor: pointer;
}
</style>
