const profileForm = document.getElementById("profileForm");

const message = document.getElementById("message");


profileForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    message.textContent = "";


    // Require at least one selected interest.

    const selectedInterests = Array.from(
        document.querySelectorAll(
            'input[name="interests"]:checked'
        )
    ).map(function (checkbox) {
        return checkbox.value;
    });


    if (selectedInterests.length === 0) {

        message.textContent =
            "Please select at least one interest.";

        return;
    }


    message.textContent = "Saving your profile...";


    // Get the currently logged-in user.

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();


    if (userError || !userData.user) {

        message.textContent =
            "Please log in before creating your profile.";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);

        return;
    }


    const user = userData.user;

    console.log("Logged In email",user.email);
    console.log("Logged In id ",user.id);


    // Collect information from the form.

    const nickname = document
        .getElementById("nickname")
        .value.trim();

    const dateOfBirth = document
        .getElementById("dateOfBirth")
        .value;

    const city = document
        .getElementById("city")
        .value.trim();

    const region = document
        .getElementById("region")
        .value;

    const description = document
        .getElementById("description")
        .value.trim();


    // Save public profile information.

    const { data:savedProfile , error: profileError } = await supabaseClient
        .from("profiles")
        .upsert({

            id: user.id,

            nickname: nickname,

            city: city,

            interests: selectedInterests,

            region: region,

            description: description

        },
        {onConfict:"id"}
    )
    .select();


    if (profileError) {
        console.error("profile save error:",profileError);

        message.textContent =
            "Could not save profile: " + profileError.message;

        return;
    }


    // Save date of birth separately and privately.

    const { error: privateError } = await supabaseClient
    .from("private_profiles")
    .upsert(
        {
            id: user.id,
            date_of_birth: dateOfBirth
        },
        { onConflict: "id" }
    );


    if (privateError) {

        message.textContent =
            "Your public profile was saved, but your date of birth could not be saved: "
            + privateError.message;

        return;
    }


    // Both saves succeeded.

    message.textContent = "Profile saved successfully!";

    window.location.href = "page2.html";

});