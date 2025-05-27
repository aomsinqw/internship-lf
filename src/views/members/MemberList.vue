<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5">Information</h1>
    <form class="d-flex" @submit.prevent>
      <input
        class="form-control me-2 shadow rounded-pill"
        type="search"
        placeholder="Search"
        aria-label="Search"
        v-model="search"
      />
      <button
        class="btn btn-outline-primary shadow rounded-pill me-md-2"
        type="submit"
      >
        Search
      </button>
      <button
        class="btn btn-outline-danger shadow rounded-pill"
        @click="goToRegister"
        type="button"
      >
        +
      </button>
    </form>

    <div class="row mt-5 table-wrapper rounded-4 shadow overflow-hidden">
      <table class="table table-bordered shadow mb-0">
        <thead>
          <tr class="text-center">
            <th scope="col" class="rounded-start-4">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Surname</th>
            <th scope="col">Email</th>
            <th scope="col">Brith Date</th>
            <th scope="col">Status</th>
            <th scope="col" class="rounded-start-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="text-center"
            v-for="(member, index) in displayedMembers"
            :key="member.id"
          >
            <th scope="row">{{ index + 1 }}</th>

            <!-- Name -->
            <td>
              <input
                v-if="editingIndex === index"
                v-model="member.name"
                class="form-control"
              />
              <span v-else v-html="highlightText(member.name, search)"></span>
            </td>

            <!-- Surname -->
            <td>
              <input
                v-if="editingIndex === index"
                v-model="member.surname"
                class="form-control"
              />
              <span
                v-else
                v-html="highlightText(member.surname, search)"
              ></span>
            </td>

            <!-- Email -->
            <td>
              <input
                v-if="editingIndex === index"
                v-model="member.email"
                class="form-control"
              />
              <span v-else v-html="highlightText(member.email, search)"></span>
            </td>

            <!-- Birth Date -->
            <td>
              <input
                v-if="editingIndex === index"
                v-model="member.birthDate"
                type="date"
                class="form-control"
              />
              <span
                v-else
                v-html="highlightText(member.birthDate, search)"
              ></span>
            </td>

            <!-- Status -->
            <!-- แก้ไข Status select ให้ bind ถูกต้อง -->
            <td>
              <select
                v-if="editingIndex === index"
                v-model="member.statusText"
                class="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <span
                v-else
                v-html="highlightText(member.statusText, search)"
              ></span>
            </td>

            <!-- Actions -->
            <td class="text-center">
              <button
                class="btn btn-sm me-2 rounded-pill shadow"
                :class="editingIndex === index ? 'btn-success' : 'btn-warning'"
                @click="
                  editingIndex === index ? saveEdit(index) : startEdit(index)
                "
              >
                <i
                  class="bi"
                  :class="
                    editingIndex === index
                      ? 'bi-check-circle'
                      : 'bi-pencil-square'
                  "
                ></i>
                {{ editingIndex === index ? "Save" : "Edit" }}
              </button>

              <button
                class="btn btn-sm btn-danger rounded-pill shadow"
                @click="confirmDelete(member.id)"
                :disabled="editingIndex === index"
              >
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import * as bootstrap from "bootstrap";
import { useToast } from "vue-toastification";
import axios from "axios";

const memberStore = useMemberStore();
const { members } = storeToRefs(memberStore);
const router = useRouter();
const toast = useToast();
const editingIndex = ref(null);

const search = ref("");
const displayedMembers = ref([]);
const deleteId = ref(null);
const selectedMember = ref(null);

onMounted(async () => {
  await memberStore.getMember();
  displayedMembers.value = [...memberStore.usersWithStatus]
    .map(member => ({
      ...member,
      statusText: typeof member.statusText === 'string'
        ? member.statusText
        : member.status
        ? 'active'
        : 'inactive'
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // ⬅ เรียง A-Z ตามชื่อ
});
  
watch(() => memberStore.usersWithStatus, (newUsers) => {
  if (newUsers && newUsers.length > 0) {
    displayedMembers.value = [...newUsers];
    
    // แก้ไข statusText ให้เป็น string เสมอ
    displayedMembers.value.forEach(member => {
      if (typeof member.statusText === 'boolean') {
        member.statusText = member.statusText ? 'active' : 'inactive';
      } else if (typeof member.statusText !== 'string') {
        member.statusText = member.status ? 'active' : 'inactive';
      }
    });
  }
}, { deep: true, immediate: true });


watch(search, (newSearch) => {
  const keyword = newSearch.toLowerCase().trim();

  const filtered = !keyword
    ? memberStore.usersWithStatus
    : memberStore.usersWithStatus.filter((member) =>
        [
          member.name,
          member.surname,
          member.email,
          member.birthDate,
          member.statusText,
        ].some((field) => field?.toLowerCase().includes(keyword))
      );

  displayedMembers.value = filtered
    .map(member => ({
      ...member,
      statusText: typeof member.statusText === 'string'
        ? member.statusText
        : member.status
        ? 'active'
        : 'inactive'
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // ⬅ เรียง A-Z
});


function highlightText(text, keyword) {
  if (!keyword || !text) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.toString().replace(regex, `<span class="highlight">$1</span>`);
}

function goToRegister() {
  memberStore.resetForm();
  router.push("/register");
}

// function goToEdit(id) {
//   router.push({ path: "/register", query: { id } });
// }

async function deleteMember() {
  await memberStore.deleteMember(deleteId.value);
  toast.success("Member deleted successfully");
  await memberStore.getMember();
  displayedMembers.value = [...memberStore.usersWithStatus];
  deleteId.value = null;
  bootstrap.Modal.getInstance(
    document.getElementById("confirmDeleteModal")
  ).hide();
}

async function confirmDelete(id) {
  const member = memberStore.usersWithStatus.find((m) => m.id === id);

  const result = await Swal.fire({
    title: "Are you sure?",
    html: `Are you sure you want to delete <strong>${member.name} ${member.surname}</strong>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    await memberStore.deleteMember(id);
    toast.success("Member deleted successfully");
    await memberStore.getMember();
    displayedMembers.value = [...memberStore.usersWithStatus];
  }
}

// เพิ่ม function สำหรับเริ่มแก้ไข
function startEdit(index) {
  editingIndex.value = index;
  // ให้แน่ใจว่า statusText เป็น string
  const member = displayedMembers.value[index];
  if (typeof member.isActive !== "string") {
    member.statusText = member.isActive ? "active" : "inactive";
  }
  console.log("Editing member:", member);
}

async function saveEdit(index) {
  const member = displayedMembers.value[index];

  console.log("Saving member with statusText:", member.statusText);

  const updateUrl = `https://backend-f224d-default-rtdb.asia-southeast1.firebasedatabase.app/members/${member.id}.json`;

  const payload = {
    name: member.name,
    surname: member.surname,
    email: member.email,
    birthDate: member.birthDate,
    statusText: member.statusText, // ใช้ statusText ที่เลือก
    isActive: member.statusText === "active", // แปลงเป็น boolean
  };

  try {
    const response = await axios.put(updateUrl, payload);
    console.log("API Response:", response.data);
    
    toast.success("Member updated successfully");
    editingIndex.value = null;
    
    // **แก้ไขตรงนี้** - อัปเดต local data ก่อน แล้วค่อย refresh
    // อัปเดตข้อมูลใน displayedMembers ให้ตรงกับที่บันทึก
    displayedMembers.value[index] = {
      ...member,
      statusText: member.statusText,
      status: member.statusText === "active"
    };
    
    
  } catch (error) {
    console.error("Update failed", error);
    toast.error("Failed to update member");
  }
}
</script>

<style>
@keyframes flash-highlight {
  0%,
  100% {
    background-color: yellow;
  }
  50% {
    background-color: rgb(0, 255, 208);
  }
}

.highlight {
  background-color: yellow;
  font-weight: bold;
  animation: flash-highlight 0.8s ease-in-out;
}

.custom-rounded-table {
  border-radius: 1rem;
  overflow: hidden; /* สำคัญ! เพื่อให้หัวตารางก็โค้งด้วย */
}

.table-wrapper {
  border: 1px solid #dee2e6; /* ถ้าต้องการเส้นรอบนอก */
}

.table-wrapper {
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
}
</style>
