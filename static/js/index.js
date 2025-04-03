function copyText(elementId, buttonId) {
  const textToCopy = document.getElementById(elementId).innerText;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // Change the button text to a tick mark
      const button = document.getElementById(buttonId);
      button.innerHTML = "✅ Copied!";
      button.disabled = true; // Disable the button temporarily

      // Revert back to original text after 3 seconds
      setTimeout(() => {
        button.innerHTML = "📋";
        button.disabled = false;
      }, 1000);
    })
    .catch((err) => {
      console.error("Error copying text: ", err);
    });
}

// window.onload = function () {
//   let currentSlide = 0;
//   const slides = document.querySelectorAll('.slide');
//   const totalSlides = slides.length;

//   function showSlide(index) {
//     if (slides.length === 0) return;

//     slides.forEach((slide, i) => {
//       slide.style.display = i === index ? "block" : "none"; // Show only the active slide
//     });
//   }

//   function nextSlide() {
//     currentSlide = (currentSlide + 1) % totalSlides;
//     showSlide(currentSlide);
//   }

//   function prevSlide() {
//     currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
//     showSlide(currentSlide);
//   }

//   // Attach event listeners to buttons
//   document.querySelector(".slider-btn.left").addEventListener("click", prevSlide);
//   document.querySelector(".slider-btn.right").addEventListener("click", nextSlide);

//   showSlide(currentSlide); // Show the first slide
// };

window.onload = function () {
  let currentIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    // Wrap around if index is out of range
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentIndex = index;

    // Hide all slides and remove 'active' class from dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show the current slide and highlight the current dot
    slides[currentIndex].classList.add("active");
    dots[currentIndex].classList.add("active");
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function goToSlide(index) {
    showSlide(index);
  }

  // Attach event listeners to buttons
  document
    .querySelector(".slider-btn.left")
    .addEventListener("click", prevSlide);
  document
    .querySelector(".slider-btn.right")
    .addEventListener("click", nextSlide);

  // Make dots clickable by adding event listeners to each dot
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  // Initialize slider
  showSlide(currentIndex);

  let fx3dIndex = 0;
  const fx3dSlides = document.querySelectorAll(".fx3d-slide");
  const fx3dDots = document.querySelectorAll(".fx3d-dot");
  const fx3dWrapper = document.querySelector(".fx3d-slider-wrapper");

  function fx3dShowSlide(index) {
    if (index >= fx3dSlides.length) index = 0;
    if (index < 0) index = fx3dSlides.length - 1;
    fx3dIndex = index;

    fx3dWrapper.style.transform = `translateX(-${index * 100}%)`;

    fx3dDots.forEach((dot) => dot.classList.remove("active"));
    fx3dDots[fx3dIndex].classList.add("active");
  }

  function fx3dNextSlide() {
    fx3dShowSlide(fx3dIndex + 1);
  }

  function fx3dPrevSlide() {
    fx3dShowSlide(fx3dIndex - 1);
  }

  function fx3dGoToSlide(index) {
    fx3dShowSlide(index);
  }

  // Attach listeners
  document
    .querySelector(".fx3d-slider-btn.left")
    .addEventListener("click", fx3dPrevSlide);
  document
    .querySelector(".fx3d-slider-btn.right")
    .addEventListener("click", fx3dNextSlide);
  fx3dDots.forEach((dot, i) =>
    dot.addEventListener("click", () => fx3dGoToSlide(i))
  );

  fx3dShowSlide(fx3dIndex);
};

let chartsRendered = false;
let chartsalignmentRendered = false;
let chartsaccuracyRendered = false;
let animationDuration = 1500;
let fontSize = 16;
let captionChartsRendered = false;
let radarChartRendered = false;

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".main-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Reset main tabs
      tabs.forEach((t) => t.classList.remove("is-active"));
      contents.forEach((c) => {
        c.style.display = "none";
        c.classList.remove("is-active");
      });

      tab.classList.add("is-active");
      const target = tab.getAttribute("data-tab");
      const activeContent = document.getElementById(target);
      activeContent.style.display = "block";
      activeContent.classList.add("is-active");

      // Reset subtabs based on the selected main tab
      if (target === "linguistic") {
        resetSubtab("avg");
        if (!chartsRendered) {
          renderAllCharts();
          chartsRendered = true;
        }
      }

      if (target === "alignment") {
        resetSubtab("gpt4-align");
        if (!chartsalignmentRendered) {
          renderPieCharts();
          chartsalignmentRendered = true;
        }
      }

      if (target === "accuracy") {
        resetSubtab("gpt4-caption");
        if (!chartsaccuracyRendered) {
          renderCaptionCharts();
          chartsaccuracyRendered = true;
        }
      }

      
      if (target === "generation" && !radarChartRendered) {
        renderTextTo3DChart();
        radarChartRendered = true;
      }


    });
  });

  // Subtab switching inside linguistic
  const subTabs = document.querySelectorAll(".sub-tab");
  const subContents = document.querySelectorAll(".subtab-content");

  subTabs.forEach((sub) => {
    sub.addEventListener("click", () => {
      subTabs.forEach((s) => s.classList.remove("is-active"));
      subContents.forEach((sc) => sc.classList.remove("is-active"));

      sub.classList.add("is-active");
      const subTarget = sub.getAttribute("data-subtab");
      const subActive = document.getElementById(subTarget);
      if (subActive) subActive.classList.add("is-active");
    });
  });

  // Auto-render if Linguistic is default visible
  renderAllCharts();
  chartsRendered = true;
});

function renderAllCharts() {
  const labels = ["Cap3D", "3D-Topia", "Kabra", "MARVEL (L4)"];
  const colors = ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"];

  const chartConfigs = [
    {
      id: "avgLengthChart",
      label: "Average Caption Length",
      data: [16, 29, 5, 44],
    },
    {
      id: "mtldChart",
      label: "Measure of Lexical Diversity (MTLD)",
      data: [39.71, 41.43, 25.85, 47.43],
    },
    {
      id: "unigramChart",
      label: "Unigram Count",
      data: [15189, 10329, 3862, 27659],
    },
    {
      id: "bigramChart",
      label: "Bi-Gram Count",
      data: [123071, 95856, 19753, 239052],
    },
  ];

  chartConfigs.forEach((chart) => {
    const ctx = document.getElementById(chart.id).getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: chart.label,
            data: chart.data,
            backgroundColor: colors,
            borderColor: colors.map((c) => c.replace("0.7", "1")),
            borderRadius: 6,
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: chart.label,
            font: {
              size: fontSize, // Increase X-axis font size here
            },
          },
          legend: {
            display: false,
            font: {
              size: fontSize, // Increase X-axis font size here
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: {
                size: fontSize, // Increase X-axis font size here
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: fontSize, // Increase X-axis font size here
              },
            },
          },
        },
      },
    });
  });
}

function renderPieCharts() {
  const datasets = ["Cap3D", "3D-Topia", "Kabra", "MARVEL (L4)"];
  const colors = ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"];

  const gpt4Data = [14.55, 10.8, 2.24, 72.41];
  const humanData = [9.5, 14.0, 3.1, 73.4];

  new Chart(document.getElementById("gpt4PieChart").getContext("2d"), {
    type: "pie",
    data: {
      labels: datasets,
      datasets: [
        {
          data: gpt4Data,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "GPT-4 Evaluation",
          font: {
            size: fontSize, // Increase X-axis font size here
          },
        },
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: fontSize, // Increase legend font size
            },
          },
        },
      },
    },
  });

  new Chart(document.getElementById("humanPieChart").getContext("2d"), {
    type: "pie",
    data: {
      labels: datasets,
      datasets: [
        {
          data: humanData,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Human Evaluation",
          font: {
            size: fontSize, // Increase X-axis font size here
          },
        },
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

function resetSubtab(defaultId) {
  const subTabs = document.querySelectorAll(".sub-tab");
  const subContents = document.querySelectorAll(".subtab-content");

  subTabs.forEach((s) => s.classList.remove("is-active"));
  subContents.forEach((sc) => sc.classList.remove("is-active"));

  const defaultTab = document.querySelector(
    `.sub-tab[data-subtab="${defaultId}"]`
  );
  const defaultContent = document.getElementById(defaultId);

  if (defaultTab) defaultTab.classList.add("is-active");
  if (defaultContent) defaultContent.classList.add("is-active");
}

function renderCaptionCharts() {
  const labels = ["Cap3D", "3D-Topia", "Kabra", "MARVEL (L1)"];
  const colors = ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"];

  const gpt4 = [76.0, 54.6, 83.4, 84.7];
  const human = [72.8, 44.8, 78.2, 82.8];

  // GPT-4 Bar Chart
  new Chart(document.getElementById("gpt4CaptionBar").getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "GPT-4 Accuracy (%)",
          data: gpt4,
          backgroundColor: colors,
          borderRadius: 6,
          barThickness: 50,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Caption Accuracy (GPT-4 Evaluation)",
          font: {
            size: fontSize, // Increase X-axis font size here
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${
                context.parsed.y ?? context.parsed.x
              }%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
            font: {
              size: fontSize, // Increase X-axis font size here
            },
          },
        },
      },
    },
  });

  // Human Bar Chart
  new Chart(document.getElementById("humanCaptionBar").getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Human Accuracy (%)",
          data: human,
          backgroundColor: colors,
          borderRadius: 6,
          barThickness: 50,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Caption Accuracy (Human Evaluation)",
          font: {
            size: fontSize, // Increase X-axis font size here
          },
        },
        legend: {
          display: false,
          font: {
            size: fontSize, // Increase X-axis font size here
          },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${
                context.parsed.y ?? context.parsed.x
              }%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
            font: {
              size: fontSize, // Increase X-axis font size here
            },
          },
        },
      },
    },
  });
}

function renderTextTo3DChart() {
  const ctx = document.getElementById("textTo3DRadar").getContext("2d");

  const labels = [
    "Geometric Consistency",
    "Visual Quality",
    "Prompt Fidelity",
    "Overall Preference",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Shap-E",
        data: [3.31, 2.25, 2.65, 2.41],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "DreamFusion",
        data: [4.88, 3.74, 4.22, 4.09],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: "HiFA",
        data: [6.59, 6.42, 6.88, 6.44],
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
      },
      {
        label: "Lucid-Dreamer",
        data: [7.25, 6.47, 6.62, 6.59],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "MARVEL-FX3D",
        data: [7.2, 6.58, 7.71, 6.94],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  const config = {
    type: "radar",
    data: data,
    options: {
      responsive: true,
      elements: {
        line: {
          borderWidth: 2,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Text-to-3D Generation Evaluation",
          font: {
            size: fontSize, // Increase X-axis font size here
          },
        },
        legend: {
          position: "top",
          font: {
            size: fontSize, // Increase X-axis font size here
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 8,
          ticks: {
            stepSize: 1,
          },

          pointLabels: {
            font: {
              size: fontSize,
            },
          },
        },
      },
    },
  };

  new Chart(ctx, config);
}
