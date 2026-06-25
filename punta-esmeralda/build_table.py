#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the sortable Punta Esmeralda apartments table (CSV + XLSX).

Single source of truth: ROWS below. Data curated from open sources on
2026-06-25 (see README). Empty strings = data not published / not confirmed.
"""
import csv
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Output goes next to this script.
OUT_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(OUT_DIR, exist_ok=True)

COLUMNS = [
    "unit_code", "tower", "floor", "model", "bedrooms", "bathrooms",
    "area_m2", "view", "price_usd", "price_basis", "parking", "storage",
    "balcony", "delivery", "status", "sale_date", "source", "source_url",
    "contact", "notes",
]

# Each row is a dict keyed by COLUMNS. Missing keys -> "".
ROWS = [
    # ---- Подтверждённые объявления в продаже (available) ----
    {
        "unit_code": "T4-07-04A", "tower": "Torre 4", "floor": 7, "model": "A",
        "bedrooms": 2, "bathrooms": 1, "area_m2": 64.85, "view": "bosque",
        "price_usd": 220000, "price_basis": "asking", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "ago-2026",
        "status": "available", "source": "Leona Raíces",
        "source_url": "https://leonaraices.com/en_us/",
        "contact": "Cecilia Alberty 8810-4103",
        "notes": "Данные из флаера пользователя. Torre 4 Punta Esmeralda, Modelo A, vista bosque, cocina/sala/bodega/balcón/1 parqueo.",
    },
    {
        "unit_code": "T3-13-04A", "tower": "Torre 3", "floor": 13, "model": "A",
        "bedrooms": 2, "bathrooms": 1, "area_m2": "", "view": "bosque",
        "price_usd": "", "price_basis": "asking", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "entregado",
        "status": "available", "source": "Leona Raíces",
        "source_url": "https://leonaraices.com/en_us/listings/apartamento-punta-esmeralda-1304a/",
        "contact": "Leona Raíces",
        "notes": "Цена по запросу. Modelo A, cocina equipada, balcón vista bosque. Площадь оценочно ~61 м² (модель A).",
    },
    {
        "unit_code": "T2-12-04A", "tower": "Torre 2", "floor": 12, "model": "A",
        "bedrooms": 2, "bathrooms": 1, "area_m2": "", "view": "mixto",
        "price_usd": "", "price_basis": "asking", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "entregado",
        "status": "available", "source": "Leona Raíces",
        "source_url": "https://leonaraices.com/es/listings/apartamento-punta-esmeralda-12-04a/",
        "contact": "Leona Raíces",
        "notes": "Цена по запросу. Vista bosque/mar, A/C completo, storage, parking, balcón.",
    },
    {
        "unit_code": "T3-03-04A", "tower": "Torre 3", "floor": 3, "model": "A",
        "bedrooms": 2, "bathrooms": 1, "area_m2": "", "view": "bosque",
        "price_usd": "", "price_basis": "asking", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "entregado",
        "status": "available", "source": "Leona Raíces",
        "source_url": "http://leonaraices.com/es/listings/apartamento-t30304a-punta-esmeralda/",
        "contact": "Leona Raíces",
        "notes": "Цена по запросу. Balcón grande con vista al bosque.",
    },
    {
        "unit_code": "TQ-108944", "tower": "", "floor": "", "model": "",
        "bedrooms": "", "bathrooms": "", "area_m2": "", "view": "bosque",
        "price_usd": 295000, "price_basis": "asking", "parking": "",
        "storage": "", "balcony": "", "delivery": "", "status": "available",
        "source": "Terraquea", "contact": "Terraquea",
        "source_url": "https://terraquea.com/estate_property/apartamento-en-venta-punta-esmeralda-punta-leona-codigo-108944/108944",
        "notes": "Vista al bosque. Точные спальни/площадь не указаны в открытом доступе.",
    },
    {
        "unit_code": "TQ-112550", "tower": "", "floor": 5, "model": "A",
        "bedrooms": 2, "bathrooms": 1, "area_m2": 60, "view": "montaña",
        "price_usd": 200000, "price_basis": "asking", "parking": 1,
        "storage": "yes", "balcony": "", "delivery": "", "status": "available",
        "source": "Terraquea", "contact": "Terraquea",
        "source_url": "https://terraquea.com/estate_property/apartamento-en-venta-en-punta-esmeralda-punta-leona-vista-a-la-montana-precio-200-000-codigo-112550/112550",
        "notes": "Piso 5, llave en mano. Mantenimiento ~$210/мес.",
    },
    {
        "unit_code": "TQ-140843", "tower": "", "floor": 19, "model": "",
        "bedrooms": 3, "bathrooms": 2, "area_m2": 83, "view": "montaña",
        "price_usd": 278000, "price_basis": "asking", "parking": 1,
        "storage": "", "balcony": "", "delivery": "", "status": "available",
        "source": "Terraquea", "contact": "Terraquea",
        "source_url": "https://terraquea.com/propiedades/excelente-oportunidad-para-inversion-apt-mountain-view-precio-278000-punta-leona-punta-esmeralda-punta-leona-playa-mantas-playa-blanca-codigo/140843/",
        "notes": "Piso 19, vista panorámica a la montaña. Mantenimiento ~$260/мес.",
    },
    {
        "unit_code": "TQ-131516", "tower": "Torre 3", "floor": 10, "model": "",
        "bedrooms": "", "bathrooms": "", "area_m2": "", "view": "mar",
        "price_usd": 260000, "price_basis": "asking", "parking": 1,
        "storage": "", "balcony": "", "delivery": "entregado",
        "status": "available", "source": "Terraquea", "contact": "Terraquea",
        "source_url": "https://terraquea.com/estate_property/apartamento-amueblado-en-venta-en-condominio-punta-esmeralda-vista-al-mar-cod-131516/131516",
        "notes": "100% amueblado, piso 10 Torre 3, vista al mar.",
    },
    {
        "unit_code": "TQ-125574", "tower": "", "floor": "", "model": "",
        "bedrooms": "", "bathrooms": "", "area_m2": "", "view": "bosque",
        "price_usd": 225000, "price_basis": "asking", "parking": "",
        "storage": "", "balcony": "", "delivery": "", "status": "available",
        "source": "Terraquea", "contact": "Terraquea",
        "source_url": "https://terraquea.com/property_area/punta-leona",
        "notes": "Condominio Punta Esmeralda, vista al bosque (код Terraquea 125574).",
    },
    {
        "unit_code": "REMAX-beachfront", "tower": "", "floor": "", "model": "",
        "bedrooms": 2, "bathrooms": 1, "area_m2": "", "view": "mar",
        "price_usd": "", "price_basis": "asking", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "entregado",
        "status": "available", "source": "RE/MAX Jaco Beach", "contact": "RE/MAX",
        "source_url": "https://remax-ocr.com/properties/punta-leona-condo-fully-titled-beachfront/",
        "notes": "Fully titled, turnkey amueblado, vista parcial al mar, pasos de Playa Mantas. Цена по запросу.",
    },
    {
        "unit_code": "JACO-PE", "tower": "", "floor": "", "model": "",
        "bedrooms": "", "bathrooms": "", "area_m2": "", "view": "",
        "price_usd": 285000, "price_basis": "asking", "parking": "",
        "storage": "", "balcony": "", "delivery": "", "status": "available",
        "source": "Jaco Real Estate CR", "contact": "Jaco Realty",
        "source_url": "https://jacorealestatecr.com/properties/apartment-for-sale-in-punta-esmeralda-punta-leona/",
        "notes": "Цена ~$285,000 (по видео Terraquea/Facebook).",
    },
    {
        "unit_code": "PV-topfloor", "tower": "", "floor": "", "model": "",
        "bedrooms": 3, "bathrooms": "", "area_m2": "", "view": "",
        "price_usd": "", "price_basis": "asking", "parking": "",
        "storage": "", "balcony": "", "delivery": "", "status": "available",
        "source": "Pura Vida Rentals & Sales", "contact": "Pura Vida",
        "source_url": "https://rentaspuravida.com/properties/spectacular-3-bedroom-condo-at-punta-esmeralda-punta-leona/",
        "notes": "3 спальни, верхний этаж (top floor). Цена по запросу.",
    },
    {
        "unit_code": "PE-oceanview-140", "tower": "", "floor": 5, "model": "",
        "bedrooms": 3, "bathrooms": 2, "area_m2": 140, "view": "mar",
        "price_usd": "", "price_basis": "asking", "parking": "",
        "storage": "", "balcony": "", "delivery": "", "status": "available",
        "source": "Terraquea Beach Properties", "contact": "—",
        "source_url": "https://terraqueabeachproperties.com/property/apartment-for-sale-in-punta-esmeralda-punta-leona/",
        "notes": "Piso 5, vista al mar. Крупный юнит ~140 м². Цена по запросу.",
    },

    # ---- Справочные строки-модели (model-reference) ----
    {
        "unit_code": "MODELO A (ref)", "tower": "", "floor": "", "model": "A",
        "bedrooms": 2, "bathrooms": 1, "area_m2": 63, "view": "bosque",
        "price_usd": "", "price_basis": "estimate", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "", "status": "model-reference",
        "source": "Сводно по проекту", "contact": "",
        "source_url": "https://www.reservaspuntaesmeralda.com/",
        "notes": "Типовая модель A: 2 сп./1 с/у, ~61-65 м², вид на лес. Типичная перепродажа $200-220k.",
    },
    {
        "unit_code": "MODELO B (ref)", "tower": "", "floor": "", "model": "B",
        "bedrooms": 3, "bathrooms": 2, "area_m2": 90, "view": "mar",
        "price_usd": "", "price_basis": "estimate", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "", "status": "model-reference",
        "source": "Сводно по проекту", "contact": "",
        "source_url": "https://www.reservaspuntaesmeralda.com/",
        "notes": "Типовая модель B: 2-3 сп./2 с/у, ~83-102 м², вид на море/горы. Типичная цена $260-295k.",
    },
    {
        "unit_code": "PREMIUM (ref)", "tower": "", "floor": "", "model": "Premium",
        "bedrooms": 3, "bathrooms": 2, "area_m2": 140, "view": "mar",
        "price_usd": "", "price_basis": "estimate", "parking": 1,
        "storage": "yes", "balcony": "yes", "delivery": "", "status": "model-reference",
        "source": "Сводно по проекту", "contact": "",
        "source_url": "https://www.reservaspuntaesmeralda.com/",
        "notes": "Объединённый/премиум юнит: ~140 м², вид на океан, верхние этажи.",
    },

    # ---- Проданные / первичные продажи застройщика (sold) ----
    {
        "unit_code": "Torre 1 (распродана)", "tower": "Torre 1", "floor": "", "model": "",
        "bedrooms": "", "bathrooms": "", "area_m2": "", "view": "",
        "price_usd": 107000, "price_basis": "estimate", "parking": "",
        "storage": "", "balcony": "", "delivery": "entregado", "status": "sold",
        "sale_date": "2021-2023", "source": "Reservas Punta Esmeralda / застройщик",
        "contact": "ventaspl@puntaesmeraldacr.com",
        "source_url": "https://www.reservaspuntaesmeralda.com/",
        "notes": "Torre 1 распродана застройщиком. $107k — стартовая цена застройщика (2 сп.), НЕ цена конкретной сделки. Точные цены сделок в Коста-Рике не публичны.",
    },
    {
        "unit_code": "Torre 2 (почти распродана)", "tower": "Torre 2", "floor": "", "model": "",
        "bedrooms": "", "bathrooms": "", "area_m2": "", "view": "",
        "price_usd": 110000, "price_basis": "estimate", "parking": "",
        "storage": "", "balcony": "", "delivery": "entregado", "status": "sold",
        "sale_date": "2022-2024", "source": "Reservas Punta Esmeralda / застройщик",
        "contact": "ventaspl@puntaesmeraldacr.com",
        "source_url": "https://www.reservaspuntaesmeralda.com/",
        "notes": "«Última Torre 2» — оставались последние юниты. $110k — оценка стартовой цены застройщика, не цена сделки.",
    },
    {
        "unit_code": "Torre 3 (первичка закрыта)", "tower": "Torre 3", "floor": "", "model": "",
        "bedrooms": "", "bathrooms": "", "area_m2": "", "view": "",
        "price_usd": 150000, "price_basis": "estimate", "parking": "",
        "storage": "", "balcony": "", "delivery": "06-2023", "status": "sold",
        "sale_date": "2023", "source": "Constructora Edificar / застройщик",
        "contact": "ventaspl@puntaesmeraldacr.com",
        "source_url": "https://constructoraedificar.com/residential-en/punta-esmeralda-torre-3-2/",
        "notes": "Torre 3 сдана 06/2023, первичные продажи в основном закрыты. На вторичке сейчас $260k+ (см. T3-13-04A, TQ-131516). $150k — оценка первички, не цена сделки.",
    },
]


def norm(row):
    return {c: row.get(c, "") for c in COLUMNS}


def write_csv(path):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        for r in ROWS:
            w.writerow(norm(r))


def write_xlsx(path):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Apartamentos"

    header_fill = PatternFill("solid", fgColor="1F6F54")
    header_font = Font(bold=True, color="FFFFFF")
    thin = Side(style="thin", color="D9D9D9")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)
    center = Alignment(horizontal="center", vertical="center")
    wrap = Alignment(vertical="top", wrap_text=True)

    status_fill = {
        "available": PatternFill("solid", fgColor="E8F5E9"),
        "sold": PatternFill("solid", fgColor="FDE0E0"),
        "model-reference": PatternFill("solid", fgColor="FFF8E1"),
    }

    ws.append(COLUMNS)
    for r in ROWS:
        nr = norm(r)
        ws.append([nr[c] for c in COLUMNS])

    # header styling
    for col_idx, _ in enumerate(COLUMNS, start=1):
        c = ws.cell(row=1, column=col_idx)
        c.fill = header_fill
        c.font = header_font
        c.alignment = center
        c.border = border

    numeric_cols = {"floor", "bedrooms", "bathrooms", "area_m2", "price_usd", "parking"}
    status_col = COLUMNS.index("status") + 1

    for row_idx in range(2, len(ROWS) + 2):
        status_val = ws.cell(row=row_idx, column=status_col).value
        fill = status_fill.get(status_val)
        for col_idx, name in enumerate(COLUMNS, start=1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.border = border
            if name in numeric_cols:
                cell.alignment = center
            else:
                cell.alignment = wrap
            if fill:
                cell.fill = fill
            if name == "price_usd" and isinstance(cell.value, (int, float)):
                cell.number_format = '#,##0 "USD"'
            if name == "area_m2" and isinstance(cell.value, (int, float)):
                cell.number_format = '0.00 "m²"'

    # column widths
    widths = {
        "unit_code": 20, "tower": 9, "floor": 7, "model": 8, "bedrooms": 9,
        "bathrooms": 9, "area_m2": 10, "view": 10, "price_usd": 13,
        "price_basis": 11, "parking": 8, "storage": 8, "balcony": 8,
        "delivery": 11, "status": 16, "sale_date": 11, "source": 22,
        "source_url": 50, "contact": 22, "notes": 60,
    }
    for col_idx, name in enumerate(COLUMNS, start=1):
        ws.column_dimensions[get_column_letter(col_idx)].width = widths.get(name, 14)

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = "A1:" + get_column_letter(len(COLUMNS)) + str(len(ROWS) + 1)

    # ---- Лист "Легенда" ----
    lg = wb.create_sheet("Легенда")
    legend = [
        ["Каталог квартир Punta Esmeralda (Punta Leona, Коста-Рика)", ""],
        ["Дата сборки данных", "2026-06-25"],
        ["", ""],
        ["Столбец", "Что значит"],
        ["unit_code", "Код юнита (T<башня>-<этаж>-<модель>) или код объявления агентства"],
        ["tower", "Башня (Torre 1-4)"],
        ["floor", "Этаж"],
        ["model", "Модель планировки (A / B / Premium)"],
        ["bedrooms", "Число спален (HAB)"],
        ["bathrooms", "Число санузлов (baño)"],
        ["area_m2", "Площадь, м²"],
        ["view", "Вид: bosque=лес, mar=океан, montaña=горы, mixto=смешанный"],
        ["price_usd", "Цена в USD (смысл — в price_basis)"],
        ["price_basis", "asking=текущая запрашиваемая, sold=цена продажи, estimate=оценка"],
        ["parking", "Парковочные места"],
        ["storage", "Кладовая (bodega): yes/нет"],
        ["balcony", "Балкон: yes/нет"],
        ["delivery", "Срок сдачи (или 'entregado' = сдан)"],
        ["status", "available=в продаже, sold=продана/первичка закрыта, model-reference=типовая модель"],
        ["sale_date", "Дата/период продажи (для status=sold)"],
        ["source", "Площадка-источник"],
        ["source_url", "Ссылка на объявление/источник"],
        ["contact", "Контакт агента/застройщика"],
        ["notes", "Примечания, оговорки по достоверности"],
        ["", ""],
        ["ВАЖНО про цены продаж", "Индивидуальные цены сделок в Коста-Рике публично не раскрываются (нет публичного API; суммы в Registro Nacional часто занижены). Строки sold показывают оценку первичных цен застройщика, а не конкретные сделки."],
        ["Как сортировать", "Excel: вкладка 'Данные' -> стрелка в шапке столбца. Google Sheets: Данные -> Создать фильтр."],
    ]
    for r in legend:
        lg.append(r)
    lg.cell(row=1, column=1).font = Font(bold=True, size=13)
    lg.cell(row=4, column=1).font = Font(bold=True)
    lg.cell(row=4, column=2).font = Font(bold=True)
    lg.column_dimensions["A"].width = 18
    lg.column_dimensions["B"].width = 90
    for row in lg.iter_rows():
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)

    wb.save(path)


if __name__ == "__main__":
    csv_path = os.path.join(OUT_DIR, "punta-esmeralda-apartments.csv")
    xlsx_path = os.path.join(OUT_DIR, "punta-esmeralda-apartments.xlsx")
    write_csv(csv_path)
    write_xlsx(xlsx_path)
    print("rows:", len(ROWS))
    print("wrote:", csv_path)
    print("wrote:", xlsx_path)
