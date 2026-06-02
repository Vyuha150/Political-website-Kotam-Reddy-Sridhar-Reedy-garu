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

      // Handle file upload (single file)
      let fileUrls = [];
      const fileInput = document.getElementById("sm_file");
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const { data, error } = await supabase.storage
          .from("social-media-files")
          .upload(`attachments/${Date.now()}_${file.name}`, file);
        if (!error) fileUrls.push(data.path);
      }

      // Collect checkbox values for platforms
      const platforms = Array.from(
        document.querySelectorAll('input[name="sm_platform"]:checked')
      ).map((el) => el.value);

      // Social media platform other
      const platformOther = document.querySelector(
        'input[name="sm_platform_other"]'
      )?.value;

      // Warrior options
      const warriorOptions = Array.from(
        document.querySelectorAll('input[name="sm_warrior"]:checked')
      ).map((el) => el.value);

      // Updates options
      const updatesOptions = Array.from(
        document.querySelectorAll('input[name="sm_updates"]:checked')
      ).map((el) => el.value);

      // Insert grievance
      const { error } = await supabase.from("social_media_grievances").insert([
        {
          user_id: user_id,
          fullname: document.getElementById("sm_fullname").value,
          email: document.getElementById("sm_email").value,
          phone: document.getElementById("sm_phone").value,
          location: document.getElementById("sm_location").value,
          platforms: platforms,
          platform_other: platformOther,
          grievance: document.getElementById("sm_grievance").value,
          action: document.getElementById("sm_action").value,
          file_urls: fileUrls,
          warrior_options: warriorOptions,
          updates_options: updatesOptions,
        },
      ]);

      if (error) {
        alert("Submission failed: " + (error.message || JSON.stringify(error)));
        console.error(error);
      } else {
        alert("Your grievance has been submitted successfully!");
        form.reset();
      }
    });
  }
});
