// 📁 Данные: Объекты
const objectData = [
  {
    id: 1,
    name: "Дворовая территория по адресу: Путевой пр. 38",
    objectId: "1004466",
    oghId: "403405",
    year: 2024,
    district: "СВАО",
    performer: "АД",
    responsible: "Андреев Ю.А",
    startDate: "15.04.2024",
    endDate: "25.08.2024",
    progress: "100",
    _children: [
      {
        name: "Ремонт покрытия асфальтобетонного проезда в рамках благоустройства территории",
        objectId: "1004466",
        oghId: "403405",
        year: 2024,
        district: "СВАО",
        performer: "АД",
        responsible: "Андреев Ю.А",
        startDate: "15.04.2024",
        endDate: "25.04.2024",
        progress: "100",
      },
      {
        name: "Устройство покрытия асфальтобетонного проезда в рамках благоустройства территории",
        objectId: "1004466",
        oghId: "403405",
        year: 2024,
        district: "СВАО",
        performer: "АД",
        responsible: "Андреев Ю.А",
        startDate: "25.04.2024",
        endDate: "11.05.2024",
        progress: "100",
      },
      {
        name: "Ремонт покрытия асфальтобетонного тротуара в рамках благоустройства территории",
        objectId: "1004466",
        oghId: "403405",
        year: 2024,
        district: "СВАО",
        performer: "АД",
        responsible: "Андреев Ю.А",
        startDate: "11.05.2024",
        endDate: "28.05.2024",
        progress: "100",
      },
      {
        name: "Замена дорожного бортового камня в рамках благоустройства территории",
        objectId: "1004466",
        oghId: "403405",
        year: 2024,
        district: "СВАО",
        performer: "АД",
        responsible: "Андреев Ю.А",
        startDate: "28.05.2024",
        endDate: "15.06.2024",
        progress: "100",
      },
      {
        name: "Устройство дорожного бортового камня в рамках благоустройства территории",
        objectId: "1004466",
        oghId: "403405",
        year: 2024,
        district: "СВАО",
        performer: "АД",
        responsible: "Андреев Ю.А",
        startDate: "15.06.2024",
        endDate: "22.07.2024",
        progress: "100",
      },
      {
        name: "Ремонт покрытия асфальтобетонного автопарковки в рамках благоустройства территории",
        objectId: "1004466",
        oghId: "403405",
        year: 2024,
        district: "СВАО",
        performer: "АД",
        responsible: "Андреев Ю.А",
        startDate: "22.07.2024",
        endDate: "25.08.2024",
        progress: "100",
      },
    ],
  },
];

// 📎 Данные: Документы
const documentsData = [
  {
    id: "doc-110628-1",
    name: "📄 Реестр приложений к акту",
    objectId: 110628,
    docType: "Реестр",
    docNumber: "б/н",
    uploadDate: "22.09.2024",
    pageCount: 2,
    sheetNum: 566,
  },
  {
    id: "doc-110628-2",
    name: "📄 Сертификат качества (газон)",
    objectId: 110628,
    docType: "Сертификат",
    docNumber: "829413ГТ",
    uploadDate: "03.10.2019",
    pageCount: 2,
    sheetNum: 568,
  },
];

// 📋 Колонки объектов
const objectColumns = [
  { title: "Наименование", field: "name", widthGrow: 2.5 },
  { title: "ID объекта", field: "objectId" },
  { title: "ID ОГХ", field: "oghId" },
  { title: "Год", field: "year" },
  { title: "Округ", field: "district" },
  { title: "Исполнитель", field: "performer" },
  { title: "Ответственный", field: "responsible" },
  { title: "Дата начала", field: "startDate" },
  { title: "Дата окончания", field: "endDate" },
  { title: "% Завершения", field: "progress" },
];

// 📋 Колонки документов
const documentColumns = [
  { title: "Наименование", field: "name", widthGrow: 2 },
  { title: "Номер", field: "docNumber" },
  { title: "Дата", field: "uploadDate" },
  { title: "Тип", field: "docType" },
  { title: "ID объекта", field: "objectId" },
  { title: "Кол-во листов", field: "pageCount" },
  { title: "Лист №", field: "sheetNum" },
];

// 🚀 Основной запуск
document.addEventListener("DOMContentLoaded", () => {
  // Инициализация таблицы объектов
  const tableObjects = new Tabulator("#table-objects", {
    data: objectData,
    layout: "fitColumns",
    height: 850,
    placeholder: "Нет данных",
    dataTree: true,
    dataTreeStartExpanded: false,
    dataTreeChildField: "_children",
    dataTreeCollapseElement: "<span style='margin-right:2px;'>▼</span>",
    dataTreeExpandElement: "<span style='margin-right:2px;'>▶</span>",
    headerSort: false,
    columns: objectColumns,
  });

  // Инициализация таблицы документов
  const tableDocuments = new Tabulator("#table-documents", {
    data: documentsData,
    columns: documentColumns,
    layout: "fitDataStretch",
    height: 500,
    placeholder: "Нет данных",
    pagination: false,
    groupBy: "objectId",
groupHeader: function(value, count, data) {
  const objectName = data[0]?.name?.split("📄 ")[1]?.split("(")?.[0] || `Объект ${value}`;
  return `<span style="margin-left: 6px;">${objectName} (${count} документа)</span>`;
},

  });

  // Переключение вкладок
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-section").forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

// Устанавливаем тему при загрузке
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.classList.add(savedTheme);

document.getElementById("themeToggle").addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  document.body.classList.remove(isDark ? "dark" : "light");
  document.body.classList.add(isDark ? "light" : "dark");
  localStorage.setItem("theme", isDark ? "light" : "dark");
});

// 📌 Фильтры для вкладки "Реестр объектов"
document.getElementById("filter-name").addEventListener("input", function () {
  tableObjects.setFilter("name", "like", this.value);
});
document.getElementById("filter-objectId").addEventListener("input", function () {
  tableObjects.setFilter("objectId", "like", this.value);
});
document.getElementById("filter-status").addEventListener("input", function () {
  tableObjects.setFilter("status", "like", this.value); // ⚠️ Поля status в колонках нет
});
document.getElementById("filter-district").addEventListener("input", function () {
  tableObjects.setFilter("district", "like", this.value);
});
document.getElementById("filter-performer").addEventListener("input", function () {
  tableObjects.setFilter("performer", "like", this.value);
});
document.getElementById("filter-year").addEventListener("input", function () {
  tableObjects.setFilter("year", "like", this.value);
});
document.getElementById("filter-start").addEventListener("input", function () {
  tableObjects.setFilter("startDate", "like", this.value);
});
document.getElementById("filter-end").addEventListener("input", function () {
  tableObjects.setFilter("endDate", "like", this.value);
});
document.getElementById("filter-responsible").addEventListener("input", function () {
  tableObjects.setFilter("responsible", "like", this.value);
});



  
// 🔍 Фильтрация по полям
const filterInputs = {
  name: "filter-name",
  district: "filter-district",
  performer: "filter-performer",
  year: "filter-year",
  responsible: "filter-responsible",
  startDate: "filter-start",
  endDate: "filter-end",
};

Object.entries(filterInputs).forEach(([field, inputId]) => {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener("input", () => {
      const filters = [];

      Object.entries(filterInputs).forEach(([f, id]) => {
        const val = document.getElementById(id).value.trim();
        if (val !== "") {
          filters.push({ field: f, type: "like", value: val });
        }
      });

      tableObjects.setFilter(filters);
    });
  }
});

});
