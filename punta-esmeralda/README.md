# Квартиры на продажу — Punta Esmeralda (Punta Leona, Коста-Рика)

Сортируемый каталог квартир в проекте **Punta Esmeralda** — новостройке на пляже
Playa Mantas в курортной зоне **Punta Leona** (кантон Garabito, провинция
Puntarenas, центральное тихоокеанское побережье Коста-Рики). Проект продаёт
агентство **Leona Raíces** (leonaraices.com); квартиры также появляются у других
агентств (Terraquea, RE/MAX, Pura Vida, Jaco Realty).

**Дата сборки данных: 2026-06-25.** Это курируемый срез из открытых источников на
указанную дату, а не живой автообновляемый агрегатор (см. ниже «Почему так»).

## Файлы

| Файл | Что это |
|---|---|
| `punta-esmeralda-apartments.xlsx` | Готовая **сортируемая таблица** с автофильтром, закреплённой шапкой и листом «Легенда». Открывайте в Excel / Google Sheets / Numbers. |
| `punta-esmeralda-apartments.csv` | Те же данные в простом виде (импорт куда угодно). |
| `agents-contacts.md` | **Контакты продавцов и листинг-агентов** по проекту (телефоны, WhatsApp, email, какие юниты ведёт каждое агентство). |

## Как сортировать и фильтровать

- **Excel:** откройте `.xlsx`. В шапке уже включён автофильтр — нажмите стрелку у
  нужного столбца → сортировка/фильтр. Например: фильтр `bedrooms = 2` и
  `bathrooms = 1`, сортировка по `price_usd` по возрастанию.
- **Google Sheets:** File → Import → загрузите `.csv` (или `.xlsx`), затем
  Data → Create a filter.
- Цветовая подсветка статуса: зелёный — в продаже, красный — продано/первичка
  закрыта, жёлтый — справочная строка-модель.

## Столбцы

`unit_code, tower, floor, model, bedrooms, bathrooms, area_m2, view, price_usd,
price_basis, parking, storage, balcony, delivery, status, sale_date, source,
source_url, contact, contact_phone, contact_email, notes`

Ключевые:
- **status** — `available` (в продаже), `sold` (продано / первичка закрыта),
  `model-reference` (типовая модель, не конкретный юнит).
- **price_basis** — что означает число в `price_usd`: `asking` (текущая
  запрашиваемая цена), `sold` (цена продажи), `estimate` (оценка).
- **view** — `bosque` (лес), `mar` (океан), `montaña` (горы), `mixto`.

Пустая ячейка = данные не опубликованы / не подтверждены в открытом доступе.
Полная расшифровка — на листе «Легенда» в `.xlsx`.

## О проекте Punta Esmeralda

- Застройка: 4 башни (Torre 1–4) × 17 этажей, ~8 квартир на этаж.
- Модели: **A** — 2 спальни / 1 санузел, ~61–65 м², вид на лес; **B** — 2–3
  спальни / 2 санузла, ~83–102 м², вид на море/горы; есть крупные/премиум юниты
  до ~140 м².
- Аменити: бассейны, джакузи, снек-бар, спортзал, йога-дек, теннис, площадка для
  детей, выход к пляжу Playa Mantas. Обслуживание ~$210–260/мес.
- Сроки: Torre 1–3 уже сданы (Torre 3 — июнь 2023); **Torre 4** сдаётся в
  **августе 2026** (к ней относится квартира с флаера — T4-07-04A).

## Источники данных (открытые)

- **Leona Raíces** — leonaraices.com (продавец проекта; юниты T3-13-04A,
  T2-12-04A, T3-03-04A; флаер: T4-07-04A, $220 000).
- **Reservas Punta Esmeralda** — reservaspuntaesmeralda.com (сетка по башням,
  статусы доступности).
- **Terraquea** — terraquea.com / terraqueabeachproperties.com (коды 108944,
  112550, 131516, 140843, 125574).
- **RE/MAX Jaco Beach** — remax-ocr.com.
- **Pura Vida Rentals & Sales** — rentaspuravida.com.
- **Jaco Real Estate CR** — jacorealestatecr.com.
- **Encuentra24** — encuentra24.com (общие листинги Punta Leona).

Где есть данные про **другие площадки Коста-Рики** в целом (на будущее):
Encuentra24, MLS re.cr, Coldwell Banker CR, RE/MAX CR, 2costaricarealestate.com,
properstar.com, point2homes.com.

## Почему так (важные оговорки)

1. **Нет публичных API.** У недвижимости Коста-Рики нет открытых программных
   интерфейсов, а сайты агентства и бронирования проекта закрыты от
   автоматических запросов (отдают 403). Поэтому таблица собрана вручную из
   результатов поиска и публичных страниц.
2. **Цены продаж не публичны.** Индивидуальные цены состоявшихся сделок в
   Коста-Рике публично не раскрываются — суммы переходов прав в Registro Nacional
   часто занижены/неполны. Строки `status=sold` показывают **оценку первичных цен
   застройщика** (Torre 1–3 в основном распроданы; старт ~$107k за 2-спальные),
   а не цену конкретной сделки. Это явно помечено в `notes` и `price_basis=estimate`.
3. **Часть цен — «по запросу».** У ряда юнитов Leona Raíces цена на сайте не
   публикуется; в таблице `price_usd` пуст, статус `available`. Актуальную цену
   уточняйте у агента.
4. **Данные устаревают.** Срез на 2026-06-25. Чтобы обновить — перезапросите
   источники и пересоберите таблицу (`build_table.py`, см. ниже).

## Контакты по проекту

Полный список агентств и агентов — в **`agents-contacts.md`**; телефоны/почты
также продублированы в столбцах `contact_phone` / `contact_email` таблицы.

- **Отдел продаж застройщика (напрямую)** — **+506 8922-5050**,
  **ventaspl@puntaesmeraldacr.com**, Instagram @punta.esmeralda.cr
- **Leona Raíces** — Cecilia Alberty, тел./WhatsApp **+506 8810-4103**,
  www.leonaraices.com
- **Terraquea** — +506 4052-5777 / 8538-9249, info@terraquea.com
- **RE/MAX Oceanside (Jacó)** — +506 2643-4005 (Shawn Fletcher, Alexandra Kleinow)
- **Pura Vida Rentals & Sales** — +506 4702-4000 / 2637-1919
- **Jaco Real Estate CR** — Vanessa Angulo, jacorealestatecr.com/contact/

## Как пересобрать таблицу

Данные лежат единым списком `ROWS` в скрипте `build_table.py` (генерирует и
`.csv`, и `.xlsx`). Обновите/дополните строки и запустите:

```bash
pip install openpyxl
python3 build_table.py
```
