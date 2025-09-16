document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ctaForm");
  const submitBtn = document.getElementById("subformBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const loader = submitBtn.querySelector(".loader-2");

  function startLoading() {
    loader.classList.remove("hidden");
    btnText.style.display = "none";
    submitBtn.disabled = true;
  }

  function stopLoading() {
    loader.classList.add("hidden");
    btnText.style.display = "inline";
    submitBtn.disabled = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("subname").value.trim();
    const email = document.getElementById("subemail").value.trim();
    const phoneInput = document.getElementById("subphone").value.trim();
    const countryCode = document.getElementById("countryCode2").value;
    const fullPhone = countryCode + phoneInput;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{7,15}$/;

    if (!name || !email || !phoneInput) {
      alert("Please fill in all fields.");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phonePattern.test(fullPhone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    const data = { name, email, fullPhone };

    startLoading();

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyEK5qTlIvToXe7OdE8vdLyoWMnpHcI-fnry5yqIgCCQQ2KHFpbs1K_0vXeFOvqnipZqQ/exec",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      // ✅ Show full-screen thank-you message while waiting
      document.body.innerHTML = `
        <div style="height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;font-family:sans-serif;text-align:center;background:#f9f9f9;padding:20px;">
          <h2>Thank you!</h2>
          <p>Redirecting to your confirmation page...</p>
        <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
      // <div class="loader-2" style="margin-top:20px;width:40px;height:40px;border:5px solid #ccc;border-top:5px solid #333;border-radius:50%;animation:spin 1s linear infinite;"></div>

      // ✅ Delay before redirect
      setTimeout(() => {
        window.location.href = "thankyou.html";
      }, 2000); // delay in ms
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      stopLoading();
    }
  });
});
