const SUPABASE_URL = "https://ytgzbjhdhgydefzevwdr.supabase.co";
const SUPABASE_KEY = "sb_publishable_LbvOgXmh_TNujagowmciFg_j1U01kxF";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        message.textContent = "Logging in...";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            message.textContent = error.message;
            return;
        }

        window.location.href = "page1.html";
    });
}