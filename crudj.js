let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let mood = 'create'
let tmp;

// Get total
function getTotal() {
    if (price.value !== '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}

// Create / store product
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

submit.onclick = function () {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    };


    if (title.value !== '' && price.value !== '' && category.value !== '') {
        if (mood === 'create') {
            if (+newPro.count > 1) {
                for (let i = 0; i < +newPro.count; i++) {
                    dataPro.push({ ...newPro });
                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            dataPro[tmp] = newPro;
            mood = 'create';
            submit.innerHTML = 'Create';
            count.style.display = 'block';
        }

        localStorage.setItem('product', JSON.stringify(dataPro));
        clearData();
        showData();
    }

};

// Clear form inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// Display data
function showData() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>`;
    }

    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}

// Delete a single product
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// Delete all
function deleteAll() {
    localStorage.clear();
    dataPro = [];
    showData();
}

// update
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: "smooth",
    });
}

// search
let searchMood = 'title';

function getSearchMood(id) {
    let search = document.getElementById('search');

    if (id === 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    search.placeholder = 'search By' + searchMood;

    search.focus();
    search.value = '';
    showData()
}

function searchData(value) {
    let table = '';
    value = value.toLowerCase(); // clean input once

    for (let i = 0; i < dataPro.length; i++) {
        let item = dataPro[i];
        if (
            (searchMood === 'title' && item.title.toLowerCase().includes(value)) ||
            (searchMood === 'category' && item.category.toLowerCase().includes(value))
        ) {
            table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.title}</td>
                    <td>${item.price}</td>
                    <td>${item.taxes}</td>
                    <td>${item.ads}</td>
                    <td>${item.discount}</td>
                    <td>${item.total}</td>
                    <td>${item.category}</td>
                    <td><button onclick="updateData(${i})">Update</button></td>
                    <td><button onclick="deleteData(${i})">Delete</button></td>
                </tr>`;
        }
    }

    document.getElementById('tbody').innerHTML = table;
}


// Initial call
showData();
