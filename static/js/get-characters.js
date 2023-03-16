// Constants
const YES_VALUE = "Yes"
const NO_VALUE = "No"

function getCharacters() {
    // Make an API call toLocaleString('en-US, {}) the Flask backend
    fetch('/get_data')
    .then(response => response.json())
    .then(characterData => {
        const characterTable = document.getElementById("characters");
        var totalIncome = 0;
    
        characterData.forEach(character => {
            const newRow = characterTable.insertRow();
    
            const characterNameCell = newRow.insertCell();
            characterNameCell.innerHTML = character["character-name"]

            if (character['character-image-url']) {
                var img = document.createElement('img')
                img.src = character['character-image-url']
                characterNameCell.appendChild(img)
            } else {
                console.log("No image found for character")
            }


            const hillaCell = newRow.insertCell();
            hillaCell.innerHTML = character["hilla"] ? YES_VALUE : NO_VALUE

            const pinkBeanCell = newRow.insertCell();
            pinkBeanCell.innerHTML = character["pinkbean"] ? YES_VALUE : NO_VALUE

            const cygnusCell = newRow.insertCell();
            cygnusCell.innerHTML = character["cygnus"] ? YES_VALUE : NO_VALUE

            const zakumCell = newRow.insertCell();
            zakumCell.innerHTML = character["zakum"] ? YES_VALUE : NO_VALUE

            const queenCell = newRow.insertCell();
            queenCell.innerHTML = character["queen"] ? YES_VALUE : NO_VALUE

            const pierreCell = newRow.insertCell();
            pierreCell.innerHTML = character["pierre"] ? YES_VALUE : NO_VALUE

            const vonbonCell = newRow.insertCell();
            vonbonCell.innerHTML = character["vonbon"] ? YES_VALUE : NO_VALUE

            const pnoCell = newRow.insertCell();
            pnoCell.innerHTML = character["pno"] ? YES_VALUE : NO_VALUE

            const magnusCell = newRow.insertCell();
            magnusCell.innerHTML = character["magnus"] ? YES_VALUE : NO_VALUE

            const vellumCell = newRow.insertCell();
            vellumCell.innerHTML = character["vellum"] ? YES_VALUE : NO_VALUE

            const totalIncomeCell = newRow.insertCell();
            totalIncomeCell.innerHTML = character["total-income"].toLocaleString('en-US', {})

            totalIncome += character["total-income"]
        });

        var totalIncomeText = document.createElement('div');
        const incomeString = "Total Weekly Income: " + totalIncome.toLocaleString('en-US', {}) + " mesos."
        totalIncomeText.textContent = incomeString
        document.body.appendChild(totalIncomeText)

    })
    .catch(error => console.error(error));



}
