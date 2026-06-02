import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  // No session check required, anyone can submit
  const form = document.querySelector(".form-container form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      // Try to get user_id if logged in, else leave undefined
      let user_id = undefined;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && session.user && session.user.id) {
          user_id = session.user.id;
        }
      } catch (e) {}

      const { error } = await supabase.from("volunteers").insert([
        {
          user_id: user_id,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          constituency: formData.get("constituency"),
          message: formData.get("message"),
        },
      ]);

      if (error) {
        alert("Submission failed: " + (error.message || JSON.stringify(error)));
        console.error(error);
      } else {
        alert("Thank you for joining as a volunteer!");
        form.reset();
      }
    });
  }
});
