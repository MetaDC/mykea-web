document.addEventListener("DOMContentLoaded", () => {
  let pdfToOpen = null;

  const portfolioBtn = document.getElementById("portfolioBtn");
  const homeBtn = document.getElementById("homeBtn");
  const freeQuoteBtn = document.getElementById("freeQuoteBtn");
  const popupForm = document.getElementById("popupForm");
  const closeBtn = document.getElementById("closeBtn");
  const userForm = document.getElementById("userForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const loader = submitBtn.querySelector(".loader");

  const formButtons = [homeBtn, portfolioBtn, freeQuoteBtn].filter(Boolean);

  formButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.popup2Timer) clearTimeout(window.popup2Timer);
      popupForm.classList.remove("hidden");
      popupForm.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      pdfToOpen = btn.getAttribute("data-pdf") || "mykeaportfolio.pdf";
    });
  });

  function closeModal() {
    popupForm.classList.add("hidden");
    popupForm.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === popupForm) closeModal();
  });

  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Start button loader
    loader.classList.remove("hidden");
    btnText.style.display = "none";
    submitBtn.disabled = true;

    // Extract form values
    const name = userForm
      .querySelector('input[placeholder="Your Name"]')
      .value.trim();
    const email = userForm
      .querySelector('input[placeholder="Email ID"]')
      .value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const countryCode = document.getElementById("countryCode").value;
    const fullPhone = countryCode + phone;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{10,15}$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return resetButton();
    }

    if (!phonePattern.test(fullPhone)) {
      alert("Please enter a valid phone number with country code.");
      return resetButton();
    }

    const data = { name, fullPhone, email };
    console.log(data);

    try {
      // Step 1: Send data
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyEK5qTlIvToXe7OdE8vdLyoWMnpHcI-fnry5yqIgCCQQ2KHFpbs1K_0vXeFOvqnipZqQ/exec",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      // Step 2: Open new tab with processing message
      const newTab = window.open("", "_blank");
      if (newTab) {
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
    <h2>Please wait...</h2>
                <p>Your download will begin shortly.</p>
    </div>
  </body>
</html>
        `);
        newTab.document.close();

        // Step 3: Redirect to PDF after short delay
        setTimeout(() => {
          newTab.location.href = pdfToOpen || "mykeaportfolio.pdf";
        }, 500);
      } else {
        // Fallback if popup blocked
        window.location.href = pdfToOpen || "mykeaportfolio.pdf";
      }

      // Step 4: Clean up
      closeModal();
      userForm.reset();
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      resetButton();
    }
  });

  function resetButton() {
    loader.classList.add("hidden");
    btnText.style.display = "inline";
    submitBtn.disabled = false;
  }
});
