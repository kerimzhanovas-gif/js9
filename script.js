// ФИО
const nameRegex = /^[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?(?:\s[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?){1,2}$/;
//телефон
const phoneRegex = /^(?:(?:\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}|\+996[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{3})$/;
//почта
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
//поля
const fields = [
    { id: "fio",   regex: nameRegex,  error: "Введите ФИО с заглавных букв, например: Хасанова Руфина Равильевна" },
    { id: "phone", regex: phoneRegex, error: "Формат: +996 123 456 789 или +996 123 45 67 89" },
    { id: "email", regex: emailRegex, error: "Введите почту в формате example@example.com" }
];
//проверка одного поля
function validateField(field) {
    const input = document.getElementById(field.id);
    const errorBox = document.getElementById(field.id + "-error");
    const ok = field.regex.test(input.value.trim());

    input.classList.toggle("invalid", !ok);
    input.classList.toggle("valid", ok);
    errorBox.textContent = ok ? "" : field.error;
    return ok;
}
const form = document.getElementById("register-form");
if (form) {
    //проверка прямо во время ввода
    fields.forEach(function (field) {
        document.getElementById(field.id).addEventListener("input", function () {
            validateField(field);
        });
    });
    //проверка при отправке формы
    form.addEventListener("submit", function (event) {
        event.preventDefault(); //не перезагружаем страницу
        const result = document.getElementById("form-result");
        //проверка всех полей
        const allOk = fields.map(validateField).every(Boolean);
        if (allOk) {
            result.textContent = "Готово! Добро пожаловать в Школу Монстров, " +
                                 document.getElementById("fio").value.trim() + "!";
            result.className = "form-result success";
            form.reset();
            fields.forEach(function (f) {
                document.getElementById(f.id).classList.remove("valid");
            });
        } else {
            result.textContent = "Исправьте поля, отмеченные красным.";
            result.className = "form-result fail";
        }
    });
}


//list, detail
const DATA_URL = 'data.json';
const charGrid = document.getElementById('char-grid');
const detailSection = document.getElementById('detail-section');
const detailCard = document.getElementById('detail-card');
const closeBtn = document.getElementById('close-btn');
let charactersData = [];
//загрузка данных из JSON
async function loadCharacters() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

        charactersData = await response.json();
        renderCharactersList(charactersData);
    } catch (error) {
        console.error('Ошибка JSON', error);
        charGrid.innerHTML = '<p style="color: #ff6b6b;">Не удалось загрузить данные. Откройте сайт через Live Server.</p>';
    }
}
//список карточек
function renderCharactersList(characters) {
    charGrid.innerHTML = '';
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = `char-card ${character.cardClass}`;
        card.innerHTML = `
            <div class="char-img-stub"><img src="${character.image}" alt="${character.name}"></div>
            <h3>${character.name}</h3>
            <p>${character.title}</p>
            <button class="btn-more">Узнать больше</button>
        `;
        card.addEventListener('click', () => showCharacterDetail(character.id));
        charGrid.appendChild(card);
    });
}
//модальное окно
function showCharacterDetail(characterId) {
    const character = charactersData.find(c => c.id === characterId);
    if (!character) return;
    const specsList = Object.entries(character.specs)
        .map(([key, value]) => `<li><strong>${key}: </strong>${value}</li>`)
        .join('');
    detailCard.innerHTML = `
        <div class="detail-layout ${character.cardClass}">
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}" class="detail-img">
            <p class="detail-title">${character.title}</p>
            <p class="detail-desc">${character.description}</p>
            <div class="detail-specs">
                <strong>О персонаже</strong>
                <ul>${specsList}</ul>
            </div>
            <button class="btn-fav" onclick="addToFavorites('${character.name}')">В избранное</button>
        </div>
    `;
    detailSection.classList.remove('hidden');
}
//акрытие модального окна
closeBtn.addEventListener('click', () => detailSection.classList.add('hidden'));
detailSection.addEventListener('click', (e) => {
    if (e.target === detailSection) detailSection.classList.add('hidden');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') detailSection.classList.add('hidden');
});
function addToFavorites(name) {
    alert("Персонаж '" + name + "' добавлен в избранное!");
}
document.addEventListener('DOMContentLoaded', loadCharacters);