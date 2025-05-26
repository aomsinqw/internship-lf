import { defineStore } from "pinia";
import axios from "axios";

const url =
  "https://backend-f224d-default-rtdb.asia-southeast1.firebasedatabase.app/members.json";

function validateForm() {
  console.log("validate");
}

export const useMemberStore = defineStore("member", {
  state: () => ({
    count: 0,
    name: "",
    surname: "",
    birthDate: "",
    isActive: "",
    email: "",
    members: [],
  }),
  actions: {
    async submitForm() {
      try {
        const qwert = {
          name: this.name,
          surname: this.surname,
          birthDate: this.birthDate,
          isActive: this.isActive,
          email: this.email,
        };

        const headers = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const submitRes = await axios.post(url, qwert, headers);
        console.log("response", submitRes);
        this.resetForm();

        return true;
      } catch (err) {
        console.error("Error submitting:", err);
        return false;
      }
    },
    async emailIsExist() {
      //
      const checkUrl = `${url}?orderBy=%22email%22&equalTo=${encodeURIComponent(
        `"${this.email}"`
      )}`;
      const response = await axios.get(checkUrl);

      console.log(response.data);
      if (response.data && Object.keys(response.data).length > 0) {
        return true;
      }
      return false;
    },
    resetForm() {
      this.name = "";
      this.surname = "";
      this.birthDate = "";
      this.isActive = "";
      this.email = "";
    },
    async getMember() {
      try {
        const response = await axios.get(url);
        console.log(response);
        if (response.data) {
          this.members = Object.entries(response.data).map(([id, value]) => ({
            id,
            ...value,
          }));
        }
      } catch (error) {
        console.error("Error loading members:", error);
      }
    },
  },
  getters: {
    usersWithStatus: (state) => {
      return state.members.map((member) => ({
        ...member,
        statusText: member.isActive ? "active" : "inactive",
        
      }));
    },
  },
});
