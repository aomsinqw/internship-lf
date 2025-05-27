import { defineStore } from 'pinia';
import axios from 'axios';

const url = "https://backend-f224d-default-rtdb.asia-southeast1.firebasedatabase.app/members.json";

export const useMemberStore = defineStore("member", {
  state: () => ({
    count: 0,
    name: "",
    surname: "",
    birthDate: "",
    isActive: null,
    email: "",
    members: [],
  }),
  actions: {
    async submitForm() {
      try {
        const body = {
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

        const submitRes = await axios.post(url, body, headers);
        console.log("response", submitRes);

        await this.getMember();  // โหลดสมาชิกใหม่หลังเพิ่ม

        this.resetForm();
        return true;
      } catch (err) {
        console.error("Error submitting:", err);
        return false;
      }
    },
    async emailIsExist() {
      const checkUrl = `${url}?orderBy=%22email%22&equalTo=${encodeURIComponent(
        `"${this.email}"`
      )}`;
      try {
        const response = await axios.get(checkUrl);
        if (response.data && Object.keys(response.data).length > 0) {
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error checking email existence:", error);
        return false;
      }
    },
    resetForm() {
      this.name = "";
      this.surname = "";
      this.birthDate = "";
      this.isActive = null;
      this.email = "";
    },
    async getMember() {
      try {
        const response = await axios.get(url);
        if (response.data) {
          console.log(response.data)
          this.members = Object.entries(response.data).map(([id, value]) => ({
            id,
            ...value,
          }));
        } else {
          this.members = [];
        }
      } catch (error) {
        console.error("Error loading members:", error);
        this.members = [];
      }
    },
    async deleteMember(id) {
      try {
        await axios.delete(
          `https://backend-f224d-default-rtdb.asia-southeast1.firebasedatabase.app/members/${id}.json`
        );
        await this.getMember();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    },
    async updateMember(id, updatedData) {
      try {
        const updateUrl = `https://backend-f224d-default-rtdb.asia-southeast1.firebasedatabase.app/members/${id}.json`;
        await axios.patch(updateUrl, updatedData, {
          headers: { "Content-Type": "application/json" },
        });
        await this.getMember();
        return true;
      } catch (error) {
        console.error("Error updating member:", error);
        return false;
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
