<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-6">
        <div class="card rounded-4 shadow">
          <div class="card-body p-4">
            <form class="form-control border-0" @submit.prevent="addOrUpdate">
              <div class="row mb-2">
                <div class="col-12">
                  <label class="form-label">first name : </label>
                  <input v-model="firstName" class="form-control" type="text" />
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-12">
                  <label class="form-label">last name :</label>
                  <input v-model="lastName" class="form-control" type="text" />
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

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
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

  <div class="container mt-5">
    <h1 class="text-center">My Favorite Pokémon</h1>

    <div v-if="favorites.list.length === 0" class="text-center">
      <p>No favorites yet</p>
    </div>

    <div v-else class="row justify-content-center">
      <div
        class="col-md-4 mb-4"
        v-for="poke in favorites.list"
        :key="poke.id"
      >
        <div class="card text-center shadow">
          <img
            :src="poke.sprites.front_default"
            class="card-img-top p-4"
            :alt="poke.name"
            style="height: 200px; object-fit: contain"
          />
          <div class="card-body">
            <h5 class="card-title">{{ poke.name }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { favorites } from "../stores/favorites";

const firstName = ref("");
const lastName = ref("");
const number = ref(0);
const items = ref([]);
const editIndex = ref(null); //new funtion
const currentPage = ref(1);
const perPage = 3;

function increase() {
  number.value++;
}

function decrease() {
  number.value--;
}
// alert
function addOrUpdate() {
  if (!firstName.value || !lastName.value || number.value === null) {
    alert("กรุณากรอกข้อมูลให้ครบค่ะ");
    return;
  }
  // newitems push in table
  const newItem = {
    firstName: firstName.value,
    lastName: lastName.value,
    number: number.value,
  };

  if (editIndex.value !== null) {
    // ถ้ามี index แสดงว่าเป็นการแก้ไข
    items.value[editIndex.value] = newItem;
    editIndex.value = null;
  } else {
    items.value.push(newItem); // ถ้าไม่มี index แสดงว่าเป็นการเพิ่มใหม่
  }
  // เคลียร์ค่าหลังเพิ่ม/แก้ไข
  firstName.value = "";
  lastName.value = "";
  number.value = 0;
}
// delete data
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

// pagination
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
</script>

<style></style>
