import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  // No session check required, anyone can submit
  const form = document.querySelector(".form-container form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Handle file uploads (attachments)
      let attachmentUrls = [];
      const files = document.getElementById("attachments").files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { data, error } = await supabase.storage
          .from("grievance-files")
          .upload(`attachments/${Date.now()}_${file.name}`, file);
        if (!error) attachmentUrls.push(data.path);
      }

      // Add file upload handling for acknowledgement and video
      let acknowledgementUrl = null;
      let videoUrl = null;

      // Handle acknowledgement upload
      const acknowledgementFile =
        document.getElementById("acknowledgement")?.files[0];
      if (acknowledgementFile) {
        const { data, error } = await supabase.storage
          .from("grievance-files")
          .upload(
            `acknowledgements/${Date.now()}_${acknowledgementFile.name}`,
            acknowledgementFile
          );
        if (!error) acknowledgementUrl = data.path;
      }

      // Handle video upload
      const videoFile = document.getElementById("video_explanation")?.files[0];
      if (videoFile) {
        const { data, error } = await supabase.storage
          .from("grievance-files")
          .upload(`videos/${Date.now()}_${videoFile.name}`, videoFile);
        if (!error) videoUrl = data.path;
      }

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

      // Insert grievance
      const { error } = await supabase.from("grievances").insert([
        {
          user_id: user_id,
          fullname: document.getElementById("fullname").value,
          age: parseInt(document.getElementById("age").value),
          gender: document.getElementById("gender").value,
          mobile: document.getElementById("mobile").value,
          email: document.getElementById("email").value || null,
          address: document.getElementById("address").value,
          caste: document.getElementById("caste").value,
          aadhaar: document.getElementById("aadhaar").value || null,
          grievance: document.getElementById("grievance").value, // Changed from 'grievance_type' to 'grievance'
          grievance_other:
            document.querySelector('input[name="grievance_other"]')?.value ||
            null,
          details: document.getElementById("details").value,
          attachments: attachmentUrls,
          political_sensitive: document.querySelector(
            'input[name="political_sensitive"]:checked'
          )?.value,
          parties: document.getElementById("parties")?.value || null,
          anonymous:
            document.querySelector('input[name="anonymous"]:checked')?.value ||
            null,
          opponent_name:
            document.getElementById("opponent_name")?.value || null,
          opponent_phone:
            document.getElementById("opponent_phone")?.value || null,
          opponent_details:
            document.getElementById("opponent_details")?.value || null,
          // New fields
          previous_complaint: document.querySelector(
            'input[name="previous_complaint"]:checked'
          )?.value,
          govt_department:
            document.getElementById("govt_department")?.value || null,
          acknowledgement_url: acknowledgementUrl || null,
          video_url: videoUrl || null,
          district: document.getElementById("district")?.value,
          mandal: document.getElementById("mandal")?.value,
          village: document.getElementById("village")?.value,
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
