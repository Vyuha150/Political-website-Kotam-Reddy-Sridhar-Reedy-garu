import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  // No session check required, anyone can submit
  const form = document.getElementById("complaintForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Handle file uploads (optional)
      let supportingDocUrl = null;
      let leaderPhotoUrl = null;

      const supportingDocFile = document.getElementById("supportingDocuments")
        .files[0];
      const leaderPhotoFile = document.getElementById("leaderPhoto").files[0];

      if (supportingDocFile) {
        const { data, error } = await supabase.storage
          .from("complaint-files")
          .upload(
            `supporting/${Date.now()}_${supportingDocFile.name}`,
            supportingDocFile
          );
        if (!error) supportingDocUrl = data.path;
      }

      if (leaderPhotoFile) {
        const { data, error } = await supabase.storage
          .from("complaint-files")
          .upload(
            `leader/${Date.now()}_${leaderPhotoFile.name}`,
            leaderPhotoFile
          );
        if (!error) leaderPhotoUrl = data.path;
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

      // Insert complaint
      const { error } = await supabase.from("complaints").insert([
        {
          user_id: user_id,
          full_name: document.getElementById("fullName").value,
          age: parseInt(document.getElementById("age").value),
          gender: document.getElementById("gender").value,
          phone: document.getElementById("phoneNumber").value,
          email: document.getElementById("email").value,
          address: document.getElementById("address").value,
          contact_mode: document.getElementById("contactMode").value,
          problem_category: document.getElementById("problemCategory").value,
          constituency: document.getElementById("constituency").value,
          mandal_village: document.getElementById("mandalVillage").value,
          location: document.getElementById("location").value,
          problem_description:
            document.getElementById("problemDescription").value,
          supporting_documents: supportingDocUrl,
          problem_date: document.getElementById("problemDate").value,
          reported_before: document.getElementById("reportedBefore").value,
          report_details: document.getElementById("reportDetails").value,
          specific_authority:
            document.getElementById("specificAuthority").value,
          similar_issues: document.getElementById("similarIssues").value,
          similar_issues_details: document.getElementById(
            "similarIssuesDetails"
          ).value,
          auth_name: document.getElementById("authName").value,
          auth_phone: document.getElementById("authPhoneNumber").value,
          auth_email: document.getElementById("authEmail").value,
          leader_photo: leaderPhotoUrl,
        },
      ]);

      if (error) {
        alert("Submission failed: " + error.message);
      } else {
        document.getElementById("successMessage").style.display = "block";
        form.reset();
      }
    });
  }
});
