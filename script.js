const SUPABASE_URL = "https://ytgzbjhdhgydefzevwdr.supabase.co";
const SUPABASE_KEY = "sb_publishable_LbvOgXmh_TNujagowmciFg_j1U01kxF";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase connected!");
alert("Supabase client initialized!");

const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Creating account...";

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { full_name: name }
        }
    });
    

    if (error) {
        message.textContent = error.message;
        return;
    }
    window.location.href = "page1.html";

    message.textContent =
        "Registration successful! Check your email if confirmation is required.";
});