import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  // No session check required, anyone can submit
  const form = document.querySelector(".form-container form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

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

      // Collect checkbox values for interest areas
      const interestAreas = Array.from(
        document.querySelectorAll('input[name="ms_interest[]"]:checked')
      ).map((el) => el.value);

      // Organization association
      const organization = document.querySelector(
        'input[name="ms_organization"]:checked'
      )?.value;

      // Experience
      const experience = document.querySelector(
        'input[name="ms_experience"]:checked'
      )?.value;

      // Declaration checkbox
      const declaration = document.querySelector(
        'input[name="ms_declaration"]:checked'
      )
        ? true
        : false;

      // Insert registration
      const { error } = await supabase
        .from("mahila_shakti_registrations")
        .insert([
          {
            user_id: user_id,
            fullname: document.getElementById("ms_fullname").value,
            age: parseInt(document.getElementById("ms_age").value),
            mobile: document.getElementById("ms_mobile").value,
            email: document.getElementById("ms_email").value || null,
            address: document.getElementById("ms_address").value,
            district: document.getElementById("ms_district").value,
            constituency: document.getElementById("ms_constituency").value,
            organization: organization,
            organization_details:
              document.getElementById("ms_organization_details").value || null,
            interest_areas: interestAreas,
            why_join: document.getElementById("ms_why_join").value,
            experience: experience,
            experience_details:
              document.getElementById("ms_experience_details").value || null,
            grievance: document.getElementById("ms_grievance").value || null,
            declaration: declaration,
          },
        ]);

      if (error) {
        alert("Submission failed: " + (error.message || JSON.stringify(error)));
        console.error(error);
      } else {
        alert(
          "Your registration has been submitted successfully! Welcome to Mahila Shakthi!"
        );
        form.reset();
      }
    });
  }
});
