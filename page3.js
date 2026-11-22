async function loadMyProfile() {

    const message = document.getElementById("message");

    const container = document.getElementById("myProfile");


    // Check login.

    const { data: userData, error: authError } =
        await supabaseClient.auth.getUser();


    if (authError || !userData.user) {

        message.textContent = "Please log in first.";

        window.location.href = "login.html";

        return;
    }


    const user = userData.user;


    // Get the public profile.

    const { data: profile, error: profileError } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();


    if (profileError) {

        message.textContent = profileError.message;

        return;
    }


    if (!profile) {

        message.textContent =
            "You have not completed your profile yet.";

        return;
    }


    // Get this user's private date of birth.

    const { data: privateProfile, error: privateError } =
        await supabaseClient
            .from("private_profiles")
            .select("date_of_birth")
            .eq("id", user.id)
            .maybeSingle();


    if (privateError) {

        message.textContent = privateError.message;

        return;
    }


    // Display the profile.

    message.textContent = "";

    container.replaceChildren();


    const details = [

        ["Nickname", profile.nickname],

        ["City", profile.city],

        ["Date of birth",
            privateProfile
                ? privateProfile.date_of_birth
                : "Not provided"],

        ["Interests", (profile.interests || []).join(", ")],

        ["Region", profile.region],

        ["About me", profile.description]

    ];


    details.forEach(function (item) {

        const paragraph = document.createElement("p");

        paragraph.textContent =
            item[0] + ": " + (item[1] || "Not provided");

        container.appendChild(paragraph);

    });

}


// Edit profile.

document.getElementById("editButton")
    .addEventListener("click", function () {

        window.location.href = "page1.html";

    });


loadMyProfile();