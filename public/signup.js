document.querySelector("#warrior-status").addEventListener("change", function(e) {
  const caregiverinputs = document.querySelector(".caregiver-inputs");
  if (e.target.value === "Caregiver") {
    caregiverinputs.style.display = "block";
  } else {
    caregiverinputs.style.display = "none";
  }
});
