<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5">Information</h1>
    <form class="d-flex">
      <input
        class="form-control me-2 rounded-pill"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button class="btn btn-outline-primary rounded-pill" type="submit">
        Search
      </button>
    </form>
    <div class="row mt-5">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Surname</th>
            <th scope="col">Email</th>
            <th scope="col">Brith Date</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in memberStore.usersWithStatus" :key="member.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ member.name }}</td>
            <td>{{ member.surname }}</td>
            <td>{{ member.email }}</td>
            <td>{{ member.birthDate }}</td>
            <td>{{ member.statusText }}</td>
          </tr>
          <tr v-if="memberStore.members.length === 0">
            <td colspan="6" class="text-center">No members found.</td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="d-grid d-md-flex justify-content-md-end mt-3">
          <button
            class="btn btn-primary me-md-2"
            @click="goToRegister"
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useMemberStore } from '@/stores/member'
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const memberStore = useMemberStore();
const { members } = storeToRefs(memberStore);
const router = useRouter();
const search = ref(" ");

// ดึง getMem จาก Firebase ผ่าน store
onMounted(() =>  {
    memberStore.getMember().then(() => {
    console.log('Member:', memberStore.members)
  })

})

function goToRegister() {
  router.push("/register");
}
</script>
