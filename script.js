const products = [
    {id : 1, name: "Ноутбук ASUS", category: "Электроника", price: 2500, inStock: true},
    {id : 2, name: "Мышь Logitech", category: "Электроника", price: 45, inStock: true},
    {id : 3, name: "Стол письменный", category: "Мебель", price: 320, inStock: false},
    {id : 4, name: "Кресло офисное", category: "Мебель", price: 480, inStock: true},
    {id : 5, name: "Наушники Sony", category: "Электроника", price: 180, inStock: true},
    {id : 6, name: "Книга «JS для всех»", category: "Книги", price: 25, inStock: true},
    {id : 7, name: "Книга «Clean Code»", category: "Книги", price: 30, inStock: false},
    {id : 8, name: "Монитор LG 27", category: "Электроника", price: 750, inStock: true},
];


let cart = [];

/*
    Так как карточка товара является динамическим элементом, то при каждом рендеринге такой карты
    к кнопке карточки необходимо добавлять обработчик событий, кроме этого по условию задания необходимо
    отображать карточки с помощью перезаписывания innerHTML контейнера. При каждом таком перезаписывании
    обработчик событий с кнопки слетает. Наличия большого кол-ва карточек может привести к снижения 
    производительности из-за большого кол-ва обработчиков. 
    Чтобы этого избежать используем делегирование событий. Вместо добавления обработчиков событий к каждой
    кнопке добавим обработчик событий к родительскому элементу. В результате всплытия события проверяем 
    является ли html элемент кнопнкой карточки. Для прикрепления информации о карточке к кнопке используем
    data-атрибуты (data-product-id).

*/
const handleAddToCart = (e) => {
    if(!e.target || !e.target.matches(".btn-cart")) return;

    const cardId = Number(e.target.dataset.productId);
    
    const foundProduct = cart.find(product => product.id === cardId);
    if(foundProduct) return;

    const product = products.find(product => product.id === Number(cardId));
    cart.push(product);   
}

const sectionCatalog = document.getElementById("section-catalog");
const sectionFilters = document.getElementById("section-filters");
sectionCatalog.addEventListener("click", handleAddToCart);
sectionFilters.addEventListener("click", handleAddToCart);

/*
    Возвращает карточку товара с добавленной кнопкой "В корзину". По условию
    задания для добавления карточки в результирующий контейнер необходимо использовать innerHtml. 
    К каждой кнопке в карточке нужно добавить обработчик события click и передать id карточки 
    в качестве аргумента.Но если добавлять обработчик события к кнопке,
    то при новом присваивании innerHTML он бубет теряться. 
    для сохранения id карточки у кнопки добавим data-аттрибут. Теперь каждая кнопка 
    будет содержать доп информацию о карточке.
*/
function createCard(product) {
    return `
            <div class="product-card" ${product.inStock ? "": "out-of-stock"}">
                <h3>${product.name}</h3>
                <p>Категория: ${product.category}</p>
                <p class="price">Цена: ${product.price} BYN</p>
                <p>${product.inStock ? "✅ В наличии" : " ❌ Нет в наличии"}</p>
                ${product.inStock ? `<button data-product-id=${product.id} class="btn btn-cart">В корзину</button>` : ""}
            </div>
            `
}





// ЗАДАНИЕ 1. Вывод каталога (forEach)
const showAllBtn = document.getElementById("btn-show-all");

const handleShowAll = () => {
    const catalogContainer = document.getElementById("catalog-container");
    catalogContainer.innerHTML = "";
    // Используем forEach для перебора элементов массива и добавления карточек в каталог
    // В данном случае модифицировать исходный массив или создавать новый не требуется 
    // Поэтому используется более производительный forEach;
    // Возращает: undefined; Не мутирует исходный массив
    products.forEach(product => {
        const card = createCard(product);
        catalogContainer.innerHTML += card;
    })
}

showAllBtn.addEventListener("click", handleShowAll);









// ЗАДАНИЕ 2. Фильтр по категории (filter); + Задание 3. Поиск по названию + сортировка (filter + map)

const searchBtn = document.getElementById("btn-search");

const handleFilter = () => {
    const filterResults = document.getElementById("filter-results");
    filterResults.innerHTML = "";
    const selectedCategory = document.getElementById("category-select").value;
    const searchText = document.getElementById("search-input").value.trim();

    // использую filter, чтобы получить новый массив с подходящими товарами по определенному критерию
    // filter возвращает новый массив, при этом только отбирая элементы, не изменяя их.
    // затем использую map, чтобы получить новый массив отфильтрованных элементов со свойства label у каждого элемента.
    // map возвращает новый массив, элементами которого являются возвращаемое значение колбэка при каждой итерации
    // элементов исходного массива.
    const filtered = products
        .filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()))
        .filter(product => selectedCategory === "Все" || product.category === selectedCategory)
        .map(product => ({
            ...product,
            label: `${product.name} - ${product.price} BYN`
        }));

    filtered.forEach(product => {
        const card = createCard(product);
        filterResults.innerHTML += card;
    })
}

searchBtn.addEventListener("click", handleFilter);












// ЗАДАНИЕ 4. Корзина покупателя (map + forEach)

const showCartBtn = document.getElementById("btn-show-cart");
const clearCartBtn = document.getElementById("btn-clear-cart");

const handleShowCart = () => {
    const cartContainer = document.getElementById("cart-container");
    const cartTotal = document.getElementById("cart-total");

    if(!cart.length) {
        cartContainer.innerHTML = "<span class='empty-state'>🛒 Корзина пуста</span>"
        return;
    }

    cartContainer.innerHTML = "";
    cart.forEach(product => {
        const cartItem = `
            <div class="cart-item">
                <span>${product.name}</span>
                <span>${product.price} BYN</span>
            </div>
        `
        cartContainer.innerHTML += cartItem;
    })

    // используем map для получения массива цен. reduce это метод который сворачивает массив
    // последовательно применяя callback к каждому элементу и накапливая результат.
    // в данном случае идет накопление суммы при переборе массива.
    // параметры: callback, исходное значение. Если исходное значение не указано, берется первый элемент
    // массива, а перебор начинается со второго.
    const total = cart.map(item => item.price).reduce((sum, price) => sum + price, 0);
    cartTotal.innerHTML = `<span class="cart-total">Итого: ${total} BYN</span>`;
}

const handleClearCart = () => {
    const cartContainer = document.getElementById("cart-container");
    const cartTotal = document.getElementById("cart-total");
    cartContainer.innerHTML = "<span class='empty-state'>🛒 Корзина пуста</span>";
    cartTotal.innerHTML = "";
    cart = [];
}

showCartBtn.addEventListener("click", handleShowCart);
clearCartBtn.addEventListener("click", handleClearCart);






// Задание 5. JSON и localStorage (JSON.stringify / JSON.parse)

const saveBtn = document.getElementById("btn-save");

const handleSaveCart = () => {
    const storageStatus = document.getElementById("storage-status");
    storageStatus.classList.remove("success");
    storageStatus.classList.remove("error");
    storageStatus.classList.remove("info");

    
    // ничего не сохраняем, если корзина пуста
    if(!cart.length) {
        storageStatus.textContent = "Корзина пуста! Добавьте товары в корзину для сохранения!";
        storageStatus.classList.add("info");
        return 
    }

    const cartJSON = JSON.stringify(cart);
    localStorage.setItem("myCart", cartJSON);
    console.log("Объект:", cart);
    console.log("JSON-строка:", cartJSON);

    storageStatus.textContent = "✅ Корзина сохранена в localStorage";
    storageStatus.classList.add("success");
}

saveBtn.addEventListener('click', handleSaveCart);



const loadBtn = document.getElementById("btn-load");

const handleLoad = () => {
    const storageStatus = document.getElementById("storage-status");
    storageStatus.classList.remove("success");
    storageStatus.classList.remove("error");
    storageStatus.classList.remove("info");

     const saved = localStorage.getItem("myCart");

    if(saved) {
        cart = JSON.parse(saved);
        storageStatus.textContent = "✅ Корзина загружена из localStorage";
        storageStatus.classList.add("success");
        console.log("Загружено:", cart);
        handleShowCart();
    } else {
        storageStatus.textContent="Нет сохраненных данных";
        storageStatus.classList.add("error");
        console.log("Нет сохраненных данных");
    }
}

loadBtn.addEventListener('click', handleLoad);











// Задание 6: Статистика каталога (map + filter + вычисления);

const statsBtn = document.getElementById("btn-stats");

const handleStats = () => {
    const statsContainer = document.getElementById("stats-container");
    statsContainer.innerHTML = "";

    const allStats = [];

    allStats.push({
        value: products.length,
        label: "Всего товаров"
    })

    allStats.push({
        value: inStockNum(products),
        label: "В наличии"
    })

    allStats.push({
        value: averagePrice(products) + " BYN",
        label: "Средняя цена"
    })

    const {name, price} = mostExpensive(products);
    allStats.push({
        value: `${name} (${price} BYN)`,
        label: "Самый дорогой"
    })

    allStats.push({
        value: getCategories(products).join(", "),
        label: "Категории"
    })

    allStats.forEach(stats => {
        const statsCard = createStatsCard(stats);
        statsContainer.innerHTML += statsCard;
    })
}

statsBtn.addEventListener('click', handleStats);

function inStockNum(products) {
    const inStock = products.filter(product => product.inStock);
    return inStock.length;
}

function averagePrice(products) {
    const prices = products.map(product => product.price);
    const avgPrice = (prices.reduce((acc, price) => acc + price, 0) / prices.length).toFixed(2);
    return avgPrice;
}

function mostExpensive(products) {
    const mostExpensive = products.reduce((max, product) => product.price > max.price ? product : max, products[0]);
    return mostExpensive;
}

function getCategories(products) {
    return [...new Set(products.map(product => product.category))];
}

function createStatsCard({value, label}) {
    return `
        <div class="stat-card">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${label}</div>
        </div>
    `
}





//------------------------------------------------------------------------------------------

// Смена темы
const themeButton = document.getElementById('theme-toggle');
const isEvening = new Date().getHours() > 18;
// Проверить наличие сохраненной темы в localStorage
// Если вечер то тема при обновлении страницы каждый раз будет темная
if(isEvening) {
   localStorage.setItem('theme', 'dark');
}

const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'dark') {
    document.documentElement.setAttribute("data-theme", "dark");
   themeButton.innerText = '☀️';
}

themeButton.addEventListener('click', function() {
   const currentTheme = document.documentElement.getAttribute("data-theme");
   
   if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem('theme', 'light');
        themeButton.innerText = '🌙'
   } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem('theme', 'dark');
        themeButton.innerText = '☀️';
   }
});