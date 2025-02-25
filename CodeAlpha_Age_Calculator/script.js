document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculateBtn").addEventListener("click", calculateAge);
});

function calculateAge() {
    // console.log("calculateAge function called!");

    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const result = document.querySelector(".result");

    // console.log(`Inputs: Day=${day}, Month=${month}, Year=${year}`); 

    if (!day || !month || !year) {
        result.innerHTML = "Please enter a valid date!";
        return;
    }

    const birthdate = new Date(year, month - 1, day);
    const today = new Date();

    if (birthdate > today || isNaN(birthdate.getTime())) {
        console.log("Invalid birthdate detected!"); 
        result.innerHTML = "Please enter a valid date!";
        return;
    }

    let ageValue = today.getFullYear() - birthdate.getFullYear();
    const monthValue = today.getMonth() - birthdate.getMonth();
    const dayValue = today.getDate() - birthdate.getDate();

    if (monthValue < 0 || (monthValue === 0 && dayValue < 0)) {
        ageValue--;
    }

    // console.log(`Calculated age: ${ageValue}`); 
    result.innerHTML = `You are <strong>${ageValue}</strong> years old!`;
}
