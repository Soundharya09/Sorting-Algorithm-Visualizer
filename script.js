const container = document.getElementById("array-container");
let array = [];
let size = 60;
let delay = 20;
let executionTimes = {};

function generateArray() {
    container.innerHTML = "";
    array = [];

    for (let i = 0; i < size; i++) {
        let value = Math.floor(Math.random() * 300) + 10;
        array.push(value);

        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        container.appendChild(bar);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSort(type) {
    let start = performance.now();

    switch(type) {
        case 'bubble': await bubbleSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'selection': await selectionSort(); break;
        case 'merge': await mergeSort(0, array.length - 1); break;
        case 'quick': await quickSort(0, array.length - 1); break;
        case 'heap': await heapSort(); break;
        case 'counting': await countingSort(); break;
    }

    let end = performance.now();
    executionTimes[type] = (end - start).toFixed(2);

    updateTimeChart();
}

function updateBars() {
    const bars = document.getElementsByClassName("bar");
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = `${array[i]}px`;
    }
}

/* =====================
   Sorting Algorithms
===================== */

async function bubbleSort() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j+1]) {
                [array[j], array[j+1]] = [array[j+1], array[j]];
                updateBars();
                await sleep(delay);
            }
        }
    }
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j--;
            updateBars();
            await sleep(delay);
        }
        array[j + 1] = key;
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let min = i;
        for (let j = i+1; j < array.length; j++) {
            if (array[j] < array[min]) min = j;
        }
        [array[i], array[min]] = [array[min], array[i]];
        updateBars();
        await sleep(delay);
    }
}

/* Merge, Quick, Heap, Counting simplified for demo */

/* =====================
   FIXED MERGE SORT
===================== */

async function mergeSort(l, r) {
    if (l >= r) return;

    let m = Math.floor((l + r) / 2);

    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

async function merge(l, m, r) {

    let left = array.slice(l, m + 1);
    let right = array.slice(m + 1, r + 1);

    let i = 0;
    let j = 0;
    let k = l;

    // Merge while both have elements
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        k++;
        updateBars();
        await sleep(delay);
    }

    // Copy remaining left elements
    while (i < left.length) {
        array[k] = left[i];
        i++;
        k++;
        updateBars();
        await sleep(delay);
    }

    // Copy remaining right elements
    while (j < right.length) {
        array[k] = right[j];
        j++;
        k++;
        updateBars();
        await sleep(delay);
    }
}

async function quickSort(l, r) {
    if (l < r) {
        let pi = await partition(l, r);
        await quickSort(l, pi - 1);
        await quickSort(pi + 1, r);
    }
}

async function partition(l, r) {
    let pivot = array[r];
    let i = l - 1;
    for (let j = l; j < r; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBars();
            await sleep(delay);
        }
    }
    [array[i+1], array[r]] = [array[r], array[i+1]];
    return i+1;
}

async function heapSort() {
    array.sort((a,b)=>a-b); // simplified
    updateBars();
}

async function countingSort() {
    array.sort((a,b)=>a-b); // simplified
    updateBars();
}

/* =====================
   Charts
===================== */

let timeChart = new Chart(document.getElementById('timeChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Execution Time (ms)',
            data: [],
            backgroundColor: '#00adb5'
        }]
    }
});

function updateTimeChart() {
    timeChart.data.labels = Object.keys(executionTimes);
    timeChart.data.datasets[0].data = Object.values(executionTimes);
    timeChart.update();
}

/* =====================
   REAL BIG-O CURVE GRAPH
===================== */

const nValues = [];
const nSquared = [];
const nLogN = [];
const nLinear = [];

for (let n = 1; n <= 100; n++) {
    nValues.push(n);
    nSquared.push(n * n);
    nLogN.push(n * Math.log2(n));
    nLinear.push(n);
}

generateArray();