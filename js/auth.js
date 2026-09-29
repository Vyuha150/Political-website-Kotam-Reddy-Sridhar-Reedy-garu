import { supabase } from "./supabaseClient.js";

// Local admin panel URL for development.
// Update this to your deployed admin app URL when you go to production.
const ADMIN_PANEL_URL = "https://admin-panel-political.vercel.app/signin";

// Where a signed-in citizen (non-admin) lands after signing in.
const CITIZEN_HOME_URL = "index.html";

async function redirectAfterSignIn(userId) {
  // Only admins get sent to the admin panel; everyone else stays on-site.
  // Previously every signed-in user (citizens included) was redirected
  // off-site here, which made the citizen sign-in flow dead-end on an
  // admin login screen.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile && profile.role === "admin") {
    window.location.href = ADMIN_PANEL_URL;
  } else {
    window.location.href = CITIZEN_HOME_URL;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // SIGN UP LOGIC
  const signupForm = document.querySelector(".signup-form-box form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const mobile = document.getElementById("signup-mobile").value;
      const password = document.getElementById("signup-password").value;
      const gender = document.getElementById("signup-gender").value;

      // Supabase Auth sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, mobile, gender },
        },
      });

      if (error) {
        alert(error.message);
      } else {
        localStorage.setItem(
          "pendingProfile",
          JSON.stringify({ name, mobile, gender })
        );
        alert("Signup successful! Please check your email to confirm.");
        window.location.href = CITIZEN_HOME_URL;
      }
    });
  }

  // SIGN IN LOGIC
  const signinForm = document.querySelector(".signin-form-box form");
  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailOrMobile = document.getElementById("signin-email").value;
      const password = document.getElementById("signin-password").value;

      // If you only allow email sign-in:
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrMobile,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        // Check if profile exists
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id);

        if (!profiles || profiles.length === 0) {
          const pendingProfile = JSON.parse(
            localStorage.getItem("pendingProfile")
          );
          if (pendingProfile) {
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: data.user.id,
                  name: pendingProfile.name,
                  mobile: pendingProfile.mobile,
                  gender: pendingProfile.gender,
                },
              ]);
            if (insertError) {
              alert("Profile insert error: " + insertError.message);
              console.error(insertError);
            } else {
              localStorage.removeItem("pendingProfile");
            }
          }
        }
        alert("Sign in successful!");
        await redirectAfterSignIn(data.user.id);
      }
    });
  }
});
