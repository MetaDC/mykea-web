window.addEventListener("load", () => {
  let pdfToOpen2 = null;

  const consultationBtn = document.getElementById("consultationBtn");
  const popupForm2 = document.getElementById("popupForm2");
  const popupForm = document.getElementById("popupForm");
  const closeBtn2 = document.getElementById("closeBtn2");
  const userForm2 = document.getElementById("userForm2");
  const submitBtn2 = document.getElementById("submitBtn2");
  const btnText2 = submitBtn2.querySelector(".btn-text-2");
  const loader2 = submitBtn2.querySelector(".loader-2");

  // Auto open popup2 if popup1 is not open after 5 seconds
  window.popup2Timer = setTimeout(() => {
    const isPopup1Open =
      popupForm &&
      !popupForm.classList.contains("hidden") &&
      popupForm.getAttribute("aria-hidden") !== "true";

    if (!isPopup1Open) {
      popupForm2.classList.remove("hidden");
      popupForm2.setAttribute("aria-hidden", "false");
    }
  }, 5000);

  consultationBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    pdfToOpen2 = consultationBtn.dataset.pdf;
    popupForm2.classList.remove("hidden");
    document.body.classList.add("modal-open");
  });

  function closeModal2() {
    popupForm2.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  closeBtn2.addEventListener("click", closeModal2);

  window.addEventListener("click", (e) => {
    if (e.target === popupForm2) {
      closeModal2();
    }
  });

  userForm2.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Start button loader
    loader2.classList.remove("hidden");
    btnText2.style.display = "none";
    submitBtn2.disabled = true;

    // Extract form values
    const name = userForm2
      .querySelector('input[placeholder="Your Full Name"]')
      .value.trim();
    const email = userForm2
      .querySelector('input[placeholder="Your Email Address"]')
      .value.trim();
    const phone = document.getElementById("phoneNumber2").value.trim();
    const countryCode = document.getElementById("countryCode2").value;
    const fullPhone = countryCode + phone;

    // Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{10,15}$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      resetButton2();
      return;
    }

    if (!phonePattern.test(fullPhone)) {
      alert("Please enter a valid phone number with country code.");
      resetButton2();
      return;
    }

    const data = { name, fullPhone, email };

    try {
      // Step 1: Fetch request after loader
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyEK5qTlIvToXe7OdE8vdLyoWMnpHcI-fnry5yqIgCCQQ2KHFpbs1K_0vXeFOvqnipZqQ/exec",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      // Step 2: After successful fetch, open new tab
      const newTab = window.open("", "_blank");

      if (newTab) {
        // Show temporary content
        newTab.document.write(`
        <html>
  <head>
    <title>Redirecting...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: sans-serif;
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #f9f9f9;
        padding: 20px;
      }

      .message-box {
        max-width: 90%;
      }

      h2 {
        font-size: 2em;
        margin-bottom: 0.5em;
      }

      p {
        font-size: 1.1em;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="message-box">
      <h2>Thank you!</h2>
      <p>Redirecting to your confirmation page...</p>
    </div>
  </body>
</html>

        `);
        newTab.document.close();

        // Redirect after a short delay
        setTimeout(() => {
          newTab.location.href = "thankyou.html";
        }, 500);
      } else {
        // Fallback if popup blocked
        window.location.href = "thankyou.html";
      }

      // Step 3: Cleanup
      closeModal2();
      userForm2.reset();
    } catch (error) {
      console.error("Form 2 submission failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      resetButton2(); // Stop loader regardless of success or failure
    }
  });

  function resetButton2() {
    loader2.classList.add("hidden");
    btnText2.style.display = "inline";
    submitBtn2.disabled = false;
  }
});
