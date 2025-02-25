document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculateBtn").addEventListener("click", calculateAge);
});

function calculateAge() {
    console.log("calculateAge function called!"); // Debugging

    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const result = document.querySelector(".result");

    console.log(`Inputs: Day=${day}, Month=${month}, Year=${year}`); // Debugging

    // Input validation: Check if fields are empty
    if (!day || !month || !year) {
        result.innerHTML = "Please enter a valid date";
        return;
    }

    const birthdate = new Date(year, month - 1, day);
    const today = new Date();

    // Check if the date is valid and not in the future
    if (birthdate > today || isNaN(birthdate.getTime())) {
        console.log("Invalid birthdate detected!"); // Debugging
        result.innerHTML = "Please enter a valid date";
        return;
    }

    let ageValue = today.getFullYear() - birthdate.getFullYear();
    const monthValue = today.getMonth() - birthdate.getMonth();
    const dayValue = today.getDate() - birthdate.getDate();

    if (monthValue < 0 || (monthValue === 0 && dayValue < 0)) {
        ageValue--;
    }

    console.log(`Calculated age: ${ageValue}`); // Debugging
    result.innerHTML = `You are ${ageValue} years old`;
}
