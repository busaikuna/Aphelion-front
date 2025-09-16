const fieldset = document.querySelector("fieldset");
const inputs = Array.from(fieldset.querySelectorAll(".input"));
const submitBtn = fieldset.querySelector("input[type='button'][value='Logar']");

inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus();
            } else {
                submitBtn.click();
            }
        }
    });
});
inputs[0].focus();
