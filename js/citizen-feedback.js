import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("citizenFeedbackForm");
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

      // Collect all form data
      const formData = new FormData(form);

      // Insert feedback
      const { error } = await supabase.from("citizen_feedback").insert([
        {
          user_id: user_id,
          name: formData.get("cf_name"),
          mobile: formData.get("cf_mobile"),
          area: formData.get("cf_area"),
          roads_condition: formData.get("roads_condition"),
          power_issues: formData.get("power_issues"),
          water_supply: formData.get("water_supply"),
          drainage_system: formData.get("drainage_system"),
          public_transport: formData.get("public_transport"),
          infrastructure_satisfaction: formData.get(
            "infrastructure_satisfaction"
          ),
          scheme_awareness: formData.get("scheme_awareness"),
          scheme_benefits: formData.get("scheme_benefits"),
          scheme_satisfaction: formData.get("scheme_satisfaction"),
          education_facilities: formData.get("education_facilities"),
          education_satisfaction: formData.get("education_satisfaction"),
          employment_opportunities: formData.get("employment_opportunities"),
          employment_satisfaction: formData.get("employment_satisfaction"),
          healthcare_access: formData.get("healthcare_access"),
          accessibility_satisfaction: formData.get(
            "accessibility_satisfaction"
          ),
          issues_heard: formData.get("issues_heard"),
          leadership_satisfaction: formData.get("leadership_satisfaction"),
          priority_issue: formData.get("priority_issue"),
        },
      ]);

      if (error) {
        alert("Submission failed: " + (error.message || JSON.stringify(error)));
        console.error(error);
      } else {
        alert("Thank you! Your feedback has been submitted successfully!");
        form.reset();
      }
    });
  }
});
