document.addEventListener('DOMContentLoaded', function () {
const objects = [
  // первые 8
  { title: 'Дворовая территория по адресу: Путевой пр. 38', status: 'Завершён', percent: 100, fio: 'Андреев Ю.А.', dates: '15.04.2024-20.08.2024', district: 'СВАО', violations: '2, проверок: 1', documents: '0%', photos: 12 },
  { title: 'Дворовая территория по адресу: Флотская ул. 54, 58 к.1', status: 'Завершён', percent: 100, fio: 'Семенов И.П.', dates: '15.04.2024-15.08.2024', district: 'САО', violations: '1, проверок: 1', documents: '0%', photos: 8 },
  { title: 'Дворовая территория по адресу: Каргопольская ул. 18', status: 'Завершён', percent: 100, fio: 'Петров Д.С.', dates: '15.04.2024-28.08.2024', district: 'СВАО', violations: '3, проверок: 2', documents: '0%', photos: 10 },
  { title: 'Дворовая территория по адресу: Бестужевых ул. 27А', status: 'Завершён', percent: 100, fio: 'Иванова Н.А.', dates: '15.04.2024-23.08.2024', district: 'СВАО', violations: '0, проверок: 1', documents: '0%', photos: 6 },
  { title: 'Дворовая территория по адресу: Челобитьевское шоссе 14 к.3, 14 к.4, 14 к.5', status: 'Завершён', percent: 100, fio: 'Кузнецов А.В.', dates: '15.04.2024-20.08.2024', district: 'СВАО', violations: '2, проверок: 2', documents: '0%', photos: 11 },
  { title: 'Дворовая территория по адресу: Мира просп. 194', status: 'Завершён', percent: 100, fio: 'Фёдоров М.Г.', dates: '15.04.2024-20.08.2024', district: 'СВАО', violations: '0, проверок: 1', documents: '0%', photos: 9 }
];


   function getStatusClass(status) {
    switch (status) {
      case 'Активный': return 'status-active';
      case 'Завершён': return 'status-complete';
      case 'На паузе': return 'status-paused';
      default: return '';
    }
  }

  function renderCards(list) {
    const container = document.getElementById('objectList');
    if (!container) return;
    container.innerHTML = '';

    list.forEach(obj => {
      const card = document.createElement('div');
      card.className = 'object-card';
      const statusClass = getStatusClass(obj.status);

      card.innerHTML = `
        <div class="card-header">
          <h3>${obj.title}</h3>
          <span class="status ${statusClass}">${obj.status}</span>
        </div>
        <div class="progress"><div class="bar" style="width: ${obj.percent}%"></div></div>
        <p class="percent">${obj.percent}%</p>
        <div class="meta">
          <span>${obj.fio}</span>
          <span>${obj.dates}</span>
          <span>${obj.district}</span>
          <span>⚠ Нарушений: ${obj.violations}</span>
          <span>📋 ИД: ${obj.documents}</span>
          <span>📷 ${obj.photos} фото</span>
        </div>
        <div class="actions">
          <button>Ганта</button>
          <button>Документы</button>
          <button class="chat-open-btn">Открыть чат</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

['searchInput', 'districtFilter', 'typeFilter', 'dateStartFilter', 'dateEndFilter', 'fioFilter', 'violationFilter'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', applyFilters);
});


  renderCards(objects);

  // === Чат-модалка ===
  const modal = document.getElementById('chatModal');
  const chatTitle = document.getElementById('chatTitle');
  const chatSelect = document.getElementById('chatSelect');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatBackBtn = document.getElementById('chatBackBtn');

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('chat-open-btn')) {
      modal.style.display = 'flex';
      chatTitle.textContent = 'Выберите чат';
      chatSelect.style.display = 'block';
      chatBody.style.display = 'none';
      chatInput.style.display = 'none';
      chatBackBtn.style.display = 'none';
    }

    if (e.target.classList.contains('chat-close')) {
      modal.style.display = 'none';
    }

    if (e.target.classList.contains('chat-option')) {
      const selected = e.target.dataset.chat;
      chatTitle.textContent = selected;
      chatSelect.style.display = 'none';
      chatBody.style.display = 'block';
      chatInput.style.display = 'none'; // без поля ввода
      chatBackBtn.style.display = 'block';
    }

    if (e.target.id === 'chatBackBtn') {
      chatTitle.textContent = 'Выберите чат';
      chatSelect.style.display = 'block';
      chatBody.style.display = 'none';
      chatInput.style.display = 'none';
      chatBackBtn.style.display = 'none';
    }
  });


function applyFilters() {
  const text = document.getElementById('searchInput').value.toLowerCase();
  const district = document.getElementById('districtFilter').value;
  const type = document.getElementById('typeFilter').value;
  const fio = document.getElementById('fioFilter').value.toLowerCase();
  const violations = document.getElementById('violationFilter').value;
  const dateStart = document.getElementById('dateStartFilter').value;
  const dateEnd = document.getElementById('dateEndFilter').value;

  function parseDateString(str) {
    const [day, month, year] = str.split('.').map(Number);
    return new Date(year, month - 1, day);
  }

  const filtered = objects.filter(obj => {
    const [startStr, endStr] = obj.dates.split('-');
    const startDateObj = parseDateString(startStr.trim());
    const endDateObj = parseDateString(endStr.trim());

    const userStartDate = dateStart ? parseDateString(dateStart) : null;
    const userEndDate = dateEnd ? parseDateString(dateEnd) : null;

    const startMatch = !userStartDate || startDateObj >= userStartDate;
    const endMatch = !userEndDate || endDateObj <= userEndDate;

    return (
      obj.title.toLowerCase().includes(text) &&
      (district === '' || obj.district === district) &&
      (type === '' || obj.title.includes(type)) &&
      startMatch &&
      endMatch &&
      (fio === '' || obj.fio.toLowerCase().includes(fio)) &&
      (violations === '' || obj.violations.startsWith(violations))
    );
  });

  renderCards(filtered);
}


// Навешиваем обработчики на все фильтры
['searchInput', 'districtFilter', 'typeFilter', 'dateStartFilter', 'dateEndFilter', 'fioFilter', 'violationFilter'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', applyFilters);
});










// === ДАННЫЕ ДЛЯ ВСЕХ ГАНТОВ ===

const defaultStart = Date.UTC(2024, 3, 1);
const taskDuration = 5 * 24 * 3600 * 1000; // 5 дней

function applyDefaultDates(tasks) {
  let current = defaultStart;
  return tasks.map(task => {
    const start = task.start || current;
    const end = task.end || (current + taskDuration);
    current = end + 1;
    return { ...task, start, end };
  });
}
  
const ganttByTitle = {
'Дворовая территория по адресу: Путевой пр. 38': [
  { id: 'task0', name: 'Ремонт покрытия асфальтобетонного проезда в рамках благоустройства территории', start: Date.UTC(2024, 3, 15), end: Date.UTC(2024, 3, 25), completed: { amount: 1, fill: '#1e3a8a' },  contract: 'ОУ3/ОТ1' },
  { id: 'task1', name: 'Устройство покрытия асфальтобетонного проезда в рамках благоустройства территории', start: Date.UTC(2024, 3, 26), end: Date.UTC(2024, 4, 10), completed: { amount: 1, fill: '#1e3a8a' }, contract: '0718-19Р', dependency: 'task0' },
  { id: 'task2', name: 'Ремонт покрытия асфальтобетонного тротуара в рамках благоустройства территории', start: Date.UTC(2024, 4, 11), end: Date.UTC(2024, 4, 30), completed: { amount: 1, fill: '#1e3a8a' }, contract: '№ ЭМ-39/18-У ', dependency: 'task1' },
  { id: 'task3', name: 'Замена дорожного бортового камня в рамках благоустройства территории', start: Date.UTC(2024, 5, 1), end: Date.UTC(2024, 5, 15), completed: { amount: 1, fill: '#1e3a8a' }, contract: '37-1694-19КС', dependency: 'task2' },
  { id: 'task4', name: 'Устройство дорожного бортового камня в рамках благоустройства территории', start: Date.UTC(2024, 5, 16), end: Date.UTC(2024, 6, 10), completed: { amount: 1, fill: '#1e3a8a' }, contract: '15801-УР-19 3/6450-19', dependency: 'task3' },
  { id: 'task6', name: 'Ремонт покрытия асфальтобетонного автопарковки в рамках благоустройства территории', start: Date.UTC(2024, 6, 26), end: Date.UTC(2024, 6, 30), completed: { amount: 1, fill: '#1e3a8a' }, contract: '40/19-65-0113', dependency: 'task5' }
],


'Дворовая территория по адресу: Флотская ул. 54, 58 к.1': applyDefaultDates([
  { id: 'task0', name: 'Ремонт покрытия асфальтобетонного проезда в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '17871-АТР-19' },
  { id: 'task1', name: 'Ремонт люка подземных коммуникаций (смотрового колодца) в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: 'ЭМ-192-19', dependency: 'task0' },
  { id: 'task2', name: 'Замена дорожного бортового камня в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '50220-1784/11819', dependency: 'task1' },
  { id: 'task3', name: 'Замена садового бортового камня в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '216-19', dependency: 'task2' },
  { id: 'task4', name: 'Ремонт покрытия асфальтобетонного тротуара в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '34/19', dependency: 'task3' },
  { id: 'task5', name: 'Ремонт газона в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '022020', dependency: 'task4' },
  { id: 'task6', name: 'Ремонт покрытия асфальтобетонного пешеходной дорожки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '74521/ДА3', dependency: 'task5' },
  { id: 'task7', name: 'Устройство покрытия из резиновой крошки детской площадки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '08-20', dependency: 'task6' },
  { id: 'task8', name: 'Установка ограждения контейнерной площадки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '2019/12/26-2', dependency: 'task7' },
  { id: 'task9', name: 'Установка ограждения детской площадки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '19000642', dependency: 'task8' },
  { id: 'task10', name: 'Установка информационного стенда в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: 'ИГ-14460/1783', dependency: 'task9' },
  { id: 'task11', name: 'Установка скамьи в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '0090-1432-2020', dependency: 'task10' },
  { id: 'task12', name: 'Установка урны в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '3293822', dependency: 'task11' },
  { id: 'task13', name: 'Установка игрового детского комплекса 1 категории в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '262-20', dependency: 'task12' },
  { id: 'task14', name: 'Установка игрового элемента карусель в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '21-20', dependency: 'task13' },
  { id: 'task15', name: 'Установка игрового элемента качалка в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '1675-ОМТО-20', dependency: 'task14' },
  { id: 'task16', name: 'Установка игрового элемента качели в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '1611', dependency: 'task15' },
  { id: 'task17', name: 'Установка игрового элемента песочница в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '24-ЗЮ/20', dependency: 'task16' },
  { id: 'task18', name: 'Установка спортивного детского комплекса 1 категории в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '31-20', dependency: 'task17' }
]),

 'Дворовая территория по адресу: Каргопольская ул. 18': applyDefaultDates([
  { id: 'task0', name: 'Устройство садового бортового камня в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: 'ГМЦ-08/20-20' },
  { id: 'task1', name: 'Замена садового бортового камня в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '1502-123-2020', dependency: 'task0' },
  { id: 'task2', name: 'Ремонт газона в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: 'ИГ-14460/1783', dependency: 'task1' },
  { id: 'task3', name: 'Замена покрытия из резиновой крошки спортивной площадки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '102-341/20', dependency: 'task2' },
  { id: 'task4', name: 'Устройство покрытия асфальтобетонного пешеходной дорожки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '463/49-20', dependency: 'task3' },
  { id: 'task5', name: 'Замена покрытия из резиновой крошки детской площадки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '14', dependency: 'task4' },
  { id: 'task6', name: 'Установка ограждения детской площадки в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '31-20', dependency: 'task5' },
  { id: 'task7', name: 'Установка скамьи в рамках благоустройства территории', completed: { amount: 1.00, fill: '#1e3a8a' }, contract: '1611', dependency: 'task6' }
]),

'Дворовая территория по адресу: Бестужевых ул. 27А': applyDefaultDates([
  { id: 'task0', name: 'Устройство покрытия асфальтобетонного пешеходной дорожки в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '13464-ОМТО-20' },
  { id: 'task1', name: 'Устройство садового бортового камня в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '1734', dependency: 'task0' },
  { id: 'task2', name: 'Ремонт газона в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '13535-ОМТО-20', dependency: 'task1' },
  { id: 'task3', name: 'Замена покрытия из резиновой крошки детской площадки в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '92749066', dependency: 'task2' },
  { id: 'task4', name: 'Замена покрытия из резиновой крошки спортивной площадки в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '92744161', dependency: 'task3' },
  { id: 'task5', name: 'ОБУСТРОЙСТВО МАФ ТЕРРИТОРИЙ', completed: { amount: 1, fill: '#1e3a8a' }, contract: '21000001', dependency: 'task4' },
  { id: 'task6', name: 'УСТАНОВКА ОГРАЖДЕНИЯ ДЕТСКОЙ ПЛОЩАДКИ', completed: { amount: 1, fill: '#1e3a8a' }, contract: 'ГМЦ-01/21-09', dependency: 'task5' }
]),

'Дворовая территория по адресу: Челобитьевское шоссе 14 к.3, 14 к.4, 14 к.5': applyDefaultDates([
  { id: 'task0', name: 'Замена ограждения контейнерной площадки в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' },  contract: '10/03-10' },
  { id: 'task1', name: 'ОБУСТРОЙСТВО МАФ ТЕРРИТОРИЙ', completed: { amount: 1, fill: '#1e3a8a' }, contract: '510-ОРКИС-21', dependency: 'task0' },
  { id: 'task2', name: 'Замена дорожного бортового камня в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '86503-О', dependency: 'task1' },
  { id: 'task3', name: 'Устройство покрытия асфальтобетонного пешеходной дорожки в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '102609-01-ДО', dependency: 'task2' }
]),

'Дворовая территория по адресу: Мира просп. 194': applyDefaultDates([
  { id: 'task0', name: 'Устройство садового бортового камня в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' },  contract: '472-2021' },
  { id: 'task1', name: 'Ремонт покрытия асфальтобетонного автопарковки в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '21000049', dependency: 'task0' },
  { id: 'task2', name: 'Ремонт покрытия асфальтобетонного тротуара в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '21000016', dependency: 'task1' },
  { id: 'task3', name: 'Ремонт покрытия асфальтобетонного проезда в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '5/21-0505', dependency: 'task2' },
  { id: 'task4', name: 'Замена дорожного бортового камня в рамках благоустройства территории', completed: { amount: 1, fill: '#1e3a8a' }, contract: '2945-АТР-21', dependency: 'task3' }
]),

};

// === УНИВЕРСАЛЬНАЯ ФУНКЦИЯ РИСОВАНИЯ ГАНТА ===
function drawHighchartsGantt(data, title = '') {
  Highcharts.ganttChart('gantChart', {
    chart: {
      scrollablePlotArea: {
        minWidth: 1200,
        scrollPositionX: 1
      }
    },
    title: { text: '' },
    colors: ['#60a5fa'],
    xAxis: {
      currentDateIndicator: true,
      tickInterval: 1000 * 60 * 60 * 24 * 30,
      labels: { format: '{value:%d %b}' }
    },
    yAxis: {
      uniqueNames: true,
      staticScale: 50
    },
 tooltip: {
  formatter: function () {
    return `<b>${this.point.name}</b><br/>
            📅 ${Highcharts.dateFormat('%d.%m.%Y', this.point.start)} — ${Highcharts.dateFormat('%d.%m.%Y', this.point.end)}<br/>
            ⏳ Выполнение: ${Highcharts.numberFormat(this.point.completed.amount * 100, 0)}%<br/>
            📄 Контракт: ${this.point.contract || '—'}`;
  }
},
    plotOptions: {
      gantt: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return Highcharts.numberFormat(this.point.completed.amount * 100, 0) + '%';
          },
          style: { color: 'white', textOutline: 'none' }
        }
      }
    },
    series: [{
      name: 'Работы',
      data: data,
      color: '#60a5fa'
    }]
  });

  // Обновим заголовок
  document.querySelector('#gantModal .chat-box-header h3').textContent = `Диаграмма Ганта — ${title}`;
}

// === КНОПКА "ГАНТА" ===
document.addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Ганта') {
    const card = e.target.closest('.object-card');
    const title = card.querySelector('h3').textContent.trim();

   if (ganttByTitle[title]) {
  const data = title === 'Дворовая территория по адресу: Путевой пр. 38'
    ? ganttByTitle[title]
    : applyDefaultDates(ganttByTitle[title]);

  drawHighchartsGantt(data, title);
  document.getElementById('gantModal').style.display = 'flex';
}
 else {
      alert(`Диаграмма Ганта не найдена для объекта: ${title}`);
    }
  }

  if (e.target.classList.contains('gant-close')) {
    document.getElementById('gantModal').style.display = 'none';
  }
});





  
const documentTypes = [
  "Акт открытия объекта",
  "Акты освидетельствования скрытых работ",
  "Исполнительная документация",
  "Сертификаты и паспорта на материалы и изделия",
  "Акт закрытия объекта",
  "Акт приемки выполненных работ"
];

function openDocumentModal() {
  const modal = document.getElementById('documentModal');
  const body = document.getElementById('documentTableBody');
  modal.style.display = 'flex';
  body.innerHTML = '';

  documentTypes.forEach(name => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td>
        <input type="file" accept=".pdf,.doc,.docx" onchange="handleUpload(this)">
        <button onclick="removeFile(this)">Удалить</button>
      </td>
      <td class="upload-date">—</td>
      <td><input type="text" placeholder="Комментарий..." /></td>
    `;
    body.appendChild(row);
  });
}


function handleUpload(input) {
  const file = input.files[0];
  const cell = input.closest('td').nextElementSibling;

  if (file && file.size <= 10 * 1024 * 1024) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU');
    cell.textContent = dateStr;
  } else {
    alert('Файл слишком большой (максимум 10 МБ).');
    input.value = '';
    cell.textContent = '—';
  }
}

function removeFile(button) {
  const input = button.parentElement.querySelector('input[type="file"]');
  input.value = '';
  button.closest('td').nextElementSibling.textContent = '—';
}

// Кнопка "Документы"
document.addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Документы') {
    openDocumentModal();
  }

  if (e.target.classList.contains('document-close')) {
    document.getElementById('documentModal').style.display = 'none';
  }
});

  


  
  
  // === Переключение темы ===
  const themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});
