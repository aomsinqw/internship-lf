<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5">Information</h1>

    <form class="d-flex mb-4" @submit.prevent>
      <input
        class="form-control me-2 rounded-pill"
        type="search"
        placeholder="Search"
        v-model="search"
      />
      <button class="btn btn-outline-primary rounded-pill me-2" type="submit">
        Search
      </button>
      <button
        class="btn btn-outline-danger rounded-pill"
        type="button"
        @click="goToRegister"
      >
        +
      </button>
    </form>

    <!-- จำนวนที่เลือก -->
    <div v-if="selectedIds.length" class="mb-3 d-flex align-items-center">
      <strong>{{ selectedIds.length }} member(s) selected. </strong>

      <button
        class="btn btn-danger btn-sm ms-3"
        :disabled="deleting"
        @click="confirmDeleteSelected"
      >
        <span
          v-if="deleting"
          class="spinner-border spinner-border-sm me-1"
        ></span>
        Delete Selected
      </button>

      <button
        class="btn btn-secondary btn-sm ms-2"
        @click="clearSelection"
        :disabled="deleting"
      >
        Clear
      </button>
    </div>

    <table class="table table-bordered rounded shadow">
      <thead>
        <tr class="text-center">
          <th></th>
          <th>Id</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Email</th>
          <th>Birth Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <transition-group name="fade-row" tag="tbody" appear>
        <tr
          class="text-center"
          v-for="(member, index) in filteredMembers"
          :key="member.id"
        >
          <td>
            <input type="checkbox" :value="member.id" v-model="selectedIds" />
          </td>

          <th>{{ index + 1 }}</th>

          <td v-if="editingId === member.id">
            <input v-model="member.name" class="form-control" />
          </td>
          <td v-else v-html="highlightText(member.name, search)"></td>

          <td v-if="editingId === member.id">
            <input v-model="member.surname" class="form-control" />
          </td>
          <td v-else v-html="highlightText(member.surname, search)"></td>

          <td v-if="editingId === member.id">
            <input v-model="member.email" class="form-control" />
          </td>
          <td v-else v-html="highlightText(member.email, search)"></td>

          <td v-if="editingId === member.id">
            <input
              v-model="member.birthDate"
              type="date"
              class="form-control"
            />
          </td>
          <td v-else v-html="highlightText(member.birthDate, search)"></td>

          <td v-if="editingId === member.id">
            <select v-model="member.isActive" class="form-select">
              <option :value="true">Online</option>
              <option :value="false">Offline</option>
            </select>
          </td>
          <td v-else v-html="highlightText(member.statusText, search)"></td>

          <td>
            <button
              v-if="editingId !== member.id"
              class="btn btn-sm btn-warning me-2 rounded-pill"
              @click="editingId = member.id"
            >
              <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button
              v-else
              class="btn btn-sm btn-success me-2 rounded-pill"
              @click="saveEdit(member)"
            >
              <i class="bi bi-check-circle"></i> Save
            </button>
            <button
              class="btn btn-sm btn-danger rounded-pill"
              @click="confirmDelete(member.id)"
            >
              <i class="bi bi-trash"></i> Delete
            </button>
          </td>
        </tr>

        <tr v-if="filteredMembers.length === 0">
          <td colspan="8" class="text-center">No members found.</td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import axios from "axios";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const router = useRouter();
const toast = useToast();
const memberStore = useMemberStore();
const { members } = storeToRefs(memberStore);

const search = ref("");
const editingId = ref(null);
const selectedIds = ref([]); // ✅ สำหรับเก็บ ID ที่ checkbox เลือก
const deleting = ref(false); // ✅ สำหรับแสดง loading ตอนลบหลายรายการ

onMounted(() => {
  memberStore.getMember();
});

const filteredMembers = computed(() => {
  const keyword = search.value.toLowerCase().trim();
  if (!keyword) return memberStore.usersWithStatus;

  return memberStore.usersWithStatus.filter((m) =>
    [m.name, m.surname, m.email, m.birthDate, m.statusText]
      .some((field) => field?.toLowerCase().includes(keyword))
  );
});

const highlightText = (text, keyword) => {
  if (!keyword || !text) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.toString().replace(regex, `<span class="highlight">$1</span>`);
};

const saveEdit = async (member) => {
  // Validate
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!member.name || !member.surname || !member.email || !member.birthDate) {
    toast.error("Please fill in all fields");
    return;
  }
  if (!emailRegex.test(member.email)) {
    toast.error("Invalid email format");
    return;
  }
  const birthYear = new Date(member.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  if (birthYear < 1900 || birthYear > currentYear) {
    toast.error("Invalid birth year");
    return;
  }

  try {
    const url = `https://backend-f224d-default-rtdb.asia-southeast1.firebasedatabase.app/members/${member.id}.json`;
    await axios.put(url, {
      name: member.name,
      surname: member.surname,
      email: member.email,
      birthDate: member.birthDate,
      isActive: member.isActive,
    });

    editingId.value = null;
    await memberStore.getMember();
    toast.success("Member updated");
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};

const confirmDelete = async (id) => {
  const member = memberStore.usersWithStatus.find((m) => m.id === id);
  const result = await Swal.fire({
    title: "Are you sure?",
    html: `Delete <strong>${member.name} ${member.surname}</strong>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    await memberStore.deleteMember(id);
    await memberStore.getMember();
    toast.success("Deleted successfully");
  }
};

const confirmDeleteSelected = async () => {
  if (selectedIds.value.length === 0) return;

  const result = await Swal.fire({
    title: "Are you sure?",
    html: `Delete <strong>${selectedIds.value.length}</strong> selected member(s)?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      deleting.value = true;
      for (const id of selectedIds.value) {
        await memberStore.deleteMember(id);
      }
      await memberStore.getMember();
      toast.success("Selected members deleted");
      selectedIds.value = [];
    } catch (err) {
      console.error(err);
      toast.error("Deletion failed");
    } finally {
      deleting.value = false;
    }
  }
};

const clearSelection = () => {
  selectedIds.value = [];
};

const goToRegister = () => {
  memberStore.resetForm?.(); 
  router.push("/register");
};
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
.fade-row-enter-active,
.fade-row-leave-active {
  transition: all 0.5s ease;
}

.fade-row-enter-from,
.fade-row-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
