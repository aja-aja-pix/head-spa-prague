document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const header = document.getElementById("mainHeader");

  // Toggle mobile menu
  mobileMenuToggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("active");
    });
  });

  // Add scrolled class to header when scrolling
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Calendar functionality
  const calendarDays = document.querySelector(".days");
  const currentMonthText = document.querySelector(".current-month");
  const prevMonthBtn = document.querySelector(".prev-month");
  const nextMonthBtn = document.querySelector(".next-month");
  const selectedDateSpan = document.getElementById("selected-date");
  const confirmBookingBtn = document.getElementById("confirm-booking");

  let currentDate = new Date();
  let selectedDate = null;

  // Initialize calendar
  generateCalendar(currentDate);

  // Previous month button
  prevMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
  });

  // Next month button
  nextMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
  });

  // Package selection
  const packageOptions = document.querySelectorAll('input[name="package"]');
  packageOptions.forEach((option) => {
    option.addEventListener("change", updateConfirmButton);
  });

  // Function to generate the calendar
  function generateCalendar(date) {
    // Clear previous days
    calendarDays.innerHTML = "";

    // Update month and year
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    currentMonthText.textContent = `${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;

    // Get first day of month and total days
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Adjust first day to start from Monday (1) instead of Sunday (0)
    let firstDayIndex = firstDay.getDay() || 7;
    firstDayIndex = firstDayIndex === 1 ? 0 : firstDayIndex - 1;

    // Add empty spaces for previous month
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyDay = document.createElement("div");
      calendarDays.appendChild(emptyDay);
    }

    // Current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = i;

      // Create a date object for this day
      const thisDate = new Date(date.getFullYear(), date.getMonth(), i);

      // Disable past dates
      if (thisDate < today) {
        dayElement.classList.add("disabled");
      } else {
        dayElement.addEventListener("click", function () {
          // Remove selected class from all days
          document.querySelectorAll(".day").forEach((day) => {
            day.classList.remove("selected");
          });

          // Add selected class to this day
          this.classList.add("selected");

          // Update selected date
          selectedDate = new Date(date.getFullYear(), date.getMonth(), i);
          selectedDateSpan.textContent = selectedDate.toLocaleDateString();

          // Update confirm button
          updateConfirmButton();
        });
      }

      // Check if this date is the previously selected date
      if (
        selectedDate &&
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
      ) {
        dayElement.classList.add("selected");
      }

      calendarDays.appendChild(dayElement);
    }
  }

  // Function to update confirm button state
  function updateConfirmButton() {
    const packageSelected = document.querySelector(
      'input[name="package"]:checked'
    );
    confirmBookingBtn.disabled = !(packageSelected && selectedDate);

    if (!confirmBookingBtn.disabled) {
      confirmBookingBtn.addEventListener("click", handleBooking);
    } else {
      confirmBookingBtn.removeEventListener("click", handleBooking);
    }
  }

  // Function to handle booking
  function handleBooking() {
    const packageSelected = document.querySelector(
      'input[name="package"]:checked'
    ).value;
    const packageText = document
      .querySelector('input[name="package"]:checked')
      .nextElementSibling.textContent.trim();
    const formattedDate = selectedDate.toLocaleDateString();

    // Generate a random time for demo purposes - ensure times are during business hours
    const hours = Math.floor(Math.random() * 7) + 10; // 10 AM to 4 PM
    const minutes = Math.random() < 0.5 ? "00" : "30"; // Either on the hour or half hour
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours;
    const time = `${displayHours}:${minutes} ${period}`;

    // Generate booking number with current year
    const currentYear = new Date().getFullYear();
    const bookingNumber =
      `HSP-${currentYear}-` + Math.floor(1000 + Math.random() * 9000);

    // Redirect to confirmation page with parameters
    window.location.href = `confirmation.html?package=${encodeURIComponent(
      packageText
    )}&date=${encodeURIComponent(formattedDate)}&time=${encodeURIComponent(
      time
    )}&booking=${encodeURIComponent(bookingNumber)}`;
  }
});
