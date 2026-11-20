// =====================================
// PORTFOLIO - LOAD WORKS FROM SUPABASE
// =====================================

document.addEventListener("DOMContentLoaded", async function () {

    const portfolioGallery = document.getElementById("portfolio-gallery");

    if (!portfolioGallery) return;

    portfolioGallery.innerHTML = "<p>Loading portfolio...</p>";

    try {

        const { data: works, error } = await supabaseClient
            .from("portfolio_works")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        portfolioGallery.innerHTML = "";

        if (!works || works.length === 0) {

            portfolioGallery.innerHTML = "<p>No work available yet.</p>";

            return;

        }

        works.forEach(function (work) {

            const card = document.createElement("div");

            card.className = "portfolio-item";


            // Media
            const media = document.createElement(
                work.media_type === "video" ? "video" : "img"
            );

            media.src = work.media_url;

            media.className = "portfolio-media";

            if (work.media_type === "video") {

                media.controls = true;

                media.preload = "metadata";

            } else {

                media.alt = work.title || "Portfolio work";

                media.loading = "lazy";

            }


            // Information
            const info = document.createElement("div");

            info.className = "portfolio-info";


            const title = document.createElement("h3");

            title.textContent = work.title || "Untitled Project";


            const description = document.createElement("p");

            description.textContent = work.description || "";


            const category = document.createElement("span");

            category.textContent = work.category || "";


            info.appendChild(title);

            info.appendChild(description);

            info.appendChild(category);


            card.appendChild(media);

            card.appendChild(info);


            // Project Details Button
            const detailsButton = document.createElement("a");

            detailsButton.className = "portfolio-details-link";

            detailsButton.textContent = "VIEW PROJECT ↗";

            detailsButton.href =
                "project.html?id=" + encodeURIComponent(work.id);


            card.appendChild(detailsButton);

            portfolioGallery.appendChild(card);

        });

    } catch (error) {

        console.error("Portfolio loading error:", error);

        portfolioGallery.innerHTML =
            "<p>Could not load portfolio. Please refresh.</p>";

    }

});



// =====================================
// BOOKING FORM - SUPABASE + WHATSAPP
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const bookingForm = document.getElementById("booking-form");

    const bookingMessage = document.getElementById("booking-message");

    const bookingDate = document.getElementById("booking-date");


    if (!bookingForm) return;



    // Prevent booking past dates
    if (bookingDate) {

        const today = new Date();

        const localDate = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        bookingDate.min = localDate;

    }



    // Submit Booking
    bookingForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const submitButton = bookingForm.querySelector(
            'button[type="submit"]'
        );


        const formData = new FormData(bookingForm);



        // Collect booking information
        const bookingData = {

            customer_name: formData.get("customer_name").trim(),

            phone: formData.get("phone").trim(),

            service_type: formData.get("service_type"),

            booking_date: formData.get("booking_date"),

            preferred_time: formData.get("preferred_time") || null,

            location: formData.get("location").trim() || null,

            notes: formData.get("notes").trim() || null,

            status: "Pending"

        };



        // Validate required fields
        if (

            !bookingData.customer_name ||

            !bookingData.phone ||

            !bookingData.service_type ||

            !bookingData.booking_date

        ) {

            bookingMessage.textContent =
                "Please fill in all required fields.";

            bookingMessage.style.color = "#B84C3A";

            return;

        }



        // Open WhatsApp tab immediately to avoid popup blocking
        const whatsappTab = window.open("about:blank", "_blank");



        // Loading State
        submitButton.disabled = true;

        submitButton.innerHTML = "SENDING REQUEST...";

        bookingMessage.textContent = "";



        try {



            // Save Booking in Supabase
            const { error } = await supabaseClient

                .from("bookings")

                .insert([bookingData]);


            if (error) {

                throw error;

            }



            // Create WhatsApp Message
            const whatsappMessage = `

📸 *NEW BOOKING REQUEST*

👤 *Customer:* ${bookingData.customer_name}

📱 *Phone:* ${bookingData.phone}

🎥 *Service:* ${bookingData.service_type}

📅 *Date:* ${bookingData.booking_date}

⏰ *Preferred Time:* ${bookingData.preferred_time || "Not specified"}

📍 *Location:* ${bookingData.location || "Not specified"}

📝 *Details:*
${bookingData.notes || "No additional details"}

━━━━━━━━━━━━━━━━━━

Booking Status: Pending

            `.trim();



            // Hashim's WhatsApp Number
            const photographerWhatsApp = "962797773795";



            // Create WhatsApp URL
            const whatsappURL =

                `https://wa.me/${photographerWhatsApp}?text=` +

                encodeURIComponent(whatsappMessage);



            // Open WhatsApp
            if (whatsappTab) {

                whatsappTab.location.href = whatsappURL;

            } else {

                window.location.href = whatsappURL;

            }



            // Success Message
            bookingMessage.textContent =

                "Your booking request has been saved successfully! WhatsApp will open so you can send your booking details to Hashim.";

            bookingMessage.style.color = "#587B50";



            // Reset Form
            bookingForm.reset();



            // Reset Minimum Date
            if (bookingDate) {

                const today = new Date();

                const localDate = new Date(

                    today.getTime() - today.getTimezoneOffset() * 60000

                ).toISOString().split("T")[0];


                bookingDate.min = localDate;

            }



        } catch (error) {



            console.error("Booking error:", error);



            // Close WhatsApp Tab if Booking Failed
            if (whatsappTab) {

                whatsappTab.close();

            }



            bookingMessage.textContent =

                "Something went wrong. Please try again or contact Hashim through WhatsApp.";

            bookingMessage.style.color = "#B84C3A";



        } finally {



            // Restore Button
            submitButton.disabled = false;

            submitButton.innerHTML =

                'SEND BOOKING REQUEST <span>↗</span>';


        }

    });

});