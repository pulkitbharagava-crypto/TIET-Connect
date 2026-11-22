async function findMatches() {

    const message = document.getElementById("message");

    const container = document.getElementById("profiles");


    // Check login.

    const { data: userData, error: authError } =
        await supabaseClient.auth.getUser();


    if (authError || !userData.user) {

        message.textContent = "Please log in first.";

        window.location.href = "login.html";

        return;
    }


    const user = userData.user;


    // Fetch the current user's profile.

    const { data: myProfile, error: myError } =
        await supabaseClient
            .from("profiles")
            .select("nickname, city, interests, region, description")
            .eq("id", user.id)
            .maybeSingle();


    if (myError) {

        message.textContent = myError.message;

        return;
    }


    if (!myProfile) {

        message.textContent =
            "Please complete your profile first.";

        window.location.href = "page1.html";

        return;
    }


    // Fetch all other public profiles.

    const { data: otherProfiles, error: profilesError } =
        await supabaseClient
            .from("profiles")
            .select("id, nickname, city, interests, region, description")
            .neq("id", user.id);


    if (profilesError) {

        message.textContent = profilesError.message;

        return;
    }


    if (!otherProfiles || otherProfiles.length === 0) {

        message.textContent =
            "No other profiles yet. Invite someone to join!";

        return;
    }


    // Calculate a relevance score for every person.

    const myInterests = (myProfile.interests || [])
        .map(function (interest) {
            return interest.toLowerCase();
        });


    const matches = otherProfiles.map(function (person) {

        const theirInterests = (person.interests || [])
            .map(function (interest) {
                return interest.toLowerCase();
            });


        // Find shared interests.

        const sharedInterests = theirInterests.filter(
            function (interest) {
                return myInterests.includes(interest);
            }
        );


        // Compare cities.

        const sameCity =
            myProfile.city.trim().toLowerCase() ===
            (person.city || "").trim().toLowerCase();


        // Compare regions.

        const sameRegion =
            myProfile.region === person.region;


        // Each shared interest = 3 points.
        // Same city = 5 points.
        // Same region = 2 points.

        let score = sharedInterests.length * 3;

        if (sameCity) {
            score += 5;
        }

        if (sameRegion) {
            score += 2;
        }


        return {

            ...person,

            sharedInterests: sharedInterests,

            sameCity: sameCity,

            sameRegion: sameRegion,

            score: score

        };

    });


    // Highest scores appear first.

    matches.sort(function (a, b) {

        return b.score - a.score;

    });


    container.replaceChildren();

    message.textContent =
        "Profiles ranked by shared interests and location.";


    // Create a card for each person.

    matches.forEach(function (person) {

        const card = document.createElement("div");

        const heading = document.createElement("h2");

        const city = document.createElement("p");

        const interests = document.createElement("p");

        const description = document.createElement("p");

        const score = document.createElement("p");

        const reasons = document.createElement("p");


        heading.textContent = person.nickname;

        city.textContent = "City: " + person.city;

        interests.textContent =
            "Interests: " + person.interests.join(", ");

        description.textContent =
            person.description || "No description provided.";


        score.textContent =
            "Match score: " + person.score;


        let reasonText = "Why you might connect: ";


        if (person.sharedInterests.length > 0) {

            reasonText +=
                "Shared interests: " +
                person.sharedInterests.join(", ");

        } else {

            reasonText += "No shared interests yet";

        }


        if (person.sameCity) {

            reasonText += " | Same city";

        }


        if (person.sameRegion) {

            reasonText += " | Same region";

        }


        reasons.textContent = reasonText;


        card.append(
            heading,
            city,
            interests,
            description,
            score,
            reasons
        );


        // Basic styling; improve it later with CSS.

        card.style.border = "1px solid #cccccc";

        card.style.padding = "15px";

        card.style.margin = "15px 0";

        card.style.borderRadius = "8px";


        container.appendChild(card);

    });

}


// Log out.

document.getElementById("logoutButton")
    .addEventListener("click", async function () {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {

            alert("Could not log out: " + error.message);

            return;
        }

        window.location.href = "login.html";

    });


findMatches();