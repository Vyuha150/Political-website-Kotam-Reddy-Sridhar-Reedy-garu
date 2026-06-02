import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  // No session check required, anyone can submit
  const form = document.getElementById("eligibilityForm");
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

      const { error } = await supabase.from("scheme_eligibility").insert([
        {
          user_id: user_id,
          fullname: formData.get("fullname"),
          age: parseInt(formData.get("age")),
          gender: formData.get("gender"),
          mobile: formData.get("mobile"),
          aadhaar: formData.get("aadhaar"),
          caste: formData.get("caste"),
          marital: formData.get("marital"),
          disability: formData.get("disability"),
          disability_details: formData.get("disability_details"),
          income: formData.get("income"),
          education: formData.get("education"),
          employment: formData.get("employment"),
          skill_training: formData.get("skill_training"),
          skill_training_details: formData.get("skill_training_details"),
          social_service: formData.get("social_service"),
          social_service_details: formData.get("social_service_details"),
          welfare_member: formData.get("welfare_member"),
          schemes: formData.get("schemes"),
        },
      ]);

      if (error) {
        alert("Submission failed: " + (error.message || JSON.stringify(error)));
        console.error(error);
      } else {
        alert("Your eligibility form has been submitted successfully!");
        form.reset();
      }
    });
  }
});
