"use strict";

makeEmptyTable();
fillEmptyTable();
showElementInfoOnClick();
let answer;
createBob();

let gamePlayedOrNot = localStorage.getItem("played");

if (gamePlayedOrNot === null) {
    whoIsBob();
} else {
    document.getElementById("ranaway").innerText = "BOB IS BACK!";
    document.getElementById("ranaway").hidden = false;
    bobIsBack();
}

function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("elementName").innerText = "";
    document.getElementById("atomicNumber").innerText = "";
    document.getElementById("atomicMass").innerText = "";
    document.getElementById("boilingPoint").innerText = "";
    document.getElementById("meltingPoint").innerText = "";
    document.getElementById("appearance").innerText = "";
    document.getElementById("element3DModel").src = "";
}

async function fetchPeriodicTable() {
    const response = await fetch("PeriodicTableJSON.json");
    const elements = await response.json();
    const tableElements = elements.elements;
    
    return tableElements
}

function makeEmptyTable() {
    const table = document.getElementById("periodicTable");

    for (let row = 1; row <= 10; row++) {
        const tr = table.insertRow();

        for (let column = 1; column <= 18; column++) {
            const elementTd = tr.insertCell();
            elementTd.id = `R${row}C${column}`;
        } 
    }
}

async function fillEmptyTable() {
    const elements = await fetchPeriodicTable();

    for (const element of elements) {
        const cellId = "R" + element.ypos + "C" + element.xpos;
        const cell = document.getElementById(cellId);
        
        cell.innerText = element.symbol;
        cell.className = "filledCell " + removeSpaces(element.category);
    }
}

function removeSpaces(stringElement) {
    let stringWithoutSpaces = "";
    for (let char of stringElement){
        if (char !== " ") {
            stringWithoutSpaces += char;
        }
    }
    return stringWithoutSpaces
}

async function showElementInfoOnClick() {
    const elements = await fetchPeriodicTable();

    for (let i = 0; i < elements.length; i++) {
        const cell = document.getElementById(`R${elements[i].ypos}C${elements[i].xpos}`);
        
        cell.onclick = function on() {
            document.getElementById("overlay").style.display = "block";
            document.getElementById("elementName").innerText = elements[i].name;
            document.getElementById("atomicNumber").innerText = "Element number: " + elements[i].number;
            document.getElementById("atomicMass").innerText = "Atomic mass: " + elements[i].atomic_mass + " daltons";
            
            if (elements[i].appearance !== null) {
                document.getElementById("appearance").innerText = "Appearance: " + elements[i].appearance;
            }
            if (elements[i].boil !== null) {
                document.getElementById("boilingPoint").innerText = "Boiling Point: " + elements[i].boil + " K";  
            }
            if (elements[i].melt !== null) {
                document.getElementById("meltingPoint").innerText = "Melting Point: " + elements[i].melt  + " K";
            }
            document.getElementById("element3DModel").src = elements[i].bohr_model_3d;
        };
    }
}

//Create bob
async function createBob(stringElement) {
    const elements = await fetchPeriodicTable();
    await fillEmptyTable();
    const bob = document.getElementById("R3C3");
            
    bob.innerText = "Bob";
    bob.className = "filledCell bob";
}

async function whoIsBob() {
    const bob = document.getElementById("R3C3");
    let bobClickCount = 1;

    bob.onclick = function bobTheRealElement() {
        document.getElementById("overlay").style.display = "block";
        const bobText = document.getElementById("elementName");
        const suspicionBar = document.getElementById("suspicionBar");
        const suspicion = document.getElementById("suspicion");

        switch (bobClickCount) {
            case 1:
                bobText.innerText = "Bobium";
                bobClickCount++;
            break;
            case 2:
                bobText.innerText = "Ok, Bob is not an actual element";
                bobClickCount++;
            break;
            case 3:
                bobText.innerText = "From a young age, Bob wanted to become an element.";
                bobClickCount++;
            break;
            case 4:
                bobText.innerText = "Nowadays, he's hanging around the periodic table as a fraudulent element.";
                bobClickCount++;
            break;
            case 5:
                bobText.innerText = "Bob will tell you his element name, did he steal it from someone?";
                suspicionBar.hidden = false;
                suspicion.value = 0;
                bobClickCount++;

                playGuessGameWithBob();
            break;
            default:
                bobText.innerText = "Bob, the real element";
            break;
        }
    }
}

async function bobIsBack() {
    const bob = document.getElementById("R3C3");

    bob.onclick = function bobElementOfSurprise() {
        document.getElementById("overlay").style.display = "block";
        const bobText = document.getElementById("elementName");

        bobText.innerText = "Bob, the element of surprise";
    }
}

async function playGuessGameWithBob() {
    const elements = await fetchPeriodicTable();
    
    let randomElement = Math.floor(Math.random() * 119);

    askQuestion(elements, randomElement);
    getAnswerOnElementClick();
    checkAnswerOnclick(randomElement, elements, answer);
}

async function getAnswerOnElementClick() {
    const elements = await fetchPeriodicTable();

    for (let i = 0; i < elements.length; i++) {
        const cell = document.getElementById("R" + elements[i].ypos + "C" + elements[i].xpos);

        cell.onclick = function returnOnClick() {
            answer = elements[i].symbol;         
        };
    }
}

async function askQuestion(elementsList, randomElement) {
    const questionCell = document.getElementById("R2C4");

    questionCell.className = "textBalloon";
    questionCell.innerText = "My element name is " + elementsList[randomElement].name +"!";
}

function checkAnswerOnclick(randomElement, elements) {
    document.addEventListener("click", function(){

        if (elements[randomElement].symbol === answer){
            document.getElementById("suspicion").value++;
            changeBobBehaviour();

            if (document.getElementById("suspicion").value !== 4) {
                randomElement = Math.floor(Math.random() * 119);
                askQuestion(elements, randomElement);
            }

        } else {
            document.getElementById("suspicion").value--;
            changeBobBehaviour();
        }            
    });
}

function changeBobBehaviour() {
    const bobCell = document.getElementById("R3C3");
    const questionCell = document.getElementById("R2C4");
    const suspicion = document.getElementById("suspicion").value;

    if (suspicion === 2) {
        bobCell.className = "filledCell bob nervous1";

    } else if (suspicion === 3) {
        bobCell.className = "filledCell bob nervous1 nervous2";

    } else if (suspicion === 4) {
        bobCell.className = "filledCell bob nervous1 nervous2 runaway";
        questionCell.className = "";
        questionCell.innerText = "";
        document.getElementById("suspicionBar").hidden = true;
        document.getElementById("ranaway").hidden = false;
        localStorage.setItem('played', true);
        showElementInfoOnClick();
    } else {
        bobCell.className = "filledCell bob";
    }
}